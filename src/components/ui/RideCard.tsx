import React from 'react';
import { View, Image, Pressable, useWindowDimensions } from 'react-native';
import { Typography } from './Core';
import { Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../../store/useAppStore';
import { useRouter } from 'expo-router';

interface RideCardProps {
  title: string;
  category: string;
  description: string;
  price: string;
  image: string;
  tag: string;
}

export const RideCard = ({ id, title, category, description, price, image, tag }: RideCardProps & { id: string }) => {
  const { addToCart, addTicket, isAuthenticated } = useAppStore();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const CARD_WIDTH = (width - 48) / 2; // For 2 cards in a row with some padding

  const handleAdd = () => {
    addToCart({ id: `RIDE-${id}`, name: title, price: parseFloat(price), image });
  };

  const handleBook = () => {
    if (!isAuthenticated) return router.push('/profile');
    // Add to cart first if not already there, then go to checkout
    addToCart({ id: `RIDE-${id}`, name: title, price: parseFloat(price), image });
    router.push('/checkout');
  };

  return (
    <View 
      style={{ width: CARD_WIDTH }} 
      className="bg-slate-50 dark:bg-[#0b0e14] rounded-premium mb-6 overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-premium relative"
    >
      {/* Floating Plus Button */}
      <Pressable 
        onPress={handleAdd} 
        className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/60 dark:bg-black/60 border border-yellow-400/30 rounded-full items-center justify-center shadow-lg active:opacity-70"
        style={{ shadowColor: '#fbbf24', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 15 }}
      >
        <Plus size={20} color="#fbbf24" strokeWidth={3} />
      </Pressable>

      {/* Image Section */}
      <View className="h-44 overflow-hidden relative">
        <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(15, 23, 42, 0.4)', 'rgba(15, 23, 42, 0.9)']}
          className="absolute inset-x-0 bottom-0 h-16"
        />
      </View>

      {/* Content Section */}
      <View className="p-4 flex-col justify-between">
        <View>
          <View className="h-[46px] justify-center mb-1">
            <Typography 
              weight="black" 
              className="text-[17px] text-slate-800 dark:text-white leading-[20px] uppercase italic" 
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {title}
            </Typography>
          </View>
          <Typography weight="black" className="text-[10px] text-indigo-500 dark:text-indigo-400 uppercase tracking-[2px] mb-3">
            {category}
          </Typography>
          <Typography weight="medium" className="text-[11px] text-slate-500 dark:text-gray-400 leading-[18px] mb-5 h-12" numberOfLines={3}>
            {description}
          </Typography>
        </View>

        <View className="h-[1px] bg-slate-200 dark:bg-white/10 mb-5" />

        <View className="flex-row items-end justify-between flex-wrap" style={{ gap: 8 }}>
          <View className="min-w-[60px] justify-center">
            <Typography weight="bold" className="text-[9px] text-slate-400 dark:text-gray-500 uppercase tracking-[1.5px] mb-0.5 font-bold">RATE</Typography>
            <Typography weight="black" className="text-[20px] text-slate-900 dark:text-white leading-none font-black italic">₹{price}</Typography>
          </View>

          <View className="flex-1 items-end min-w-[80px]">
            <Pressable onPress={handleBook} className="bg-yellow-400 px-5 py-2.5 rounded-xl shadow-lg shadow-yellow-400/20 active:bg-yellow-500 w-full items-center">
              <Typography weight="black" className="text-[10px] text-black uppercase tracking-[1.5px] font-black">BOOK</Typography>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};
