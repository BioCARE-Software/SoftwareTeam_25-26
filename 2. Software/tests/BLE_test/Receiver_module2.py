import asyncio
import struct
import time

import numpy as np
import matplotlib.pyplot as plt
from bleak import BleakClient, BleakScanner

SERVICE_UUID = "b36ffaec-2ef4-4f92-8240-05877b9d71e6"
CHAR_UUID_SENSOR = "b9d3b9d6-9fb5-4b2e-89c1-2fb2a2f6d111"

# Data storagesour
times = []
values = []
start_time = None

def handle_sensor(_, data: bytearray):
    """Callback that runs every time a BLE notification is received."""
    global start_time

    # First sample defines t = 0
    if start_time is None:
        start_time = time.time()

    t = time.time() - start_time

    # Data is 2 bytes, little-endian int16
    (sensor_value,) = struct.unpack("<h", data)

    times.append(t)
    values.append(sensor_value)

    # Optional: keep only last N points (for smoother plotting)
    MAX_POINTS = 500
    if len(times) > MAX_POINTS:
        del times[0]
        del values[0]

    # Debug print
    print(f"t={t:.3f}s, sensor={sensor_value}")

async def main():
    print("Scanning for ESP32...")
    devices = await BleakScanner.discover()
    esp32 = next((d for d in devices if d.name and "BioCare_ProstheticTest" in d.name), None)

    if not esp32:
        print("Device not found. Make sure it’s powered and advertising.")
        return

    async with BleakClient(esp32.address) as client:
        print("Connected!")

        # Start BLE notifications
        await client.start_notify(CHAR_UUID_SENSOR, handle_sensor)
        print("Receiving data... Close the plot window or Ctrl+C to stop.")

        # ---- Matplotlib live plot setup ----
        plt.ion()  # interactive mode on
        fig, ax = plt.subplots()
        line, = ax.plot([], [], lw=2)
        ax.set_xlabel("Time (s)")
        ax.set_ylabel("Sensor value (ADC)")
        ax.set_title("Live Force Sensor Data")
        ax.grid(True)

        try:
            while True:
                if times:
                    # Copy data to numpy arrays
                    t_arr = np.array(times)
                    v_arr = np.array(values)

                    line.set_data(t_arr, v_arr)

                    # Adjust axes to fit data
                    ax.set_xlim(t_arr.min(), t_arr.max() if t_arr.size > 0 else 1)

                    # Add a little padding on y-axis
                    ymin = v_arr.min()
                    ymax = v_arr.max()
                    if ymin == ymax:
                        ymin -= 1
                        ymax += 1
                    ax.set_ylim(ymin, ymax)

                    fig.canvas.draw()
                    fig.canvas.flush_events()

                # Small delay so we don't hammer the CPU
                await asyncio.sleep(0.05)
        except KeyboardInterrupt:
            print("Stopping...")
        finally:
            await client.stop_notify(CHAR_UUID_SENSOR)
            print("Disconnected.")

if __name__ == "__main__":
    asyncio.run(main())