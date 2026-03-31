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
        <View className="bg-white/5 p-10 rounded-[48px] border border-white/10 mb-10">
           <Typography weight="bold" className="text-[11px] text-white/40 italic leading-7 uppercase tracking-wider">
              <Typography weight="black" className="text-white">EFOUR ELURU </Typography>
              PROTECTS ALL YOUR INFORMATION AND DATA SHARED WITH US VIA THIS WEBSITE. POLICY LAST UPDATED ON 
              <Typography weight="black" className="text-indigo-400"> MARCH 01, 2026.</Typography>
           </Typography>
        </View>

        {/* DATA & SECURITY SECTION - VERTICAL STACK */}
        <View className="space-y-8 mb-8">
           <PolicyCard icon={UserCheck} title="YOUR DATA">
             <View className="space-y-5">
               {['NAME & MOBILE NUMBER', 'EMAIL & RESIDENTIAL ADDRESS', 'USER SURVEY FEEDBACK'].map((item) => (
                 <View key={item} className="flex-row items-center space-x-4">
                   <View className="w-2 h-2 rounded-full bg-indigo-500 shadow-premium" />
                   <Typography weight="black" className="text-[10px] text-white/60 tracking-widest uppercase italic font-black">{item}</Typography>
                 </View>
               ))}
             </View>
           </PolicyCard>

           <PolicyCard icon={ShieldCheck} title="SECURITY PROTOCOLS" color="#f97316">
             <Typography weight="bold" className="text-[11px] text-white/40 leading-6 uppercase tracking-wider italic">
               WE IMPLEMENT RIGOROUS PHYSICAL AND ELECTRONIC PROCEDURES TO SECURE YOUR SENSITIVE DATA. EFOUR NEVER SELLS OR LEASES YOUR PERSONAL INFORMATION TO THIRD PARTIES WITHOUT EXPLICIT CONSENT.
             </Typography>
           </PolicyCard>

           {/* HOW WE USE DATA */}
           <PolicyCard icon={Database} title="USE OF INFORMATION">
              <View className="flex-row flex-wrap justify-between mt-4">
                {[
                  { n: '01', t: 'INTERNAL RECORDS' },
                  { n: '02', t: 'SERVICE UPDATES' },
                  { n: '03', t: 'PROMOTIONS' },
                  { n: '04', t: 'MARKET ANALYSIS' }
                ].map((item) => (
                  <View key={item.n} className="w-[45%] mb-8">
                    <Typography weight="black" className="text-indigo-400 italic text-2xl mb-2 font-black">{item.n}</Typography>
                    <Typography weight="black" className="text-[10px] text-white/30 tracking-[3px] uppercase italic font-black">{item.t}</Typography>
                  </View>
                ))}
              </View>
           </PolicyCard>

           <PolicyCard icon={Clock} title="DATA RETENTION" color="#f97316">
             <Typography weight="bold" className="text-[11px] text-white/40 leading-6 uppercase tracking-wider italic">
               WE STORE DATA ONLY AS LONG AS NECESSARY FOR THE PURPOSE IT WAS COLLECTED OR AS MANDATED BY REGULATORY LAWS.
             </Typography>
           </PolicyCard>

           <PolicyCard icon={ThumbsUp} title="USER CONSENT">
             <Typography weight="bold" className="text-[11px] text-white/40 leading-6 uppercase tracking-wider italic">
               BY ACCESSING THE EFOUR ELURU PORTAL, YOU AGREE TO OUR PRIVACY TERMS. CONSENT CAN BE WITHDRAWN VIA THE PROFILE SETTINGS AT ANY TIME.
             </Typography>
           </PolicyCard>
        </View>

        {/* RIGHTS / COOKIES / SHARING - VERTICAL STACK */}
        <View className="space-y-6 mb-12">
           <View className="bg-white/5 p-8 rounded-[40px] border border-white/5 flex-row items-center space-x-6">
              <View className="w-14 h-14 items-center justify-center bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                 <Fingerprint size={24} color="#6366f1" />
              </View>
              <View className="flex-1">
                 <Typography weight="black" className="text-[12px] text-white italic uppercase mb-2 font-black">USER RIGHTS</Typography>
                 <Typography weight="bold" className="text-[9px] text-white/20 uppercase italic leading-4">ACCESS, CORRECT, OR REQUEST PERMANENT DELETION OF DATA.</Typography>
              </View>
           </View>
           <View className="bg-white/5 p-8 rounded-[40px] border border-white/5 flex-row items-center space-x-6">
              <View className="w-14 h-14 items-center justify-center bg-orange-500/10 rounded-2xl border border-orange-500/20">
                 <Cookie size={24} color="#f97316" />
              </View>
              <View className="flex-1">
                 <Typography weight="black" className="text-[12px] text-white italic uppercase mb-2 font-black">COOKIES</Typography>
                 <Typography weight="bold" className="text-[9px] text-white/20 uppercase italic leading-4">ENHANCING ANALYTICS. ACCEPT OR DECLINE VIA SESSION SETTINGS.</Typography>
              </View>
           </View>
           <View className="bg-white/5 p-8 rounded-[40px] border border-white/5 flex-row items-center space-x-6">
              <View className="w-14 h-14 items-center justify-center bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                 <Share2 size={24} color="#6366f1" />
              </View>
              <View className="flex-1">
                 <Typography weight="black" className="text-[12px] text-white italic uppercase mb-2 font-black">NO LEAK POLICY</Typography>
                 <Typography weight="bold" className="text-[9px] text-white/20 uppercase italic leading-4">SHARED WITH TRUSTED PROVIDERS ONLY. NO THIRD-PARTY MARKETING.</Typography>
              </View>
           </View>
        </View>

        {/* IDENTITY FOOTER */}
        <View className="bg-[#0b0e14] rounded-[48px] p-10 mb-40 border border-white/10">
           <View className="flex-row items-center space-x-5 mb-10">
              <View className="w-14 h-14 items-center justify-center bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                 <ShieldAlert size={24} color="#6366f1" />
              </View>
              <View>
                <Typography weight="black" className="text-[10px] text-white/20 tracking-[4px] uppercase italic font-black font-black">IDENTITY CONTROL</Typography>
                <Typography weight="black" className="text-2xl text-white italic uppercase tracking-tighter font-black">EFOUR ELURU HQ</Typography>
              </View>
           </View>
           
           <View className="space-y-4">
              <View className="bg-white/5 px-6 py-5 rounded-[24px] border border-white/5 flex-row items-center justify-between">
                 <View className="flex-row items-center space-x-4">
                    <Mail size={16} color="#6366f1" />
                    <Typography weight="black" className="text-[10px] text-white/60 tracking-widest italic lowercase font-black">CEO@EFOUR-ELURU.COM</Typography>
                 </View>
                 <ShieldCheck size={14} color="#10b981" />
              </View>
              <View className="bg-white/5 px-6 py-5 rounded-[24px] border border-white/5 flex-row items-center justify-between">
                 <View className="flex-row items-center space-x-4">
                    <Phone size={16} color="#f97316" />
                    <Typography weight="black" className="text-[10px] text-white/60 tracking-widest uppercase italic font-black">+91 70369 23456</Typography>
                 </View>
                 <Zap size={14} color="#f59e0b" fill="#f59e0b" />
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
