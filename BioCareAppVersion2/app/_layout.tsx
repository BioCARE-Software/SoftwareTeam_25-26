// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Home */}
      <Stack.Screen name="index" />

      {/* Settings – MUST be explicitly here */}
      <Stack.Screen name="settings" />

      {/* Your other pages */}
      <Stack.Screen name="presets" />
      <Stack.Screen name="create-gesture" />
      <Stack.Screen name="precision-grip" />
      <Stack.Screen name="power-grip" />
      <Stack.Screen name="live-data" />
      {/* Add more if you have them */}
    </Stack>
  );
}