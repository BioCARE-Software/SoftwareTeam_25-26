// app/settings.tsx
import { Link } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
//import { manager } from "./utils/bleManager"; // ← Fix path: from app/ to app/utils/
import { BleManager } from "react-native-ble-plx";
//import { manager } from "./utils/bleManager";


export let connectedDevice: any = null;

export default function Settings() {
  const [scanning, setScanning] = useState(false);
  
  const connect = () => {
    if (scanning) return;
    setScanning(true);

    Alert.alert("Scanning...", "Looking for BioCare_ProstheticESP32");

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        Alert.alert("Error", error.message);
        setScanning(false);
        return;
      }

      if (device?.name?.includes("BioCare")) {
        manager.stopDeviceScan();
        device.connect()
          .then((d) => d.discoverAllServicesAndCharacteristics())
          .then((d) => {
            connectedDevice = d;
            setScanning(false);
            Alert.alert("SUCCESS", "Connected to ESP32!");
            console.log("Connected:", d.id);
          })
          .catch((err) => {
            setScanning(false);
            Alert.alert("Failed", err.message || "Connection failed");
          });
      }
    });

    // Timeout
    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
    }, 12000);
  };

  return (
    
    <View style={styles.container}>
      <Link href=".." asChild>
        <TouchableOpacity>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </Link>
      
      <Text style={styles.title}>SETTINGS</Text>
      <TouchableOpacity onPress={connect} style={styles.btn} disabled={scanning}>
        <Text style={styles.btnText}>
          {scanning ? "Scanning..." : connectedDevice ? "CONNECTED" : "Connect ESP32"}
        </Text>
      </TouchableOpacity>
      {connectedDevice && (
        <Text style={styles.success}>ESP32 CONNECTED!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: "#111", justifyContent: "center", alignItems: "center" },
  title: { color: "#fff", fontSize: 48, fontWeight: "bold", marginBottom: 80 },
  backArrow: { color: "#fff", fontSize: 38, marginRight: 38, fontWeight: "bold" },
  btn: { backgroundColor: "#d33c32", padding: 28, borderRadius: 40, paddingHorizontal: 100 },
  btnText: { color: "#fff", fontSize: 28, fontWeight: "bold" },
  success: { color: "lime", fontSize: 36, marginTop: 50, fontWeight: "bold" },
});