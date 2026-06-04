// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tabs navigator */}
      <Stack.Screen name="(tabs)" />

      {/* Other screens */}
      <Stack.Screen name="home_page/home_screen" />
      <Stack.Screen name="manual/slide_control" />
    </Stack>
  );
}
