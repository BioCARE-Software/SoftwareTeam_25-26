import asyncio
from bleak import BleakClient, BleakScanner

# Service and Characteristic UUIDs -- Should match ESP32 defined UUIDs
SERVICE_UUID = "b36ffaec-2ef4-4f92-8240-05877b9d71e6"

#write
RX_CHAR_UUID = "36e89808-bb82-471d-9791-a2dc10994675"


# recieving data
TX_CHAR_UUID = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"

def notification_handler(sender: int, data: bytearray):
    message = data.decode("utf-8")
    print("ESP32 says:", message)

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
        
        # START RECEIVING NOTIFICATIONS
        await client.start_notify(TX_CHAR_UUID, notification_handler)
        print("Listening for ESP32 messages...")
        loop = asyncio.get_running_loop()

        
        #cmd = input("Enter a message: ")
        #data = cmd.encode("utf-8")  
        #await client.write_gatt_char(RX_CHAR_UUID, data)
        #print(f'Sent message {cmd}')

        #user input
        while True:
            cmd = input("Enter a message: ")
            if (cmd == "stop"):
                print("No longer recieivng from esp32")
                await client.stop_notify(TX_CHAR_UUID)
            elif (cmd == "start"):
                print("now recieivng from esp32")
                await client.start_notify(TX_CHAR_UUID, notification_handler)

            elif (cmd != 'exit'):
                data = cmd.encode("utf-8")  # STRING
                await client.write_gatt_char(RX_CHAR_UUID, data)
                print(f'Sent Servo Position {cmd}')
            
            else:
                break

    print("Disconnected") 

if __name__ == "__main__":
    asyncio.run(main())