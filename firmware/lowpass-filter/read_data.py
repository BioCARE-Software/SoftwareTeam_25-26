#!/usr/bin/env python3
# read_data.py
# Plot the mock filtered data from the ESP in real time.

import matplotlib.pyplot as plt
import serial

# configure serial (matched ESP32 baud rate for controller Jacob gave me, but not sure whether using same thing during meetings?)
ser = serial.Serial("/dev/ttyUSB0", 115200)

# set up plotting
plt.ion()  # enable interactive mode
fig, ax = plt.subplots()
raw_data, filtered_data = [], []
x_vals = []
counter = 0

print("Starting live plot...")

while True:
    try:
        line = ser.readline().decode("utf-8").strip()
        if not line:
            continue

        raw, filtered = map(float, line.split(","))

        # append data
        x_vals.append(counter)
        raw_data.append(raw)
        filtered_data.append(filtered)
        counter += 1

        # keep only last 100 points @ any given time
        if len(x_vals) > 100:
            x_vals.pop(0)
            raw_data.pop(0)
            filtered_data.pop(0)

        # clear and redraw
        ax.clear()
        ax.plot(x_vals, raw_data, label="Raw", alpha=0.5)
        ax.plot(x_vals, filtered_data, label="Filtered", linewidth=2)
        ax.legend(loc="upper left")

        plt.pause(0.01)  # refresh rate

    except (ValueError, KeyboardInterrupt):
        break

plt.ioff()
plt.show()
