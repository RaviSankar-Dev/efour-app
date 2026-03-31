import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence, 
  withDelay, 
  withTiming,
  runOnJS 
} from 'react-native-reanimated';
import { Typography } from './Core';
import { ShoppingBag, CheckCircle2 } from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';

const { width } = Dimensions.get('window');

export const Toast = () => {
  const { toast, hideToast } = useAppStore();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (toast?.visible) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(60, { damping: 12 });
      
      const timeout = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        translateY.value = withTiming(-100, { duration: 300 }, () => {
          runOnJS(hideToast)();
        });
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [toast]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!toast?.visible) return null;

  return (
    <Animated.View 
      style={[{ 
        position: 'absolute', 
        top: 0, 
        left: 20, 
        right: 20, 
        zIndex: 9999,
      }, animatedStyle]}
    >
      <View className="bg-[#0b0e14] border border-white/20 rounded-2xl p-5 flex-row items-center space-x-4 shadow-2xl">
        <View className="w-10 h-10 bg-green-500/10 rounded-xl items-center justify-center border border-green-500/20">
           <CheckCircle2 size={20} color="#22c55e" strokeWidth={2.5} />
        </View>
        <View className="flex-1">
          <Typography weight="black" className="text-[10px] text-green-500 tracking-[3px] uppercase italic mb-0.5">ADDED TO CART</Typography>
          <Typography weight="black" className="text-[13px] text-white italic uppercase font-black tracking-tight" numberOfLines={1}>
            {toast.message}
          </Typography>
        </View>
      </View>
    </Animated.View>
  );
};
