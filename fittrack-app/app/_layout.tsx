// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* The (tabs) group: headerShown false because each tab manages its own header */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Detail screens live outside the tab group so they cover the tab bar */}
      <Stack.Screen name="studios/[id]" options={{ title: "Studio Details" }} />
    </Stack>
  );
}