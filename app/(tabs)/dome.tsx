import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, Image, Pressable, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Typography } from '../../src/components/ui/Core';
import { Navbar } from '../../src/components/ui/Navbar';
import { Footer } from '../../src/components/ui/Footer';
import { Clock, Users, Zap, Shield, Sparkles, MapPin, Calendar, Layout } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DomeScreen() {
  const router = useRouter();
  const [dome, setDome] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<ScrollView>(null);
  const galleryRef = useRef<ScrollView>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const galleryImages = [
    require('../../public/images/dome1.jpeg'),
    require('../../public/images/dome2.jpeg'),
  ];

  useEffect(() => {
    fetchDomeData();
  }, []);

  const fetchDomeData = async () => {
    try {
      const response = await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/domes?location=E4');
      const data = await response.json();
      if (response.ok) {
        const domeInfo = Array.isArray(data) ? data[0] : (data.domes ? data.domes[0] : data);
        if (domeInfo) setDome(domeInfo);
      }
    } catch (error) {
      console.error("FAILED TO FETCH DOME:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (galleryIndex + 1) % galleryImages.length;
      setGalleryIndex(nextIndex);
      galleryRef.current?.scrollTo({ x: nextIndex * (width - 64), animated: true });
    }, 3000);
    return () => clearInterval(timer);
  }, [galleryIndex, width]);

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView 
        ref={scrollRef} 
        bounces={false} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 160 + insets.bottom }}
      >
        {/* HERO SECTION */}
        <View style={{ height: 450 + insets.top }} className="relative">
          <Image
            source={{ uri: dome?.imageUrl || 'https://images.unsplash.com/photo-1549416878-b99b70ad2dbf?q=80&w=2070&auto=format&fit=crop' }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(15, 23, 42, 0.4)', 'rgba(15, 23, 42, 0.9)']}
            className="absolute inset-0"
          />

          <View style={{ bottom: 40, paddingHorizontal: 32 }} className="absolute">
            <View className="bg-orange-500/20 border border-orange-500/30 px-4 py-1.5 rounded-full self-start mb-6 flex-row items-center space-x-2">
              <Sparkles size={12} stroke="#f97316" fill="#f97316" />
              <Typography weight="black" className="text-[10px] text-orange-500 tracking-[3px] uppercase italic font-black">PRIVATE EXPERIENCE</Typography>
            </View>
            <Typography weight="black" className="text-7xl text-white italic tracking-tighter uppercase font-black leading-tight">{dome?.name?.replace(' ', '\n') || 'THE\nDOME.'}</Typography>
          </View>
        </View>

        <View className="bg-white dark:bg-[#000000] px-8 pt-6 pb-20">
          {loading ? (
            <View className="py-20 items-center">
              <ActivityIndicator color="#6366f1" size="large" />
              <Typography weight="black" className="text-[10px] text-slate-400 dark:text-white/30 tracking-[4px] uppercase mt-4 font-black">SYNCING RESERVATION STATUS...</Typography>
            </View>
          ) : (
            <>
              {/* BOOKING INFO CARDS */}
              <View className="flex-row items-center justify-between mb-8 gap-5 overflow-visible">
                <View className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[32px] p-6 items-center shadow-sm dark:shadow-premium">
                  <View className="w-12 h-12 items-center justify-center bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20">
                    <Clock size={22} stroke="#6366f1" strokeWidth={2.5} />
                  </View>
                  <Typography weight="black" className="text-[14px] text-slate-900 dark:text-white italic font-black mb-1">{dome?.availability || '12PM - 12AM'}</Typography>
                  <Typography weight="bold" className="text-[8px] text-slate-400 dark:text-white/30 tracking-[2px] uppercase font-bold">AVAILABILITY</Typography>
                </View>

                <View className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[32px] p-6 items-center shadow-sm dark:shadow-premium">
                  <View className="w-12 h-12 items-center justify-center bg-orange-500/10 rounded-2xl mb-4 border border-orange-500/20">
                    <Users size={22} stroke="#f97316" strokeWidth={2.5} />
                  </View>
                  <Typography weight="black" className="text-[14px] text-slate-900 dark:text-white italic font-black mb-1">{dome?.capacity || '4-6 PEOPLE'}</Typography>
                  <Typography weight="bold" className="text-[8px] text-slate-400 dark:text-white/30 tracking-[2px] uppercase font-bold">CAPACITY</Typography>
                </View>
              </View>

              {/* MAIN CARD */}
              <View className="bg-slate-50 dark:bg-[#0b0e14] border-2 border-indigo-600/10 dark:border-indigo-600/20 rounded-premium overflow-hidden mb-10 shadow-sm dark:shadow-premium">
                <View className="p-10">
                  <View className="flex-row items-center mb-6">
                    <Typography weight="black" className="text-[52px] text-slate-900 dark:text-white italic font-black leading-none tracking-tighter">₹{dome?.price || '500'}</Typography>
                    <Typography weight="black" className="text-lg text-indigo-500 dark:text-indigo-400 italic font-black ml-2 uppercase tracking-[2px]">/ HOUR</Typography>
                  </View>

                  <Typography weight="bold" className="text-[12px] text-slate-500 dark:text-gray-400 leading-[22px] italic uppercase tracking-[2px] mb-8 font-bold">
                    {dome?.description || 'EXPERIENCE THE LUXURY OF YOUR OWN PRIVATE DOME. PERFECT FOR FAMILIES, FRIENDS, OR CELEBRATIONS.'}
                  </Typography>

                  <View className="space-y-6 mb-10">
                    {(dome?.features || [
                      { icon: Shield, text: 'PRIVATE & SECURE ENVIRONMENT' },
                      { icon: MapPin, text: 'PREMIUM BIRD-EYE LOCATION' },
                      { icon: Clock, text: 'FLEXIBLE HOURLY BOOKINGS' }
                    ]).map((feature: any, i: number) => {
                      const Icon = feature.icon || Shield;
                      return (
                        <View key={i} className="flex-row items-center gap-4">
                          <Icon size={16} color="#4f46e5" className="dark:text-[#6366f1]" />
                          <Typography weight="black" className="text-[10px] text-slate-700 dark:text-white/70 tracking-[2px] uppercase font-black">{feature.text || feature}</Typography>
                        </View>
                      );
                    })}
                  </View>

                  <View
                    className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 h-14 rounded-2xl flex-row items-center justify-center space-x-4 shadow-sm dark:shadow-2xl active:opacity-70"
                  >
                    <Sparkles size={16} stroke="#4f46e5" className="dark:text-[#6366f1]" strokeWidth={2.5} />
                    <Typography weight="black" className="text-[11px] text-indigo-600 dark:text-indigo-400 tracking-[4px] uppercase font-black italic">LAUNCHING SOON</Typography>
                  </View>
                </View>

                <View className="bg-indigo-600/5 dark:bg-indigo-600/10 py-5 items-center border-t border-slate-200 dark:border-white/10">
                  <Typography weight="black" className="text-[9px] text-indigo-600 dark:text-indigo-400 tracking-[5px] uppercase font-black">INSTANT CONFIRMATION</Typography>
                </View>
              </View>
            </>
          )}

          {/* GALLERY PREVIEW */}
          <View className="mb-8">
            <Typography weight="black" className="text-4xl italic text-slate-900 dark:text-white mb-6 tracking-[-2px] uppercase font-black">PREMIUM{"\n"}ATMOSPHERE.</Typography>

            <View className="h-80 rounded-[40px] overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-premium relative bg-slate-100 dark:bg-[#0b0e14]">
              <ScrollView
                ref={galleryRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                  const newIndex = Math.round(e.nativeEvent.contentOffset.x / (width - 64));
                  setGalleryIndex(newIndex);
                }}
              >
                {galleryImages.map((img, idx) => (
                  <View key={idx} style={{ width: width - 64, height: 320 }}>
                    <Image
                      source={img}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>

              {/* PAGINATION DOTS */}
              <View className="absolute bottom-6 flex-row w-full justify-center space-x-2">
                {galleryImages.map((_, idx) => (
                  <View
                    key={idx}
                    className={`h-1.5 rounded-full ${galleryIndex === idx ? 'w-8 bg-indigo-500' : 'w-1.5 bg-slate-800/20 dark:bg-white/20'}`}
                  />
                ))}
              </View>

              <LinearGradient
                colors={['transparent', 'rgba(15, 23, 42, 0.4)']}
                className="absolute inset-0 pointer-events-none"
              />
            </View>
          </View>
        </View>

        <Footer onBackToTop={() => scrollRef.current?.scrollTo({ y: 0, animated: true })} />
      </ScrollView>

      {/* FIXED HEADER - PLACED AT THE END FOR NATURAL Z-ORDER STACKING */}
      <Navbar />
    </View>
  );
}

