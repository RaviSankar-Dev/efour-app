import "../global.css";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useFonts, Inter_400Regular, Inter_700Bold, Inter_500Medium, Inter_600SemiBold, Inter_900Black } from "@expo-google-fonts/inter";

import { View, Image, Dimensions, StyleSheet, Platform } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence, 
  withDelay, 
  withSpring,
  runOnJS,
  interpolate
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import CartDrawer from "../src/components/ui/CartDrawer";
import { Toast } from "../src/components/ui/Toast";
import { Typography } from "../src/components/ui/Core";

const { width, height } = Dimensions.get('window');

// Create Query Client
const queryClient = new QueryClient();

// Keep splash screen visible until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  return <RootContent loaded={loaded} error={error} />;
}

function RootContent({ loaded, error }: { loaded: boolean; error: any }) {
  const [isSplashDone, setSplashDone] = useState(false);
  const logoScale = useSharedValue(1.0); // Start at 1.0 to match native splash icon size
  const logoOpacity = useSharedValue(0.1); // Slight visibility to prevent flicker
  const splashOpacity = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (loaded || error) {
      // Immediate handoff from native splash
      SplashScreen.hideAsync();
      
      // Start Animation Sequence from 1.0 scale (matching native) to emphasize professionalism
      logoScale.value = withSequence(
        withSpring(1.1, { damping: 10, stiffness: 80 }),
        withSpring(1.0, { damping: 12, stiffness: 60 })
      );
      logoOpacity.value = withTiming(1, { duration: 400 });
      
      glowOpacity.value = withDelay(400, withSequence(
        withTiming(0.5, { duration: 1200 }),
        withTiming(0, { duration: 1000 })
      ));

      // Final Transition
      setTimeout(() => {
        splashOpacity.value = withTiming(0, { duration: 800 }, (finished) => {
          if (finished) {
            runOnJS(setSplashDone)(true);
          }
        });
      }, 3000);
    }
  }, [loaded, error]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const splashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
    pointerEvents: isSplashDone ? 'none' : 'auto',
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: interpolate(glowOpacity.value, [0, 0.5], [1, 1.5]) }],
  }));

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <CartDrawer />
        <Toast />
        <StatusBar style="light" />

        {/* CUSTOM ANIMATED SPLASH SCREEN OVERLAY */}
        {!isSplashDone && (
          <Animated.View style={[StyleSheet.absoluteFill, splashStyle, { zIndex: 9999, backgroundColor: '#020408' }]}>
            <LinearGradient colors={['#020408', '#080c14', '#020408']} style={StyleSheet.absoluteFill} />
            
            <View className="flex-1 items-center justify-center">
               {/* RADIAL GLOW EFFECT */}
               <Animated.View 
                  style={[
                    glowStyle,
                    { 
                      position: 'absolute', 
                      width: 300, 
                      height: 300, 
                      borderRadius: 150, 
                      backgroundColor: '#6366f1', 
                      opacity: 0.1,
                      filter: Platform.OS === 'web' ? 'blur(100px)' : undefined 
                    }
                  ]} 
               />

               <Animated.View style={logoStyle} className="items-center">
                  <Image 
                    source={require('../assets/images/E4_LOGO_NEW.jpeg')} 
                    style={{ width: 220, height: 180 }} 
                    resizeMode="contain" 
                  />
                  <View className="mt-8 flex-row items-center space-x-3">
                     <View className="w-8 h-[1px] bg-indigo-500/30" />
                     <Typography weight="black" className="text-[12px] text-white/40 tracking-[6px] uppercase font-black italic">ELURU'S PREMIER</Typography>
                     <View className="w-8 h-[1px] bg-indigo-500/30" />
                  </View>
               </Animated.View>
            </View>
            
            <View className="absolute bottom-20 w-full items-center">
               <Typography weight="black" className="text-[8px] text-indigo-500/30 tracking-[4px] uppercase font-black">AUTHENTIC EXPERIENCE</Typography>
            </View>
          </Animated.View>
        )}
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
