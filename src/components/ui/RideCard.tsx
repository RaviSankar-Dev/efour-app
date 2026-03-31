import React from 'react';
import { View, Image, Pressable, Dimensions } from 'react-native';
import { Typography } from './Core';
import { Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../../store/useAppStore';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // For 2 cards in a row with some padding

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
    <View style={{ width: CARD_WIDTH }} className="bg-[#0b0e14] rounded-premium mb-6 overflow-hidden border border-white/10 shadow-premium relative">
      {/* Floating Plus Button */}
      <Pressable 
        onPress={handleAdd} 
        className="absolute top-3 right-3 z-20 w-8 h-8 bg-indigo-600/90 rounded-full items-center justify-center shadow-lg shadow-indigo-500/40 active:bg-indigo-700"
      >
        <Plus size={16} color="white" />
      </Pressable>

      {/* Image Section */}
      <View className="h-44 overflow-hidden relative">
        <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(11, 14, 20, 0.9)']}
          className="absolute inset-x-0 bottom-0 h-16"
        />
        {tag && (
          <View className="absolute top-4 left-4 bg-indigo-600/95 px-2.5 py-1 rounded-lg">
            <Typography weight="black" className="text-[8px] text-white tracking-[1.5px] uppercase font-black">{tag}</Typography>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View className="p-4 flex-col justify-between">
        <View>
          <Typography 
            weight="black" 
            className="text-[17px] text-white leading-tight mb-1 uppercase italic" 
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {title}
          </Typography>
          <Typography weight="black" className="text-[10px] text-indigo-400 uppercase tracking-[2px] mb-3">
            {category}
          </Typography>
          <Typography weight="medium" className="text-[11px] text-gray-400 leading-[18px] mb-5 h-12" numberOfLines={3}>
            {description}
          </Typography>
        </View>

        <View className="h-[1px] bg-white/10 mb-5" />

        <View className="flex-row items-center justify-between">
          <View className="justify-center">
            <Typography weight="bold" className="text-[9px] text-gray-500 uppercase tracking-[1.5px] mb-0.5 font-bold">RATE</Typography>
            <Typography weight="black" className="text-[20px] text-white leading-none font-black italic">₹{price}</Typography>
          </View>

          <View className="flex-row items-center space-x-2.5">
            <Pressable onPress={handleBook} className="bg-indigo-600 px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 active:bg-indigo-700">
              <Typography weight="black" className="text-[10px] text-white uppercase tracking-[1.5px] font-black">BOOK</Typography>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};
