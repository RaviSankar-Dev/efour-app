import React, { useState, useEffect, useMemo, memo } from 'react';
import { View, ScrollView, Pressable, Dimensions, StyleSheet, Platform, Modal, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
   useSharedValue,
   useAnimatedStyle,
   withSpring,
   interpolate,
   withTiming,
   FadeInDown,
   FadeInRight,
   Layout
} from 'react-native-reanimated';
import {
   Ticket as TicketIcon,
   Clock,
   ArrowRight,
   ShieldCheck,
   Zap,
   X,
   MapPin,
   Calendar,
   ChevronRight,
   Hash,
   Gift,
   Search,
   ChevronDown
} from 'lucide-react-native';
import { Typography } from '../../src/components/ui/Core';
import { useAppStore } from '../../src/store/useAppStore';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- THEME ---
const THEME = {
   purple: '#6C5CE7',
   orange: '#FF7A00',
   emerald: '#10b981',
   bg: '#000000',
   card: 'rgba(255,255,255,0.03)',
   border: 'rgba(255,255,255,0.08)',
};

// --- HELPER COMPONENTS ---

const TicketPass = memo(({ ticket, orderDate }: { ticket: any, orderDate: string }) => {
   const isExpired = ticket.status === 'used' || ticket.expired;
   const qrCode = ticket.code || ticket.uniqueQrId || ticket.qrData;

   return (
      <Animated.View
         entering={FadeInRight}
         className="bg-[#0f111a] rounded-[32px] border border-white/5 mb-4 p-5 flex-row items-center shadow-2xl"
      >
         {/* QR Section */}
         <View className="w-24 h-24 bg-white rounded-2xl p-2 items-center justify-center relative overflow-hidden">
            <Image
               source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCode)}&margin=1` }}
               className={`w-full h-full ${isExpired ? 'opacity-10 grayscale' : ''}`}
            />
            {isExpired && (
               <View className="absolute inset-0 items-center justify-center bg-black/60">
                  <View className="bg-red-500 px-2 py-1 rounded rotate-12">
                     <Typography weight="black" style={{ fontSize: 6 }} className="text-white uppercase font-black">USED/EXPIRED</Typography>
                  </View>
               </View>
            )}
         </View>

         {/* Details Section */}
         <View className="flex-1 ml-4 justify-between h-24 py-1">
            <View>
               <Typography weight="black" className="text-white text-xs uppercase tracking-tight">{ticket.name || 'ENTRY PASS'}</Typography>
               <Typography weight="black" style={{ fontSize: 7, letterSpacing: 2 }} className="text-white/30 uppercase mt-1">EFOUR GATEWAY</Typography>
            </View>

            <View className="flex-row items-center space-x-3">
               <View className="flex-row items-center space-x-1.5">
                  <Clock size={8} color={THEME.purple} />
                  <Typography weight="bold" style={{ fontSize: 7 }} className="text-white/60">VALID 24H</Typography>
               </View>
               <View className="w-1 h-1 rounded-full bg-white/10" />
               <View className="flex-row items-center space-x-1.5">
                  <ShieldCheck size={8} color={THEME.emerald} />
                  <Typography weight="bold" style={{ fontSize: 7 }} className="text-white/60">VERIFIED</Typography>
               </View>
            </View>
         </View>

         <View className="opacity-10">
            <ChevronRight size={16} color="white" />
         </View>
      </Animated.View>
   );
});

export default function YourTickets() {
   const insets = useSafeAreaInsets();
   const router = useRouter();
   const { user, tokens, isAuthenticated, logout, orders, fetchOrders } = useAppStore();

   // LOGIC STATES
   const [activeTab, setActiveTab] = useState<'rides' | 'events'>('rides');
   const [loading, setLoading] = useState(true);
   const [isRefreshing, setIsRefreshing] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
   const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any>(null);
   const [orderTicketsCache, setOrderTicketsCache] = useState<Record<string, any[]>>({});
   const [ticketsLoadingFor, setTicketsLoadingFor] = useState<string | null>(null);

   useEffect(() => {
      const init = async () => {
         if (isAuthenticated) {
            setLoading(true);
            setError(null);
            try {
               await fetchOrders();
            } catch (e: any) {
               setError(e.message || "Failed to parse transaction logs");
            } finally {
               setLoading(false);
            }
         } else {
            setLoading(false);
         }
      };
      init();
   }, [isAuthenticated]);

   const onRefresh = async () => {
      setIsRefreshing(true);
      await fetchOrders();
      setIsRefreshing(false);
   };

   const handleExpand = async (orderId: string) => {
      if (expandedOrder === orderId) {
         setExpandedOrder(null);
         return;
      }
      setExpandedOrder(orderId);

      // If already in cache, don't refetch
      if (orderTicketsCache[orderId]) return;

      setTicketsLoadingFor(orderId);
      try {
         const res = await fetch(`https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/tickets/order/${orderId}`, {
            headers: { 'Authorization': `Bearer ${tokens?.accessToken}` }
         });
         if (res.ok) {
            const data = await res.json();
            const tickets = Array.isArray(data) ? data : (data.tickets || []);
            setOrderTicketsCache(prev => ({ ...prev, [orderId]: tickets }));
         }
      } catch (err) {
         console.error("EXPANSION FETCH FAILED:", err);
      } finally {
         setTicketsLoadingFor(null);
      }
   };

   // CATEGORIZATION & GROUPING
   const categorizedOrders = useMemo(() => {
      const rides: any[] = [];
      const events: any[] = [];

      (orders || []).forEach(order => {
         const isEvent = (order?.items || []).some((item: any) => {
            const name = (item?.name || '').toLowerCase();
            return name.includes('dome') || name.includes('booking') || name.includes('event') || item?.stall === 'DOME';
         });

         // Map raw items to virtual tickets for instant preview before expansion fetch
         const virtualTickets = (order?.items || []).filter((item: any) => {
            const name = (item?.name || '').toLowerCase();
            return !name.includes('gst') && item?.id !== 'tax-gst';
         }).flatMap((item: any) => {
            const isCombo = (item?.name || '').toLowerCase().includes('combo') || (item?.rideCount || 0) > 1;
            const count = isCombo ? (item?.rideCount || 5) : 1;
            const total = (item?.quantity || 1) * count;

            return Array.from({ length: total }).map((_, i) => ({
               ...item,
               qrData: `${order?._id}-${item?.id}-${i}`,
               isVirtual: true
            }));
         });

         const processedOrder = { ...order, virtualTickets, isEvent };
         if (isEvent) events.push(processedOrder);
         else rides.push(processedOrder);
      });

      return { rides, events };
   }, [orders]);

   const activeOrders = activeTab === 'rides' ? categorizedOrders.rides : categorizedOrders.events;

   if (!isAuthenticated) {
      return (
         <View style={{ flex: 1, backgroundColor: THEME.bg, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
            <View className="w-24 h-24 bg-white/5 rounded-[32px] items-center justify-center mb-10 border border-white/10">
               <TicketIcon size={42} color={THEME.purple} />
            </View>
            <Typography weight="black" className="text-3xl text-white text-center mb-4 uppercase italic">ACCESS DENIED</Typography>
            <Typography weight="bold" style={{ fontSize: 9, letterSpacing: 3 }} className="text-white/30 text-center uppercase mb-12">PLEASE LOGIN TO VIEW YOUR PASSES</Typography>
            <Pressable
               onPress={() => router.push('/profile')}
               className="bg-[#6C5CE7] w-full h-16 rounded-[24px] items-center justify-center active:scale-95 shadow-2xl shadow-purple-900/40"
            >
               <Typography weight="black" style={{ fontSize: 11, letterSpacing: 4 }} className="text-white uppercase font-black">LOG IN NOW</Typography>
            </Pressable>
         </View>
      );
   }

   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
         <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
               <RefreshControl refreshing={isRefreshing} onRefresh={() => { setIsRefreshing(true); fetchOrders(); }} tintColor={THEME.purple} />
            }
         >
            {/* HEADER */}
            <View className="px-8 pt-10 pb-6">
               <View className="flex-row items-center space-x-3 mb-2 opacity-50">
                  <View className="w-10 h-[1.5px] bg-indigo-500" />
                  <Typography weight="black" style={{ fontSize: 9, letterSpacing: 4 }} className="text-indigo-400 uppercase">INTERNAL HUB</Typography>
               </View>
               <Typography weight="black" className="text-5xl text-white uppercase italic tracking-tighter leading-[1]">YOUR{"\n"}PASSES.</Typography>
               <View className="flex-row items-center space-x-3 mt-4 opacity-20">
                  <ShieldCheck size={12} color="white" />
                  <Typography weight="bold" style={{ fontSize: 8, letterSpacing: 2 }} className="text-white uppercase">END-TO-END ENCRYPTED GATEWAY</Typography>
               </View>
            </View>

            {/* SEARCH & FILTER */}
            <View className="px-6 mb-8 flex-row items-center space-x-4">
               <View className="flex-1 bg-white/[0.03] border border-white/5 rounded-2xl h-14 px-5 flex-row items-center space-x-4">
                  <Search size={16} color="rgba(255,255,255,0.2)" />
                  <Typography weight="bold" style={{ fontSize: 10, letterSpacing: 2 }} className="text-white/20 uppercase font-black">SEARCH TRANSACTIONS...</Typography>
               </View>
            </View>

            {/* TAB SWITCHER */}
            <View className="px-6 mb-10">
               <View className="bg-white/[0.03] p-1.5 rounded-[24px] border border-white/5 flex-row">
                  <Pressable
                     onPress={() => setActiveTab('rides')}
                     className={`flex-1 py-4 rounded-2xl items-center justify-center ${activeTab === 'rides' ? 'bg-[#FFD700]' : ''}`}
                  >
                     <Typography weight="black" style={{ fontSize: 10, letterSpacing: 4 }} className={`${activeTab === 'rides' ? 'text-black' : 'text-white/20'} uppercase italic font-black`}>RIDES</Typography>
                  </Pressable>
                  <Pressable
                     onPress={() => setActiveTab('events')}
                     className={`flex-1 py-4 rounded-2xl items-center justify-center ${activeTab === 'events' ? 'bg-[#FFD700]' : ''}`}
                  >
                     <Typography weight="black" style={{ fontSize: 10, letterSpacing: 4 }} className={`${activeTab === 'events' ? 'text-black' : 'text-white/20'} uppercase italic font-black`}>EVENTS</Typography>
                  </Pressable>
               </View>
            </View>

            {/* MAIN LIST */}
            <View className="px-6">
               {loading && !isRefreshing ? (
                  <View className="py-20 items-center justify-center">
                     <ActivityIndicator color={THEME.purple} size="large" />
                     <Typography weight="black" className="text-[10px] text-white/30 tracking-[4px] uppercase mt-6 font-black">PARSING TRANSACTION LOGS...</Typography>
                  </View>
               ) : error ? (
                  <View className="py-20 items-center justify-center">
                     <X size={28} color="#ef4444" />
                     <Typography weight="black" className="text-xl text-white/50 text-center uppercase tracking-tighter mt-4">FETCH PROTOCOL FAILED</Typography>
                     <Typography weight="bold" className="text-[9px] text-red-500/50 uppercase mt-2">{error}</Typography>
                     <Pressable onPress={onRefresh} className="mt-10 px-8 py-4 bg-red-500/10 rounded-full border border-red-500/20">
                        <Typography weight="black" className="text-[10px] text-red-500 tracking-[3px] uppercase italic">RETRY CONNECTION</Typography>
                     </Pressable>
                  </View>
               ) : activeOrders.length === 0 ? (
                  <View className="py-20 items-center justify-center">
                     <View className="w-20 h-20 bg-white/5 rounded-full items-center justify-center mb-8 border border-white/5 opacity-40">
                        <TicketIcon size={28} color="white" />
                     </View>
                     <Typography weight="black" className="text-xl text-white/20 text-center uppercase tracking-tighter">NO VALID PASSES FOUND</Typography>
                     <Pressable onPress={() => router.push('/')} className="mt-10 px-8 py-4 bg-white/5 rounded-full border border-white/10">
                        <Typography weight="black" className="text-[10px] text-indigo-400 tracking-[3px] uppercase italic">EXPLORE EXPERIENCES</Typography>
                     </Pressable>
                  </View>
               ) : (
                  activeOrders.map((order) => {
                     const isExpanded = expandedOrder === order._id;
                     const date = new Date(order.createdAt);
                     const amount = order.totalAmount || order.amount || 0;

                     return (
                        <Animated.View
                           key={order._id}
                           layout={Layout.springify()}
                           className="bg-[#0b0e14] rounded-[40px] border border-white/5 mb-6 overflow-hidden shadow-2xl"
                        >
                           {/* Header */}
                           <View className="p-6 border-b border-white/5 flex-row justify-between items-start">
                              <View className="flex-row items-center space-x-4">
                                 <View className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center border border-white/10">
                                    <TicketIcon size={18} color={THEME.purple} />
                                 </View>
                                 <View>
                                    <Typography weight="black" className="text-white text-base">EFOUR</Typography>
                                    <Typography weight="bold" style={{ fontSize: 7, letterSpacing: 1 }} className="text-white/30 uppercase mt-0.5">VIJAYAWADA TERMINAL</Typography>
                                 </View>
                              </View>
                              <View className="flex-row items-center space-x-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                 <ShieldCheck size={10} color={THEME.emerald} />
                                 <Typography weight="black" style={{ fontSize: 7, letterSpacing: 1 }} className="text-emerald-500 uppercase">PAID</Typography>
                              </View>
                           </View>

                           {/* Content Body */}
                           <View className="p-6">
                              <View className="space-y-3 mb-6">
                                 {order.items?.map((item: any, i: number) => {
                                    if (item.id === 'tax-gst' || item.name.includes('GST')) return null;
                                    return (
                                       <View key={i} className="flex-row items-center justify-between">
                                          <Typography weight="black" className="text-white/60 text-xs uppercase italic"><Typography weight="black" style={{ color: THEME.purple }}>{item.quantity}X</Typography> {item.name}</Typography>
                                          <Typography weight="black" className="text-white text-xs">₹{item.price * item.quantity}</Typography>
                                       </View>
                                    );
                                 })}
                              </View>

                              <View className="flex-row items-center justify-between pt-6 border-t border-white/5">
                                 <View className="flex-row items-center space-x-5 opacity-40">
                                    <View className="flex-row items-center space-x-2">
                                       <Calendar size={12} color="white" />
                                       <Typography weight="bold" style={{ fontSize: 9 }} className="text-white uppercase">{date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</Typography>
                                    </View>
                                    <View className="flex-row items-center space-x-2">
                                       <Clock size={12} color="white" />
                                       <Typography weight="bold" style={{ fontSize: 9 }} className="text-white uppercase">{date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}</Typography>
                                    </View>
                                 </View>
                                 <View className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                                    <Typography weight="black" className="text-white text-lg font-black">₹{amount}</Typography>
                                 </View>
                              </View>

                              {/* Action Buttons Stacked to Divide them clearly */}
                              <View className="space-y-4 mt-10">
                                 <Pressable
                                    onPress={() => handleExpand(order._id)}
                                    className={`h-16 rounded-3xl flex-row items-center justify-center space-x-3 active:scale-95 shadow-xl ${isExpanded ? 'bg-white/5 border border-white/10' : 'bg-[#FFD700] shadow-[#FFD700]/40'}`}
                                 >
                                    <Typography weight="black" style={{ fontSize: 10, letterSpacing: 4 }} className={`${isExpanded ? 'text-white' : 'text-black'} uppercase italic font-black`}>{isExpanded ? 'HIDE PASSES' : 'VIEW PASSES'}</Typography>
                                    {!isExpanded && <ChevronRight size={16} color="black" />}
                                    {isExpanded && <ChevronDown size={16} color="white" />}
                                 </Pressable>

                                 <Pressable
                                    onPress={() => setSelectedOrderForInvoice(order)}
                                    className="bg-white/5 h-16 rounded-3xl items-center justify-center border border-white/10 active:bg-white/10"
                                 >
                                    <Typography weight="black" style={{ fontSize: 10, letterSpacing: 4 }} className="text-white/40 uppercase italic">VIEW INVOICE</Typography>
                                 </Pressable>
                              </View>
                           </View>

                           {/* EXPANDED SECTION */}
                           {isExpanded && (
                              <View className="bg-white/[0.02] border-t border-dashed border-white/10 p-6">
                                 {ticketsLoadingFor === order._id ? (
                                    <View className="py-8 items-center space-x-3 flex-row justify-center">
                                       <ActivityIndicator color={THEME.purple} size="small" />
                                       <Typography weight="black" style={{ fontSize: 9, letterSpacing: 2 }} className="text-white/40 uppercase">SYNCING PASSES...</Typography>
                                    </View>
                                 ) : (
                                    <View>
                                       {(orderTicketsCache[order._id] || order.virtualTickets).map((ticket: any, tIdx: number) => (
                                          <TicketPass key={ticket._id || tIdx} ticket={ticket} orderDate={order.createdAt} />
                                       ))}
                                    </View>
                                 )}
                              </View>
                           )}
                        </Animated.View>
                     );
                  })
               )}
            </View>
         </ScrollView>

         {/* --- INVOICE MODAL --- */}
         <Modal visible={!!selectedOrderForInvoice} transparent animationType="slide">
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' }}>
               <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
               <SafeAreaView className="flex-1">
                  <View className="p-8 border-b border-white/5 flex-row justify-between items-center">
                     <View>
                        <Typography weight="black" className="text-white text-3xl uppercase tracking-tighter">DIGITAL <Typography weight="black" className="text-indigo-400">INVOICE</Typography></Typography>
                        <Typography weight="bold" style={{ fontSize: 8, letterSpacing: 4 }} className="text-white/30 uppercase mt-2">REF: {selectedOrderForInvoice?._id?.slice(-16)}</Typography>
                     </View>
                     <Pressable onPress={() => setSelectedOrderForInvoice(null)} className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 items-center justify-center">
                        <X size={24} color="#fff" />
                     </Pressable>
                  </View>

                  <ScrollView className="flex-1 px-8 pt-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                     {/* Entity Header */}
                     <View className="mb-10 items-center">
                        <View className="w-20 h-20 bg-white rounded-3xl p-4 mb-4 border border-white/20 items-center justify-center">
                           <Image source={require('../../assets/images/E4_LOGO_NEW.jpeg')} style={{ width: 44, height: 44 }} resizeMode="contain" />
                        </View>
                        <Typography weight="black" className="text-2xl text-white italic tracking-tighter uppercase mb-2">EFOUR ADVENTURE PARK</Typography>
                        <Typography weight="bold" className="text-[9px] text-white/40 text-center leading-relaxed max-w-[280px]">
                           ELURU BYPASS ROAD, NEAR RTC DEPOT, ELURU,{"\n"}ANDHRA PRADESH - 534001{"\n"}HELPLINE: +91 70369 23456
                        </Typography>
                     </View>

                     {/* Meta Grid */}
                     <View className="flex-row flex-wrap gap-4 mb-10">
                        <View className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5 min-w-[140px]">
                           <Typography weight="bold" style={{ fontSize: 7, letterSpacing: 2 }} className="text-white/30 uppercase mb-2">TRANSACTION DATE</Typography>
                           <Typography weight="black" className="text-white text-xs">{selectedOrderForInvoice && new Date(selectedOrderForInvoice.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</Typography>
                        </View>
                        <View className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5 min-w-[140px]">
                           <Typography weight="bold" style={{ fontSize: 7, letterSpacing: 2 }} className="text-white/30 uppercase mb-2">PAYMENT STATUS</Typography>
                           <View className="flex-row items-center space-x-2">
                              <ShieldCheck size={10} color={THEME.emerald} />
                              <Typography weight="black" className="text-emerald-500 text-xs">PAID & VERIFIED</Typography>
                           </View>
                        </View>
                     </View>

                     {/* Items List */}
                     <View className="bg-white/5 rounded-[32px] border border-white/5 p-8 mb-10">
                        <Typography weight="black" style={{ fontSize: 9, letterSpacing: 4 }} className="text-white/40 uppercase mb-8">BOOKING BREAKDOWN</Typography>

                        <View className="space-y-6">
                           {(() => {
                              const items = selectedOrderForInvoice?.items || [];
                              const rideItems = items.filter((it: any) => it.id !== 'tax-gst' && !it.name?.includes('GST'));
                              const taxItems = items.filter((it: any) => it.id === 'tax-gst' || it.name?.includes('GST'));

                              const subTotal = rideItems.reduce((acc: number, it: any) => acc + (it.price * it.quantity), 0);
                              const taxTotal = taxItems.reduce((acc: number, it: any) => acc + (it.price * it.quantity), 0);
                              const grandTotal = subTotal + taxTotal;

                              return (
                                 <>
                                    {rideItems.map((item: any, i: number) => (
                                       <View key={i} className="flex-row justify-between items-start">
                                          <View className="flex-1 mr-4">
                                             <Typography weight="black" className="text-white text-sm uppercase tracking-tight leading-tight">{item.name}</Typography>
                                             <Typography weight="bold" style={{ fontSize: 8 }} className="text-white/30 mt-1 uppercase">QTY: {item.quantity} × ₹{item.price}</Typography>
                                          </View>
                                          <Typography weight="black" className="text-white text-sm">₹{item.price * item.quantity}</Typography>
                                       </View>
                                    ))}

                                    <View className="h-[1px] bg-white/10 my-8" />

                                    <View className="flex-row justify-between items-center opacity-40 mb-4">
                                       <Typography weight="bold" style={{ fontSize: 9 }} className="text-white uppercase">SUB-TOTAL</Typography>
                                       <Typography weight="bold" className="text-white">₹{subTotal}</Typography>
                                    </View>
                                    <View className="flex-row justify-between items-center opacity-40 mb-8">
                                       <Typography weight="bold" style={{ fontSize: 9 }} className="text-white uppercase">GOV TAXES (GST 9%)</Typography>
                                       <Typography weight="bold" className="text-white">₹{taxTotal}</Typography>
                                    </View>

                                    <View className="flex-row justify-between items-center bg-[#6C5CE7] -mx-8 px-8 py-5">
                                       <Typography weight="black" style={{ fontSize: 12, letterSpacing: 4 }} className="text-white uppercase italic">GRAND TOTAL</Typography>
                                       <Typography weight="black" className="text-2xl text-white italic font-black">₹{grandTotal}</Typography>
                                    </View>
                                 </>
                              );
                           })()}
                        </View>
                     </View>

                     <View className="items-center py-10 opacity-20">
                        <Typography weight="bold" style={{ fontSize: 8, letterSpacing: 2 }} className="text-white/40 text-center uppercase">THIS IS A COMPUTER GENERATED SECURE RECEIPT. NO SIGNATURE REQUIRED.</Typography>
                     </View>
                  </ScrollView>

                  <View className="p-8 border-t border-white/5">
                     <Pressable
                        onPress={() => setSelectedOrderForInvoice(null)}
                        className="bg-white/5 h-18 rounded-3xl items-center justify-center border border-white/10 active:bg-white/10"
                     >
                        <Typography weight="black" style={{ fontSize: 11, letterSpacing: 6 }} className="text-white uppercase font-black">CLOSE PROTOCOL</Typography>
                     </Pressable>
                  </View>
               </SafeAreaView>
            </View>
         </Modal>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({});
