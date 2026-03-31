import { Tabs } from "expo-router";
import { LayoutGrid, User, ChefHat, Phone, Stars, Ticket, Home, Utensils, Globe } from "lucide-react-native";
import { THEME } from "../../src/constants/theme";
import { View, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { Typography } from "../../src/components/ui/Core";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Platform.OS === 'ios' ? 30 : 20,
          left: 12,
          right: 12,
          height: 64,
          borderRadius: 32,
          backgroundColor: Platform.OS === 'ios' ? 'rgba(12, 14, 22, 0.78)' : 'rgba(12, 14, 22, 1)',
          borderTopWidth: 0,
          elevation: 25,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.08)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.8,
          shadowRadius: 24,
          paddingHorizontal: 12,
        },
        safeAreaInsets: {
          bottom: 0,
          top: 0
        },
        tabBarItemStyle: {
          height: 64,
          margin: 0,
          padding: 0,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView intensity={90} tint="dark" style={{ flex: 1 }} />
          ) : null
        ),
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.35)',
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ height: 64, width: 55, alignItems: 'center', justifyContent: 'center' }}>
              <Home color={color} size={22} strokeWidth={2.4} />
              <Typography weight="black" numberOfLines={1} style={{ fontSize: 7, marginTop: 2, letterSpacing: 0.5 }} className={focused ? 'text-white' : 'text-white/35'}>HOME</Typography>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="dine"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ height: 64, width: 55, alignItems: 'center', justifyContent: 'center' }}>
              <View>
                <Utensils color={color} size={22} strokeWidth={2.4} />
                <View style={{ position: 'absolute', top: -1, right: -1, width: 7, height: 7, backgroundColor: '#6366f1', borderRadius: 4, borderWidth: 1.5, borderColor: '#0c0e16' }} />
              </View>
              <Typography weight="black" numberOfLines={1} style={{ fontSize: 7, marginTop: 2, letterSpacing: 0.5 }} className={focused ? 'text-white' : 'text-white/35'}>DINE</Typography>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="dome"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ height: 64, width: 55, alignItems: 'center', justifyContent: 'center' }}>
              <View>
                <Globe color={color} size={22} strokeWidth={2.4} />
                <View style={{ position: 'absolute', top: -1, right: -1, width: 7, height: 7, backgroundColor: '#10b981', borderRadius: 4, borderWidth: 1.5, borderColor: '#0c0e16' }} />
              </View>
              <Typography weight="black" numberOfLines={1} style={{ fontSize: 7, marginTop: 2, letterSpacing: 0.5 }} className={focused ? 'text-white' : 'text-white/35'}>DOME</Typography>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ height: 64, width: 55, alignItems: 'center', justifyContent: 'center' }}>
              <User color={color} size={22} strokeWidth={2.4} />
              <Typography weight="black" numberOfLines={1} style={{ fontSize: 7, marginTop: 2, letterSpacing: 0.5 }} className={focused ? 'text-white' : 'text-white/35'}>USER</Typography>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ height: 64, width: 55, alignItems: 'center', justifyContent: 'center' }}>
              <Phone color={color} size={22} strokeWidth={2.4} />
              <Typography weight="black" numberOfLines={1} style={{ fontSize: 7, marginTop: 2, letterSpacing: 0.1 }} className={focused ? 'text-white' : 'text-white/35'}>CONTACT</Typography>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ height: 64, width: 55, alignItems: 'center', justifyContent: 'center' }}>
              <Ticket color={color} size={22} strokeWidth={2.4} />
              <Typography weight="black" numberOfLines={1} style={{ fontSize: 7, marginTop: 2, letterSpacing: 0.5 }} className={focused ? 'text-white' : 'text-white/35'}>PASS</Typography>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
