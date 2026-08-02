// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#e5e7eb",
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          height: Platform.OS === "ios" ? 84 : 60,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        //   tabBarIcon: ({ color, size }) => (
        //     <Ionicons name="home-outline" size={size} color={color} />
        //   ),
        }}
      />
      <Tabs.Screen
        name="studios"
        options={{
          title: "Studios",
        //   tabBarIcon: ({ color, size }) => (
        //     <Ionicons name="fitness-outline" size={size} color={color} />
        //   ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        //   tabBarIcon: ({ color, size }) => (
        //     <Ionicons name="person-outline" size={size} color={color} />
        //   ),
        }}
      />
    </Tabs>
  );
}