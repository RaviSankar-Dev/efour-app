import { View, ScrollView, Dimensions, Pressable, TextInput, StyleSheet, Linking, Image } from "react-native";
import { Typography } from "../../src/components/ui/Core";
import { Navbar } from "../../src/components/ui/Navbar";
import { Footer } from "../../src/components/ui/Footer";
import { MapPin, Phone, Mail, Clock, Zap, Shield, Send, Globe } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay,
  Easing,
  interpolate
} from "react-native-reanimated";
import React, { useEffect } from "react";

const { width, height } = Dimensions.get("window");

const RadarRing = ({ delay = 0 }: { delay?: number }) => {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withDelay(delay, withRepeat(withTiming(3, { duration: 3000, easing: Easing.out(Easing.quad) }), -1, false));
    opacity.value = withDelay(delay, withRepeat(withTiming(0, { duration: 3000, easing: Easing.out(Easing.quad) }), -1, false));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={[{
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 1.5,
        borderColor: '#6366f1',
      }, animatedStyle]} 
    />
  );
};

export default function ContactScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ flex: 1, backgroundColor: '#020408' }}>
      <Navbar />

      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View className="bg-[#020408] pt-40 pb-10 px-6">
           {/* HEADER SECTION */}
           <View className="items-center mb-16 px-2">
              <Typography weight="black" className="text-6xl leading-[65px] italic text-white text-center tracking-[-3px] uppercase font-black">CONTACT{"\n"}US.</Typography>
              <View className="h-[2px] w-14 bg-indigo-500 my-10 rounded-full" />
              <Typography weight="medium" className="text-[12px] text-gray-400 leading-[22px] text-center uppercase tracking-[1.5px] px-6 font-medium">
                 LOCATED IN THE HEART OF ELURU. EFOUR IS YOUR MAIN SPOT FOR WORLD-CLASS ENTERTAINMENT AND GREAT FOOD.
              </Typography>
           </View>

           {/* CONTACT INFO CARD */}
           <View className="bg-[#0b0e14] border border-white/10 rounded-[48px] p-10 mb-10 overflow-hidden relative shadow-premium">
              <View className="flex-row items-center mb-12">
                 <View className="w-10 h-[2px] bg-indigo-500 mr-4" />
                 <Typography weight="black" className="text-[11px] text-indigo-400 italic tracking-[4px] uppercase font-black">CONTACT INFO</Typography>
              </View>

              <View className="gap-10">
                 {/* LOCATION */}
                 <View className="flex-row items-start">
                    <View className="w-14 h-14 items-center justify-center bg-white/5 rounded-2xl border border-white/10 shadow-2xl mr-6">
                       <MapPin size={22} color="#6366f1" strokeWidth={2} />
                    </View>
                    <View className="flex-1 justify-center min-h-[56px]">
                       <Typography weight="black" className="text-[10px] text-white/30 tracking-[3px] uppercase font-black mb-1">LOCATION</Typography>
                       <Typography weight="bold" className="text-[14px] text-white italic tracking-[0.5px] uppercase font-bold leading-[22px]">
                          Opp: New RTC Main Bus Stand, NR Peta, ELURU - 534 006
                       </Typography>
                    </View>
                 </View>

                 {/* DIRECT LINE */}
                 <View className="flex-row items-start">
                    <View className="w-14 h-14 items-center justify-center bg-white/5 rounded-2xl border border-white/10 shadow-2xl mr-6">
                       <Phone size={22} color="#6366f1" strokeWidth={2} />
                    </View>
                    <View className="flex-1 justify-center min-h-[56px]">
                       <Typography weight="black" className="text-[10px] text-white/30 tracking-[3px] uppercase font-black mb-1">DIRECT LINE</Typography>
                       <Typography weight="black" className="text-3xl text-white italic tracking-tighter uppercase font-black leading-none">70369 23456</Typography>
                    </View>
                 </View>

                 {/* OPENING HOURS */}
                 <View className="flex-row items-start">
                    <View className="w-14 h-14 items-center justify-center bg-white/5 rounded-2xl border border-white/10 shadow-2xl mr-6">
                       <Clock size={22} color="#6366f1" strokeWidth={2} />
                    </View>
                    <View className="flex-1 justify-center min-h-[56px]">
                       <Typography weight="black" className="text-[10px] text-white/30 tracking-[3px] uppercase font-black mb-1">OPENING HOURS</Typography>
                       <Typography weight="black" className="text-2xl text-white italic tracking-[-1px] uppercase font-black leading-none">9:00 AM - 11:00 PM</Typography>
                    </View>
                 </View>
              </View>
           </View>

           {/* NAVIGATION CARD */}
           <View className="bg-[#0b0e14] border border-white/10 rounded-[48px] overflow-hidden mb-24 relative shadow-premium">
              <View className="items-center justify-center py-20 relative min-h-[480px]">
                 {/* HIGH-FIDELITY ENVIRONMENTAL BACKDROP */}
                 <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1888&auto=format&fit=crop' }} 
                    className="absolute inset-0 w-full h-full opacity-40"
                    resizeMode="cover"
                 />
                 <LinearGradient 
                    colors={['#020408', 'rgba(2,4,8,0.4)', '#020408']} 
                    className="absolute inset-0" 
                 />

                 {/* VISUAL MAP MOCKUP (FLOATING PIN) */}
                 <Animated.View className="bg-black/80 border border-white/10 p-10 rounded-[48px] items-center mb-12 shadow-2xl backdrop-blur-3xl z-10">
                    <View className="bg-yellow-500/10 border border-yellow-500/20 px-6 py-3 rounded-2xl mb-8 shadow-2xl shadow-yellow-500/20">
                       <Typography weight="black" className="text-[28px] text-yellow-500 italic leading-none font-black tracking-tighter">E4</Typography>
                    </View>
                    <Typography weight="black" className="text-2xl text-white italic uppercase tracking-tighter font-black">EFOUR ELURU</Typography>
                    <Typography weight="bold" className="text-[10px] text-white/30 tracking-[4px] uppercase mt-3 font-bold">OUR PREMIER LOCATION</Typography>
                 </Animated.View>

                 <Pressable 
                    onPress={() => Linking.openURL('https://maps.app.goo.gl/vt9Y6CR3inDZ6yuX9?g_st=aw')}
                    className="bg-indigo-600 px-14 py-6 rounded-3xl shadow-2xl shadow-indigo-600/60 z-10 active:bg-indigo-700 active:scale-95 transition-all"
                 >
                    <Typography weight="black" className="text-[13px] text-white tracking-[4px] uppercase font-black italic">OPEN NAVIGATION</Typography>
                 </Pressable>
              </View>
           </View>

           {/* SECTION 2: GET IN TOUCH */}
           <View className="mb-20">
              <View className="mb-16">
                 <View className="flex-row items-center mb-10">
                    <View className="w-10 h-[2px] bg-indigo-500 mr-4" />
                    <Typography weight="black" className="text-[11px] tracking-[4px] text-indigo-400 uppercase font-black">GET IN TOUCH</Typography>
                 </View>
                 
                 <Typography weight="black" className="text-5xl leading-[55px] italic text-white mb-10 tracking-[-2px] font-black uppercase">CONNECT.</Typography>
                 
                 <View className="border-l-2 border-indigo-500/30 pl-8 mb-16">
                    <Typography weight="medium" className="text-[13px] text-gray-400 leading-[26px] italic uppercase tracking-[1.5px] font-medium">
                       OUR SUPPORT TEAM IS HERE TO HELP 24/7. SEND US YOUR MESSAGE AND WE WILL GET BACK TO YOU AS SOON AS POSSIBLE.
                    </Typography>
                 </View>

                 {/* EMAIL UNIT */}
                 <View className="flex-row items-start">
                    <View className="w-14 h-14 items-center justify-center bg-white/5 rounded-2xl border border-white/10 shadow-2xl mr-6">
                       <Mail size={22} color="#6366f1" strokeWidth={2} />
                    </View>
                    <View className="flex-1 justify-center min-h-[56px]">
                       <Typography weight="black" className="text-[10px] text-white/30 tracking-[3px] uppercase font-black mb-1">EMAIL SUPPORT</Typography>
                       <Typography weight="black" className="text-xl text-white italic tracking-tight lowercase font-black leading-none">efoureluru@gmail.com</Typography>
                    </View>
                 </View>
              </View>

              {/* FORM CARD */}
              <View className="bg-[#0b0e14] border border-white/10 rounded-[48px] p-10 gap-10 shadow-premium">
                 <View>
                    <Typography weight="black" className="text-[10px] text-indigo-400 tracking-[3px] uppercase mb-5 ml-4 font-black">YOUR NAME</Typography>
                    <View className="bg-black/60 border border-white/10 rounded-2xl px-8 h-20 justify-center shadow-inner focus:border-indigo-500/50">
                       <TextInput 
                          placeholder="ENTER YOUR FULL NAME"
                          placeholderTextColor="rgba(255,255,255,0.15)"
                          className="text-white text-[13px] font-bold uppercase tracking-widest h-full"
                       />
                    </View>
                 </View>

                 <View>
                    <Typography weight="black" className="text-[10px] text-indigo-400 tracking-[3px] uppercase mb-5 ml-4 font-black">YOUR EMAIL</Typography>
                    <View className="bg-black/60 border border-white/10 rounded-2xl px-8 h-20 justify-center shadow-inner focus:border-indigo-500/50">
                       <TextInput 
                          placeholder="EMAIL@DOMAIN.COM"
                          placeholderTextColor="rgba(255,255,255,0.15)"
                          className="text-white text-[13px] font-bold lowercase tracking-widest h-full"
                          keyboardType="email-address"
                       />
                    </View>
                 </View>

                 <View>
                    <Typography weight="black" className="text-[10px] text-indigo-400 tracking-[3px] uppercase mb-5 ml-4 font-black">YOUR MESSAGE</Typography>
                    <View className="bg-black/60 border border-white/10 rounded-[32px] px-8 h-48 pt-8 shadow-inner focus:border-indigo-500/50">
                       <TextInput 
                          placeholder="TYPE YOUR MESSAGE HERE..."
                          placeholderTextColor="rgba(255,255,255,0.15)"
                          className="text-white text-[13px] font-bold uppercase tracking-widest h-full"
                          multiline={true}
                          textAlignVertical="top"
                       />
                    </View>
                 </View>

                 <Pressable className="bg-indigo-600 h-24 rounded-[32px] flex-row items-center justify-center space-x-6 shadow-2xl shadow-indigo-600/50 mt-4 active:bg-indigo-700">
                    <Typography weight="black" className="text-base text-white tracking-[5px] uppercase font-black italic">SEND MESSAGE</Typography>
                    <Send size={20} color="white" strokeWidth={4} />
                 </Pressable>
              </View>
           </View>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}
