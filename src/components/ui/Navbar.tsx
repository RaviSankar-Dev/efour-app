import { View, Pressable, Platform, Image, StyleSheet } from "react-native";
import { Typography } from "./Core";
import { ShoppingCart, User, Zap, Ticket as TicketIcon } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "../../store/useAppStore";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const isHome = pathname === "/" || pathname === "/(tabs)" || pathname === "/index";
  const { setCartOpen, cart, isAuthenticated } = useAppStore();


  return (
    <View 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        paddingTop: insets.top + 8,
        paddingHorizontal: 20,
        backgroundColor: 'transparent', // NO UNWANTED BLACK NAVBAR
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* BRAND & ACTION GROUP - LEFT */}
      <View className="flex-row items-center">
        <Pressable onPress={() => router.push("/")}>
           <Image 
             source={require('../../../assets/images/E4_LOGO_NEW.jpeg')} 
             style={{ width: 135, height: 90 }} 
             resizeMode="contain" 
           />
        </Pressable>
      </View>

      {/* ACCESS ICONS - RIGHT */}
      <View style={{ gap: 16 }} className="flex-row items-center">
         <Pressable 
            onPress={() => setCartOpen(true)}
            className="w-12 h-12 items-center justify-center bg-white/5 border border-white/10 rounded-2xl relative shadow-2xl"
         >
            <ShoppingCart size={20} stroke="white" strokeWidth={2.4} />
            {cart.length > 0 && (
              <View className="absolute -top-1 -right-1 bg-indigo-600 min-w-[18px] h-[18px] rounded-full items-center justify-center border-2 border-black">
                <Typography weight="black" className="text-[9px] text-white leading-none font-black">{cart.length}</Typography>
              </View>
            )}
         </Pressable>

         {!isAuthenticated && (
           <Pressable 
              onPress={() => router.push("/profile")}
              className="bg-indigo-600 w-12 h-12 rounded-2xl shadow-2xl shadow-indigo-600/30 items-center justify-center active:bg-indigo-700"
           >
              <User size={20} stroke="white" strokeWidth={2.8} />
           </Pressable>
         )}
         
         {isAuthenticated && (
           <Pressable 
              onPress={() => router.push("/profile")}
              className="w-12 h-12 items-center justify-center bg-indigo-600 rounded-2xl shadow-premium"
           >
              <User size={20} stroke="white" strokeWidth={2.8} />
           </Pressable>
         )}
      </View>
    </View>
  );
};
