import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";

export default function Presets() {
  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <View style={styles.header}>
        <Text style={styles.backArrow}>←</Text>
        <Text style={styles.title}>PRESETS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.presetsList}>
        <PresetButton label="Utility" />
        <PresetButton label="Strength" />
        <PresetButton label="Sport" />
        <PresetButton label="Custom" />
      </ScrollView>

      {/* New Preset Button */}
      <Link href="/create-gesture" asChild>
        <TouchableOpacity style={styles.newPresetBtn}>
          <Text style={styles.newPresetText}>New Preset</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

function PresetButton({ label }: { label: string }) {
  return (
    <TouchableOpacity style={styles.presetBtn}>
      <Text style={styles.presetLabel}>{label}</Text>
      <Text style={styles.presetIcon}>⋮</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  backArrow: {
    color: "#fff",
    fontSize: 32,
    marginRight: 10,
    fontWeight: "bold",
  },
  title: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  presetsList: {
    gap: 16,
    marginBottom: 34,
  },
  presetBtn: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 26,
    padding: 18,
    justifyContent: "space-between",
    marginBottom: 0,
  },
  presetLabel: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
  },
  presetIcon: {
    fontSize: 26,
    color: "#222",
  },
  newPresetBtn: {
    backgroundColor: "#d33c32",
    borderRadius: 26,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  newPresetText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 26,
  },
});
