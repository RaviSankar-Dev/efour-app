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
        <View className="flex-row space-x-4 mb-16">
           {/* Vendors Card */}
           <View className="flex-1 bg-indigo-500/5 p-6 rounded-[32px] border border-indigo-500/10">
              <View className="w-12 h-12 items-center justify-center bg-indigo-500/10 rounded-2xl mb-6">
                 <Store size={22} color="#6366f1" />
              </View>
              <Typography weight="black" className="text-lg text-white italic mb-4 uppercase">FOR VENDORS</Typography>
              <Typography weight="bold" className="text-[9px] text-white/40 leading-4 uppercase tracking-wider italic">
                PROMOTE YOUR CULINARY BUSINESS DIRECTLY TO THOUSANDS. BENEFIT FROM AN ENHANCED E-EXPERIENCE WITH DIRECT CUSTOMER REVIEWS.
              </Typography>
           </View>

           {/* Users Card */}
           <View className="flex-1 bg-orange-500/5 p-6 rounded-[32px] border border-orange-500/10">
              <View className="w-12 h-12 items-center justify-center bg-orange-500/10 rounded-2xl mb-6">
                 <Users size={22} color="#f97316" />
              </View>
              <Typography weight="black" className="text-lg text-white italic mb-4 uppercase">FOR USERS</Typography>
              <Typography weight="bold" className="text-[9px] text-white/40 leading-4 uppercase tracking-wider italic">
                A WIDE RANGE OF SERVICES SUITED TO YOUR NEEDS—FROM DIVERSE CUISINES TO CUSTOMIZED ENTERTAINMENT PACKAGES.
              </Typography>
           </View>
        </View>

        {/* VISION SECTION */}
        <View className="bg-white/5 rounded-[40px] p-8 mb-40 border border-white/5">
           <View className="flex-row items-center space-x-4 mb-10">
              <View className="w-10 h-10 items-center justify-center bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                 <Target size={18} color="#6366f1" />
              </View>
              <Typography weight="black" className="text-lg text-white italic uppercase">OUR VISION</Typography>
           </View>

           <View className="bg-black/40 rounded-3xl p-6 border-l-4 border-indigo-500 mb-10">
              <Typography weight="bold" className="text-xs text-white/80 leading-5 italic uppercase">
                "WE DESIGNED AN AMPLE SPACE FOR ALL CUISINES AND PLAY ZONE ACTIVITIES TO SUIT ALL AGES AND PROMOTE LOCAL TALENT."
              </Typography>
           </View>

           {/* FOUNDER BLOCK - REFINED PORTRAIT CROP */}
           <View className="flex-row items-center space-x-8">
              <View className="w-32 h-44 rounded-[40px] overflow-hidden border border-white/10 shadow-2xl bg-[#0b0e14]">
                 <Image 
                   source={require('../assets/images/founder_new.jpeg')} 
                   style={{ width: '100%', height: '100%', transform: [{ translateY: 5 }] }}
                   resizeMode="cover"
                 />
              </View>
              <View className="flex-1">
                 <Typography weight="black" className="text-2xl text-white italic uppercase leading-none mb-6 tracking-tighter">JAYANARAYANA KURETI</Typography>
                 <View className="flex-row items-center space-x-3">
                    <View className="w-8 h-[2px] bg-indigo-500" />
                    <Typography weight="black" className="text-[10px] text-white/30 tracking-[4px] uppercase italic">FOUNDER & CEO</Typography>
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
