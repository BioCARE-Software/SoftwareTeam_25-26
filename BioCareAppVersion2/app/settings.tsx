import { useState } from "react";
import { View, Text, TouchableOpacity, Switch, StyleSheet } from "react-native";

export default function Settings() {
  const [enabled, setEnabled] = useState(false);

  return (
    <View style={styles.container}>
      {/* Back Arrow + Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 18 }}>
        <Text style={styles.backArrow}>←</Text>
        <Text style={styles.title}>SETTINGS</Text>
      </View>

      {/* Enable Connect Switch */}
      <View style={styles.itemBox}>
        <Text style={styles.itemLabel}>Enable Connect</Text>
        <Switch
          value={enabled}
          onValueChange={setEnabled}
          trackColor={{ false: "#333", true: "#d33c32" }}
          thumbColor={enabled ? "#fff" : "#fff"}
        />
      </View>

      {/* Find Device Button */}
      <TouchableOpacity style={styles.itemBoxDark}>
        <Text style={styles.itemLabel}>Find Device</Text>
        <Text style={styles.itemArrow}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  backArrow: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginRight: 10,
  },
  title: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  itemBox: {
    backgroundColor: "#222",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 26,
    padding: 18,
    justifyContent: "space-between",
    marginVertical: 22,
  },
  itemBoxDark: {
    backgroundColor: "#222",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 26,
    padding: 18,
    justifyContent: "space-between",
    marginBottom: 0,
    marginVertical: 8,
  },
  itemLabel: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  itemArrow: {
    fontSize: 32,
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
  },
});
