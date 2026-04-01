import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Typography } from '../src/components/ui/Core';
import { FileText, X, UserPlus, FileCheck, Shield, CreditCard, Layout, Ban, Copyright, Lock, AlertTriangle, RefreshCcw, Globe, Power, Gavel, Info, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const TermsCard = ({ icon: Icon, title, content, color = "#6366f1", fullWidth = false }: any) => (
    <View className={`${fullWidth ? 'w-full' : 'w-[48%]'} bg-slate-50 dark:bg-white/5 p-5 rounded-[32px] border border-slate-200 dark:border-white/5 mb-4 shadow-sm`}>
      <View className="flex-row items-center space-x-3 mb-4">
        <View className="w-8 h-8 items-center justify-center rounded-xl border" style={{ backgroundColor: `${color}10`, borderColor: `${color}20` }}>
          <Icon size={14} color={color} />
        </View>
        <Typography weight="black" className="text-[10px] text-slate-900 dark:text-white italic tracking-widest uppercase flex-1">{title}</Typography>
      </View>
      <Typography weight="bold" className="text-[8px] text-slate-500 dark:text-white/40 leading-4 uppercase tracking-wider italic">
        {content}
      </Typography>
    </View>
  );

  return (
    <View className="flex-1 bg-white dark:bg-[#020408]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}>
        <View className="p-6" style={{ paddingTop: insets.top + 20 }}>
          {/* HEADER SECTION */}
          <View className="flex-row items-center justify-between mb-12">
             <View className="flex-row items-center space-x-3">
                <View className="w-10 h-10 items-center justify-center bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                   <FileText size={18} color="#6366f1" />
                </View>
                <View>
                  <Typography weight="black" className="text-[8px] text-indigo-600 dark:text-indigo-400 tracking-[3px] uppercase italic">PROTOCOL 2026</Typography>
                  <Typography weight="black" className="text-xl text-slate-900 dark:text-white italic tracking-tighter uppercase">TERMS OF USE</Typography>
                </View>
             </View>
             <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10 active:opacity-70 shadow-sm">
                <X size={18} className="text-slate-400 dark:text-white/40" />
             </Pressable>
          </View>

          {/* TOP USAGE CARD */}
          <View className="bg-slate-50 dark:bg-white/5 p-8 rounded-[40px] border border-slate-200 dark:border-white/10 mb-8 shadow-sm">
             <Typography weight="bold" className="text-xs text-slate-500 dark:text-white/40 italic leading-6 uppercase tracking-wider text-center">
               USAGE OF <Typography weight="black" className="text-slate-900 dark:text-white font-black">EFOUR ELURU</Typography> (EFOUR-ELURU.COM) IS SUBJECT TO THESE TERMS & CONDITIONS. ACCEPTANCE IS IMPLIED BY USING THE SITE.
             </Typography>
          </View>

          {/* TERMS GRID */}
          <View className="flex-row flex-wrap justify-between">
            <TermsCard icon={UserPlus} title="ELIGIBILITY" content="YOU MUST BE AT LEAST 18 YEARS OLD OR VISITING UNDER PARENTAL SUPERVISION. YOU REPRESENT THAT YOU HAVE THE LEGAL CAPACITY TO ENTER INTO A BINDING AGREEMENT." />
            <TermsCard icon={FileCheck} title="USER OBLIGATIONS" color="#f97316" content="USE FOR LAWFUL PURPOSES ONLY. YOU MUST PROVIDE ACCURATE INFO AND KEEP YOUR LOGIN CREDENTIALS SECURE. DO NOT SHARE YOUR ACCOUNT." />
            <TermsCard icon={Shield} title="ACCOUNT RESPONSIBILITY" content="YOU ARE RESPONSIBLE FOR ALL ACTIVITIES THAT OCCUR UNDER YOUR ACCOUNT. NOTIFY US IMMEDIATELY OF ANY UNAUTHORIZED USE OR SECURITY BREACH." />
            <TermsCard icon={CreditCard} title="PAYMENTS & TRANSACTIONS" color="#f97316" content="ALL PAYMENTS ARE PROCESSED SECURELY VIA RAZORPAY. PRICES ARE INCLUSIVE OF APPLICABLE GST. TRANSACTIONS ARE FINAL ONCE CONFIRMED." />
            <TermsCard icon={Layout} title="CONTENT USAGE" content="MATERIALS ARE FOR PERSONAL USE ONLY. NO DATA MINING OR SCRAPING. WE AREN'T RESPONSIBLE FOR ACCURACY OF THIRD-PARTY MENU DESCRIPTIONS." />
            <TermsCard icon={Ban} title="PROHIBITED ACTIVITIES" color="#f97316" content="NO HACKING, REVERSE-ENGINEERING, OR USING AUTOMATED TOOLS TO ACCESS THE SITE. DO NOT POST OFFENSIVE OR ILLEGAL CONTENT." />
            <TermsCard icon={Copyright} title="INTELLECTUAL PROPERTY" content="ALL SITE CONTENT, INCLUDING THE EFOUR LOGO, TEXT, AND GRAPHICS, IS THE PROPERTY OF JAAN ENTERTAINMENT PVT LTD AND PROTECTED BY IP LAWS." />
            <TermsCard icon={Lock} title="PRIVACY POLICY REFERENCE" color="#f97316" content="YOUR USE OF OUR PLATFORM IS ALSO GOVERNED BY OUR PRIVACY POLICY, WHICH DETAILS HOW WE COLLECT AND MANAGE YOUR DATA." />
            
            <TermsCard fullWidth icon={AlertTriangle} title="LIABILITY LIMITATION" color="#f97316" content="WE ARE NOT LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING FROM SITE USAGE OR SERVICE INTERRUPTIONS. USE IT AT YOUR OWN RISK." />
            
            <TermsCard fullWidth icon={RefreshCcw} title="REFUND & RETURN POLICY" content="ALL BOOKINGS AND PURCHASES ARE FINAL. WE MAINTAIN A STRICT NO-REFUND AND NO-RETURN POLICY ONCE A SERVICE HAS BEEN BOOKED, FOOD HAS BEEN SERVED, OR ENTRY HAS BEEN GRANTED. PLEASE DOUBLE-CHECK YOUR ORDER BEFORE PROCEEDING." />
            
            <TermsCard icon={Globe} title="SERVICE AVAILABILITY" content="WE STRIVE FOR 24/7 UPTIME BUT DO NOT GUARANTEE UNINTERRUPTED ACCESS. WE RESERVE THE RIGHT TO PERFORM MAINTENANCE WITHOUT PRIOR NOTICE." />
            <TermsCard icon={Power} title="TERMINATION" color="#10b981" content="WE RESERVE THE RIGHT TO SUSPEND OR TERMINATE YOUR ACCOUNT AT OUR SOLE DISCRETION IF THESE TERMS ARE VIOLATED." />
            
            <TermsCard icon={Gavel} title="GOVERNING LAW" content="THESE TERMS ARE GOVERNED BY THE LAWS OF INDIA. ANY DISPUTES ARE SUBJECT TO THE EXCLUSIVE JURISDICTION OF THE COURTS IN VIJAYAWADA." />
            <View className="w-[48%] bg-slate-50 dark:bg-white/5 p-5 rounded-[32px] border border-slate-200 dark:border-white/5 mb-4 shadow-sm">
              <View className="flex-row items-center space-x-3 mb-4">
                <View className="w-8 h-8 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
                  <Info size={14} color="#6366f1" />
                </View>
                <Typography weight="black" className="text-[10px] text-slate-900 dark:text-white italic tracking-widest uppercase flex-1">CONTACT INFO</Typography>
              </View>
              <Typography weight="black" className="text-[7px] text-slate-400 dark:text-white/30 tracking-widest italic lowercase mb-2">CEO@EFOUR-ELURU.COM</Typography>
              <Typography weight="black" className="text-[7px] text-slate-400 dark:text-white/30 tracking-widest uppercase italic font-black">+91 70369 23456</Typography>
            </View>
          </View>

          <View className="h-40" />
        </View>
      </ScrollView>

      {/* FOOTER ACTION */}
      <View className="absolute bottom-10 inset-x-6" style={{ marginBottom: insets.bottom / 2 }}>
         <Pressable onPress={() => router.back()} className="bg-indigo-600 rounded-[32px] py-6 flex-row items-center justify-center shadow-lg active:bg-indigo-700 active:opacity-90">
            <Typography weight="black" className="text-[11px] text-white tracking-[5px] uppercase font-black">I AGREE</Typography>
            <Zap size={16} color="white" className="ml-3" />
         </Pressable>
      </View>
    </View>
  );
}
