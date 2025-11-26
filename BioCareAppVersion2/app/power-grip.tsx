// app/power-grip.tsx
import { View, Text, StyleSheet } from "react-native";

export default function PowerGrip() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Power Grip</Text>
      <Text style={styles.comingSoon}>Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", justifyContent: "center", alignItems: "center" },
  title: { color: "#fff", fontSize: 42, fontWeight: "bold" },
  comingSoon: { color: "#d33c32", fontSize: 28, marginTop: 20 },
});