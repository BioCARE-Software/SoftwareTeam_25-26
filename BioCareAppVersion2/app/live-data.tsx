// app/live-data/index.tsx
import { Link } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { connectedDevice } from "../app/settings";  // ← path from app/live-data/ to app/settings.tsx
import { Buffer } from "buffer";
const SENSOR_CHAR_UUID = "b9d3b9d6-9fb5-4b2e-89c1-2fb2a2f6d111";

export default function LiveData() {
  const [emgValue, setEmgValue] = useState(0);

  useEffect(() => {
    if (!connectedDevice) {
      console.log("ESP32 not connected yet");
      return;
    }
    const subscription = connectedDevice.monitorCharacteristicForService(
      "b36ffaec-2ef4-4f92-8240-05877b9d71e6",
      SENSOR_CHAR_UUID,
      (error, char) => {
        if (error) {
          console.log("BLE Error:", error);
          return;
        }

        if (char?.value) {
          const raw = Buffer.from(char.value, "base64");
          const value = (raw[1] << 8) | raw[0]; // little-endian 16-bit
          setEmgValue(value);
          console.log("REAL EMG:", value);
        }
      }
    );

    return () => subscription?.remove();
  }, []);

  return (
    <View style={styles.container}>
      {/* Back arrow – goes back to previous page */}
      <View style={styles.header}>
        <Link href=".." asChild>
          <TouchableOpacity>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>LIVE DATA</Text>
      </View>

      {/* Show value */}
      <View style={styles.valueBox}>
        <Text style={styles.label}>EMG Signal</Text>
        <Text style={styles.bigValue}>{emgValue}</Text>
      </View>

      {!connectedDevice && (
        <Text style={{ color: "#ff5555", textAlign: "center", marginTop: 30, fontSize: 18 }}>
          Connect ESP32 in Settings first!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", paddingHorizontal: 20, paddingTop: 68 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  backArrow: { color: "#fff", fontSize: 36, marginRight: 20 },
  title: { color: "#fff", fontSize: 48, fontWeight: "bold", marginLeft: 10 },
  valueBox: { backgroundColor: "#222", padding: 40, borderRadius: 30, alignItems: "center", marginTop: 50 },
  label: { color: "#aaa", fontSize: 24 },
  bigValue: { color: "#3fa7df", fontSize: 80, fontWeight: "bold", marginTop: 10 },
});