import React, { useEffect } from "react";
import { View, ScrollView, Dimensions, TextInput, Pressable, Image, ActivityIndicator } from "react-native";
import { Typography } from "../../src/components/ui/Core";
import { Navbar } from "../../src/components/ui/Navbar";
import { Footer } from "../../src/components/ui/Footer";
import { DineCard, DineProps } from "../../src/components/ui/DineCard";
import { Search, MapPin, Clock } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

const DINE_DATA: DineProps[] = [
  { id: '1', title: 'WOW! MOMO PLATTER', description: 'WOW! MOMO PLATTER', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?q=80&w=2070&auto=format&fit=crop' },
  { id: '2', title: 'PREMIUM PIZZA', description: 'WOOD FIRED CLASSICS', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop' },
  { id: '3', title: 'GRILL PLATTER', description: 'SMOKEY BBQ EXPERTS', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2070&auto=format&fit=crop' },
  { id: '4', title: 'DESERT HAVEN', description: 'SWEET SENSATION', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1974&auto=format&fit=crop' },
];

export default function DineScreen() {
  const [dineItems, setDineItems] = React.useState<DineProps[]>(DINE_DATA);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  useEffect(() => {
    fetchDineData();
  }, []);

  const fetchDineData = async () => {
    try {
      const response = await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/e4/dine?all=true');
      const data = await response.json();
      if (response.ok) {
        const fetchedItems = Array.isArray(data) ? data : (data.dine || []);
        if (fetchedItems.length > 0) {
          // Map API fields to DineProps
          const mappedItems = fetchedItems.map((item: any) => {
            let parsedMenu = item.menu;
            if (typeof parsedMenu === 'string') {
              try { parsedMenu = JSON.parse(parsedMenu); } catch(e) { parsedMenu = []; }
            }
            if (!Array.isArray(parsedMenu)) {
              parsedMenu = [];
            }
            return {
              id: item._id || item.id,
              title: item.name || item.title || 'UNNAMED DISH',
              description: item.description || item.desc || 'EXPERIENCE THE FINEST CULINARY DELIGHTS AT E4 ELURU.',
              image: item.imageUrl || item.image,
              menu: parsedMenu
            };
          });
          setDineItems(mappedItems);
        }
      }
    } catch (error) {
      console.error("FAILED TO FETCH DINE DATA:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollRef = React.useRef<ScrollView>(null);

  return (
    <View style={{ flex: 1, backgroundColor: '#020408' }}>
      <ScrollView 
        ref={scrollRef} 
        bounces={false} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingTop: 0, paddingBottom: 160 }}
      >
        <View className="bg-[#020408] pt-40 pb-16 px-6">
          {/* HEADER */}
          <View className="mb-12 px-2">
            <View className="flex-row items-center space-x-3 mb-6">
              <View className="w-10 h-[1.5px] bg-indigo-500 mr-2" />
              <Typography weight="black" className="text-[11px] tracking-[4px] text-indigo-400 uppercase font-black">OUR DINE</Typography>
            </View>

            <Typography weight="black" className="text-6xl italic text-white mb-8 tracking-[-3px] uppercase font-black">OUR{"\n"}DINE.</Typography>

            <Typography weight="medium" className="text-[13px] text-gray-400 leading-[22px] italic uppercase tracking-[1.5px] font-medium mb-8">
              BEST FOOD IN ELURU. CHOOSE YOUR FAVORITE DISH AND ENJOY.
            </Typography>

            <View className="w-full bg-[#0d0f14] border border-white/10 rounded-2xl px-6 py-4 flex-row items-center shadow-2xl">
              <Search size={16} color="rgba(255,255,255,0.5)" />
              <TextInput 
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="SEARCH RESTAURANTS..." 
                placeholderTextColor="rgba(255,255,255,0.3)" 
                className="text-[10px] text-white font-black uppercase tracking-widest flex-1 p-0 m-0 ml-4" 
              />
            </View>
          </View>

          <View className="h-[1px] w-full bg-white/10 mb-12" />

          {/* FILTER BADGE */}
          <Pressable className="bg-yellow-400 px-10 py-5 rounded-2xl flex-row items-center self-start mb-16 shadow-2xl shadow-yellow-400/40 active:bg-yellow-500">
            <Typography weight="black" className="text-[12px] text-black tracking-[3px] italic uppercase font-black">EXPLORE DINE</Typography>
          </Pressable>

          {/* DINE GRID */}
          <View className="flex-col">
            {loading ? (
              <View className="py-20 items-center">
                <ActivityIndicator color="#6366f1" size="large" />
                <Typography weight="black" className="text-[10px] text-white/30 tracking-[4px] uppercase mt-4 font-black">SYNCING KITCHEN CATALOG...</Typography>
              </View>
            ) : (
              dineItems.filter((item) => {
                const search = searchQuery.toLowerCase();
                const title = (item.title || '').toLowerCase();
                const desc = (item.description || '').toLowerCase();
                return title.includes(search) || desc.includes(search);
              }).map((item) => (
                <DineCard key={item.id} item={item} />
              ))
            )}
          </View>
        </View>

        <Footer onBackToTop={() => scrollRef.current?.scrollTo({ y: 0, animated: true })} />
      </ScrollView>

      {/* FIXED HEADER - PLACED AT THE END FOR NATURAL Z-ORDER STACKING */}
      <Navbar />
    </View>
  );
}
