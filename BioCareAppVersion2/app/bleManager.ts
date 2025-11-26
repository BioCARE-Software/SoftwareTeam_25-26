// bleManager.ts  ← IN PROJECT ROOT
import { BleManager, Device } from "react-native-ble-plx";

export const manager = new BleManager();
export let connectedDevice: Device | null = null;