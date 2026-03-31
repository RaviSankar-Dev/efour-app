import { Tabs } from "expo-router";
import { LayoutGrid, User, ChefHat, Phone, Stars, Ticket, Home, Utensils, Globe } from "lucide-react-native";
import { THEME } from "../../src/constants/theme";
import { View, Platform, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { Typography } from "../../src/components/ui/Core";
import React, { useEffect } from "react";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming,
  FadeIn,
  FadeOut
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const TabIcon = ({ 
  icon: Icon, 
  color, 
  focused, 
  label, 
  hasDot, 
  dotColor 
}: { 
  icon: any, 
  color: string, 
  focused: boolean, 
  label: string, 
  hasDot?: boolean, 
  dotColor?: string 
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const glowScale = useSharedValue(0.8);

  useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.15, { damping: 15, stiffness: 200 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 200 });
      glowOpacity.value = withTiming(0.12, { duration: 300 });
      glowScale.value = withSpring(1.2, { damping: 15, stiffness: 200 });
    } else {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 200 });
      glowOpacity.value = withTiming(0, { duration: 300 });
      glowScale.value = withSpring(0.8, { damping: 15, stiffness: 200 });
    }
  }, [focused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }]
  }));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: 72, width: 68 }}>
      {/* Background Glow for Active Tab - Centered behind icon, moved down deeply */}
      <Animated.View style={[
        {
          position: 'absolute',
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: THEME.colors.primary,
          // Move the glow to a deeper top offset
          top: 22,
        },
        animatedGlowStyle
      ]} />

      <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 22 }}>
        <Animated.View style={animatedIconStyle}>
          <View>
            <Icon 
              color={focused ? "#ffffff" : "rgba(255, 255, 255, 0.4)"} 
              size={24} 
              strokeWidth={focused ? 2.5 : 2} 
            />
            {hasDot && (
              <View style={{ 
                position: 'absolute', 
                top: -2, 
                right: -4, 
                width: 8, 
                height: 8, 
                backgroundColor: dotColor || THEME.colors.primary, 
                borderRadius: 4, 
                borderWidth: 2, 
                borderColor: '#0c0e16' 
              }} />
            )}
          </View>
        </Animated.View>

        <Typography 
          weight={focused ? "black" : "bold"} 
          style={{ 
            fontSize: 9, 
            marginTop: 4, 
            letterSpacing: 0.5,
            opacity: focused ? 1 : 0.4
          }}
        >
          {label}
        </Typography>
      </View>

      {/* Indicator Dot - Lowest alignment */}
      {focused && (
        <Animated.View 
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={{
            position: 'absolute',
            bottom: 2,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: '#ffffff',
            shadowColor: '#ffffff',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 5,
          }}
        />
      )}
    </View>
  );
};






export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          height: 72,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          position: "absolute",
          bottom: Platform.OS === 'ios' ? 34 : 24,
          left: 20,
          right: 20,
          height: 72,
          borderRadius: 36,
          backgroundColor: Platform.OS === 'ios' ? 'rgba(12, 14, 22, 0.75)' : '#0c0e16',
          borderTopWidth: 0,
          borderWidth: 1.5,
          borderColor: 'rgba(255, 255, 255, 0.08)',
          paddingHorizontal: 12,
          elevation: 25,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 15 },
          shadowOpacity: 0.5,
          shadowRadius: 25,
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView 
              intensity={80} 
              tint="dark" 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                borderRadius: 36,
                overflow: 'hidden'
              }} 
            />
          ) : (
            <LinearGradient
              colors={['rgba(12, 14, 22, 1)', 'rgba(30, 41, 59, 0.95)']}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 36,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.05)'
              }}
            />
          )
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={Home} color={color} focused={focused} label="HOME" />
          ),
        }}
      />
      <Tabs.Screen
        name="dine"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon 
              icon={Utensils} 
              color={color} 
              focused={focused} 
              label="DINE" 
              hasDot 
              dotColor="#6366f1" 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dome"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon 
              icon={Globe} 
              color={color} 
              focused={focused} 
              label="DOME" 
              hasDot 
              dotColor="#10b981" 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={Ticket} color={color} focused={focused} label="PASS" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={User} color={color} focused={focused} label="USER" />
          ),
        }}
      />
    </Tabs>
  );
}

