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
          backgroundColor: '#FFD700',
          borderColor: '#EAB308',
          shadowColor: '#FFD700',
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
      <Icon size={20} stroke={variant === "primary" ? "black" : "white"} strokeWidth={2.4} />
      {badgeCount > 0 && (
        <View style={{
          position: 'absolute',
          top: -2,
          right: -2,
          backgroundColor: '#FFD700',
          minWidth: 18,
          height: 18,
          borderRadius: 9,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: '#000',
        }}>
          <Typography weight="black" style={{ fontSize: 9, lineHeight: 12, color: 'black' }}>{badgeCount}</Typography>
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
        backgroundColor: '#000000',
        paddingTop: insets.top,
        zIndex: 100,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 8,
        }}
      >
        {/* BRAND - LEFT */}
        <Pressable 
          onPress={() => router.push("/")} 
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
          }}
        >
          <Image 
            source={require('../../../assets/images/E4_LOGO_NEW.jpeg')} 
            style={{ width: 85, height: 50 }} 
            resizeMode="contain" 
          />
        </Pressable>

        {/* ACTION GROUP - RIGHT */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
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
    </View>
  );
};

