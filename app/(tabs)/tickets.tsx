import React, { useState, useEffect, useMemo, memo } from 'react';
import { View, ScrollView, Pressable, Dimensions, StyleSheet, Platform, Modal, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  withTiming,
  withSequence,
  runOnJS
} from 'react-native-reanimated';
import Svg, { Circle, Rect } from 'react-native-svg';
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
  Cpu,
  Globe,
  Trash2
} from 'lucide-react-native';
import { Typography } from '../../src/components/ui/Core';
import { useAppStore } from '../../src/store/useAppStore';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- CONSTANTS ---
const EXPIRY_HOURS = 24;
const THEME = {
  purple: '#6C5CE7',
  orange: '#FF7A00',
  emerald: '#10b981',
  bg: '#000000',
  card: 'rgba(255,255,255,0.03)',
  border: 'rgba(255,255,255,0.08)',
};

// --- HELPER COMPONENTS ---

const QRCodeSVG = ({ size = 150 }) => {
  const dots = useMemo(() => {
    const list = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        if (
          !(i < 4 && j < 4) &&
          !(i > count - 5 && j < 4) &&
          !(i < 4 && j > count - 5)
        ) {
          if (Math.random() > 0.4) list.push({ i, j });
        }
      }
    }
    return list;
  }, []);

  const dotSize = size / 16;

  return (
    <View style={{ width: size, height: size, backgroundColor: '#fff', padding: size * 0.1, borderRadius: 24 }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
        <Rect x={0} y={0} width={dotSize * 4} height={dotSize * 4} fill="#000" rx={4} />
        <Rect x={dotSize} y={dotSize} width={dotSize * 2} height={dotSize * 2} fill="#fff" rx={2} />
        <Rect x={dotSize * 1.5} y={dotSize * 1.5} width={dotSize} height={dotSize} fill="#000" rx={1} />

        <Rect x={size - dotSize * 4} y={0} width={dotSize * 4} height={dotSize * 4} fill="#000" rx={4} />
        <Rect x={size - dotSize * 3} y={dotSize} width={dotSize * 2} height={dotSize * 2} fill="#fff" rx={2} />
        <Rect x={size - dotSize * 2.5} y={dotSize * 1.5} width={dotSize} height={dotSize} fill="#000" rx={1} />

        <Rect x={0} y={size - dotSize * 4} width={dotSize * 4} height={dotSize * 4} fill="#000" rx={4} />
        <Rect x={dotSize} y={size - dotSize * 3} width={dotSize * 2} height={dotSize * 2} fill="#fff" rx={2} />
        <Rect x={dotSize * 1.5} y={size - dotSize * 2.5} width={dotSize} height={dotSize} fill="#000" rx={1} />

        {dots.map((d, i) => (
          <Rect
            key={i}
            x={d.i * dotSize + dotSize * 1.5}
            y={d.j * dotSize + dotSize * 1.5}
            width={dotSize * 0.8}
            height={dotSize * 0.8}
            fill="#000"
            rx={1}
          />
        ))}
      </Svg>
    </View>
  );
};

const CircularProgress = ({ pct, color }: { pct: number, color: string }) => {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - pct) * circ) / 100;

  return (
    <View style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width="44" height="44" style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle r={r} cx="22" cy="22" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
        <Circle r={r} cx="22" cy="22" fill="transparent" stroke={color} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={strokePct} strokeLinecap="round" />
      </Svg>
    </View>
  );
};

