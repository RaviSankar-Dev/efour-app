import React, { useEffect } from "react";
import { View, Pressable, Dimensions, StyleSheet, Platform, ScrollView, TextInput, Image, ActivityIndicator } from "react-native";
import { Typography, Container } from "../../src/components/ui/Core";
import { LinearGradient } from "expo-linear-gradient";
import { Globe, ArrowRight, ArrowDown, ArrowUp, Search, ShoppingBag } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import MaskedView from '@react-native-masked-view/masked-view';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { RideCard } from "../../src/components/ui/RideCard";
import { Footer } from "../../src/components/ui/Footer";
import { Navbar } from "../../src/components/ui/Navbar";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
  interpolate,
  withSequence,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

// --- MOCK DATA FOR RIDES ---
const RIDE_DATA = [
  { id: '1', title: 'Mega Combo Pack', category: 'FUN RIDE', description: 'Get any 5 exhilarating rides for just ₹500! The ultimate fun...', price: '500', image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop', tag: 'ALL AGES' },
  { id: '2', title: 'Mega Combo Pack Kids', category: 'FUN RIDE', description: 'Get any 5 exhilarating rides for just ₹500! Specifically for kids...', price: '500', image: 'https://images.unsplash.com/photo-1544605151-6f414801ed15?q=80&w=2065&auto=format&fit=crop', tag: 'KIDS' },
  { id: '3', title: 'Trampoline Zone', category: 'FUN RIDE', description: 'Anti-gravity world with giant trampolines and foam pits for children.', price: '100', image: 'https://images.unsplash.com/photo-1544605151-6f414801ed15?q=80&w=2065&auto=format&fit=crop', tag: 'KIDS' },
  { id: '4', title: '360 Cycle', category: 'FUN RIDE', description: 'Experience the thrill of cycling in a full 360-degree loop scenario.', price: '100', image: 'https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?q=80&w=2070&auto=format&fit=crop', tag: 'KIDS' },
  { id: '5', title: 'Columbus Mini', category: 'FUN RIDE', description: 'A mini version of the classic swinging ship ride for little...', price: '150', image: 'https://images.unsplash.com/photo-1579611222888-a3e760599628?q=80&w=2070&auto=format&fit=crop', tag: 'KIDS' },
  { id: '6', title: 'Joker Ride', category: 'FUN RIDE', description: 'A fun and colorful ride that brings smiles to every face today.', price: '100', image: 'https://images.unsplash.com/photo-1596489369903-886ecbdb0019?q=80&w=2070&auto=format&fit=crop', tag: 'KIDS' },
  { id: '7', title: 'Free Fall', category: 'FUN RIDE', description: 'Experience the adrenaline rush of a sudden drop in safety mode.', price: '100', image: 'https://images.unsplash.com/photo-1542451313-0352407c1b8a?q=80&w=2070&auto=format&fit=crop', tag: 'YOUTH' },
  { id: '8', title: 'Sun & Moon', category: 'FUN RIDE', description: 'A delightful ride for the whole family to enjoy together today.', price: '150', image: 'https://images.unsplash.com/photo-1628191140046-7cfdec37d1d2?q=80&w=2070&auto=format&fit=crop', tag: 'FAMILY' },
  { id: '9', title: 'Train Ride', category: 'FUN RIDE', description: 'All aboard! A scenic train journey around the park today.', price: '100', image: 'https://images.unsplash.com/photo-1515165599610-b1e8a05c3127?q=80&w=2070&auto=format&fit=crop', tag: 'ALL AGES' },
  { id: '10', title: 'Kids Soft Play', category: 'FUN RIDE', description: 'Safe and soft play area designed specifically for little toddlers.', price: '150', image: 'https://images.unsplash.com/photo-1545656512-5853538f5f4a?q=80&w=2070&auto=format&fit=crop', tag: 'TODDLERS' },
  { id: '11', title: 'Bull Ride', category: 'FUN RIDE', description: 'Hold on tight and test your balance on our mechanical bull.', price: '100', image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1974&auto=format&fit=crop', tag: '10+' },
  { id: '12', title: 'Balloon Shooting', category: 'FUN RIDE', description: 'Test your aim and precision at our shooting range today.', price: '100', image: 'https://images.unsplash.com/photo-1596489369903-886ecbdb0019?q=80&w=2070&auto=format&fit=crop', tag: '10+' },
  { id: '13', title: 'Bungee Jump', category: 'FUN RIDE', description: 'Jump high and flip safely on our bungee trampolines today.', price: '150', image: 'https://images.unsplash.com/photo-1544333323-5377ac490cc1?q=80&w=2070&auto=format&fit=crop', tag: '8+' },
  { id: '14', title: 'Paddle Boat', category: 'FUN RIDE', description: 'Gentle boating fun on the water for kids and family.', price: '100', image: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=1915&auto=format&fit=crop', tag: 'KIDS' },
  { id: '15', title: 'Mini Wheel', category: 'FUN RIDE', description: 'Classic views from the top of our mini ferris wheel today.', price: '100', image: 'https://images.unsplash.com/photo-1628191140046-7cfdec37d1d2?q=80&w=2070&auto=format&fit=crop', tag: 'ALL AGES' },
  { id: '16', title: 'Bouncy Castle', category: 'FUN RIDE', description: 'Jump, bounce, and play in our colorful inflatable castle area.', price: '100', image: 'https://images.unsplash.com/photo-1545656512-5853538f5f4a?q=80&w=2070&auto=format&fit=crop', tag: 'KIDS' },
  { id: '18', title: 'Indoor Cricket Slot', category: 'FUN RIDE', description: 'Have fun with our great indoor cricket rides for everyone.', price: '500', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop', tag: 'ALL AGES' },
  { id: '19', title: 'Double Bumping Cars', category: 'FUN RIDE', description: 'Double the fun with our spacious two-seater bumping cars today.', price: '200', image: 'https://images.unsplash.com/photo-1596489369903-886ecbdb0019?q=80&w=2070&auto=format&fit=crop', tag: 'FAMILY' },
  { id: '20', title: 'Bumping Cars', category: 'FUN RIDE', description: 'High-octane fun for kids and adults alike in our bumping arena.', price: '150', image: 'https://images.unsplash.com/photo-1596489369903-886ecbdb0019?q=80&w=2070&auto=format&fit=crop', tag: '7+ YEARS' },
];


const AnimatedOrb = ({ color, size, initialPos, delay = 0 }: any) => {
  const floatValue = useSharedValue(0);
  useEffect(() => {
    floatValue.value = withDelay(delay, withRepeat(withTiming(1, { duration: 4000 + Math.random() * 2000, easing: Easing.inOut(Easing.sin) }), -1, true));
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: color, left: initialPos.x, top: initialPos.y, filter: Platform.OS === 'web' ? 'blur(100px)' : undefined,
    transform: [{ translateY: interpolate(floatValue.value, [0, 1], [-30, 30]) }, { translateX: interpolate(floatValue.value, [0, 1], [-20, 20]) }],
    opacity: interpolate(floatValue.value, [0, 1], [0.3, 0.6]),
  }));
  return (
    <Animated.View style={animatedStyle}>
      <LinearGradient colors={[color, 'transparent']} style={{ flex: 1, borderRadius: size / 2 }} />
    </Animated.View>
  );
};


// SECTION 3: OUR VISION
const OurVisionSection = ({ onBookRide }: { onBookRide?: () => void }) => {
  return (
    <View className="bg-[#000000] px-6 pt-4 pb-16 overflow-hidden">
      {/* BACKGROUND TEXT OVERLAY */}
      <View className="absolute top-0 right-[-100px] opacity-[0.03]">
        <Typography style={{ fontSize: 350, transform: [{ rotate: '90deg' }] }} className="font-black text-white uppercase italic">
          FOUR
        </Typography>
      </View>

      <View className="flex-row items-center space-x-3 mb-8">
        <View className="w-10 h-10 bg-indigo-500/10 rounded-xl items-center justify-center border border-indigo-500/20">
          <Globe size={18} color="#6366f1" />
        </View>
        <Typography weight="black" className="text-[11px] text-indigo-400 font-black tracking-[4px] uppercase italic">ABOUT US</Typography>
      </View>

      <View className="flex-col items-start px-2">
        {/* LEFT CONTENT */}
        <View className="mb-12">
          <Typography weight="black" className="text-6xl font-black italic text-white tracking-[-3px] mb-6 uppercase leading-tight">
            OUR{"\n"}VISION.
          </Typography>
          <Typography className="text-gray-400 text-sm font-medium uppercase leading-relaxed mb-8 tracking-wide max-w-[280px]">
            WE ARE BUILDING THE BEST PLACE IN ELURU FOR GREAT FOOD AND FUN RIDES FOR FAMILIES.
          </Typography>

          <Pressable
            onPress={onBookRide}
            className="bg-indigo-600 self-start px-10 py-5 rounded-2xl flex-row items-center shadow-2xl shadow-indigo-500/40 active:bg-indigo-700"
          >
            <Typography weight="black" className="text-[12px] text-white font-black uppercase tracking-[3px]">BOOK YOUR RIDE</Typography>
            <ArrowUp size={16} color="white" className="ml-4" />
          </Pressable>
        </View>

        {/* RIGHT IMAGERY */}
        <View className="relative w-full h-[400px]">
          {/* Main Large Image */}
          <View className="w-full h-[85%] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
            <Image
              source={require('../../assets/images/vision_park.png')}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Overlapping Small Image */}
          <View className="absolute -bottom-6 right-6 w-[60%] h-[45%] rounded-[24px] overflow-hidden border-8 border-[#020408] shadow-2xl">
            <View className="flex-1 border border-white/20 rounded-[16px] overflow-hidden">
              <Image
                source={require('../../assets/images/vision_park.png')}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const { scroll } = useLocalSearchParams<{ scroll: string }>();
  const scrollRef = React.useRef<ScrollView>(null);

  // API DATA STATE
  const [rides, setRides] = React.useState<any[]>(RIDE_DATA);
  const [loadingRides, setLoadingRides] = React.useState(true);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const response = await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/e4/rides?all=true');
      const data = await response.json();
      if (response.ok) {
        // Assuming API returns { rides: [...] } or just [...]
        const fetchedRides = Array.isArray(data) ? data : (data.rides || []);
        if (fetchedRides.length > 0) {
          setRides(fetchedRides);
        }
      }
    } catch (error) {
      console.error("FAILED TO FETCH RIDES:", error);
    } finally {
      setLoadingRides(false);
    }
  };

  useEffect(() => {
    if (scroll === 'rides' && scrollRef.current) {
      // Small delay to ensure layout is ready
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: height - 100, animated: true });
      }, 600);
    }
  }, [scroll]);
  const opacity = useSharedValue(0);
  const glowAnim = useSharedValue(0);
  const eatY = useSharedValue(50);
  const avoidY = useSharedValue(50);
  const entertainY = useSharedValue(50);
  const eluruY = useSharedValue(50);
  const scrollAnim = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1200 });
    eatY.value = withDelay(400, withSpring(0, { damping: 15 }));
    avoidY.value = withDelay(600, withSpring(0, { damping: 15 }));
    entertainY.value = withDelay(800, withSpring(0, { damping: 15 }));
    eluruY.value = withDelay(1000, withSpring(0, { damping: 15 }));
    glowAnim.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
    scrollAnim.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, []);

  const eatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: eatY.value }],
    opacity: interpolate(eatY.value, [50, 0], [0, 1]),
  }));
  const enjoyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: avoidY.value }],
    opacity: interpolate(avoidY.value, [50, 0], [0, 1]),
  }));
  const entertainStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: entertainY.value }],
    opacity: interpolate(entertainY.value, [50, 0], [0, 1]),
  }));
  const eluruStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: eluruY.value }],
    opacity: interpolate(eluruY.value, [50, 0], [0, 1]),
  }));

  const scrollLineStyle = useAnimatedStyle(() => ({
    height: interpolate(scrollAnim.value, [0, 1], [24, 48]),
    opacity: interpolate(scrollAnim.value, [0, 1], [0.2, 0.6]),
  }));

  const badgeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const bottomStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const glowingButtonStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glowAnim.value, [0, 1], [0.2, 0.8]),
    shadowRadius: interpolate(glowAnim.value, [0, 1], [10, 30]),
    transform: [{ scale: interpolate(glowAnim.value, [0, 1], [1, 1.02]) }]
  }));

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <Navbar />
      <ScrollView ref={scrollRef} style={{ flex: 1 }} className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        {/* SECTION 1: HERO */}
        <View style={{ height: height * 0.88, width }}>
          <View style={StyleSheet.absoluteFill}>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]} />
            <AnimatedOrb color="#e65100" size={width * 0.9} initialPos={{ x: -width * 0.35, y: height * 0.05 }} delay={0} />
            <AnimatedOrb color="#0d47a1" size={width * 1.0} initialPos={{ x: width * 0.05, y: height * 0.15 }} delay={500} />
            <AnimatedOrb color="#283593" size={width * 0.8} initialPos={{ x: width * 0.1, y: height * 0.45 }} delay={1000} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)', '#000000']} style={StyleSheet.absoluteFill} />
          </View>
          <View style={{ flex: 1, paddingHorizontal: 32, paddingTop: 200, alignItems: 'center' }}>
            <Animated.View className="flex-row items-center bg-white/5 self-center px-5 py-2.5 rounded-full border border-white/10 mb-12" style={badgeStyle}>
              <View className="w-2 h-2 rounded-full bg-[#52caff] mr-3" />
              <Typography weight="black" className="text-[11px] text-gray-100 font-black tracking-[3px] uppercase italic">ELURU'S PREMIER HUB</Typography>
            </Animated.View>

            <View className="items-center">
              <Animated.View style={eatStyle}><Typography weight="black" className="text-8xl italic font-black text-white leading-[85px] tracking-[-4px] text-center">EAT.</Typography></Animated.View>
              <Animated.View style={enjoyStyle}><Typography weight="black" className="text-8xl italic font-black text-white leading-[85px] tracking-[-4px] text-center">ENJOY.</Typography></Animated.View>
              <Animated.View style={[entertainStyle, { height: 100, width: width - 64 }]}>
                <MaskedView style={{ flex: 1 }} maskElement={<Typography weight="black" numberOfLines={1} adjustsFontSizeToFit className="text-[100px] italic font-black leading-[100px] tracking-[-4px] text-center">ENTERTAIN.</Typography>}>
                  <LinearGradient colors={['#ff8533', '#8a2be2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }} />
                </MaskedView>
              </Animated.View>
              <Animated.View style={eluruStyle}><Typography weight="black" className="text-8xl italic font-black text-white leading-[85px] tracking-[-4px] text-center">ELURU.</Typography></Animated.View>
            </View>

            <View className="mt-auto mb-4 items-center w-full">
              <Animated.View style={[bottomStyle, { alignItems: 'center', width: '100%' }]}>
                <Typography weight="black" className="text-[9px] text-white/30 tracking-[4px] mb-8 font-black uppercase italic">SCROLL TO EXPLORE</Typography>
                <View className="relative w-full px-2">
                  <Animated.View style={[{ position: 'absolute', inset: -2, borderRadius: 28, backgroundColor: '#0ea5e9', opacity: 0.15 }, glowingButtonStyle]} />
                  <Pressable
                    onPress={() => scrollRef.current?.scrollTo({ y: height, animated: true })}
                    className="bg-[#0b0e14]/80 border border-white/5 backdrop-blur-xl rounded-[32px] w-full h-20 flex-row items-center justify-center active:bg-sky-950"
                  >
                    <Typography weight="black" className="text-[14px] text-white tracking-[6px] font-black uppercase italic">BOOK YOUR RIDE</Typography>
                    <ArrowDown size={18} color="#0ea5e9" className="ml-5" />
                  </Pressable>
                </View>
                <View className="h-10 justify-center items-center mt-6">
                  <Animated.View style={[{ width: 1.5, backgroundColor: '#0ea5e9', borderRadius: 1 }, scrollLineStyle]} />
                </View>
              </Animated.View>
            </View>
          </View>
        </View>

        {/* SECTION 2: OUR RIDES */}
        <View id="our-rides" className="bg-[#000000] px-6 pt-4 pb-16 border-t border-white/5">
          <View className="flex-row items-end justify-between mb-8">
            <View className="flex-1">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-[1.5px] bg-indigo-500 mr-3" />
                <Typography weight="black" className="text-[11px] text-indigo-400 font-black tracking-[4px] uppercase">ALL RIDES</Typography>
              </View>
              <Typography weight="black" className="text-6xl font-black italic text-white tracking-[-3px] mb-4 uppercase">OUR RIDES.</Typography>
              <Typography weight="medium" className="text-gray-400 text-[12px] leading-[20px] max-w-[280px]">
                HAVE FUN WITH YOUR FAMILY AND FRIENDS. WE HAVE RIDES FOR EVERYONE TO ENJOY.
              </Typography>
            </View>
            <View className="bg-[#0d0f14] border border-white/10 rounded-2xl px-6 py-4 flex-row items-center space-x-4 min-w-[200px] shadow-2xl">
              <Search size={16} color="rgba(255,255,255,0.5)" />
              <TextInput placeholder="SEARCH RIDES..." placeholderTextColor="rgba(255,255,255,0.3)" className="text-[10px] text-white font-black uppercase tracking-widest flex-1 p-0 m-0" />
            </View>
          </View>

          {loadingRides ? (
            <View className="py-20 items-center">
              <ActivityIndicator color="#6366f1" size="large" />
              <Typography weight="black" className="text-[10px] text-white/30 tracking-[4px] uppercase mt-4 font-black">LOADING LIVE CATALOG...</Typography>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {rides.map((ride) => (
                <RideCard
                  key={ride._id || ride.id}
                  id={ride._id || ride.id}
                  title={ride.name || ride.title || 'UNNAMED RIDE'}
                  category={ride.category || 'FUN RIDE'}
                  description={ride.description || ride.desc || 'EXPERIENCE THE THRILL OF THIS ELURU PREMIER ATTRACTION.'}
                  price={ride.price || '0'}
                  image={ride.imageUrl || ride.image}
                  tag={ride.tag || 'ALL AGES'}
                />
              ))}
            </View>
          )}
        </View>

        {/* SECTION 3: OUR VISION */}
        <OurVisionSection onBookRide={() => scrollRef.current?.scrollTo({ y: height * 0.88, animated: true })} />

        {/* FOOTER SECTION */}
        <Footer onBackToTop={() => scrollRef.current?.scrollTo({ y: 0, animated: true })} />
      </ScrollView>
    </View>
  );
}






