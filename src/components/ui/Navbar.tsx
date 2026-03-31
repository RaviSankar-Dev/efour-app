import { View, Pressable, Platform, Image, StyleSheet } from "react-native";
import { Typography } from "./Core";
import { ShoppingCart, User, Zap, Ticket as TicketIcon } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "../../store/useAppStore";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withSequence 
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const NavbarButton = ({ icon: Icon, onPress, badgeCount, variant = "glass" }: any) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        {
          width: 48,
          height: 48,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
        },
        variant === "primary" ? {
          backgroundColor: '#6366f1',
          borderColor: '#818cf8',
          shadowColor: '#6366f1',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        } : {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        animatedStyle
      ]}
    >
      <Icon size={20} stroke="white" strokeWidth={2.4} />
      {badgeCount > 0 && (
        <View style={{
          position: 'absolute',
          top: -2,
          right: -2,
          backgroundColor: '#6366f1',
          minWidth: 18,
          height: 18,
          borderRadius: 9,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: '#000',
        }}>
          <Typography weight="black" style={{ fontSize: 9, lineHeight: 12 }}>{badgeCount}</Typography>
        </View>
      )}
    </AnimatedPressable>
  );
};

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setCartOpen, cart, isAuthenticated } = useAppStore();

  return (
    <View 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: insets.top + 4,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 100,
      }}
    >
      {/* BRAND - LEFT */}
      <Pressable onPress={() => router.push("/")} style={{ transform: [{ translateX: -10 }] }}>
        <Image 
          source={require('../../../assets/images/E4_LOGO_NEW.jpeg')} 
          style={{ width: 140, height: 90 }} 
          resizeMode="contain" 
        />
      </Pressable>

      {/* ACTION GROUP - RIGHT */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <NavbarButton 
          icon={ShoppingCart} 
          onPress={() => setCartOpen(true)} 
          badgeCount={cart.length} 
        />
        
        <NavbarButton 
          icon={User} 
          onPress={() => router.push("/profile")} 
          variant={isAuthenticated ? "primary" : "glass"}
        />
      </View>
    </View>
  );
};