const TicketCard = memo(({ item }: { item: any }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useSharedValue(0);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0, pct: 100 });

  useEffect(() => {
    const timer = setInterval(() => {
      const bDate = item.bookingDate || item.purchaseDate || Date.now();
      const now = Date.now();
      const diff = (bDate + EXPIRY_HOURS * 60 * 60 * 1000) - now;
      if (diff <= 0) {
        setTimeLeft({ h: 0, m: 0, s: 0, pct: 0 });
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      const pct = (diff / (EXPIRY_HOURS * 60 * 60 * 1000)) * 100;
      setTimeLeft({ h, m, s, pct });
    }, 1000);
    return () => clearInterval(timer);
  }, [item.bookingDate, item.purchaseDate]);

  const handlePress = () => {
    flipAnim.value = withSpring(isFlipped ? 0 : 1, { damping: 20, stiffness: 90 });
    setIsFlipped(!isFlipped);
  };

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(flipAnim.value, [0, 1], [0, 180])}deg` }],
    opacity: interpolate(flipAnim.value, [0, 0.5, 1], [1, 0, 0]),
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(flipAnim.value, [0, 1], [180, 360])}deg` }],
    opacity: interpolate(flipAnim.value, [0, 0.5, 1], [0, 0, 1]),
  }));

  const statusColor = timeLeft.pct < 15 ? THEME.orange : (item.isExpired ? '#ef4444' : THEME.purple);

  return (
    <View style={{ height: 320, width: '100%', marginBottom: 24, zIndex: isFlipped ? 100 : 1 }}>
      <Pressable onPress={handlePress} style={{ flex: 1 }}>
        <Animated.View style={[StyleSheet.absoluteFill, frontStyle]}>
          <View className="flex-1 bg-[#0f121b] rounded-[40px] border border-white/10 p-8 justify-between shadow-2xl relative overflow-hidden">
            <View style={{ backgroundColor: statusColor, position: 'absolute', top: 0, left: 0, right: 0, height: 4, opacity: 0.3 }} />
            <View className="flex-row justify-between items-start">
              <View className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex-row items-center space-x-2">
                <View style={{ backgroundColor: statusColor }} className="w-1.5 h-1.5 rounded-full shadow-lg" />
                <Typography weight="black" style={{ fontSize: 7, letterSpacing: 3 }} className="text-white uppercase">ACTIVE</Typography>
              </View>
              <Typography weight="black" className="text-white text-xl">₹{item.price * item.quantity}</Typography>
            </View>
            <View className="flex-1 justify-center py-6">
              <View className="flex-row items-center space-x-4 mb-3">
                <Cpu size={14} color={THEME.purple} />
                <Typography weight="black" style={{ fontSize: 8, letterSpacing: 4 }} className="text-white/40 uppercase">E4 PASS SYSTEM</Typography>
              </View>
              <Typography weight="black" className="text-[32px] text-white tracking-tighter uppercase leading-none">{item.name}</Typography>
            </View>
            <View className="flex-row items-center bg-black/40 rounded-3xl p-4 border border-white/5">
              <CircularProgress pct={timeLeft.pct} color={statusColor} />
              <View className="ml-4">
                <Typography weight="black" style={{ fontSize: 7, letterSpacing: 2 }} className="text-white/30 uppercase mb-1">REMAINING</Typography>
                <Typography weight="black" className="text-xl text-white font-mono tabular-nums tracking-widest leading-none">
                  {String(timeLeft.h).padStart(2, '0')}:{String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')}
                </Typography>
              </View>
              <View className="ml-auto w-12 h-12 rounded-2xl bg-white/5 items-center justify-center border border-white/10">
                <ArrowRight size={18} color="#fff" />
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[StyleSheet.absoluteFill, backStyle]}>
          <View className="flex-1 bg-black rounded-[40px] border border-white/10 p-8 items-center justify-between shadow-2xl overflow-hidden">
            <View className="w-full flex-row justify-between items-center opacity-40">
              <Typography weight="bold" style={{ fontSize: 8, letterSpacing: 4 }} className="text-white uppercase">VERIFICATION</Typography>
              <Zap size={14} color="#fff" />
            </View>
            <View className="items-center justify-center">
              <View className="p-4 bg-white rounded-[40px] shadow-2xl">
                <QRCodeSVG size={140} />
              </View>
              <Typography weight="black" className="text-white text-[10px] tracking-[4px] uppercase mt-8 opacity-40">TICKET KEY: {String(item.id || 'N/A').slice(-8)}</Typography>
            </View>
            <View className="w-full bg-white/5 rounded-2xl p-4 border border-white/10 flex-row items-center justify-center space-x-6">
              <View className="flex-row items-center space-x-3">
                <ShieldCheck size={14} color={THEME.emerald} />
                <Typography weight="black" style={{ fontSize: 8 }} className="text-white/60 uppercase">SECURE</Typography>
              </View>
              <View className="w-1 h-1 rounded-full bg-white/20" />
              <View className="flex-row items-center space-x-3">
                <Globe size={14} color={THEME.purple} />
                <Typography weight="black" style={{ fontSize: 8 }} className="text-white/60 uppercase">VALID</Typography>
              </View>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
});

