import React from 'react';
import { View, ScrollView, Pressable, Platform } from 'react-native';
import { Typography } from '../src/components/ui/Core';
import { ShieldAlert, X, UserCheck, ShieldCheck, Database, Clock, ThumbsUp, Fingerprint, Cookie, Share2, Mail, Phone, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyScreen() {
  const router = useRouter();

  const PolicyCard = ({ icon: Icon, title, children, color = "#6366f1" }: any) => (
    <View className="bg-white/5 p-6 rounded-[32px] border border-white/5 mb-4">
      <View className="flex-row items-center space-x-4 mb-6">
        <View className={`w-10 h-10 items-center justify-center rounded-xl border`} style={{ backgroundColor: `${color}10`, borderColor: `${color}20` }}>
          <Icon size={18} color={color} />
        </View>
        <Typography weight="black" className="text-sm text-white italic tracking-widest uppercase">{title}</Typography>
      </View>
      {children}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#020408]">
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {/* HEADER SECTION */}
        <View className="flex-row items-center justify-between mb-12">
           <View className="flex-row items-center space-x-3">
              <View className="w-10 h-10 items-center justify-center bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                 <ShieldAlert size={18} color="#6366f1" />
              </View>
              <View>
                <Typography weight="black" className="text-[8px] text-indigo-400 tracking-[3px] uppercase italic">YOUR PROTECTION</Typography>
                <Typography weight="black" className="text-xl text-white italic tracking-tighter uppercase">PRIVACY POLICY</Typography>
              </View>
           </View>
           <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center bg-white/5 rounded-full border border-white/10">
              <X size={18} color="rgba(255,255,255,0.4)" />
           </Pressable>
        </View>

        {/* TOP INTRO CARD */}
        <View className="bg-white/5 p-8 rounded-[40px] border border-white/10 mb-8">
           <Typography weight="bold" className="text-sm text-white/40 italic leading-7 uppercase tracking-wider">
             <Typography weight="black" className="text-white">EFOUR ELURU </Typography>
             PROTECTS ALL YOUR INFORMATION AND DATA SHARED WITH US VIA THIS WEBSITE. POLICY STARTED ON 
             <Typography weight="black" className="text-indigo-400"> MARCH 01, 2026.</Typography>
           </Typography>
        </View>

        {/* DATA & SECURITY GRID */}
        <View className="flex-row space-x-4 mb-4">
           <View className="flex-1">
             <PolicyCard icon={UserCheck} title="YOUR DATA">
               <View className="space-y-4">
                 {['NAME & MOBILE', 'EMAIL & ADDRESS', 'SURVEY DATA'].map((item) => (
                   <View key={item} className="flex-row items-center space-x-3">
                     <View className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                     <Typography weight="bold" className="text-[10px] text-white/60 tracking-wider uppercase italic">{item}</Typography>
                   </View>
                 ))}
               </View>
             </PolicyCard>
           </View>
           <View className="flex-1">
             <PolicyCard icon={ShieldCheck} title="SECURITY" color="#f97316">
               <Typography weight="bold" className="text-[9px] text-white/40 leading-4 uppercase tracking-wider italic">
                 WE USE SUITABLE PHYSICAL AND ELECTRONIC PROCEDURES TO SAFEGUARD YOUR INFO. WE WON'T SELL YOUR DATA UNLESS REQUIRED BY LAW.
               </Typography>
             </PolicyCard>
           </View>
        </View>

        {/* HOW WE USE DATA */}
        <PolicyCard icon={Database} title="HOW WE USE DATA">
           <View className="flex-row flex-wrap justify-between mt-2">
             {[
               { n: '01', t: 'INTERNAL RECORDS' },
               { n: '02', t: 'SERVICE UPDATES' },
               { n: '03', t: 'PROMOTIONS' },
               { n: '04', t: 'MARKET ANALYSIS' }
             ].map((item) => (
               <View key={item.n} className="w-[48%] mb-6">
                 <Typography weight="black" className="text-indigo-400 italic text-xl mb-1">{item.n}</Typography>
                 <Typography weight="black" className="text-[9px] text-white/30 tracking-[2px] uppercase italic">{item.t}</Typography>
               </View>
             ))}
           </View>
        </PolicyCard>

        {/* RETENTION & CONSENT GRID */}
        <View className="flex-row space-x-4 mb-4">
           <View className="flex-1">
             <PolicyCard icon={Clock} title="DATA RETENTION" color="#f97316">
               <Typography weight="bold" className="text-[9px] text-white/40 leading-4 uppercase tracking-wider italic">
                 WE STORE DATA ONLY AS LONG AS NECESSARY FOR THE PURPOSE IT WAS COLLECTED OR AS REQUIRED BY REGULATORY POLICIES.
               </Typography>
             </PolicyCard>
           </View>
           <View className="flex-1">
             <PolicyCard icon={ThumbsUp} title="CONSENT">
               <Typography weight="bold" className="text-[9px] text-white/40 leading-4 uppercase tracking-wider italic">
                 BY USING EFOUR ELURU, YOU CONSENT TO OUR POLICY. YOU CAN WITHDRAW YOUR CONSENT AT ANY TIME.
               </Typography>
             </PolicyCard>
           </View>
        </View>

        {/* RIGHTS / COOKIES / SHARING */}
        <View className="flex-row space-x-3 mb-8">
           <View className="flex-1 bg-white/5 p-5 rounded-[28px] border border-white/5">
              <Fingerprint size={16} color="#6366f1" className="mb-4" />
              <Typography weight="black" className="text-[10px] text-white italic uppercase mb-2">USER RIGHTS</Typography>
              <Typography weight="bold" className="text-[7px] text-white/20 uppercase italic leading-3">YOU CAN ACCESS, CORRECT, OR REQUEST DELETION OF YOUR DATA.</Typography>
           </View>
           <View className="flex-1 bg-white/5 p-5 rounded-[28px] border border-white/5">
              <Cookie size={16} color="#f97316" className="mb-4" />
              <Typography weight="black" className="text-[10px] text-white italic uppercase mb-2">COOKIES</Typography>
              <Typography weight="bold" className="text-[7px] text-white/20 uppercase italic leading-3">USED TO ENHANCE YOUR EXPERIENCE. ACCEPT OR DECLINE VIA SETTINGS.</Typography>
           </View>
           <View className="flex-1 bg-white/5 p-5 rounded-[28px] border border-white/5">
              <Share2 size={16} color="#6366f1" className="mb-4" />
              <Typography weight="black" className="text-[10px] text-white italic uppercase mb-2">DATA SHARING</Typography>
              <Typography weight="bold" className="text-[7px] text-white/20 uppercase italic leading-3">SHARED WITH TRUSTED PROVIDERS ONLY. NO MARKETING WITHOUT CONSENT.</Typography>
           </View>
        </View>

        {/* IDENTITY FOOTER */}
        <View className="bg-white/5 rounded-[40px] p-8 mb-40 border border-white/5 flex-row items-center justify-between">
           <View className="flex-row items-center space-x-4">
              <View className="w-12 h-12 items-center justify-center bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                 <ShieldAlert size={20} color="#6366f1" />
              </View>
              <View>
                <Typography weight="black" className="text-[8px] text-white/20 tracking-[3px] uppercase italic">IDENTITY</Typography>
                <Typography weight="black" className="text-xl text-white italic uppercase">EFOUR ELURU HQ</Typography>
              </View>
           </View>
           <View className="space-y-3">
              <View className="bg-black/60 px-4 py-2 rounded-xl flex-row items-center space-x-3">
                 <Mail size={12} color="#6366f1" />
                 <Typography weight="black" className="text-[8px] text-white tracking-widest italic lowercase">CEO@EFOUR-ELURU.COM</Typography>
              </View>
              <View className="bg-black/60 px-4 py-2 rounded-xl flex-row items-center space-x-3">
                 <Phone size={12} color="#f97316" />
                 <Typography weight="black" className="text-[8px] text-white tracking-widest uppercase italic">+91 70369 23456</Typography>
              </View>
           </View>
        </View>
      </ScrollView>

      {/* FOOTER ACTION */}
      <View className="absolute bottom-10 inset-x-6">
         <Pressable onPress={() => router.back()} className="bg-indigo-600 rounded-[32px] py-6 flex-row items-center justify-center shadow-2xl shadow-indigo-600/40 active:bg-indigo-700">
            <Typography weight="black" className="text-[11px] text-white tracking-[5px] uppercase">I UNDERSTAND</Typography>
            <Zap size={16} color="white" className="ml-3" />
         </Pressable>
      </View>
    </SafeAreaView>
  );
}
