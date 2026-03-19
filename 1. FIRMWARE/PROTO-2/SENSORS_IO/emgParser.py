import tkinter as tk
from tkinter import messagebox
import serial
import csv
import datetime
import threading
import collections
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import matplotlib.animation as animation

class EMGVisualizer:
    def __init__(self, root):
        self.root = root
        self.root.title("EMG Live Data")
        self.root.configure(bg="#f0f0f0")

        # Data Settings
        self.serial_port = 'COM3' 
        self.baud_rate = 115200
        self.recording = False
        
        # Buffers for Plotting (stores last 100 points)
        self.max_points = 100
        self.data_x = collections.deque([0]*self.max_points, maxlen=self.max_points)
        self.data_y = collections.deque([0]*self.max_points, maxlen=self.max_points)
        self.count = 0

        # --- UI Layout ---
        top_frame = tk.Frame(root, bg="#f0f0f0")
        top_frame.pack(side=tk.TOP, fill=tk.X, pady=10)

        btn_style = {"width": 12, "bg": "#e1e1e1", "relief": "raised", "bd": 1}
        
        self.start_btn = tk.Button(top_frame, text="Start", command=self.start, **btn_style)
        self.start_btn.pack(side=tk.LEFT, padx=10)

        self.stop_btn = tk.Button(top_frame, text="Stop", command=self.stop, state=tk.DISABLED, **btn_style)
        self.stop_btn.pack(side=tk.LEFT)

        self.status_label = tk.Label(top_frame, text="IDLE", bg="#f0f0f0", font=("Arial", 10, "bold"))
        self.status_label.pack(side=tk.RIGHT, padx=20)

        # --- Matplotlib Figure ---
        self.fig, self.ax = plt.subplots(figsize=(5, 3), dpi=100)
        self.ax.set_title("Live EMG Signal")
        self.ax.set_ylim(0, 1024) # Standard Arduino 10-bit range
        self.line, = self.ax.plot(self.data_x, self.data_y, color='#555555')
        self.ax.set_facecolor('#f9f9f9')
        
        self.canvas = FigureCanvasTkAgg(self.fig, master=root)
        self.canvas.get_tk_widget().pack(side=tk.BOTTOM, fill=tk.BOTH, expand=True)

    def data_thread(self):
        filename = f"emg_data_{datetime.date.today()}.csv"
        try:
            ser = serial.Serial(self.serial_port, self.baud_rate, timeout=1)
            with open(filename, "w", newline="") as f:
                writer = csv.writer(f)
                if f.tell() == 0:
                    writer.writerow(["Timestamp", "Value"])

                while self.recording:
                    if ser.in_waiting > 0:
                        raw = ser.readline().decode('utf-8', errors='ignore').strip()
                        if raw.isdigit():
                            val = int(raw)
                            ts = datetime.datetime.now().strftime("%H:%M:%S.%f")[:-3]
                            writer.writerow([ts, val])
                            
                            # Update plot buffers
                            self.count += 1
                            self.data_x.append(self.count)
                            self.data_y.append(val)
            ser.close()
        except Exception as e:
            self.recording = False
            messagebox.showerror("Error", str(e))

    def animate(self, i):
        if self.recording:
            self.line.set_data(range(self.max_points), self.data_y)
            self.ax.set_xlim(0, self.max_points)
            self.canvas.draw()

    def start(self):
        self.recording = True
        self.start_btn.config(state=tk.DISABLED)
        self.stop_btn.config(state=tk.NORMAL)
        self.status_label.config(text="RECORDING", fg="#d32f2f")
        
        threading.Thread(target=self.data_thread, daemon=True).start()
        # Trigger the animation loop
        self.ani = animation.FuncAnimation(self.fig, self.animate, interval=50, cache_frame_data=False)

    def stop(self):
        self.recording = False
        self.start_btn.config(state=tk.NORMAL)
        self.stop_btn.config(state=tk.DISABLED)
        self.status_label.config(text="SAVED", fg="#388e3c")

if __name__ == "__main__":
    root = tk.Tk()
    app = EMGVisualizer(root)
    root.mainloop()