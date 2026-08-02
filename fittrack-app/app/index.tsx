// app/index.tsx
import { Link, useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {/* Declarative navigation */}
      <Link href="/studios">
        <Text>View Studios</Text>
      </Link>

      {/* Imperative navigation */}
      <Pressable onPress={() => router.push("/studios")}>
        <Text>View Studios</Text>
      </Pressable>

      {/* Replace instead of push, no back button */}
      <Pressable onPress={() => router.replace("/login")}>
        <Text>Go to Login</Text>
      </Pressable>

      {/* Go back */}
      <Pressable onPress={() => router.back()}>
        <Text>Back</Text>
      </Pressable>
    </View>
  );
}