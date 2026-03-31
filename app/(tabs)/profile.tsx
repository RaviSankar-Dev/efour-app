import { Alert, View, ImageBackground, Pressable, ScrollView, TextInput, Dimensions, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from "react-native";
import { Typography, Container } from "../../src/components/ui/Core";
import { THEME } from "../../src/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Phone, ArrowRight, Key, ArrowLeft, ShieldCheck, Mail, LogOut, Ticket, CreditCard, ShoppingBag, Settings, User, Zap, Mail as MailIcon, Phone as PhoneIcon, User as UserIcon, Trash2, Edit2, Shield, Check, X } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
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
                  if (!success) {
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
   const [editedName, setEditedName] = useState("RAVI SANKAR");
   const [editedEmail, setEditedEmail] = useState("SANKARHEARTKANDRA@GMAIL.COM");

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
                  avatar: data.user?.avatar || data.data?.user?.avatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop"
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
         <View style={{ flex: 1, backgroundColor: "#020408" }}>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
               <View className="px-6 pt-40 pb-20">

                  {/* BRANDED HEADER ROW */}
                  <View className="flex-row items-center justify-between mb-16 px-1">
                     <View className="flex-row items-center space-x-5">
                        <View className="w-20 h-20 rounded-full bg-[#0b0e14] border-2 border-white/10 items-center justify-center shadow-premium">
                           <Typography weight="black" className="text-3xl text-white italic font-black">R</Typography>
                        </View>
                        <View>
                           <View className="flex-row items-center">
                              <Typography weight="black" className="text-[36px] text-white italic tracking-tighter uppercase font-black">{user?.name?.split(' ')[0]}</Typography>
                              <View className="w-2 h-2 rounded-full bg-indigo-500 ml-2 mt-4 shadow-sm shadow-indigo-500/50" />
                           </View>
                           <View className="flex-row items-center space-x-2 mt-2">
                              <View className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg shadow-2xl"><Typography weight="bold" className="text-[8px] text-white/40 tracking-[2px] uppercase font-bold">VERIFIED</Typography></View>
                              <View className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg shadow-2xl"><Typography weight="bold" className="text-[8px] text-indigo-400 tracking-[2px] uppercase font-bold">PREMIUM MEMBER</Typography></View>
                           </View>
                        </View>
                     </View>

                     <Pressable
                        onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                        className={`${isEditing ? 'bg-indigo-600' : 'bg-white/5 border border-white/10'} px-6 py-3 rounded-2xl flex-row items-center space-x-3 shadow-2xl active:bg-indigo-700`}
                     >
                        {isEditing ? <Check size={14} stroke="white" strokeWidth={3} /> : <Edit2 size={12} stroke="white" strokeWidth={2.5} />}
                        <Typography weight="black" className="text-[10px] text-white tracking-[2px] uppercase italic font-black">
                           {isEditing ? "SAVE" : "EDIT"}
                        </Typography>
                     </Pressable>
                  </View>

                  <View className="h-[1px] w-full bg-white/10 mb-16" />

                  {/* SECTION 1: ACCOUNT INFO */}
                  <View className="mb-20">
                     <View className="flex-row items-center space-x-3 mb-10 ml-2">
                        <Shield size={16} stroke="#6366f1" />
                        <Typography weight="black" className="text-[11px] text-white italic tracking-[3px] uppercase font-black">ACCOUNT PROFILE</Typography>
                     </View>

                     <View className="bg-[#0b0e14] border border-white/10 rounded-premium p-8 space-y-12 shadow-premium">
                        {/* NAME FIELD */}
                        <View className="flex-row items-center space-x-6">
                           <View className="w-14 h-14 items-center justify-center bg-black/40 rounded-2xl border border-white/10 shadow-2xl">
                              <UserIcon size={22} stroke="#6366f1" strokeWidth={2} />
                           </View>
                           <View className="flex-1">
                              <Typography weight="black" className="text-[10px] text-indigo-400 tracking-[2px] uppercase mb-1 font-black">FULL NAME</Typography>
                              {isEditing ? (
                                 <TextInput
                                    value={editedName}
                                    onChangeText={setEditedName}
                                    className="text-white text-[18px] font-black italic tracking-tight uppercase border-b-2 border-indigo-500 pb-1"
                                 />
                              ) : (
                                 <Typography weight="black" className="text-[18px] text-white italic tracking-tight uppercase font-black">{user?.name}</Typography>
                              )}
                           </View>
                        </View>

                        {/* EMAIL FIELD */}
                        <View className="flex-row items-center space-x-6">
                           <View className="w-14 h-14 items-center justify-center bg-black/40 rounded-2xl border border-white/10 shadow-2xl">
                              <MailIcon size={22} stroke="#6366f1" strokeWidth={2} />
                           </View>
                           <View className="flex-1">
                              <Typography weight="black" className="text-[10px] text-indigo-400 tracking-[2px] uppercase mb-1 font-black">EMAIL ADDRESS</Typography>
                              {isEditing ? (
                                 <TextInput
                                    value={editedEmail}
                                    onChangeText={setEditedEmail}
                                    className="text-white text-[14px] font-black italic tracking-tight uppercase border-b-2 border-indigo-500 pb-1"
                                 />
                              ) : (
                                 <Typography weight="black" className="text-[14px] text-white italic tracking-tighter uppercase font-black">{user?.email}</Typography>
                              )}
                           </View>
                        </View>

                        {/* PHONE FIELD */}
                        <View className="flex-row items-center space-x-6">
                           <View className="w-14 h-14 items-center justify-center bg-black/40 rounded-2xl border border-white/10 shadow-2xl">
                              <PhoneIcon size={22} stroke="#6366f1" strokeWidth={2} />
                           </View>
                           <View>
                              <Typography weight="black" className="text-[10px] text-indigo-400 tracking-[2px] uppercase mb-1 font-black">MOBILE NUMBER</Typography>
                              <Typography weight="black" className="text-[18px] text-white italic tracking-[1px] uppercase font-black">+91 93466 08305</Typography>
                           </View>
                        </View>
                     </View>
                  </View>

                  {/* SECTION 2: REWARDS */}
                  <View className="mb-20">
                     <View className="flex-row items-center space-x-3 mb-10 ml-2">
                        <Zap size={16} stroke="#f59e0b" fill="#f59e0b" />
                        <Typography weight="black" className="text-[11px] text-white italic tracking-[3px] uppercase font-black">REWARDS SYSTEM</Typography>
                     </View>

                     <View className="bg-[#0b0e14] border border-white/10 rounded-premium p-10 items-center shadow-premium">
                        <Typography weight="black" className="text-[10px] text-yellow-500 tracking-[3px] uppercase mb-8 italic font-black">AVAILABLE POINTS</Typography>
                        <View className="flex-row items-baseline mb-10">
                           <Typography weight="black" className="text-[72px] text-white italic leading-none font-black">0</Typography>
                           <Typography weight="black" className="text-[18px] text-white/20 italic ml-3 uppercase font-black">PTS</Typography>
                        </View>

                        <View className="bg-black/60 border border-white/10 rounded-2xl p-6 w-full flex-row items-center space-x-5 shadow-2xl">
                           <View className="w-12 h-12 items-center justify-center bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                              <Zap size={18} stroke="#f59e0b" fill="#f59e0b" />
                           </View>
                           <View className="flex-1">
                              <Typography weight="medium" className="text-[11px] text-gray-400 uppercase italic leading-[18px] tracking-[1px] font-medium">EARN <Typography className="text-yellow-500 font-black">500 POINTS</Typography> FOR A <Typography className="text-indigo-500 font-black">FREE ATTRACTION PASS</Typography></Typography>
                           </View>
                        </View>
                     </View>
                  </View>

                  {/* BOTTOM ACTIONS */}
                  <View className="mt-12 space-y-6">
                     <Pressable onPress={() => logout()} className="bg-white/5 border border-white/10 h-20 rounded-[28px] flex-row items-center justify-center space-x-5 shadow-2xl active:bg-white/10">
                        <LogOut size={20} stroke="#ef4444" strokeWidth={2.5} />
                        <Typography weight="black" className="text-[13px] text-white tracking-[4px] uppercase font-black italic">LOG OUT DASHBOARD</Typography>
                     </Pressable>

                     <Pressable onPress={handleDeleteAccount} className="h-14 items-center justify-center active:opacity-60">
                        <Typography weight="black" className="text-[11px] text-red-500/40 tracking-[5px] uppercase font-black italic">DELETE ACCOUNT PERMANENTLY</Typography>
                     </Pressable>
                  </View>
               </View>
            </ScrollView>
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
               <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false} className="px-6">
                  <View className="pt-4 pb-80">
                     {/* BRANDING HEADER - CENTERED FOCUS */}
                     <View className="items-center mb-16">
                        <View className="bg-yellow-500/10 border border-yellow-500/20 px-6 py-3 rounded-2xl mb-10 shadow-2xl shadow-yellow-500/20">
                           <Typography weight="black" className="text-[32px] text-yellow-500 italic font-black leading-none tracking-tighter">E4</Typography>
                        </View>
                        <Typography weight="black" className="text-7xl leading-[65px] italic text-white text-center tracking-[-4px] uppercase font-black">EFOUR{"\n"}ELURU.</Typography>
                        <View className="w-12 h-1 bg-indigo-500 my-10 rounded-full" />
                        <Typography weight="medium" className="text-[11px] text-gray-400 leading-[20px] text-center italic uppercase tracking-[2px] font-medium px-10">
                           PREMIUM ENTERTAINMENT PORTAL.{"\n"}LOGIN TO CONTINUE YOUR EXPERIENCE.
                        </Typography>
                     </View>

                     {/* LOGIN UNIT - GLASSMORPHIC CARD */}
                     <View className="bg-black/60 border border-white/10 p-10 rounded-[48px] shadow-premium backdrop-blur-3xl">
                        <View className="items-center mb-12">
                           <View className="w-16 h-16 items-center justify-center bg-white/5 border border-white/10 rounded-2xl mb-8 shadow-2xl shadow-indigo-500/10">
                              <Key size={26} color="#6366f1" strokeWidth={2.5} />
                           </View>
                           <Typography weight="black" className="text-[44px] leading-[44px] italic text-white mb-3 tracking-tighter uppercase text-center font-black">{step === 0 ? "LOGIN" : "VERIFY"}</Typography>
                           <Typography weight="black" className="text-[10px] text-indigo-400 tracking-[5px] uppercase font-black text-center">{step === 0 ? "E4 SECURE ACCOUNT" : "OTP SESSION TOKEN"}</Typography>
                        </View>

                        <View className="gap-8">
                           {step === 0 ? (
                              <View className="bg-black/40 border border-white/10 rounded-2xl px-8 h-20 flex-row items-center shadow-inner">
                                 <Phone size={20} color="#6366f1" strokeWidth={2} className="mr-6" />
                                 <TextInput
                                    placeholder="PHONE NUMBER"
                                    placeholderTextColor="rgba(255,255,255,0.25)"
                                    className="text-white text-lg font-black italic tracking-[2px] flex-1"
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
                              <View className="bg-black/40 border border-white/10 rounded-2xl px-8 h-20 flex-row items-center shadow-inner">
                                 <ShieldCheck size={20} color="#6366f1" strokeWidth={2} className="mr-6" />
                                 <TextInput
                                    placeholder="XXXX"
                                    placeholderTextColor="rgba(255,255,255,0.25)"
                                    className="text-white text-3xl font-black tracking-[8px] flex-1 text-center"
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

                           <Pressable
                              onPress={step === 0 ? handleSendOTP : handleVerifyOTP}
                              disabled={loading}
                              className={`h-24 rounded-[32px] flex-row items-center justify-center space-x-6 shadow-2xl transition-all ${loading ? 'bg-indigo-600/50' : 'bg-indigo-600 shadow-indigo-600/60 active:bg-indigo-700 active:scale-[0.95]'}`}
                           >
                              {loading ? (
                                 <ActivityIndicator color="white" />
                              ) : (
                                 <>
                                    <Typography weight="black" className="text-[14px] text-white tracking-[5px] uppercase font-black italic">{step === 0 ? "SEND OTP" : "VERIFY NOW"}</Typography>
                                    <ArrowRight size={22} color="white" strokeWidth={4} />
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
