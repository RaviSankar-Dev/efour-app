import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, TextInput, Dimensions, KeyboardAvoidingView, Platform, ActivityIndicator, Modal } from 'react-native';
import { Typography, Container } from '../src/components/ui/Core';
import { Navbar } from '../src/components/ui/Navbar';
import { Calendar, Clock, Users, User, ArrowRight, ChevronLeft, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../src/store/useAppStore';

const { width, height } = Dimensions.get('window');

const SelectionModal = ({ visible, onClose, options, onSelect, title }: any) => (
   <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: 'rgba(2,4,8,0.95)', justifyContent: 'flex-end' }}>
         <View className="bg-[#0b0e14] border-t border-white/10 rounded-t-[48px] p-8 pb-16">
            <View className="flex-row items-center justify-between mb-10">
               <Typography weight="black" className="text-xl text-white italic font-black uppercase tracking-[3px]">{title}</Typography>
               <Pressable onPress={onClose} className="w-10 h-10 items-center justify-center bg-white/5 rounded-full">
                  <Typography weight="black" className="text-white/30">✕</Typography>
               </Pressable>
            </View>
            <ScrollView className="max-h-[500px]" showsVerticalScrollIndicator={false}>
               <View className="gap-3">
                  {options.map((opt: any) => (
                     <Pressable
                        key={opt.val || opt}
                        onPress={() => { onSelect(opt.val || opt); onClose(); }}
                        className="bg-white/5 border border-white/10 h-16 rounded-2xl items-center justify-center active:bg-indigo-600/20"
                     >
                        <Typography weight="black" className="text-white text-[13px] font-black tracking-widest uppercase">{opt.label || opt}</Typography>
                     </Pressable>
                  ))}
               </View>
            </ScrollView>
         </View>
      </View>
   </Modal>
);

