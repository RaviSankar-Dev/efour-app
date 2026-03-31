import React from 'react';
import { View, ScrollView, Pressable, Image, Platform } from 'react-native';
import { Typography } from '../src/components/ui/Core';
import { Info, X, Store, Users, Target, ArrowUpRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#020408]">
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {/* HEADER SECTION */}
        <View className="flex-row items-center justify-between mb-12">
           <View className="flex-row items-center space-x-3">
              <View className="w-10 h-10 items-center justify-center bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                 <Info size={18} color="#6366f1" />
              </View>
              <Typography weight="black" className="text-xl text-white italic tracking-tighter uppercase">OUR STORY</Typography>
           </View>
           <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center bg-white/5 rounded-full border border-white/10">
              <X size={18} color="rgba(255,255,255,0.4)" />
           </Pressable>
        </View>

        {/* HERO SECTION */}
        <View className="items-center mb-16 px-4">
           <Typography weight="black" className="text-[10px] text-indigo-400 tracking-[5px] mb-6 uppercase">SINCE 2026</Typography>
           <View className="items-center mb-8">
              <Typography weight="black" className="text-6xl text-white italic tracking-[-3px] leading-[55px] text-center">EAT. ENJOY.</Typography>
              <Typography weight="black" className="text-6xl text-indigo-400 italic tracking-[-3px] leading-[55px] text-center uppercase">ENTERTAIN.</Typography>
           </View>
           <Typography weight="bold" className="text-[11px] text-white/40 leading-6 italic uppercase tracking-wider text-center">
             EFOUR IS A PREMIER FOOD COURT AND PLAY ZONE BRINGING FAMILIES TOGETHER THROUGH DIVERSE CUISINES AND RECREATION UNDER ONE ROOF.
           </Typography>
        </View>

        {/* VALUE CARDS */}
        <View className="space-y-6 mb-16">
           {/* Vendors Card */}
           <View className="bg-[#0b0e14] p-8 rounded-[40px] border border-white/5">
              <View className="flex-row items-center space-x-5 mb-6">
                 <View className="w-12 h-12 items-center justify-center bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                    <Store size={22} color="#6366f1" />
                 </View>
                 <Typography weight="black" className="text-xl text-white italic uppercase">FOR VENDORS</Typography>
              </View>
              <Typography weight="bold" className="text-[11px] text-white/40 leading-6 uppercase tracking-wider italic">
                PROMOTE YOUR CULINARY BUSINESS DIRECTLY TO THOUSANDS. BENEFIT FROM AN ENHANCED E-EXPERIENCE WITH DIRECT CUSTOMER REVIEWS AND ANALYTICS.
              </Typography>
           </View>

           {/* Users Card */}
           <View className="bg-[#0b0e14] p-8 rounded-[40px] border border-white/5">
              <View className="flex-row items-center space-x-5 mb-6">
                 <View className="w-12 h-12 items-center justify-center bg-orange-500/10 rounded-2xl border border-orange-500/20">
                    <Users size={22} color="#f97316" />
                 </View>
                 <Typography weight="black" className="text-xl text-white italic uppercase">FOR USERS</Typography>
              </View>
              <Typography weight="bold" className="text-[11px] text-white/40 leading-6 uppercase tracking-wider italic">
                A WIDE RANGE OF SERVICES SUITED TO YOUR NEEDS—FROM DIVERSE CUISINES TO CUSTOMIZED ENTERTAINMENT PACKAGES AND SEAMLESS QR PAYMENTS.
              </Typography>
           </View>
        </View>

        {/* VISION SECTION */}
        <View className="bg-white/5 rounded-[48px] p-10 mb-40 border border-white/5">
           <View className="flex-row items-center space-x-4 mb-10">
              <View className="w-10 h-10 items-center justify-center bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                 <Target size={18} color="#6366f1" />
              </View>
              <Typography weight="black" className="text-lg text-white italic uppercase">OUR VISION</Typography>
           </View>

           <View className="bg-black/60 rounded-[32px] p-8 border-l-4 border-indigo-500 mb-12 shadow-2xl">
              <Typography weight="bold" className="text-sm text-white/80 leading-6 italic uppercase">
                "WE DESIGNED AN AMPLE SPACE FOR ALL CUISINES AND PLAY ZONE ACTIVITIES TO SUIT ALL AGES AND PROMOTE LOCAL TALENT."
              </Typography>
           </View>

           {/* FOUNDER BLOCK - PREMIUM AVATAR STYLING */}
           <View className="items-center">
              <View className="w-36 h-36 rounded-full overflow-hidden border-2 border-indigo-500/30 shadow-2xl bg-[#0b0e14] mb-8 p-1">
                 <View className="w-full h-full rounded-full overflow-hidden">
                    <Image 
                      source={require('../assets/images/founder_new.jpeg')} 
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                 </View>
              </View>
              
              <View className="items-center">
                 <Typography weight="black" className="text-2xl text-white italic uppercase tracking-tighter text-center mb-3">JAYANARAYANA KURETI</Typography>
                 <View className="flex-row items-center space-x-4">
                    <View className="w-8 h-[1.5px] bg-indigo-500" />
                    <Typography weight="black" className="text-[10px] text-indigo-400 tracking-[5px] uppercase italic">FOUNDER & CEO</Typography>
                    <View className="w-8 h-[1.5px] bg-indigo-500" />
                 </View>
              </View>
           </View>
        </View>
      </ScrollView>

      {/* FOOTER ACTION */}
      <View className="absolute bottom-10 inset-x-6">
         <Pressable onPress={() => router.back()} className="bg-indigo-600 rounded-[32px] py-6 flex-row items-center justify-center shadow-2xl shadow-indigo-600/40 active:bg-indigo-700">
            <Typography weight="black" className="text-[11px] text-white tracking-[5px] uppercase">GO BACK</Typography>
            <ArrowUpRight size={16} color="white" className="ml-3" />
         </Pressable>
      </View>
    </SafeAreaView>
  );
}
