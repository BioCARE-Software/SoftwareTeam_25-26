# ble_client.py
import asyncio
from bleak import BleakClient, BleakScanner, BleakGATTCharacteristic, BleakError
from bleak.backends.device import BLEDevice
from typing import Optional, Callable

class BioCareBLEClient:
    def __init__(self):
        self.client: Optional[BleakClient] = None
        self.is_connected = False
        self.on_data_received: Optional[Callable[[int], None]] = None  # callback for future notifications

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
                print("ESP32 not found.")
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
            # Convert int to 4 bytes (little-endian, signed)
            data = position.to_bytes(4, byteorder="little", signed=True)
            await self.client.write_gatt_char(CHAR_UUID, data, response=True)
            print(f"Sent position: {position}")
            return True
        except BleakError as e:
            print(f"Write failed: {e}")
            return False
        


    async def cleanup(self):
        await self.disconnect()
        
async def start_notifications(self, callback: Callable[[int], None]):
    if not self.client:
        return

    await self.client.start_notify(SENSOR_CHAR_UUID, self.notification_handler)
    self.on_data_received = callback

def notification_handler(self, sender: BleakGATTCharacteristic, data: bytearray):
    value = int.from_bytes(data, "little", signed=False)
    if self.on_data_received:
        self.on_data_received(value)