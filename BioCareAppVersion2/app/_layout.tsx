// app/_layout.tsx
import { Stack } from "expo-router";

//layout of the app and which screens are included
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="presets" />
      <Stack.Screen name="create-gesture" />
      <Stack.Screen name="precision-grip" />
      <Stack.Screen name="power-grip" />
      <Stack.Screen name="live-data" />
      <Stack.Screen name="Settings" />
    </Stack>
  );
}