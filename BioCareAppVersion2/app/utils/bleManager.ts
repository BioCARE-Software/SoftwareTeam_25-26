// bleManager.ts  (in project root or app/utils/ — both are fine)
import { BleManager, Device } from "react-native-ble-plx";
import { Platform } from "react-native";

// Single shared BleManager instance (never create more than one)
export const manager = new BleManager();

// Global connected device reference (other screens can import and use this)
export let connectedDevice: Device | null = null;

// Optional: Cleanup when app closes (good practice, especially on Android)
if (Platform.OS !== "web") {
  const subscription = manager.onStateChange((state) => {
    if (state === "PoweredOff") {
      console.log("Bluetooth is turned off");
      // You could show an alert here if you want
    }
  }, true);

}