export default function DomeBookingScreen() {
   const insets = useSafeAreaInsets();
   const router = useRouter();
   const { width, height } = useWindowDimensions();
   const { addToCart, setCartOpen } = useAppStore();
   const [formData, setFormData] = useState({
      name: '',
      date: '2026-03-28',
      time: '12:00 PM',
      guests: '4'
   });
   const [slots, setSlots] = useState<string[]>([]);
   const [loadingSlots, setLoadingSlots] = useState(false);
   const [dateModal, setDateModal] = useState(false);
   const [timeModal, setTimeModal] = useState(false);

   useEffect(() => {
      if (formData.date) {
         fetchSlots(formData.date);
      }
   }, [formData.date]);

   const fetchSlots = async (date: string) => {
      setLoadingSlots(true);
      try {
         const response = await fetch(`https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/domes/slots?date=${date}&location=E4`);
         const data = await response.json();
         if (response.ok) {
            const availableSlots = Array.isArray(data) ? data : (data.slots || []);
            setSlots(availableSlots);
            if (availableSlots.length > 0 && !formData.time) {
               setFormData(prev => ({ ...prev, time: availableSlots[0] }));
            }
         }
      } catch (error) {
         console.error("FAILED TO FETCH SLOTS:", error);
      } finally {
         setLoadingSlots(false);
      }
   };

   const handleProceed = () => {
      if (!formData.name || !formData.time) return;

      // ADD TO GLOBAL CART FOR UNIFIED CHECKOUT
      addToCart({
         id: `DOME-${formData.date}-${formData.time.replace(/\s/g, '')}-${formData.name.replace(/\s/g, '')}`,
         name: `DOME: ${formData.date} @ ${formData.time}`,
         price: 500,
         image: 'https://images.unsplash.com/photo-1549416878-b99b70ad2dbf?q=80&w=2070&auto=format&fit=crop'
      });

      // OPEN GLOBAL CART DRAWER
      setCartOpen(true);
   };

   const DATES = [
      { val: '2026-03-28', label: 'MARCH 28, 2026' },
      { val: '2026-03-29', label: 'MARCH 29, 2026' },
      { val: '2026-03-30', label: 'MARCH 30, 2026' }
   ];

   const DEFAULT_SLOTS = [
      '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
      '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
   ];

   return (
      <View className="flex-1 bg-white dark:bg-[#020408]">
         <Navbar />

         <SelectionModal
            visible={dateModal}
            onClose={() => setDateModal(false)}
            title="SELECT DATE"
            options={DATES}
            onSelect={(d: any) => setFormData({ ...formData, date: d, time: '' })}
         />

         <SelectionModal
            visible={timeModal}
            onClose={() => setTimeModal(false)}
            title="PICK A SLOT"
            options={slots.length > 0 ? slots : DEFAULT_SLOTS}
            onSelect={(s: any) => setFormData({ ...formData, time: s })}
         />

         <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
         >
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
               <View className="px-8 pb-20" style={{ paddingTop: insets.top + 100 }}>
                  {/* BACK BUTTON */}
                  <Pressable onPress={() => router.back()} className="flex-row items-center space-x-2 mb-10 opacity-60">
                     <ChevronLeft size={16} className="text-slate-900 dark:text-white" />
                     <Typography weight="black" className="text-[10px] text-slate-900 dark:text-white tracking-[3px] uppercase font-black">GO BACK</Typography>
                  </Pressable>

                  {/* HEADER */}
                  <View className="mb-14">
                     <View className="flex-row items-center mb-6">
                        <View className="w-10 h-[2px] bg-indigo-500 mr-4" />
                        <Typography weight="black" className="text-[11px] tracking-[4px] text-indigo-600 dark:text-indigo-400 uppercase font-black">RESERVATION GATEWAY</Typography>
                     </View>
                     <Typography weight="black" className="text-6xl text-slate-900 dark:text-white italic font-black uppercase leading-none">RESERVE{"\n"}DOME.</Typography>
                  </View>

                  {/* FORM CARD */}
                  <View className="bg-slate-50 dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-[48px] p-10 shadow-sm dark:shadow-premium mb-12">
                     <View className="gap-12">
                        {/* FULL NAME */}
                        <View>
                           <View className="flex-row items-center mb-5">
                              <View className="w-8 h-8 items-center justify-center bg-slate-100 dark:bg-white/5 rounded-xl mr-4 border border-slate-200 dark:border-white/10">
                                 <User size={14} color="#6366f1" />
                              </View>
                              <Typography weight="black" className="text-[10px] text-slate-400 dark:text-white/30 tracking-[3px] uppercase font-black">FULL NAME</Typography>
                           </View>
                           <TextInput
                              placeholder="ENTER YOUR NAME..."
                              placeholderTextColor={Platform.OS === 'ios' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.15)'}
                              className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 h-16 rounded-2xl px-6 text-slate-900 dark:text-white font-bold uppercase tracking-widest text-[13px] active:border-indigo-500/50"
                              value={formData.name}
                              onChangeText={(t) => setFormData({ ...formData, name: t })}
                           />
                        </View>

                        {/* DATE SELECTION */}
                        <View>
                           <View className="flex-row items-center mb-5">
                              <Pressable onPress={() => setDateModal(true)} className="flex-row items-center">
                                 <View className="w-8 h-8 items-center justify-center bg-slate-100 dark:bg-white/5 rounded-xl mr-4 border border-slate-200 dark:border-white/10">
                                    <Calendar size={14} color="#6366f1" />
                                 </View>
                                 <Typography weight="black" className="text-[10px] text-slate-400 dark:text-white/30 tracking-[3px] uppercase font-black">SELECT DATE</Typography>
                              </Pressable>
                           </View>
                           <Pressable
                              onPress={() => setDateModal(true)}
                              className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 h-16 rounded-2xl px-6 flex-row items-center justify-between shadow-sm"
                           >
                              <Typography weight="black" className="text-slate-900 dark:text-white text-[13px] font-black tracking-widest uppercase italic">{DATES.find(d => d.val === formData.date)?.label || formData.date}</Typography>
                              <ChevronDown size={14} className="text-slate-400 dark:text-white/30" />
                           </Pressable>
                        </View>

                        {/* TIME SLOTS */}
                        <View>
                           <View className="flex-row items-center mb-5">
                              <Pressable onPress={() => setTimeModal(true)} className="flex-row items-center">
                                 <View className="w-8 h-8 items-center justify-center bg-slate-100 dark:bg-white/5 rounded-xl mr-4 border border-slate-200 dark:border-white/10">
                                    <Clock size={14} color="#6366f1" />
                                 </View>
                                 <Typography weight="black" className="text-[10px] text-slate-400 dark:text-white/30 tracking-[3px] uppercase font-black">PREMIUM SLOTS</Typography>
                              </Pressable>
                           </View>

                           <Pressable
                              onPress={() => setTimeModal(true)}
                              className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 h-16 rounded-2xl px-6 flex-row items-center justify-between shadow-sm"
                           >
                              <Typography weight="black" className="text-slate-900 dark:text-white text-[13px] font-black tracking-widest uppercase italic">{formData.time || 'CHOOSE TIMING'}</Typography>
                              <ChevronDown size={14} className="text-slate-400 dark:text-white/30" />
                           </Pressable>
                        </View>

                        {/* NUMBER OF PEOPLE */}
                        <View>
                           <View className="flex-row items-center mb-5">
                              <View className="w-8 h-8 items-center justify-center bg-slate-100 dark:bg-white/5 rounded-xl mr-4 border border-slate-200 dark:border-white/10">
                                 <Users size={14} color="#6366f1" />
                              </View>
                              <Typography weight="black" className="text-[10px] text-slate-400 dark:text-white/30 tracking-[3px] uppercase font-black">GUESTS (4-6)</Typography>
                           </View>
                           <View className="flex-row gap-4">
                              {['4', '5', '6'].map((n) => (
                                 <Pressable
                                    key={n}
                                    onPress={() => setFormData({ ...formData, guests: n })}
                                    className={`flex-1 h-16 rounded-2xl items-center justify-center border-2 ${formData.guests === n ? 'bg-indigo-600 border-indigo-400' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5'}`}
                                 >
                                    <Typography weight="black" className={`text-xl font-black italic ${formData.guests === n ? 'text-white' : 'text-slate-400 dark:text-white/30'}`}>{n}</Typography>
                                 </Pressable>
                              ))}
                           </View>
                        </View>
                     </View>

                     <View className="h-[1px] w-full bg-slate-200 dark:bg-white/10 my-12" />

                     <View className="flex-row items-center justify-between mb-12">
                        <Typography weight="black" className="text-[11px] text-slate-500 dark:text-white/40 tracking-[4px] uppercase font-black">TOTAL HR RATE</Typography>
                        <View className="flex-row items-center">
                           <Typography weight="black" className="text-5xl text-slate-900 dark:text-white italic font-black tracking-tighter">₹500</Typography>
                           <Typography weight="black" className="text-[12px] text-indigo-600 dark:text-indigo-400 italic font-black ml-2 uppercase tracking-[2px]">/ HOUR</Typography>
                        </View>
                     </View>

                     <Pressable
                        onPress={handleProceed}
                        className="bg-indigo-600 h-20 rounded-[32px] flex-row items-center justify-center gap-5 shadow-lg active:bg-indigo-700 active:opacity-90"
                     >
                        <Typography weight="black" className="text-[14px] text-white tracking-[5px] uppercase font-black italic">PROCEED TO PAY</Typography>
                        <ArrowRight size={22} stroke="white" strokeWidth={4} />
                     </Pressable>
                  </View>

               </View>
            </ScrollView>
         </KeyboardAvoidingView>
      </View>
   );
}