const OrderCard = ({ order, onDetails }: { order: any, onDetails: () => void }) => {
  const date = new Date(order.bookingDate || order.purchaseDate || Date.now());
  const total = order.totalPrice || order.tickets?.reduce((acc: number, t: any) => acc + (t.price * t.quantity), 0) || 0;

  return (
    <Pressable onPress={onDetails} style={{ marginBottom: 24 }}>
      <View className="bg-[#0f111a] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
        <View className="p-6 flex-row items-center justify-between border-b border-white/5 bg-white/[0.01]">
          <View className="flex-row items-center space-x-4">
            <View className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center border border-white/10">
              <Image source={require('../../assets/images/E4_LOGO_NEW.jpeg')} style={{ width: 24, height: 24 }} resizeMode="contain" className="brightness-150" />
            </View>
            <View>
              <Typography weight="black" className="text-white text-base">EFOUR</Typography>
              <View className="flex-row items-center space-x-1 opacity-40">
                <MapPin size={8} color={THEME.purple} />
                <Typography weight="bold" style={{ fontSize: 7, letterSpacing: 1 }} className="text-white uppercase">VIJAYAWADA TERMINAL</Typography>
              </View>
            </View>
          </View>
          <View className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Typography weight="black" style={{ fontSize: 8, letterSpacing: 2 }} className="text-emerald-500 uppercase">PAID</Typography>
          </View>
        </View>
        <View className="p-6">
          <View className="space-y-4">
            {order.tickets?.map((t: any, i: number) => (
              <View key={i} className="flex-row justify-between items-center">
                <Typography weight="bold" className="text-white/60 text-sm uppercase"><Typography weight="black" className="text-indigo-400">{t.quantity}X</Typography> {t.name}</Typography>
                <Typography weight="black" className="text-white text-sm">₹{t.price * t.quantity}</Typography>
              </View>
            ))}
          </View>
          <View className="mt-8 flex-row items-center justify-between">
            <View className="flex-row items-center space-x-6 opacity-30">
              <View className="flex-row items-center space-x-2">
                <Calendar size={12} color="#fff" />
                <Typography weight="bold" className="text-[10px] uppercase">{date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</Typography>
              </View>
              <View className="flex-row items-center space-x-2">
                <Clock size={12} color="#fff" />
                <Typography weight="bold" className="text-[10px] uppercase">{date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</Typography>
              </View>
            </View>
            <View className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <Typography weight="black" className="text-white text-lg">₹{total}</Typography>
            </View>
          </View>
          <View className="mt-8 flex-row space-x-4">
            <Pressable className="flex-1 bg-white/5 h-14 rounded-2xl items-center justify-center border border-white/5 active:bg-white/10" onPress={onDetails}>
              <Typography weight="black" style={{ fontSize: 9, letterSpacing: 2 }} className="text-white uppercase">DETAILS</Typography>
            </Pressable>
            <Pressable className="flex-[1.5] bg-[#6C5CE7] h-14 rounded-2xl flex-row items-center justify-center space-x-3 active:scale-95 shadow-xl shadow-purple-900/40" onPress={onDetails}>
              <Typography weight="black" style={{ fontSize: 9, letterSpacing: 2 }} className="text-white uppercase">VIEW PASSES</Typography>
              <ChevronRight size={14} color="#fff" />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default function YourTickets() {
  const router = useRouter();
  const { tickets, isAuthenticated, fetchMyTickets } = useAppStore();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      fetchMyTickets().finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  const activeOrders = useMemo(() => {
    return tickets.filter(t => !t.isExpired).reverse(); // Latest first
  }, [tickets]);

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-[#000000] items-center justify-center px-12">
        <View className="w-32 h-32 rounded-[40px] bg-white/5 items-center justify-center border border-white/10 mb-12">
          <TicketIcon size={48} color={THEME.purple} />
        </View>
        <Typography weight="black" className="text-3xl text-white uppercase text-center mb-4">ACCESS <Typography weight="black" className="text-indigo-400">DENIED</Typography></Typography>
        <Typography weight="bold" style={{ fontSize: 10, letterSpacing: 4 }} className="text-white/30 text-center uppercase mb-12 leading-loose">PLEASE LOGIN TO SYNC YOUR SECURE RESERVATIONS</Typography>
        <Pressable onPress={() => router.push('/profile')} className="w-full h-16 bg-[#6C5CE7] rounded-3xl items-center justify-center shadow-2xl shadow-purple-900/40">
          <Typography weight="black" style={{ fontSize: 12, letterSpacing: 4 }} className="text-white uppercase">AUTHENTICATE NOW</Typography>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        <View className="px-8 pt-12 pb-8">
          <View className="flex-row items-center space-x-4 mb-2">
            <View className="w-12 h-[2px] bg-indigo-500/30" />
            <Typography weight="black" style={{ fontSize: 10, letterSpacing: 8 }} className="text-indigo-400 uppercase">MY TICKETS</Typography>
          </View>
          <Typography weight="black" className="text-[52px] text-white tracking-tighter uppercase leading-[0.9]">YOUR <Typography weight="black" className="text-indigo-500 italic">PASSES.</Typography></Typography>
          <View className="mt-4 flex-row items-center space-x-3 opacity-30">
            <ShieldCheck size={14} color="#fff" />
            <Typography weight="bold" style={{ fontSize: 9, letterSpacing: 2 }} className="text-white uppercase">ACTIVE BOOKINGS VALID FOR 24 HOURS</Typography>
          </View>
        </View>

        <View className="px-6 pt-8">
          {loading ? (
            <View className="space-y-6">
              {[1, 2].map(i => <View key={i} className="h-64 bg-white/5 rounded-[32px] animate-pulse" />)}
            </View>
          ) : activeOrders.length === 0 ? (
            <View className="items-center justify-center py-32">
              <View className="w-24 h-24 rounded-full bg-white/5 border border-white/10 items-center justify-center mb-8">
                <TicketIcon size={32} color="rgba(255,255,255,0.1)" strokeWidth={1.5} />
              </View>
              <Typography weight="black" className="text-2xl text-white uppercase text-center mb-4">NO ACTIVE <Typography weight="black" className="text-indigo-500 italic">ORDERS.</Typography></Typography>
              <Typography weight="bold" style={{ fontSize: 10, letterSpacing: 4 }} className="text-white/20 text-center uppercase mb-12">GO TO OUR RIDES OR FOOD TO START BOOKING</Typography>
              <Pressable onPress={() => router.push('/')} className="px-10 h-16 bg-[#6C5CE7] rounded-3xl flex-row items-center justify-center shadow-2xl shadow-purple-900/40">
                <Typography weight="black" style={{ fontSize: 11, letterSpacing: 3 }} className="text-white uppercase italic">EXPLORE EXPERIENCES</Typography>
                <ArrowRight size={16} color="#fff" className="ml-4" />
              </Pressable>
            </View>
          ) : (
            <View>
              {activeOrders.map((order, idx) => (
                <OrderCard key={idx} order={order} onDetails={() => setSelectedOrder(order)} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={!!selectedOrder} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' }}>
          <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
          <SafeAreaView className="flex-1">
            <View className="p-8 flex-row justify-between items-center">
              <View>
                <Typography weight="black" className="text-white text-3xl uppercase tracking-tighter">ACTIVE <Typography weight="black" className="text-indigo-400 font-black">PASSES</Typography></Typography>
                <Typography weight="bold" style={{ fontSize: 8, letterSpacing: 4 }} className="text-white/30 uppercase mt-2">REF: {String(selectedOrder?.id || '').slice(-12)}</Typography>
              </View>
              <Pressable onPress={() => setSelectedOrder(null)} className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 items-center justify-center active:bg-white/10">
                <X size={24} color="#fff" />
              </Pressable>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              {selectedOrder?.tickets?.flatMap((item: any) =>
                Array.from({ length: item.quantity }).map((_, i) => (
                  <TicketCard key={`${item.name}-${i}`} item={{ ...item, quantity: 1, bookingDate: selectedOrder.bookingDate || selectedOrder.purchaseDate }} />
                ))
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
