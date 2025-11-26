// app/live-data.tsx
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { esp32Device } from "./settings";

const SENSOR_CHAR_UUID = "b9d3b9d6-9fb5-4b2e-89c1-2fb2a2f6d111";  // Your sensor characteristic

export default function LiveData() {
  const [emgValue, setEmgValue] = useState(0);

  useEffect(() => {
    if (!esp32Device) {
      console.log("ESP32 not connected yet");
      return;
    }

    // Start listening to sensor data
    const subscription = esp32Device.monitorCharacteristicForService(
      "b36ffaec-2ef4-4f92-8240-05877b9d71e6",
      SENSOR_CHAR_UUID,
      (error, characteristic) => {
        if (error) {
          console.log("BLE Error:", error);
          return;
        }

        if (characteristic?.value) {
          const raw = Buffer.from(characteristic.value, "base64");
          const value = (raw[1] << 8) | raw[0];  // little-endian 16-bit
          setEmgValue(value);
          console.log("REAL EMG VALUE:", value);  // ← SEE THIS IN TERMINAL
        }
      }
    );

    return () => subscription?.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.backArrow}>Back</Text>
      <Text style={styles.title}>Live SENSOR DATA</Text>

      <View style={styles.valueBox}>
        <Text style={styles.label}>EMG Signal</Text>
        <Text style={styles.bigValue}>{emgValue}</Text>
      </View>

      {!esp32Device && (
        <Text style={{ color: "#ff5555", textAlign: "center", marginTop: 20 }}>
          Connect ESP32 in Settings first!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 20, paddingTop: 60 },
  backArrow: { color: "#fff", fontSize: 36, fontWeight: "bold", marginBottom: 20 },
  title: { color: "#fff", fontSize: 42, fontWeight: "bold", textAlign: "center" },
  valueBox: { backgroundColor: "#222", padding: 40, borderRadius: 30, alignItems: "center", marginTop: 50 },
  label: { color: "#aaa", fontSize: 24 },
  bigValue: { color: "#3fa7df", fontSize: 72, fontWeight: "bold", marginTop: 10 },
});