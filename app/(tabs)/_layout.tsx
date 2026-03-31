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
          bottom: Platform.OS === 'ios' ? 34 : 24,
          left: 24,
          right: 24,
          height: 70,
          borderRadius: 35,
          backgroundColor: Platform.OS === 'ios' ? 'rgba(12, 14, 22, 0.78)' : 'rgba(12, 14, 22, 1)',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.6,
          shadowRadius: 18,
          borderWidth: 1.5,
          borderColor: 'rgba(255, 255, 255, 0.12)',
          paddingHorizontal: 8,
        },
        tabBarItemStyle: {
          height: 70,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: Platform.OS === 'ios' ? 2 : 6,
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView intensity={90} tint="dark" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 35 }} />
          ) : null
        ),
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.45)',
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Home color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
              <Typography weight={focused ? "black" : "bold"} style={{ fontSize: 9, marginTop: 2, letterSpacing: 0.8 }} className={focused ? 'text-white' : 'text-white/45'}>HOME</Typography>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="dine"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View>
                <Utensils color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
                <View style={{ position: 'absolute', top: -1, right: -2, width: 7, height: 7, backgroundColor: '#6366f1', borderRadius: 3.5, borderWidth: 1.5, borderColor: '#0c0e16' }} />
              </View>
              <Typography weight={focused ? "black" : "bold"} style={{ fontSize: 9, marginTop: 2, letterSpacing: 0.8 }} className={focused ? 'text-white' : 'text-white/45'}>DINE</Typography>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="dome"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View>
                <Globe color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
                <View style={{ position: 'absolute', top: -1, right: -2, width: 7, height: 7, backgroundColor: '#10b981', borderRadius: 3.5, borderWidth: 1.5, borderColor: '#0c0e16' }} />
              </View>
              <Typography weight={focused ? "black" : "bold"} style={{ fontSize: 9, marginTop: 2, letterSpacing: 0.8 }} className={focused ? 'text-white' : 'text-white/45'}>DOME</Typography>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ticket color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
              <Typography weight={focused ? "black" : "bold"} style={{ fontSize: 9, marginTop: 2, letterSpacing: 0.8 }} className={focused ? 'text-white' : 'text-white/45'}>PASS</Typography>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <User color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
              <Typography weight={focused ? "black" : "bold"} style={{ fontSize: 9, marginTop: 2, letterSpacing: 0.8 }} className={focused ? 'text-white' : 'text-white/45'}>USER</Typography>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
