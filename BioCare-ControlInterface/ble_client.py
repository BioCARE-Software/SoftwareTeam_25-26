# ble_client.py
import asyncio
from bleak import BleakClient, BleakScanner, BleakGATTCharacteristic, BleakError
from bleak.backends.device import BLEDevice
from typing import Optional, Callable

# ── UUIDs – MUST MATCH YOUR ESP32 FIRMWARE ──
SERVICE_UUID = "b36ffaec-2ef4-4f92-8240-05877b9d71e6"
SENSOR_CHAR_UUID = "b9d3b9d6-9fb5-4b2e-89c1-2fb2a2f6d111"   # For receiving sensor data (notify)
CONTROL_CHAR_UUID = "36e89808-bb82-471d-9791-a2dc10994675"  # For sending commands (write)

class BioCareBLEClient:
    def __init__(self):
        self.client: Optional[BleakClient] = None
        self.is_connected = False
        self.on_data_received: Optional[Callable[[int], None]] = None  # callback for sensor data

    async def connect(self) -> bool:
        try:
            print("Scanning for BioCare_ProstheticESP32...")
            devices = await BleakScanner.discover(timeout=8.0)

            target: Optional[BLEDevice] = None
            for d in devices:
                if d.name and "BioCare_ProstheticESP32" in d.name:
                    target = d
                    break

            if not target:
                print("ESP32 not found. Make sure it's powered on and advertising.")
                return False

            print(f"Found {target.name} ({target.address})")

            self.client = BleakClient(target.address)
            await self.client.connect()
            self.is_connected = True
            print("Connected successfully.")
            return True

        except Exception as e:
            print(f"Connection failed: {e}")
            return False

    async def disconnect(self):
        if self.client and self.client.is_connected:
            await self.client.disconnect()
            self.is_connected = False
            print("Disconnected.")

    async def send_servo_position(self, position: int):
        """Send a 32-bit signed integer (0–180) to the ESP32"""
        if not self.is_connected or not self.client:
            print("Not connected.")
            return False

        try:
            data = position.to_bytes(4, byteorder="little", signed=True)
            await self.client.write_gatt_char(CONTROL_CHAR_UUID, data, response=True)
            print(f"Sent position: {position}")
            return True
        except BleakError as e:
            print(f"Write failed: {e}")
            return False

    async def start_notifications(self, callback: Callable[[int], None]):
        if not self.client or not self.client.is_connected:
            print("Cannot start notifications – not connected.")
            return

        try:
            def handler(sender: BleakGATTCharacteristic, data: bytearray):
                value = int.from_bytes(data, "little", signed=False)
                print(f"Received sensor value: {value}")
                if callback:
                    callback(value)

            await self.client.start_notify(SENSOR_CHAR_UUID, handler)
            self.on_data_received = callback
            print("Notifications started for sensor data.")
        except BleakError as e:
            print(f"Failed to start notifications: {e}")

    async def cleanup(self):
        await self.disconnect()