import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Studios" }} />
      <Stack.Screen name="login" options={{ title: "Log in" }} />
      <Stack.Screen name="studios/[id]" options={{ title: "Studio" }} />
      <Stack.Screen name="bookings" options={{ title: "My bookings" }} />
    </Stack>
  );
}
