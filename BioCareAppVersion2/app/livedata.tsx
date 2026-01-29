// app/live-data/index.tsx   ← OR app/livedata.tsx
import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { connectedDevice } from "./settings";  // ← now works

const SENSOR_CHAR_UUID = "b9d3b9d6-9fb5-4b2e-89c1-2fb2a2f6d111";

export default function LiveData() {
  const [emgValue, setEmgValue] = useState(0);

  useEffect(() => {
    if (!connectedDevice) return;

    const subscription = connectedDevice.monitorCharacteristicForService(
      "b36ffaec-2ef4-4f92-8240-05877b9d71e6",
      SENSOR_CHAR_UUID,
      (error, char) => {
        if (char?.value) {
          const raw = Buffer.from(char.value, "base64");
          const value = (raw[1] << 8) | raw[0];
          setEmgValue(value);
          console.log("REAL EMG:", value);
        }
      }
    );

    return () => subscription?.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LIVE DATA</Text>
      <Text style={styles.value}>{emgValue}</Text>
      {!connectedDevice && <Text style={{color:"red"}}>Connect ESP32 first!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", justifyContent: "center", alignItems: "center" },
  title: { color: "#fff", fontSize: 48, fontWeight: "bold" },
  value: { color: "#3fa7df", fontSize: 80, marginTop: 40 },
});