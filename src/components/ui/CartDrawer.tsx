import React, { useState, useMemo } from 'react';
import { View, Modal, Pressable, ScrollView, Image, Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import { Typography } from "./Core";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Zap, ShieldCheck, Lock } from "lucide-react-native";
import { useAppStore } from "../../store/useAppStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolate,
  FadeInRight,
  FadeInUp,
  Layout
} from 'react-native-reanimated';
import Svg, { Path, Rect, Defs, Pattern } from 'react-native-svg';

const { width, height } = Dimensions.get("window");

// --- PREMIUM STYLING CONSTANTS ---
const THEME = {
  orange: '#FF7A18',
  bg: '#000000',
  text: '#F8FAFC',
  subtext: '#AAB2C5',
};


export default function CartDrawer() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { cart, isCartOpen, setCartOpen, removeFromCart, updateQuantity, clearCart } = useAppStore();
  const [showTaxBreakdown, setShowTaxBreakdown] = useState(false);

  // LOGIC: PRICING
  const subtotal = useMemo(() => 
    cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  , [cart]);
  
  const gstAmount = subtotal * 0.09;
  const finalTotal = subtotal + gstAmount;

  if (!isCartOpen) return null;

  return (
    <Modal visible={isCartOpen} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: THEME.bg }}>
        <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />

        {/* HEADER: PREMIUM BRANDING */}
        <View style={{ paddingTop: insets.top + 24 }} className="px-8 flex-row items-center justify-between pb-10 border-b border-white/5 bg-white/[0.01]">
           <View className="flex-row items-center space-x-6">
              <View className="relative">
                 <View style={{ backgroundColor: `${THEME.orange}30` }} className="absolute -inset-2 rounded-2xl blur-xl opacity-40" />
                 <View className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl items-center justify-center relative overflow-hidden shadow-2xl">
                    <ShoppingBag size={26} color={THEME.orange} strokeWidth={2.5} />
                 </View>
              </View>
              <View>
                 <View className="flex-row items-baseline">
                    <Typography weight="black" className="text-3xl text-white italic tracking-tighter uppercase leading-none">YOUR</Typography>
                    <Typography weight="black" style={{ color: THEME.orange }} className="text-3xl italic tracking-tighter uppercase leading-none ml-2">CART</Typography>
                 </View>
                 <View className="flex-row items-center space-x-2 mt-2">
                    <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                    <Typography weight="black" style={{ fontSize: 9, letterSpacing: 3 }} className="text-white/40 uppercase">{cart.length} ITEMS READY</Typography>
                 </View>
              </View>
           </View>
           
           <Pressable 
              onPress={() => setCartOpen(false)} 
              className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl items-center justify-center active:bg-white/10 shadow-2xl"
           >
              <X size={20} color="white" strokeWidth={2.5} />
           </Pressable>
        </View>

        {/* BODY: SCROLLABLE ITEMS */}
        <ScrollView 
           contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 40 }} 
           showsVerticalScrollIndicator={false}
           className="no-scrollbar"
        >
           {cart.length === 0 ? (
              <View className="flex-1 items-center justify-center py-40 px-12">
                 <View className="w-24 h-24 bg-white/5 rounded-[40px] border border-white/5 items-center justify-center mb-10 shadow-2xl">
                    <ShoppingBag size={42} color="white" opacity={0.05} />
                 </View>
                 <Typography weight="black" className="text-xl text-white/20 italic tracking-tighter uppercase text-center mb-8">YOUR CART IS EMPTY</Typography>
                 <Pressable 
                    onPress={() => { setCartOpen(false); }} 
                    className="bg-white/5 px-10 py-5 rounded-full border border-white/10 active:bg-white/10"
                 >
                    <Typography weight="black" style={{ color: THEME.orange, fontSize: 10, letterSpacing: 5 }} className="uppercase italic">BOOK RIDE NOW</Typography>
                 </Pressable>
              </View>
           ) : (
              <View className="px-6 py-10">
                 {cart.map((item, idx) => (
                    <Animated.View 
                       key={item.id} 
                       entering={FadeInRight.delay(idx * 100)}
                       layout={Layout.springify()}
                       className="mb-6 relative bg-[#0F172A]/40 border border-white/5 rounded-[32px] p-5 shadow-2xl overflow-hidden"
                    >
                       <View style={{ backgroundColor: THEME.orange }} className="absolute top-0 left-0 w-1 h-full opacity-60" />
                       
                       <View className="flex-row items-center relative z-10">
                          {/* ITEM IMAGE */}
                          <View className="w-24 h-24 bg-black/40 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                             <Image 
                                source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
                                className="w-full h-full grayscale" 
                                style={{ opacity: 0.8 }}
                                resizeMode="cover" 
                             />
                          </View>
                          
                          <View className="flex-1 ml-5 justify-between h-24 py-1">
                             <View className="flex-row justify-between items-start">
                                <View>
                                   <Typography weight="black" className="text-lg text-white italic tracking-tighter uppercase leading-tight">{item.name}</Typography>
                                   <Typography weight="black" style={{ fontSize: 8, letterSpacing: 2.5 }} className="text-white/20 uppercase mt-0.5">{item.stall || 'EFOUR ADVENTURE'}</Typography>
                                </View>
                                <TouchableOpacity 
                                   onPress={() => removeFromCart(item.id)}
                                   className="w-8 h-8 bg-white/5 border border-white/5 rounded-xl items-center justify-center"
                                >
                                   <Trash2 size={14} color="#ef4444" opacity={0.6} />
                                </TouchableOpacity>
                             </View>

                             <View className="flex-row items-center justify-between">
                                <Typography weight="black" style={{ color: THEME.orange }} className="text-2xl italic">₹{item.price}</Typography>
                                
                                <View className="bg-white/5 border border-white/10 rounded-2xl p-1 flex-row items-center space-x-4 shadow-2xl">
                                   <TouchableOpacity 
                                      onPress={() => updateQuantity(item.id, -1)} 
                                      className="w-8 h-8 bg-white/5 rounded-xl items-center justify-center"
                                   >
                                      <Minus size={12} color="white" strokeWidth={3} />
                                   </TouchableOpacity>
                                   <Typography weight="black" className="text-base text-white italic min-w-[20px] text-center">{item.quantity}</Typography>
                                   <TouchableOpacity 
                                      onPress={() => updateQuantity(item.id, 1)} 
                                      className="w-8 h-8 bg-white/5 rounded-xl items-center justify-center"
                                   >
                                      <Plus size={12} color="white" strokeWidth={3} />
                                   </TouchableOpacity>
                                </View>
                             </View>
                          </View>
                       </View>
                    </Animated.View>
                 ))}

                 {/* SUMMARY: TAXES & TOTAL */}
                 <View className="mt-12 pt-12 border-t border-white/10 space-y-6">
                    {showTaxBreakdown && (
                       <Animated.View entering={FadeInUp} className="space-y-4 mb-4">
                          <View className="flex-row justify-between items-center opacity-40">
                             <Typography weight="black" style={{ fontSize: 9, letterSpacing: 4 }} className="text-white/60 uppercase">RIDES SUB-TOTAL</Typography>
                             <Typography weight="black" className="text-base text-white italic">₹{subtotal.toFixed(2)}</Typography>
                          </View>
                          <View className="flex-row justify-between items-center opacity-40">
                             <Typography weight="black" style={{ fontSize: 9, letterSpacing: 4, color: THEME.orange }} className="uppercase">GOV TAXES (GST)</Typography>
                             <Typography weight="black" className="text-base text-white italic">₹{gstAmount.toFixed(2)}</Typography>
                          </View>
                       </Animated.View>
                    )}

                    <View className="flex-row justify-between items-center">
                       <View>
                          <Typography weight="black" style={{ fontSize: 10, letterSpacing: 6 }} className="text-white/30 uppercase mb-2">TOTAL PRICE</Typography>
                          <TouchableOpacity 
                             onPress={() => setShowTaxBreakdown(!showTaxBreakdown)}
                             className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 flex-row items-center space-x-2"
                          >
                             <Typography weight="black" style={{ fontSize: 8, color: THEME.orange, letterSpacing: 2 }} className="uppercase">
                                {showTaxBreakdown ? 'HIDE SUMMARY −' : 'INC. ALL TAXES +'}
                             </Typography>
                          </TouchableOpacity>
                       </View>
                       <Typography weight="black" className="text-[52px] text-white italic tracking-tighter leading-none">₹{finalTotal % 1 === 0 ? finalTotal : finalTotal.toFixed(2)}</Typography>
                    </View>

                    <TouchableOpacity 
                       onPress={() => {
                          setCartOpen(false);
                          router.push('/checkout');
                       }}
                       style={{ shadowColor: THEME.orange, shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.3, shadowRadius: 40 }}
                       className="bg-[#6C5CE7] h-20 rounded-[28px] flex-row items-center justify-center space-x-6 shadow-2xl mt-12 active:scale-95"
                    >
                       <Typography weight="black" style={{ fontSize: 13, letterSpacing: 6 }} className="text-white uppercase italic">GO TO PAYMENT</Typography>
                       <ArrowRight size={22} color="white" strokeWidth={4} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                       onPress={() => clearCart()} 
                       className="items-center py-10 flex-row justify-center space-x-4 opacity-40"
                    >
                       <Trash2 size={12} color="#ef4444" strokeWidth={2.5} />
                       <Typography weight="black" style={{ fontSize: 9, letterSpacing: 8 }} className="text-white/40 uppercase">EMPTY CART PROTOCOL</Typography>
                    </TouchableOpacity>

                    <View className="flex-row items-center justify-center space-x-6 opacity-10">
                       <View className="flex-row items-center space-x-2">
                          <Lock size={10} color="white" />
                          <Typography weight="black" style={{ fontSize: 6, letterSpacing: 2 }} className="text-white uppercase">ENCRYPTED</Typography>
                       </View>
                       <View className="flex-row items-center space-x-2">
                          <ShieldCheck size={10} color="white" />
                          <Typography weight="black" style={{ fontSize: 6, letterSpacing: 2 }} className="text-white uppercase">SECURED</Typography>
                       </View>
                    </View>
                 </View>
              </View>
           )}
        </ScrollView>
      </View>
    </Modal>
  );
}
