// Build app/studios/index.tsx as a simple list screen: a View containing a handful of hardcoded studio names, each wrapped in a Pressable. Then create app/studios/[id].tsx, and wire up navigation so pressing a studio in the list pushes to its detail screen and displays that studio's id from the route params, with a working back button.

import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function StudiosScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Pressable onPress={() => router.push("/studios/1")}>
        <Text>Studio 1</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/studios/2")}>
        <Text>Studio 2</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/studios/3")}>
        <Text>Studio 3</Text>
      </Pressable>
    </View>
  );
}
