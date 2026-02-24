# test_ble.py
import asyncio
from bleak import BleakScanner, BleakClient

# Your ESP32 UUIDs from main.cpp
SERVICE_UUID = "b36ffaec-2ef4-4f92-8240-05877b9d71e6"
CONTROL_UUID = "36e89808-bb82-471d-9791-a2dc10994675"

async def scan():
    print("Scanning for 10 seconds...")
    devices = await BleakScanner.discover(timeout=10.0)
    for d in devices:
        if d.name and "BioCare_ProstheticESP32" in d.name:
            print(f"FOUND: {d.name} ({d.address})")
            return d.address
    print("ESP32 not found. Is it powered on?")
    return None

async def connect_and_test(address):
    print(f"Connecting to {address}...")
    async with BleakClient(address) as client:
        print("Connected!")

        # Test write: send 90 (should turn LED ON)
        data = (90).to_bytes(4, byteorder="little", signed=True)
        await client.write_gatt_char(CONTROL_UUID, data, response=True)
        print("Sent position 90 – check if LED turned ON")

        # Test write: send 10 (should turn LED OFF)
        data = (10).to_bytes(4, byteorder="little", signed=True)
        await client.write_gatt_char(CONTROL_UUID, data, response=True)
        print("Sent position 10 – check if LED turned OFF")

async def main():
    address = await scan()
    if address:
        await connect_and_test(address)
    else:
        print("Cannot connect – no device found.")

if __name__ == "__main__":
    asyncio.run(main())