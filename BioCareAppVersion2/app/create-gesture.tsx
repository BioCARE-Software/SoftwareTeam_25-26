import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";

export default function UtilityGestureSet() {
  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <View style={styles.header}>
        <Text style={styles.backArrow}>←</Text>
        <Text style={styles.title}>UTILITY</Text>
      </View>

      <Text style={styles.setTitle}>Gesture Set:</Text>
      <ScrollView contentContainerStyle={styles.gestureList}>
        <GestureItem label="Precision Grip" />
        <GestureItem label="Point Gesture" />
        <GestureItem label="Lateral Grip" />
        <GestureItem label="OK Gesture" />
      </ScrollView>

      {/* Edit Set Button */}
      <TouchableOpacity style={styles.editSetBtn}>
        <Text style={styles.editSetText}>✏️ EDIT SET</Text>
      </TouchableOpacity>
    </View>
  );
}

function GestureItem({ label }: { label: string }) {
  return (
    <TouchableOpacity style={styles.gestureItem}>
      <Text style={styles.gestureLabel}>{label}</Text>
      <Text style={styles.gestureArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingHorizontal: 22,
    paddingTop: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  backArrow: {
    color: "#fff",
    fontSize: 32,
    marginRight: 10,
    fontWeight: "bold",
  },
  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
  },
  setTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  gestureList: {
    gap: 10,
    marginBottom: 34,
  },
  gestureItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#555",
    borderBottomWidth: 3,
    paddingVertical: 11,
    justifyContent: "space-between",
  },
  gestureLabel: {
    fontSize: 28,
    fontWeight: "400",
    color: "#fff",
  },
  gestureArrow: {
    fontSize: 34,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  editSetBtn: {
    backgroundColor: "#d33c32",
    borderRadius: 26,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 25,
  },
  editSetText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 26,
  },
});
