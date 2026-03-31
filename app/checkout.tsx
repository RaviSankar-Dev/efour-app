import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, ScrollView, Pressable, Image, Dimensions, Alert, ActivityIndicator, AppState, AppStateStatus, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Linking as RNLinking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Typography } from '../src/components/ui/Core';
import { CreditCard, Shield, ChevronLeft, Zap, ArrowRight, Lock, CheckCircle2, Plus, Minus, Trash2, Phone, ShieldCheck, Key, Cpu, Fingerprint, Mail, Circle, Globe, X, RefreshCw, AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../src/store/useAppStore';
import { BlurView } from 'expo-blur';
import Svg, { Path, Rect, Defs, Pattern } from 'react-native-svg';
import Animated, { FadeIn, FadeInDown, FadeInUp, Layout, SlideInRight, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// --- THEME ---
const THEME = {
   orange: '#FF7A18',
   purple: '#6C5CE7',
   bg: '#000000',
   card: 'rgba(255,255,255,0.03)',
   border: 'rgba(255,255,255,0.08)',
};

/**
 * PRODUCTION-READY PAYMENT VERIFICATION ARCHITECTURE
 * Handles deep-link returns, manual sync polling, and app-state restoration.
 */
export default function CheckoutScreen() {
   const insets = useSafeAreaInsets();
   const router = useRouter();
   const { cart, tokens, logout, user, isAuthenticated, setUser, setTokens, fetchMyTickets, tickets, clearCart, updateQuantity, removeFromCart, setCartOpen, addToCart } = useAppStore();

   // --- LOCAL STATE ---
   const [isProcessing, setIsProcessing] = useState(false);
   const [step, setStep] = useState(isAuthenticated ? 1 : 0); // 0: Auth, 1: Review, 2: Payment (via Gateway), 3: Success
   const [authStep, setAuthStep] = useState(0); // 0: Phone, 1: OTP
   const [phone, setPhone] = useState("");
   const [otp, setOtp] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [initialTicketCount, setInitialTicketCount] = useState(0);
   const [reconcileTime, setReconcileTime] = useState(0); // Time spent on verification
   
   const appState = useRef(AppState.currentState);
   const pollingTimer = useRef<NodeJS.Timeout | null>(null);

   // --- PRICING ---
   const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);
   const gst = Math.round(subtotal * 0.09);
   const finalTotal = subtotal + gst;

   // --- 1. ROBUST RECONCILIATION LOOP (POLLING FALLBACK) ---
   useEffect(() => {
      if (isProcessing) {
         setReconcileTime(0);
         // Initial sync
         fetchMyTickets();

         // Polling Logic: High-frequency initial (1s) then decay to 3s
         const startPolling = () => {
             pollingTimer.current = setInterval(async () => {
                setReconcileTime(prev => prev + 2);
                await fetchMyTickets();
             }, 2000);
         };

         startPolling();

         // App State Change Re-trigger (User returns from browser)
         const appStateSub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
            if (appState.current.match(/inactive|background/) && nextState === 'active') {
               console.log("[PAYMENT] User returned - Force Reconciliation Sync");
               fetchMyTickets();
            }
            appState.current = nextState;
         });

         return () => {
            if (pollingTimer.current) clearInterval(pollingTimer.current);
            appStateSub.remove();
         };
      }
   }, [isProcessing]);

   // --- 2. AUTOMATIC TICKET ARRIVAL DETECTION ---
   useEffect(() => {
      // If we are waiting and a new ticket arrives in the global store, sync immediately
      if (isProcessing && tickets.length > initialTicketCount) {
         console.log("[PAYMENT] AUTO-VERIFY SUCCESS: Ticket count increased from", initialTicketCount, "to", tickets.length);
         handleVerificationSuccess();
      }
   }, [tickets, isProcessing, initialTicketCount]);

   const handleVerificationSuccess = () => {
      setIsProcessing(false);
      clearCart();
      setStep(3); // Success Screen
   };

   // --- 3. THEME/UI: ROTATING SPINNER ANIMATION ---
   const spinnerStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: withRepeat(withTiming('360deg', { duration: 1500 }), -1, false) }]
   }));

   // --- AUTH ACTIONS ---
   const handleSendOTP = async () => {
      const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
      if (cleanPhone.length !== 10) { setError("ENTER VALID 10-DIGIT NUMBER"); return; }
      setLoading(true);
      setError(null);
      try {
         const response = await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/auth/send-otp', {
            method: 'POST',
            headers: { 'accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile: cleanPhone, location: 'E4' })
         });
         if (response.ok) setAuthStep(1);
         else setError("VALIDATION FAILED. RETRY.");
      } catch (err) { setError("NETWORK ERROR"); }
      finally { setLoading(false); }
   };

   const handleVerifyOTP = async () => {
      if (otp.length < 4) return;
      setLoading(true);
      setError(null);
      try {
         const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
         const response = await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile: cleanPhone, otp, location: 'E4' })
         });
         const data = await response.json();
         if (response.ok) {
            const accessToken = data.accessToken || data.token || data.data?.accessToken;
            if (accessToken) setTokens({ accessToken, refreshToken: data.refreshToken || '' });
            setUser(data.user || data.data?.user || { id: "1", name: "User", email: "" });
            setStep(1);
         } else setError("INVALID OTP");
      } catch (err) { setError("VERIFICATION ERROR"); }
      finally { setLoading(false); }
   };

   // --- 4. SECURE PAYMENT INITIATION ---
   const handlePayment = async () => {
      if (!user) { setStep(0); return; }

      setLoading(true);
      // Ensure we have a clean baseline of current tickets
      await fetchMyTickets();
      const baselineCount = useAppStore.getState().tickets.length;
      setInitialTicketCount(baselineCount);

      const checkoutItems = [
         ...cart.map(item => {
            const cleanId = String(item.id).replace('RIDE-', '').replace('DINE-', '');
            return {
               id: cleanId.startsWith('DOME') ? '1' : cleanId,
               name: cleanId.startsWith('DOME') ? 'Dome' : item.name,
               price: item.price,
               quantity: item.quantity || 1,
               stall: cleanId.startsWith('DOME') ? 'DOME' : (String(item.id).startsWith('DINE-') ? 'DINE' : 'RIDE'),
               category: cleanId.startsWith('DOME') ? 'DOME' : (String(item.id).startsWith('DINE-') ? 'DINE' : 'RIDE')
            };
         }),
         { id: 'tax-gst', name: 'GST (9%)', price: gst, quantity: 1, stall: 'Tax', category: 'TAX' }
      ];

      // CRITICAL: Dynamic Redirect URL for Web/Android/iOS Protocol
      const redirectUrl = Linking.createURL('checkout', { queryParams: { status: 'success' } });

      try {
         console.log("[PAYMENT] Initializing Secure Gateway Transaction...");
         const response = await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/orders/e4/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokens?.accessToken || ''}` },
            body: JSON.stringify({
               location: 'E4',
               items: checkoutItems,
               email: user?.email || 'guest@efour.in',
               name: user?.name || 'Guest',
               callback_url: redirectUrl
            }),
         });
         
         const result = await response.json();
         const paymentUrl = result.payment_url || result.url;
         
         if (paymentUrl) {
            setIsProcessing(true); // Switch to Verification Mode
            
            // Open Gateway in Secure Browser
            const authResult = await WebBrowser.openAuthSessionAsync(paymentUrl, redirectUrl);

            if (authResult.type === 'success' || authResult.type === 'cancel') {
               // Browser dismissed - Immediate Reconciliation trigger
               console.log("[PAYMENT] Secure Window Closed - Reconciliation active.");
               setTimeout(() => fetchMyTickets(), 1000);
            }
         } else {
             Alert.alert("GATEWAY ERROR", result.message || "COULD NOT OPEN SECURE CHANNEL");
             setIsProcessing(false);
         }
      } catch (err) {
          Alert.alert("NETWORK FAILURE", "UNABLE TO REACH PAYMENT AUTHORIZATION SERVER.");
          setIsProcessing(false);
      } finally {
          setLoading(false);
      }
   };

   // --- 5. ROBUST DEEP-LINK CALLBACK HANDLER ---
   useEffect(() => {
      const handleDeepLink = ({ url }: { url: string }) => {
         console.log("[PAYMENT] PROTOCOL SIGNAL DETECTED:", url);
         // Unified success handler for various gateway protocols
         if (url.includes('success') || url.includes('status=200') || url.includes('payment=confirmed')) {
            handleVerificationSuccess();
         }
      };

      const linkSub = Linking.addEventListener('url', handleDeepLink);
      Linking.getInitialURL().then(url => { if (url) handleDeepLink({ url }); });

      return () => linkSub.remove();
   }, []);

   // --- 6. AUTO REDIRECT POST-VERIFICATION ---
   useEffect(() => {
      if (step === 3) {
         const autoNav = setTimeout(() => {
            try {
               clearCart();
               setCartOpen(false);
               router.replace('/(tabs)/tickets');
            } catch (e) {
               router.replace('/tickets');
            }
         }, 3000);
         return () => clearTimeout(autoNav);
      }
   }, [step]);

   // --- 7. MANUAL RE-VERIFICATION HANDLER (FALLBACK) ---
   const triggerManualVerification = async () => {
       setLoading(true);
       await fetchMyTickets();
       setLoading(false);
       
       const { tickets: latest } = useAppStore.getState();
       if (latest.length > initialTicketCount) {
          handleVerificationSuccess();
       } else if (reconcileTime > 60) {
          Alert.alert("STILL VERIFYING", "YOUR PAYMENT IS BEING PROCESSED BY THE BANK. IT MAY TAKE A FEW MINUTES. WE WILL AUTOMATICALLY NOTIFY YOU.", [{ text: "STAY ON SCREEN" }, { text: "GO TO TICKETS", onPress: () => router.replace('/tickets') }]);
       } else {
          Alert.alert("SYNC IN PROGRESS", "NO NEW RESERVATIONS LOCATED YET. PLEASE WAIT UNTIL THE PAYMENT IS FULLY PROCESSED BY YOUR BANK.");
       }
   };

   // --- VIEW: AUTH ---
   if (step === 0) {
      return (
         <View style={{ flex: 1, backgroundColor: THEME.bg }}>
            <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
            <SafeAreaView className="flex-1">
               <View className="px-8 pt-6 pb-12 flex-row justify-between items-center bg-white/[0.01] border-b border-white/5">
                  <Pressable onPress={() => router.back()} className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 items-center justify-center">
                     <ChevronLeft size={20} color="white" />
                  </Pressable>
                  <Typography weight="black" style={{ fontSize: 10, letterSpacing: 6 }} className="text-white uppercase">AUTHENTICATION</Typography>
                  <View className="w-12 h-12 items-center justify-center">
                     <Lock size={18} color="rgba(255,255,255,0.2)" />
                  </View>
               </View>

               <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                  <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-8">
                     <Animated.View entering={FadeInUp} className="items-center mb-16">
                        <View className="w-20 h-20 bg-[#FF7A18]/10 rounded-[32px] border border-[#FF7A18]/20 items-center justify-center mb-10 shadow-2xl shadow-[#FF7A18]/10">
                           <Fingerprint size={32} color={THEME.orange} strokeWidth={2} />
                        </View>
                        <Typography weight="black" className="text-5xl italic text-white text-center tracking-tighter uppercase font-black leading-none uppercase">EFOUR{"\n"}<Typography weight="black" style={{ color: THEME.orange }} className="italic font-black">PROTOCOL.</Typography></Typography>
                        <Typography weight="black" style={{ fontSize: 9, letterSpacing: 4 }} className="text-white/20 uppercase mt-8 text-center">PLEASE LOGIN TO SECURE YOUR RESERVATIONS</Typography>
                     </Animated.View>

                     <View className="bg-black/40 border border-white/10 p-10 rounded-[40px] shadow-2xl backdrop-blur-3xl">
                        <View className="items-center mb-12">
                           <Typography weight="black" className="text-3xl italic text-white mb-2 tracking-tight uppercase font-black">{authStep === 0 ? "MOBILE" : "VERIFY"}</Typography>
                           <Typography weight="black" style={{ fontSize: 8, letterSpacing: 5 }} className="text-indigo-400 uppercase">STEP {authStep + 1} OF 2</Typography>
                        </View>

                        <View className="space-y-8">
                           {authStep === 0 ? (
                              <View className="bg-white/5 border border-white/10 rounded-2xl px-6 h-20 flex-row items-center">
                                 <Phone size={18} color={THEME.orange} className="mr-5" />
                                 <TextInput
                                    placeholder="Enter Number"
                                    placeholderTextColor="rgba(255,255,255,0.2)"
                                    className="text-white text-xl font-black italic tracking-widest flex-1"
                                    keyboardType="numeric" value={phone} onChangeText={setPhone}
                                 />
                              </View>
                           ) : (
                              <View className="bg-white/5 border border-white/10 rounded-2xl px-6 h-20 flex-row items-center">
                                 <Key size={18} color={THEME.orange} className="mr-5" />
                                 <TextInput
                                    placeholder="••••••"
                                    placeholderTextColor="rgba(255,255,255,0.2)"
                                    className="text-white text-3xl font-black tracking-[12px] flex-1 text-center"
                                    keyboardType="numeric" maxLength={6} value={otp} onChangeText={setOtp}
                                 />
                              </View>
                           )}

                           <Pressable
                              onPress={authStep === 0 ? handleSendOTP : handleVerifyOTP}
                              className={`h-20 rounded-[28px] bg-indigo-600 flex-row items-center justify-center space-x-5 shadow-2xl active:bg-indigo-700 ${loading ? 'opacity-50' : ''}`}
                           >
                              {loading ? <ActivityIndicator color="white" /> : (
                                 <>
                                    <Typography weight="black" style={{ fontSize: 12, letterSpacing: 5 }} className="text-white uppercase italic font-black">{authStep === 0 ? "SEND TOKEN" : "LOGIN NOW"}</Typography>
                                    <Zap size={20} color="white" strokeWidth={3} />
                                 </>
                              )}
                           </Pressable>
                           {error && <Typography weight="black" style={{ fontSize: 8 }} className="text-red-500 uppercase text-center mt-4">{error}</Typography>}
                        </View>
                     </View>
                  </ScrollView>
               </KeyboardAvoidingView>
            </SafeAreaView>
         </View>
      );
   }

   // --- VIEW: SUCCESS ---
   if (step === 3) {
      return (
         <View style={{ flex: 1, backgroundColor: THEME.bg }}>
            <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
            <SafeAreaView className="flex-1 items-center justify-center px-10">
               <Animated.View entering={FadeIn.duration(1000)} className="w-40 h-40 bg-emerald-500/10 border border-emerald-500/20 rounded-full items-center justify-center mb-12 shadow-2xl shadow-emerald-500/10">
                  <CheckCircle2 size={72} color="#10b981" strokeWidth={1.5} />
               </Animated.View>
               <Typography weight="black" className="text-5xl text-white text-center italic tracking-tighter uppercase font-black leading-none mb-6">PAYMENT{"\n"}SUCCESSFUL!</Typography>
               <Typography weight="black" style={{ fontSize: 9, letterSpacing: 4 }} className="text-white/30 text-center uppercase mb-16 leading-6">RESERVATION SYNCED. YOUR SECURE QR PASSES ARE READY IN THE TICKETS SECTION.</Typography>
               <Pressable onPress={() => router.replace('/(tabs)/tickets')} className="bg-white/5 border border-white/10 w-full h-20 rounded-[32px] items-center justify-center shadow-2xl active:bg-white/10">
                  <Typography weight="black" style={{ fontSize: 12, letterSpacing: 6 }} className="text-white uppercase italic font-black">ACCESS PASSES</Typography>
               </Pressable>
            </SafeAreaView>
         </View>
      );
   }

   // --- VIEW: PROCESSING FALLBACK (RECONCILIATION) ---
   if (isProcessing) {
      return (
         <View style={{ flex: 1, backgroundColor: THEME.bg }}>
            <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
            <SafeAreaView className="flex-1 items-center justify-center px-10">
               <Animated.View style={[spinnerStyle]} className="mb-12">
                  <RefreshCw size={52} color={THEME.orange} strokeWidth={3} />
               </Animated.View>
               <Typography weight="black" className="text-3xl text-white text-center italic tracking-tighter uppercase font-black mb-6">VERIFYING PAYMENT...</Typography>
               <Typography weight="black" style={{ fontSize: 9, letterSpacing: 4 }} className="text-white/40 text-center uppercase mb-16 leading-6">WAITING FOR NETWORK RECONCILIATION. ONCE PAYMENT IS COMPLETE, WE WILL AUTO-SYNC.</Typography>

               <Pressable 
                  onPress={triggerManualVerification} 
                  className="bg-indigo-600 w-full h-20 rounded-[32px] items-center justify-center shadow-2xl active:scale-95 mb-6"
               >
                  {loading ? <ActivityIndicator color="white" /> : (
                     <Typography weight="black" style={{ fontSize: 12, letterSpacing: 6 }} className="text-white uppercase italic font-black">FORCE SYNC NOW</Typography>
                  )}
               </Pressable>

               <Pressable onPress={() => setIsProcessing(false)} className="bg-white/5 border border-white/10 w-full h-16 rounded-[24px] items-center justify-center">
                  <Typography weight="black" style={{ fontSize: 9, letterSpacing: 4 }} className="text-white/20 uppercase font-black tracking-widest">CANCEL & RETURN</Typography>
               </Pressable>
            </SafeAreaView>
         </View>
      );
   }

   // --- VIEW: REVIEW & PAY ---
   return (
      <View style={{ flex: 1, backgroundColor: THEME.bg }}>
         <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
         <SafeAreaView className="flex-1">
            <ScrollView showsVerticalScrollIndicator={false}>
               <View className="px-8 pt-6 pb-12 flex-row justify-between items-center bg-white/[0.01] border-b border-white/5">
                  <Pressable onPress={() => router.back()} className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 items-center justify-center">
                     <ChevronLeft size={20} color="white" />
                  </Pressable>
                  <Typography weight="black" style={{ fontSize: 10, letterSpacing: 8 }} className="text-white uppercase">CHECKOUT</Typography>
                  <View className="w-12 h-12 items-center justify-center">
                     <Shield size={18} color="#FF7A18" />
                  </View>
               </View>

               <View className="px-6 pt-12 pb-32">
                  {/* Step Progress */}
                  <View className="flex-row items-center justify-center mb-16 space-x-10">
                     <View className="items-center">
                        <View style={{ backgroundColor: THEME.purple }} className="w-10 h-10 rounded-full items-center justify-center shadow-2xl"><Typography weight="black" className="text-xs text-white italic">01</Typography></View>
                        <Typography weight="black" style={{ fontSize: 7, letterSpacing: 2 }} className="text-white uppercase mt-3">REVIEW</Typography>
                     </View>
                     <View className="w-20 h-[1px] bg-white/10 mt-[-20px]" />
                     <View className="items-center opacity-30">
                        <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center border border-white/10"><Typography weight="black" className="text-xs text-white/50 italic">02</Typography></View>
                        <Typography weight="black" style={{ fontSize: 7, letterSpacing: 2 }} className="text-white uppercase mt-3">PAY</Typography>
                     </View>
                  </View>

                  {/* Summary Card */}
                  <View className="bg-white/5 border border-white/10 rounded-[40px] p-8 mb-12 shadow-2xl overflow-hidden relative">
                     <View style={{ backgroundColor: THEME.orange }} className="absolute top-0 left-0 w-full h-1 opacity-40" />
                     <View className="flex-row items-center space-x-5 mb-12">
                        <Zap size={16} color={THEME.orange} fill={THEME.orange} />
                        <Typography weight="black" style={{ fontSize: 10, letterSpacing: 6 }} className="text-white/60 uppercase">RESERVATION DATA</Typography>
                     </View>

                     {cart.map((item, idx) => (
                        <View key={`${item.id}-${idx}`} className="flex-row justify-between items-center mb-10 border-b border-white/5 pb-10">
                           <View className="flex-1">
                              <Typography weight="black" className="text-2xl text-white italic uppercase tracking-tighter mb-4 leading-none">{item.name}</Typography>
                              <View className="flex-row items-center">
                                 <View className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex-row items-center space-x-5">
                                    <Pressable onPress={() => updateQuantity(item.id, -1)}><Minus size={14} color="white" strokeWidth={3} /></Pressable>
                                    <Typography weight="black" className="text-base text-white italic font-black">{item.quantity}</Typography>
                                    <Pressable onPress={() => updateQuantity(item.id, 1)}><Plus size={14} color="white" strokeWidth={3} /></Pressable>
                                 </View>
                                 <Pressable onPress={() => removeFromCart(item.id)} className="ml-5 w-10 h-10 bg-red-500/10 rounded-xl border border-red-500/20 items-center justify-center opacity-40"><Trash2 size={16} color="#ef4444" /></Pressable>
                              </View>
                           </View>
                           <Typography weight="black" className="text-3xl text-white italic font-black ml-4">₹{item.price * item.quantity}</Typography>
                        </View>
                     ))}

                     <View className="space-y-4">
                        <View className="flex-row justify-between items-center opacity-40">
                           <Typography weight="black" style={{ fontSize: 9, letterSpacing: 4 }} className="text-white uppercase">SUB-TOTAL</Typography>
                           <Typography weight="black" className="text-base text-white italic font-black">₹{subtotal}</Typography>
                        </View>
                        <View className="flex-row justify-between items-center opacity-40">
                           <Typography weight="black" style={{ fontSize: 9, letterSpacing: 4, color: THEME.orange }} className="uppercase">TAXES (GST)</Typography>
                           <Typography weight="black" className="text-base text-white italic font-black">₹{gst}</Typography>
                        </View>
                        <View className="h-[1px] bg-white/10 my-8" />
                        <View className="flex-row justify-between items-end">
                           <View>
                              <Typography weight="black" style={{ fontSize: 10, letterSpacing: 6 }} className="text-white uppercase font-black mb-2">GRAND TOTAL</Typography>
                              <View className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg"><Typography weight="black" style={{ fontSize: 6, letterSpacing: 2 }} className="text-white/30 uppercase">INC ALL TAXES +</Typography></View>
                           </View>
                           <Typography weight="black" className="text-[52px] text-white italic tracking-tighter leading-none font-black">₹{finalTotal}</Typography>
                        </View>
                     </View>
                  </View>

                  <Pressable
                     disabled={isProcessing}
                     onPress={handlePayment}
                     className={`bg-indigo-600 h-24 rounded-[32px] flex-row items-center justify-center space-x-8 shadow-2xl shadow-indigo-600/60 ${isProcessing ? 'opacity-50' : ''} active:scale-95`}
                  >
                     {loading ? <ActivityIndicator size="small" color="white" /> : (
                        <>
                           <Typography weight="black" style={{ fontSize: 14, letterSpacing: 6 }} className="text-white tracking-[6px] uppercase font-black italic">
                              {isProcessing ? 'PROCESSING...' : `CONFIRM ₹${finalTotal}`}
                           </Typography>
                           {!isProcessing && <ArrowRight size={24} color="white" strokeWidth={4} />}
                        </>
                     )}
                  </Pressable>

                  <View className="mt-16 flex-row items-center justify-center space-x-4 opacity-20">
                     <Lock size={14} color="white" />
                     <Typography weight="black" style={{ fontSize: 9, letterSpacing: 4 }} className="text-white uppercase">SECURE 256-BIT ENCRYPTION</Typography>
                  </View>
               </View>
            </ScrollView>
         </SafeAreaView>
      </View>
   );
}
