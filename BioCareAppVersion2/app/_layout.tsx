// app/_layout.tsx
//<Stack.Screen name="create-gesture" />
import { Stack } from "expo-router";

//THERE ARE WHERE THE PAGES ARE DEFINED
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Home */}
      <Stack.Screen name="index" />
      <Stack.Screen name="presets" />
      <Stack.Screen name="precision-grip" />
      <Stack.Screen name="power-grip" />
      <Stack.Screen name="live-data" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="create-gesture" />
    </Stack>
  );
}