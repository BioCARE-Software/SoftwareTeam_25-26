## Ensure you run pip install bleak for python BLE library

import asyncio
from bleak import BleakClient, BleakScanner

# Service and Characteristic UUIDs -- Should match ESP32 defined UUIDs
SERVICE_UUID = "b36ffaec-2ef4-4f92-8240-05877b9d71e6"
CHAR_UUID = "36e89808-bb82-471d-9791-a2dc10994675"

async def main():
    print("Scanning for device...")
    devices = await BleakScanner.discover() # Search for BLE Devices

    esp32 = None

    # Search for Target Device name in discoverable devices
    for d in devices: 
        if d.name and "BioCare_ProstheticESP32" in d.name:
            esp32 = d
            break

    if not esp32:
        print("Device not found. Make sure it's powered on and advertising. ")
        return

    print(f"Device Found: {esp32.name} ({esp32.address})")

    async with BleakClient(esp32.address) as client:
        print("Connected to ESP32")

        while True:
            cmd = input("Enter command (on/off/exit): ").strip().lower()
            if cmd == "on":
                await client.write_gatt_char(CHAR_UUID, b"LED_ON") # Transmission of input -- client.write_gatt_char(CHAR_UUID, xxxx): xxxx is user defined input
                print("Sent: LED_ON")
            elif cmd == "off":
                await client.write_gatt_char(CHAR_UUID, b"LED_OFF") 
                print("Sent: LED_OFF")
            elif cmd == "exit":
                break
            else:
                print("Unknown Command")

    print("Disconnected") 

if __name__ == "__main__":
    asyncio.run(main())
