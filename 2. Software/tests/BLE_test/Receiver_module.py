import asyncio
import struct
from bleak import BleakClient, BleakScanner

SERVICE_UUID = "b36ffaec-2ef4-4f92-8240-05877b9d71e6"
CHAR_UUID_SENSOR = "b9d3b9d6-9fb5-4b2e-89c1-2fb2a2f6d111"

def handle_sensor(_, data: bytearray):
    # Convert 2 bytes → int16 (same as we sent)
    (sensor_value,) = struct.unpack("<h", data)
    print("Sensor value:", sensor_value)

async def main():
    print("Scanning for ESP32...")
    devices = await BleakScanner.discover()
    esp32 = next((d for d in devices if d.name and "BioCare_ProstheticESP32" in d.name), None)

    if not esp32:
        print("Device not found. Make sure it’s powered and advertising.")
        return

    async with BleakClient(esp32.address) as client:
        print("Connected!")
        await client.start_notify(CHAR_UUID_SENSOR, handle_sensor)
        print("Receiving data... (Ctrl+C to stop)")
        try:
            while True:
                await asyncio.sleep(1)
        except KeyboardInterrupt:
            print("Stopped.")
        await client.stop_notify(CHAR_UUID_SENSOR)

asyncio.run(main())
