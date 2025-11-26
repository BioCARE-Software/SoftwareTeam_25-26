// app/create-gesture.tsx
import { Link } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function UtilityGestureSet() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href=".." asChild>
          <TouchableOpacity>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>UTILITY Gesture Set</Text>
      </View>

      <Link href="/precision-grip" asChild>
        <TouchableOpacity style={styles.gestureItem}>
          <Text style={styles.gestureLabel}>Precision Grip</Text>
          <Text style={styles.gestureArrow}>›</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/power-grip" asChild>
        <TouchableOpacity style={styles.gestureItem}>
          <Text style={styles.gestureLabel}>Power Grip</Text>
          <Text style={styles.gestureArrow}>›</Text>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity style={styles.editSetBtn}>
        <Text style={styles.editSetText}>EDIT SET</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", paddingHorizontal: 22, paddingTop: 48 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  backArrow: { color: "#fff", fontSize: 38, marginRight: 12 },
  title: { color: "#fff", fontSize: 34, fontWeight: "bold" },
  gestureItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 18, borderBottomWidth: 2, borderBottomColor: "#444" },
  gestureLabel: { color: "#fff", fontSize: 28, fontWeight: "500" },
  gestureArrow: { color: "#fff", fontSize: 36 },
  editSetBtn: { backgroundColor: "#d33c32", borderRadius: 30, padding: 20, alignItems: "center", marginTop: 40 },
  editSetText: { color: "#fff", fontWeight: "bold", fontSize: 26 },
});