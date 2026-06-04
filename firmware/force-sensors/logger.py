import serial
import csv
import time

PORT = '/dev/ttyUSB0'
BAUD = 115200
OUTPUT_FILE = './data/data_position3.csv'

with serial.Serial(PORT, BAUD, timeout=1) as ser:
    ser.reset_input_buffer()  # flush any stale bytes on startup
    
    with open(OUTPUT_FILE, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['timestamp_ms', 'raw_value'])
        
        print(f"Logging to {OUTPUT_FILE}... Press Ctrl+C to stop")
        start = time.time()
        
        while True:
            try:
                line = ser.readline().decode('utf-8', errors='ignore').strip()
                if line and line.isdigit():  # only log valid numeric lines
                    elapsed_ms = int((time.time() - start) * 1000)
                    writer.writerow([elapsed_ms, int(line)])  # cast to int not string
                    print(f"{elapsed_ms}, {line}")
            except KeyboardInterrupt:
                print(f"\nLogging stopped. Data saved to {OUTPUT_FILE}")
                break
