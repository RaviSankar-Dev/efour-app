import { Alert, View, ImageBackground, Pressable, ScrollView, TextInput, Dimensions, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from "react-native";
import { Typography, Container } from "../../src/components/ui/Core";
import { THEME } from "../../src/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Phone, ArrowRight, Key, ArrowLeft, ShieldCheck, Mail, LogOut, Ticket, CreditCard, ShoppingBag, Settings, User, Zap, Mail as MailIcon, Phone as PhoneIcon, User as UserIcon, Trash2, Edit2, Shield, Check, X } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { Navbar } from "../../src/components/ui/Navbar";
import { useAppStore } from "../../src/store/useAppStore";

const { width, height } = Dimensions.get("window");

export default function ProfileScreen() {
   const insets = useSafeAreaInsets();
   const router = useRouter();
   const { isAuthenticated, user, setUser, logout, fetchProfile, updateProfile, deleteAccount } = useAppStore();

   useEffect(() => {
      if (isAuthenticated) {
         fetchProfile();
      }
   }, [isAuthenticated]);

   const handleDeleteAccount = () => {
      Alert.alert(
         "DELETE ACCOUNT",
         "ARE YOU SURE? THIS ACTION PERMANENTLY DELETES ALL YOUR DATA AND PASSES.",
         [
            { text: "CANCEL", style: "cancel" },
            {
               text: "DELETE NOW",
               style: "destructive",
               onPress: async () => {
                  setLoading(true);
                  const success = await deleteAccount();
                  if (success) {
                     // RESET ALL LOGIN RELATED STATES FOR A CLEAN REDIRECT
                     setStep(0);
                     setPhone("");
                     setOtp("");
                     setLoading(false);
                     setError(null);
                  } else {
                     setError("FAILED TO DELETE ACCOUNT AT THIS TIME.");
                     setLoading(false);
                  }
               }
            }
         ]
      );
   };

   const [step, setStep] = useState(0);
   const [phone, setPhone] = useState("");
   const [otp, setOtp] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   // EDIT PROFILE STATES
   const [isEditing, setIsEditing] = useState(false);
   const [editedName, setEditedName] = useState("");
   const [editedEmail, setEditedEmail] = useState("");

   const handleSendOTP = async () => {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const cleanPhoneTen = cleanPhone.slice(-10);
      if (cleanPhoneTen.length === 10) {
         setLoading(true);
         setError(null);
         try {
            // MATCHING EXACT CURL SPECIFICATION: 10-DIGIT MOBILE + LOCATION ID
            const payload = {
               mobile: cleanPhoneTen,
               location: 'E4'
            };

            const response = await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/auth/send-otp', {
               method: 'POST',
               headers: { 'accept': 'application/json', 'Content-Type': 'application/json' },
               body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (response.ok) {
               setStep(1);
            } else {
               const errorMsg = data.message || data.error || JSON.stringify(data);
               setError(`VALIDATION FAILED: ${errorMsg}`);
            }
         } catch (err) {
            setError(`NETWORK ERROR: ${err instanceof Error ? err.message : 'TRY AGAIN'}`);
         } finally {
            setLoading(false);
         }
      } else {
         setError("ENTER A VALID 10-DIGIT NUMBER");
      }
   };

   const handleVerifyOTP = async () => {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const cleanPhoneTen = cleanPhone.slice(-10);
      if (otp.length >= 4) {
         setLoading(true);
         setError(null);
         const { setUser, setTokens } = useAppStore.getState();
         try {
            // MATCHING SYMMETRICAL PAYLOAD FOR VERIFICATION
            const payload = {
               mobile: cleanPhoneTen,
               otp: otp,
               location: 'E4'
            };
            const response = await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/auth/verify-otp', {
               method: 'POST',
               headers: { 'accept': 'application/json', 'Content-Type': 'application/json' },
               body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (response.ok) {
               // COMPREHENSIVE TOKEN EXTRACTION FOR ALL POTENTIAL BACKEND FORMATS
               const accessToken = data.accessToken || data.token || data.access_token || data.data?.accessToken || data.data?.token;
               const refreshToken = data.refreshToken || data.refresh_token || data.data?.refreshToken;

               if (accessToken) {
                  setTokens({
                     accessToken: accessToken,
                     refreshToken: refreshToken || ''
                  });
               } else if (data.tokens) {
                  setTokens(data.tokens);
               }

               setUser({
                  id: data.user?.id || data.data?.user?.id || "1",
                  name: data.user?.name || data.data?.user?.name || editedName,
                  email: data.user?.email || data.data?.user?.email || editedEmail,
                  avatar: data.user?.avatar || data.data?.user?.avatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop",
                  mobile: cleanPhoneTen
               });
            } else {
               setError(data.message || "INVALID OTP. TRY AGAIN.");
            }
         } catch (err) {
            setError("VERIFICATION FAILED. CHECK NETWORK.");
         } finally {
            setLoading(false);
         }
      }
   };

   const handleSaveProfile = async () => {
      if (user) {
         setLoading(true);
         const success = await updateProfile(editedName, editedEmail);
         if (success) {
            setIsEditing(false);
         } else {
            setError("FAILED TO UPDATE PROFILE ON SERVER.");
         }
         setLoading(false);
      }
   };

    // AUTHENTICATED DASHBOARD
    if (isAuthenticated && user) {
        return (
            <View style={{ flex: 1, backgroundColor: '#020408' }}>
                {/* FIXED HEADER */}
                <Navbar />

                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView 
                        bounces={false} 
                        showsVerticalScrollIndicator={false} 
                        contentContainerStyle={{ paddingBottom: 140 }}
                    >
                        <View className="px-8 pt-32 pb-10">

                            {/* SECTION 1: ACCOUNT INFO - CONSOLIDATED HEADER */}
                            <View className="mb-10">
                                <View className="flex-row items-center justify-between mb-8 ml-1">
                                    <View className="flex-row items-center space-x-4">
                                        <View className="w-10 h-10 rounded-full bg-indigo-500/10 items-center justify-center border border-indigo-500/20">
                                            <Shield size={16} stroke="#6366f1" />
                                        </View>
                                        <Typography weight="black" className="text-[12px] text-white/60 italic tracking-[3px] uppercase font-black">ACCOUNT PROFILE</Typography>
                                    </View>

                                    <Pressable
                                        onPress={() => {
                                            if (isEditing) {
                                                handleSaveProfile();
                                            } else {
                                                setEditedName(user?.name || "");
                                                setEditedEmail(user?.email || "");
                                                setIsEditing(true);
                                            }
                                        }}
                                        className={`${isEditing ? 'bg-indigo-600' : 'bg-white/5 border border-white/10'} px-5 h-11 rounded-xl flex-row items-center shadow-2xl active:bg-indigo-700`}
                                        style={{ gap: 8 }}
                                    >
                                        {isEditing ? <Check size={14} stroke="white" strokeWidth={3} /> : <Edit2 size={12} stroke="white" strokeWidth={2.5} />}
                                        <Typography weight="black" className="text-[9px] text-white tracking-[2px] uppercase italic font-black">
                                            {isEditing ? "SAVE" : "EDIT"}
                                        </Typography>
                                    </Pressable>
                                </View>

                                <View className="bg-[#0b0e14] border border-white/10 rounded-[32px] p-8 shadow-premium">
                                    <View className="gap-6">
                                        {/* NAME FIELD */}
                                        <View className="flex-row items-center" style={{ gap: 20 }}>
                                            <View className="w-14 h-14 items-center justify-center bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
                                                <UserIcon size={22} stroke="#6366f1" strokeWidth={2.5} />
                                            </View>
                                            <View className="flex-1">
                                                <Typography weight="black" className="text-[10px] text-indigo-500 tracking-[3px] uppercase mb-1 font-black">FULL NAME</Typography>
                                                {isEditing ? (
                                                    <TextInput
                                                        value={editedName}
                                                        onChangeText={setEditedName}
                                                        className="text-white text-[18px] font-black italic tracking-tight uppercase border-b border-indigo-500/30 pb-1"
                                                    />
                                                ) : (
                                                    <Typography weight="black" className="text-[20px] text-white italic tracking-tighter uppercase font-black">{user?.name}</Typography>
                                                )}
                                            </View>
                                        </View>
                                        <View className="h-[1px] w-full bg-white/5" />

                                        {/* EMAIL FIELD */}
                                        <View className="flex-row items-center" style={{ gap: 20 }}>
                                            <View className="w-14 h-14 items-center justify-center bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
                                                <MailIcon size={22} stroke="#6366f1" strokeWidth={2.5} />
                                            </View>
                                            <View className="flex-1">
                                                <Typography weight="black" className="text-[10px] text-indigo-500 tracking-[3px] uppercase mb-1 font-black">EMAIL ADDRESS</Typography>
                                                {isEditing ? (
                                                    <TextInput
                                                        value={editedEmail}
                                                        onChangeText={setEditedEmail}
                                                        autoCapitalize="none"
                                                        className="text-white text-[14px] font-black italic tracking-tight uppercase border-b border-indigo-500/30 pb-1"
                                                    />
                                                ) : (
                                                    <View className="flex-row items-center justify-between">
                                                        <Typography weight="black" className="text-[14px] text-white/80 italic tracking-tighter uppercase font-black" numberOfLines={1}>{user?.email}</Typography>
                                                        <View className="w-4 h-4 bg-green-500/10 rounded-full items-center justify-center border border-green-500/20 ml-2"><Check size={8} color="#22c55e" /></View>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                        <View className="h-[1px] w-full bg-white/5" />

                                        {/* PHONE FIELD */}
                                        <View className="flex-row items-center" style={{ gap: 20 }}>
                                            <View className="w-14 h-14 items-center justify-center bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
                                                <PhoneIcon size={22} stroke="#6366f1" strokeWidth={2.5} />
                                            </View>
                                            <View className="flex-1">
                                                <Typography weight="black" className="text-[10px] text-indigo-500 tracking-[3px] uppercase mb-1 font-black">MOBILE NUMBER</Typography>
                                                <Typography weight="black" className="text-[18px] text-white italic tracking-[1px] uppercase font-black">+91 {user?.mobile || '9293929292'}</Typography>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* SECTION 2: REWARDS */}
                            <View className="mb-10">
                                <View className="flex-row items-center space-x-4 mb-6 ml-1">
                                    <View className="w-10 h-10 rounded-full bg-yellow-500/10 items-center justify-center border border-yellow-500/20">
                                        <Zap size={14} stroke="#f59e0b" fill="#f59e0b" />
                                    </View>
                                    <Typography weight="black" className="text-[12px] text-white/60 italic tracking-[3px] uppercase font-black">REWARDS SYSTEM</Typography>
                                </View>

                                <View className="bg-[#0b0e14] border border-white/10 rounded-[32px] p-10 items-center shadow-premium">
                                    <Typography weight="black" className="text-[10px] text-yellow-500/60 tracking-[4px] uppercase mb-8 italic font-black">AVAILABLE POINTS</Typography>
                                    <View className="flex-row items-baseline mb-12">
                                        <Typography weight="black" className="text-[82px] text-white italic leading-none font-black">0</Typography>
                                        <Typography weight="black" className="text-[18px] text-white/30 italic ml-4 uppercase font-black">PTS</Typography>
                                    </View>

                                    <View className="bg-white/5 border border-white/10 rounded-[28px] p-6 w-full flex-row items-center" style={{ gap: 20 }}>
                                        <View className="w-14 h-14 items-center justify-center bg-yellow-500/10 rounded-2xl border border-yellow-500/20 shadow-2xl">
                                            <Zap size={24} stroke="#f59e0b" fill="#f59e0b" />
                                        </View>
                                        <View className="flex-1">
                                            <Typography weight="medium" className="text-[12px] text-gray-400 uppercase italic leading-[20px] tracking-[1px] font-medium">REDEEM <Typography weight="black" className="text-yellow-500 font-black">500 POINTS</Typography> FOR A <Typography weight="black" className="text-indigo-500 font-black">FREE EXCLUSIVE PASS</Typography></Typography>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* BOTTOM ACTIONS */}
                            <View className="mt-4 space-y-4">
                                <Pressable 
                                   onPress={() => {
                                       logout();
                                       setStep(0);
                                       setPhone("");
                                       setOtp("");
                                   }} 
                                   className="bg-white/5 border border-white/10 h-16 rounded-[24px] flex-row items-center justify-center space-x-4 shadow-2xl active:bg-white/10"
                                >
                                    <LogOut size={18} stroke="#ef4444" strokeWidth={2.5} />
                                    <Typography weight="black" className="text-[12px] text-white tracking-[3px] uppercase font-black italic">LOG OUT DASHBOARD</Typography>
                                </Pressable>

                                <Pressable onPress={handleDeleteAccount} className="h-12 items-center justify-center active:opacity-60">
                                    <Typography weight="black" className="text-[10px] text-red-500/40 tracking-[4px] uppercase font-black italic">DELETE ACCOUNT PERMANENTLY</Typography>
                                </Pressable>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }

   // LOGIN SCREEN
   return (
      <View style={{ flex: 1, backgroundColor: "#020408" }}>
         <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1518173946687-a4c8a9ba332f?q=80&w=1974&auto=format&fit=crop' }}
            className="flex-1"
         >
            <LinearGradient colors={['rgba(2,4,8,0.4)', 'rgba(2,4,8,0.7)', '#020408']} className="absolute inset-0" />

            <View style={{ paddingTop: insets.top + 24 }} className="px-6 flex-row items-center">
               <Pressable onPress={() => router.push("/")} className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex-row items-center shadow-2xl active:bg-white/10">
                  <ArrowLeft size={16} stroke="white" strokeWidth={3} className="mr-3" />
                  <Typography weight="black" className="text-[10px] text-white tracking-[3px] uppercase font-black italic">EXIT</Typography>
               </Pressable>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
               <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }} showsVerticalScrollIndicator={false} className="px-6">
                  <View className="pt-8 pb-10">
                     {/* BRANDING HEADER - CENTERED FOCUS */}
                     <View className="items-center mb-8">
                        <View className="w-48 h-48 mb-6 items-center justify-center">
                           <Image source={require('../../assets/images/E4_LOGO_NEW.jpeg')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                        </View>
                        <Typography weight="medium" className="text-[11px] text-gray-400 leading-[20px] text-center italic uppercase tracking-[2px] font-medium px-10">
                           PREMIUM ENTERTAINMENT PORTAL.{"\n"}LOGIN TO CONTINUE YOUR EXPERIENCE.
                        </Typography>
                     </View>

                     {/* LOGIN UNIT - GLASSMORPHIC CARD */}
                     <View className="bg-black/60 border border-white/10 p-6 rounded-[32px] shadow-premium backdrop-blur-3xl mx-2">
                        <View className="items-center mb-6">
                           <View className="w-14 h-14 items-center justify-center bg-white/5 border border-white/10 rounded-2xl mb-4 shadow-2xl shadow-indigo-500/10">
                              <Key size={22} color="#6366f1" strokeWidth={2.5} />
                           </View>
                           <Typography weight="black" className="text-4xl leading-[40px] italic text-white mb-2 tracking-tighter uppercase text-center font-black">{step === 0 ? "LOGIN" : "VERIFY"}</Typography>
                           <Typography weight="black" className="text-[9px] text-indigo-400 tracking-[4px] uppercase font-black text-center">{step === 0 ? "E4 SECURE ACCOUNT" : "OTP SESSION TOKEN"}</Typography>
                        </View>

                        <View className="gap-5">
                           {step === 0 ? (
                              <View className="bg-black/40 border border-white/10 rounded-2xl px-5 h-16 flex-row items-center shadow-inner">
                                 <Phone size={18} color="#6366f1" strokeWidth={2} className="mr-5" />
                                 <TextInput
                                    placeholder="PHONE NUMBER"
                                    placeholderTextColor="rgba(255,255,255,0.25)"
                                    className="text-white text-[15px] font-black italic tracking-[2px] flex-1 pt-1"
                                    keyboardType="numeric"
                                    returnKeyType="done"
                                    value={phone}
                                    onChangeText={(t) => {
                                       setPhone(t);
                                       if (error) setError(null);
                                    }}
                                 />
                              </View>
                           ) : (
                              <View className="bg-black/40 border border-white/10 rounded-2xl px-5 h-16 flex-row items-center shadow-inner">
                                 <ShieldCheck size={18} color="#6366f1" strokeWidth={2} className="mr-5" />
                                 <TextInput
                                    placeholder="XXXX"
                                    placeholderTextColor="rgba(255,255,255,0.25)"
                                    className="text-white text-2xl font-black tracking-[6px] flex-1 text-center pt-1"
                                    keyboardType="numeric"
                                    returnKeyType="done"
                                    maxLength={6}
                                    value={otp}
                                    onChangeText={(t) => {
                                       setOtp(t);
                                       if (error) setError(null);
                                    }}
                                 />
                              </View>
                           )}

                           {step === 1 && (
                              <Pressable 
                                 onPress={() => {
                                    setStep(0);
                                    setOtp("");
                                    setError(null);
                                 }}
                                 className="mt-[-15px] mb-5 items-center active:opacity-50"
                              >
                                 <Typography weight="black" className="text-[10px] text-indigo-400/80 tracking-[3px] uppercase font-black italic underline">CHANGE MOBILE NUMBER</Typography>
                              </Pressable>
                           )}

                           <Pressable
                              onPress={step === 0 ? handleSendOTP : handleVerifyOTP}
                              disabled={loading}
                              className={`h-[72px] rounded-3xl flex-row items-center justify-center space-x-4 shadow-2xl transition-all ${loading ? 'bg-[#FFD700]/50' : 'bg-[#FFD700] shadow-[#FFD700]/40 active:bg-yellow-500 active:scale-[0.95]'}`}
                           >
                              {loading ? (
                                 <ActivityIndicator color="black" />
                              ) : (
                                 <>
                                    <Typography weight="black" className="text-[12px] text-black tracking-[5px] uppercase font-black italic">{step === 0 ? "SEND OTP" : "VERIFY NOW"}</Typography>
                                    <ArrowRight size={20} color="black" strokeWidth={4} />
                                 </>
                              )}
                           </Pressable>

                           {error && (
                              <View className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl mt-4">
                                 <Typography weight="black" className="text-[10px] text-red-500 tracking-[1.5px] uppercase text-center font-black leading-[16px]">{error}</Typography>
                              </View>
                           )}
                        </View>
                     </View>
                  </View>
               </ScrollView>
            </KeyboardAvoidingView>
         </ImageBackground>
      </View>
   );
}
