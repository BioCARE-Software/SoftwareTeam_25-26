import tkinter as tk
from tkinter import ttk
import matplotlib
matplotlib.use("TkAgg")
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

import numpy as np
import threading
import time
import csv
import os
from collections import deque
from datetime import datetime

import serial
import serial.tools.list_ports

# ============================================================
# CONFIG
# ============================================================
SAMPLE_RATE_HZ = 1000        # Nominal EMG sampling rate (Hz) from Arduino
PLOT_RATE_HZ   = 30          # Plot refresh rate (Hz)

ENVELOPE_WINDOW = 30         # (~30 samples -> ~30 ms)
RMS_WINDOW      = 100        # (~100 samples -> ~100 ms) smoother RMS

env_buf = deque(maxlen=ENVELOPE_WINDOW)
rms_buf = deque(maxlen=RMS_WINDOW)

# Rolling baseline for ADC to auto-center
raw_baseline_buf = deque(maxlen=2000)   # ~2s at 1kHz
baseline_offset = 512.0

Data = {
    "time": [],         # seconds
    "emg_raw": [],
    "emg_rect": [],
    "emg_env": [],
    "emg_rms": [],
    "binary": []        # 0/1 activation
}

running = False
start_time = None
experiment_folder = None
auto_export_interval = 5

# Live metrics
last_env_value = 0.0
last_peak_time = None
last_peak_env = 0.0
motion_artifact_flag = False
prev_active = False

# Autosave status
last_export_ts = None
last_export_str = ""

# Baseline stats from calibration (envelope)
baseline_mean = None
baseline_std = None

# Quality score
last_quality_score = None

# Pulse detection and control mode state
MIN_PULSE_DUR = 0.05
DOUBLE_WINDOW = 0.7
MIN_DOUBLE_GAP = 0.1
LONG_FLEX_DUR = 1.5

high_start_time = None
long_flex_triggered = False
pending_single = False
pending_single_time = None

hand_state = "OPEN"
hand_position = 0.0  # 0=open, 1=closed

# Serial state
ser = None
start_ms = None

# Strength mode state
strength_rest_env = 0.0
strength_max_env = 0.1
strength_initialized = False

# Binary state (for hysteresis)
current_binary_state = 0
previous_binary_sample_state = 0

# ============================================================
# SERIAL AUTO-DETECTION
# ============================================================
def detect_serial_port():
    global ser

    ports = serial.tools.list_ports.comports()
    if not ports:
        status_label.config(text="Status: No serial ports found", foreground="red")
        return False

    for p in ports:
        try:
            s = serial.Serial(p.device, 115200, timeout=0.5)
            s.reset_input_buffer()

            # Try reading up to 30 lines to find a valid "ms,raw" line
            for _ in range(30):
                line = s.readline().decode(errors="ignore").strip()
                if "," not in line:
                    continue

                parts = line.split(",")
                if len(parts) != 2:
                    continue

                try:
                    int(parts[0])
                    int(parts[1])
                except:
                    continue

                # SUCCESS — valid EMG format
                ser = s
                status_label.config(
                    text=f"Status: Connected to {p.device}",
                    foreground="green"
                )
                return True

            # No valid lines → try next port
            s.close()

        except Exception:
            continue

    status_label.config(text="Status: Failed to auto-detect EMG device", foreground="red")
    return False


# ============================================================
# EXPORT HANDLING
# ============================================================
def create_experiment_folder():
    desktop = "C:/Users/omara/OneDrive/Desktop"
    ts = datetime.now().strftime("EMG_Experiment_%Y-%m-%d_%H-%M-%S")
    folder = os.path.join(desktop, ts)
    os.makedirs(folder, exist_ok=True)
    return folder


def export_csv():
    global last_export_ts, last_export_str
    if experiment_folder is None:
        return

    n = len(Data["time"])
    if n == 0:
        return

    ts = datetime.now()
    ts_str = ts.strftime("%Y-%m-%d_%H-%M-%S")
    filename = os.path.join(experiment_folder, f"{ts_str}.csv")

    with open(filename, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["time", "emg_raw", "emg_rect", "emg_env", "emg_rms", "binary_active"])
        for i in range(n):
            w.writerow([
                Data["time"][i],
                Data["emg_raw"][i],
                Data["emg_rect"][i],
                Data["emg_env"][i],
                Data["emg_rms"][i],
                Data["binary"][i]
            ])

    last_export_ts = time.time()
    last_export_str = ts.strftime("%H:%M:%S")
    print(f"[EXPORT] Saved {filename}")


def auto_export_worker():
    while running:
        time.sleep(auto_export_interval)
        if running:
            export_csv()


# ============================================================
# ACQUISITION THREAD
# ============================================================
def acquisition_loop():
    """
    Reads lines from Arduino: 'ms,raw_value'
    Auto-centers raw ADC, computes envelope/RMS, and binary with hysteresis.
    """
    global running, last_env_value, start_ms, ser
    global baseline_offset, current_binary_state, previous_binary_sample_state

    while running:
        if ser is None or not ser.is_open:
            time.sleep(0.1)
            continue

        try:
            line = ser.readline().decode(errors="ignore").strip()
        except Exception:
            time.sleep(0.01)
            continue

        if not line:
            continue

        parts = line.split(",")
        if len(parts) != 2:
            continue

        try:
            ms = int(parts[0])
            raw_val = int(parts[1])
        except ValueError:
            continue

        if start_ms is None:
            start_ms = ms
        t = (ms - start_ms) / 1000.0
        if t < 0:
            start_ms = ms
            t = 0.0

        # Auto-centering
        raw_baseline_buf.append(raw_val)
        if len(raw_baseline_buf) > 100:
            baseline_offset = float(np.mean(raw_baseline_buf))
        else:
            baseline_offset = 512.0

        emg_raw = (raw_val - baseline_offset) / 512.0
        emg_rect = abs(emg_raw)

        env_buf.append(emg_rect)
        emg_env = sum(env_buf) / len(env_buf)

        rms_buf.append(emg_raw ** 2)
        emg_rms = np.sqrt(sum(rms_buf) / len(rms_buf))

        # Binary with hysteresis
        thr_high = threshold_var.get()
        thr_low = thr_high * 0.7
        if emg_env >= thr_high:
            binary_state = 1
        elif emg_env <= thr_low:
            binary_state = 0
        else:
            binary_state = previous_binary_sample_state

        previous_binary_sample_state = binary_state
        current_binary_state = binary_state

        Data["time"].append(t)
        Data["emg_raw"].append(emg_raw)
        Data["emg_rect"].append(emg_rect)
        Data["emg_env"].append(emg_env)
        Data["emg_rms"].append(emg_rms)
        Data["binary"].append(binary_state)

        last_env_value = emg_env


# ============================================================
# CALIBRATION & TRIAL RECORDING
# ============================================================
def calibrate_rest():
    """
    Measure baseline envelope for ~3 s and set threshold to mean + 3*std.
    """
    def worker():
        global baseline_mean, baseline_std

        calib_samples = []
        calib_duration = 3.0
        t0 = time.time()
        status_label.config(text="Status: Calibrating rest...", foreground="blue")

        while time.time() - t0 < calib_duration and running:
            calib_samples.append(last_env_value)
            time.sleep(0.01)

        if not calib_samples:
            status_label.config(text="Status: Calibration failed (no data)", foreground="red")
            return

        arr = np.array(calib_samples)
        mean = float(arr.mean())
        std = float(arr.std())

        baseline_mean = mean
        baseline_std = std

        new_thr = mean + 3 * std
        threshold_var.set(new_thr)

        baseline_label.config(
            text=f"Baseline: mean={mean:.3f}, std={std:.3f}, thr≈{new_thr:.3f}"
        )
        status_label.config(text="Status: Rest calibration complete", foreground="green")

    threading.Thread(target=worker, daemon=True).start()


def record_flex_trial():
    """
    Save 1 second of data as labeled flex trial with binary column.
    """
    def worker():
        if experiment_folder is None:
            status_label.config(text="Status: Start recording before trials", foreground="red")
            return

        if not Data["time"]:
            status_label.config(text="Status: No data yet for flex trial", foreground="red")
            return

        status_label.config(text="Status: Recording 1s flex trial...", foreground="blue")

        n = min(
            len(Data["time"]),
            len(Data["emg_raw"]),
            len(Data["emg_rect"]),
            len(Data["emg_env"]),
            len(Data["emg_rms"]),
            len(Data["binary"])
        )
        if n == 0:
            status_label.config(text="Status: Flex trial empty (no data)", foreground="red")
            return

        t_arr = np.array(Data["time"][:n], dtype=float)
        raw = np.array(Data["emg_raw"][:n], dtype=float)
        rect = np.array(Data["emg_rect"][:n], dtype=float)
        env = np.array(Data["emg_env"][:n], dtype=float)
        rms = np.array(Data["emg_rms"][:n], dtype=float)
        bin_arr = np.array(Data["binary"][:n], dtype=int)

        t_start = t_arr[-1]
        t_end = t_start + 1.0

        time.sleep(1.05)

        n2 = min(
            len(Data["time"]),
            len(Data["emg_raw"]),
            len(Data["emg_rect"]),
            len(Data["emg_env"]),
            len(Data["emg_rms"]),
            len(Data["binary"])
        )
        if n2 == 0:
            status_label.config(text="Status: Flex trial empty (no data)", foreground="red")
            return

        t_arr = np.array(Data["time"][:n2], dtype=float)
        raw = np.array(Data["emg_raw"][:n2], dtype=float)
        rect = np.array(Data["emg_rect"][:n2], dtype=float)
        env = np.array(Data["emg_env"][:n2], dtype=float)
        rms = np.array(Data["emg_rms"][:n2], dtype=float)
        bin_arr = np.array(Data["binary"][:n2], dtype=int)

        mask = (t_arr >= t_start) & (t_arr <= t_end)
        if not mask.any():
            status_label.config(text="Status: Flex trial empty (mask)", foreground="red")
            return

        t_seg = t_arr[mask]
        raw_seg = raw[mask]
        rect_seg = rect[mask]
        env_seg = env[mask]
        rms_seg = rms[mask]
        bin_seg = bin_arr[mask]

        trials_folder = os.path.join(experiment_folder, "trials")
        os.makedirs(trials_folder, exist_ok=True)
        ts = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        fname = os.path.join(trials_folder, f"flex_trial_{ts}.csv")

        with open(fname, "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["time", "emg_raw", "emg_rect", "emg_env", "emg_rms", "binary_active", "label"])
            for i in range(len(t_seg)):
                w.writerow([
                    float(t_seg[i]),
                    float(raw_seg[i]),
                    float(rect_seg[i]),
                    float(env_seg[i]),
                    float(rms_seg[i]),
                    int(bin_seg[i]),
                    "flex"
                ])

        status_label.config(text=f"Status: Flex trial saved ({os.path.basename(fname)})", foreground="green")

    threading.Thread(target=worker, daemon=True).start()


# ============================================================
# PLOTTING
# ============================================================
def update_plot():
    if running:
        n = min(
            len(Data["time"]),
            len(Data["emg_raw"]),
            len(Data["emg_env"]),
            len(Data["emg_rms"]),
            len(Data["binary"])
        )

        if n > 1:
            if mode_var.get() == "time":
                _plot_time_domain(n)
            else:
                _plot_fft_domain(n)

        root.after(int(1000 / PLOT_RATE_HZ), update_plot)


def _plot_time_domain(n):
    global last_quality_score, motion_artifact_flag, last_peak_env

    t_all = Data["time"][:n]
    current_t = t_all[-1]

    window = window_var.get()
    t_min = current_t - window

    idx_start = next((i for i, tval in enumerate(t_all) if tval >= t_min), 0)

    t = t_all[idx_start:]
    raw = Data["emg_raw"][idx_start:n]
    env = Data["emg_env"][idx_start:n]
    rms = Data["emg_rms"][idx_start:n]
    bin_vals = Data["binary"][idx_start:n]

    ax.clear()
    ax_bin.clear()

    plotted = False

    if var_raw.get():
        ax.plot(t, raw, label="Raw", alpha=0.3)
        plotted = True
    if var_env.get():
        ax.plot(t, env, label="Envelope", linewidth=2)
        plotted = True
    if var_rms.get():
        ax.plot(t, rms, label="RMS", linewidth=2)
        plotted = True

    thr = threshold_var.get()
    if plotted and (var_env.get() or var_rms.get()):
        ax.axhline(thr, color="red", linestyle="--", linewidth=1, label="Threshold")

    if plotted:
        ax.set_title("EMG — Time Domain (Sliding Window)")
        ax.set_ylabel("Normalized amplitude")
        ax.grid(True)
        ax.legend()

    # Binary panel
    if var_binary.get() and len(bin_vals) > 0:
        ax_bin.step(t, bin_vals, where="post")
        ax_bin.set_ylim(-0.2, 1.2)
        ax_bin.set_yticks([0, 1])
        ax_bin.set_yticklabels(["OFF", "ON"])
        ax_bin.set_xlabel("Time (s)")
        ax_bin.set_ylabel("Active")
        ax_bin.grid(True)
    else:
        ax_bin.set_xlabel("Time (s)")
        ax_bin.set_yticks([])
        ax_bin.set_ylabel("")
        ax_bin.grid(False)

    canvas.draw()

    if env:
        env_arr = np.array(env, dtype=float)
        peak = float(env_arr.max())
        drift = float(env_arr.max() - env_arr.min())
        last_peak_env = peak
        motion_artifact_flag = drift > 0.7

        mean = float(env_arr.mean())
        std = float(env_arr.std())
        if std > 1e-6:
            snr = mean / std
            quality = max(0.0, min(100.0, snr * 20.0))
        else:
            quality = 0.0
        last_quality_score = quality

        if last_peak_time is not None:
            dt = time.time() - last_peak_time
            dt_str = f"{dt:.2f} s"
        else:
            dt_str = "N/A"

        metrics_label.config(
            text=f"Peak env (window): {peak:.3f} | "
                 f"Time since last activation: {dt_str} | "
                 f"Motion artifacts: {'YES' if motion_artifact_flag else 'no'}"
        )
        quality_label.config(
            text=f"Signal quality (SNR-based): {quality:.1f}/100"
        )


def _plot_fft_domain(n):
    max_fft_samples = 4096
    start = max(0, n - max_fft_samples)
    raw_seg = np.array(Data["emg_raw"][start:n], dtype=float)
    if raw_seg.size < 32:
        return

    win = np.hanning(raw_seg.size)
    raw_win = raw_seg * win

    Y = np.fft.rfft(raw_win)
    freqs = np.fft.rfftfreq(raw_win.size, d=1.0 / SAMPLE_RATE_HZ)
    mag = np.abs(Y)

    ax.clear()
    ax_bin.clear()

    ax.plot(freqs, mag)
    ax.set_xlim(0, 500)
    ax.set_title("EMG — Frequency Domain (FFT of recent data)")
    ax.set_xlabel("Frequency (Hz)")
    ax.set_ylabel("Magnitude")
    ax.grid(True)

    ax_bin.set_yticks([])
    ax_bin.set_xticks([])
    canvas.draw()


# ============================================================
# PULSE HANDLERS
# ============================================================
def handle_single_flex(now):
    global hand_state, hand_position
    if control_mode_var.get() != "pulse":
        return

    if hand_state == "OPEN":
        hand_state = "CLOSED"
        hand_position = 1.0
    else:
        hand_state = "OPEN"
        hand_position = 0.0

    status_label.config(
        text=f"Status: Single flex -> toggled hand to {hand_state}", foreground="green"
    )


def handle_double_flex(now):
    if control_mode_var.get() != "pulse":
        return
    status_label.config(
        text="Status: Double flex detected (mode-switch event placeholder)",
        foreground="blue"
    )


def handle_long_flex(now):
    global hand_position, hand_state
    if control_mode_var.get() != "pulse":
        return
    hand_position = 0.0
    hand_state = "OPEN"
    status_label.config(
        text="Status: Long flex detected (EMERGENCY STOP - simulated)",
        foreground="red"
    )


def handle_flex_pulse(now):
    global pending_single, pending_single_time
    if control_mode_var.get() != "pulse":
        return

    if pending_single and (now - pending_single_time) >= MIN_DOUBLE_GAP and (now - pending_single_time) <= DOUBLE_WINDOW:
        pending_single = False
        pending_single_time = None
        handle_double_flex(now)
    else:
        pending_single = True
        pending_single_time = now


def check_pending_single(now):
    global pending_single, pending_single_time

    if control_mode_var.get() != "pulse":
        pending_single = False
        return

    if pending_single and (now - pending_single_time) > DOUBLE_WINDOW:
        handle_single_flex(now)
        pending_single = False
        pending_single_time = None


# ============================================================
# ACTIVATION INDICATOR + SERVO & STRENGTH
# ============================================================
def update_activation_indicator():
    global prev_active, last_peak_time, last_peak_env
    global high_start_time, long_flex_triggered, hand_position
    global strength_rest_env, strength_max_env, strength_initialized

    env_val = last_env_value
    thr = threshold_var.get()
    # Use binary state (with hysteresis) as activation
    active = bool(current_binary_state)
    now = time.time()
    dt = 0.05

    # Pulse detection driven by binary state transitions
    if active and not prev_active:
        high_start_time = now
        long_flex_triggered = False
        last_peak_time = now
    if not active and prev_active:
        if high_start_time is not None:
            duration = now - high_start_time
            if duration >= MIN_PULSE_DUR:
                handle_flex_pulse(now)
        high_start_time = None
        long_flex_triggered = False
    if active and high_start_time is not None and not long_flex_triggered:
        if (now - high_start_time) >= LONG_FLEX_DUR:
            handle_long_flex(now)
            long_flex_triggered = True

    prev_active = active
    check_pending_single(now)

    # Indicator
    indicator_frame.config(bg=("green" if active else "darkred"))
    indicator_label.config(
        text=f"Activation: {'ON' if active else 'OFF'} | Env={env_val:.3f} | Thr={thr:.3f}"
    )

    mode = control_mode_var.get()

    # Strength mode
    if mode == "strength":
        if baseline_mean is not None:
            target_rest = baseline_mean
        else:
            target_rest = env_val

        if not strength_initialized:
            strength_rest_env = target_rest
            strength_max_env = target_rest + 0.1
            strength_initialized = True

        if env_val < strength_rest_env:
            strength_rest_env = 0.9 * strength_rest_env + 0.1 * env_val
        else:
            strength_rest_env = 0.995 * strength_rest_env + 0.005 * env_val

        if env_val > strength_max_env:
            strength_max_env = 0.9 * strength_max_env + 0.1 * env_val

        denom = max(0.05, strength_max_env - strength_rest_env)
        strength = (env_val - strength_rest_env) / denom
        strength = max(0.0, min(1.0, strength))

        servo_pct = int(strength * 100)
        servo_bar["value"] = servo_pct

        servo_label.config(text=f"Flex strength (normalized): {servo_pct:3d}%")
        hand_label.config(
            text=f"Strength mode: rest≈{strength_rest_env:.3f}, max≈{strength_max_env:.3f}"
        )

        root.after(50, update_activation_indicator)
        return

    # Pulse / angle / speed
    if mode == "pulse":
        servo_pct = int(hand_position * 100)

    elif mode == "angle":
        if not active:
            hand_position = 0.0
        else:
            gain = 1.5
            hand_position = (env_val - thr) / (thr * gain) if thr > 0 else 0.0
            hand_position = max(0.0, min(1.0, hand_position))
        servo_pct = int(hand_position * 100)

    elif mode == "speed":
        if not active or thr <= 0:
            speed_norm = 0.0
        else:
            gain = 1.5
            speed_norm = (env_val - thr) / (thr * gain)
            speed_norm = max(0.0, min(1.0, speed_norm))

        move_gain = 1.0
        hand_position += speed_norm * move_gain * dt
        if not active:
            hand_position -= 0.25 * dt
        hand_position = max(0.0, min(1.0, hand_position))
        servo_pct = int(hand_position * 100)

    else:
        servo_pct = int(hand_position * 100)

    servo_bar["value"] = servo_pct

    if mode == "pulse":
        hand_label.config(
            text=f"Hand state (pulse): {hand_state} | Pos={servo_pct:3d}%"
        )
        servo_label.config(text=f"Servo output (sim, pulse): {servo_pct:3d}%")
    elif mode == "angle":
        servo_label.config(text=f"Servo output (sim, angle): {servo_pct:3d}%")
        hand_label.config(
            text=f"Hand position (angle): {servo_pct:3d}% (0=open, 100=closed)"
        )
    elif mode == "speed":
        servo_label.config(text=f"Servo output (sim, speed): {servo_pct:3d}%")
        hand_label.config(
            text=f"Hand position (speed): {servo_pct:3d}% (0=open, 100=closed)"
        )

    root.after(50, update_activation_indicator)


# ============================================================
# AUTOSAVE LABEL
# ============================================================
def update_autosave_label():
    if running:
        if last_export_ts is not None:
            elapsed = time.time() - last_export_ts
            remaining = max(0.0, auto_export_interval - elapsed)
            autosave_label.config(
                text=f"Autosave: last {last_export_str or 'N/A'}, next in {remaining:4.1f}s"
            )
        else:
            autosave_label.config(text="Autosave: first save pending...")
    else:
        if last_export_str:
            autosave_label.config(text=f"Autosave: stopped, last {last_export_str}")
        else:
            autosave_label.config(text="Autosave: idle")

    root.after(500, update_autosave_label)


# ============================================================
# HELP POPUP (shortened)
# ============================================================
def open_help_popup():
    help_win = tk.Toplevel(root)
    help_win.title("Help & Instructions")
    help_win.geometry("800x600")

    frame = ttk.Frame(help_win)
    frame.pack(fill="both", expand=True)

    canvas_help = tk.Canvas(frame)
    scrollbar = ttk.Scrollbar(frame, orient="vertical", command=canvas_help.yview)
    scroll_frame = ttk.Frame(canvas_help)

    scroll_frame.bind(
        "<Configure>",
        lambda e: canvas_help.configure(scrollregion=canvas_help.bbox("all"))
    )

    canvas_help.create_window((0, 0), window=scroll_frame, anchor="nw")
    canvas_help.configure(yscrollcommand=scrollbar.set)

    canvas_help.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    help_text = tk.Text(scroll_frame, wrap="word", font=("Segoe UI", 11), height=40)
    help_text.pack(fill="both", expand=True)

    help_message = """
BioCARE EMG Tool — Quick Help

• Use "Start" to auto-detect the Arduino (115200 baud, sending ms,raw).
• The top plot shows EMG (Raw, Envelope, RMS).
• The bottom plot shows Binary activation (0 = OFF, 1 = ON, from hysteresis).

Threshold:
• Controls when EMG is considered ON vs OFF.
• "Calibrate Rest (3s)" measures baseline and sets threshold ~mean+3*std.

Control Modes:
• pulse    — Single/Double/Long flex events for discrete control.
• angle    — Envelope above threshold controls hand position.
• speed    — Envelope above threshold controls how fast the hand closes.
• strength — Flex strength from 0–100% (auto-calibrates rest/max).

Binary:
• Computed from envelope using hysteresis:
    ON if env ≥ threshold
    OFF if env ≤ 0.7 × threshold
  Otherwise it keeps its previous state.
• Stored in CSV as "binary_active".
• Used for stable activation, pulse detection, and for debugging in the lower panel.

Flex Trials:
• "Record Flex Trial (1s)" saves a labeled 1-second window for ML/offline analysis.

Autosave:
• Every X seconds (top left), a CSV is exported to a Desktop/EMG_Experiment_... folder.

For Ava:
• Start with strength mode to see which electrode placement gives the clearest flex.
• Then test pulse mode for reliable single/double/long flex detection.
"""
    help_text.insert("1.0", help_message)
    help_text.config(state="disabled")


# ============================================================
# CONTROL BUTTONS
# ============================================================
def start():
    global running, start_time, experiment_folder, auto_export_interval
    global last_export_ts, last_export_str
    global hand_state, hand_position
    global pending_single, pending_single_time, high_start_time, long_flex_triggered
    global start_ms, strength_initialized
    global previous_binary_sample_state, current_binary_state

    if running:
        return

    if not detect_serial_port():
        return

    running = True
    start_time = time.time()
    experiment_folder = create_experiment_folder()

    for k in Data:
        Data[k].clear()

    last_export_ts = None
    last_export_str = ""
    pending_single = False
    pending_single_time = None
    high_start_time = None
    long_flex_triggered = False
    start_ms = None
    strength_initialized = False
    previous_binary_sample_state = 0
    current_binary_state = 0

    hand_state = "OPEN"
    hand_position = 0.0

    try:
        val = int(export_var.get())
        auto_export_interval = max(1, val)
    except ValueError:
        auto_export_interval = 5

    threading.Thread(target=acquisition_loop, daemon=True).start()
    threading.Thread(target=auto_export_worker, daemon=True).start()

    update_plot()
    status_label.config(text="Status: Running", foreground="green")


def stop():
    global running, ser
    running = False
    time.sleep(0.2)
    export_csv()
    if ser is not None and ser.is_open:
        try:
            ser.close()
        except Exception:
            pass
    status_label.config(text="Status: Stopped", foreground="black")


# ============================================================
# GUI SETUP
# ============================================================
root = tk.Tk()
root.title("BioCARE EMG Tool — Real MyoWare, Pulse/Continuous/Strength + Binary")
root.geometry("1200x860")

top = ttk.Frame(root)
top.pack(fill="x", pady=8)

ttk.Label(top, text="Autosave (s):").pack(side="left", padx=5)
export_var = tk.StringVar(value="5")
ttk.Entry(top, textvariable=export_var, width=6).pack(side="left", padx=5)

ttk.Button(top, text="Start", command=start).pack(side="left", padx=10)
ttk.Button(top, text="Stop", command=stop).pack(side="left", padx=10)
ttk.Button(top, text="Help", command=open_help_popup).pack(side="left", padx=10)

var_raw = tk.BooleanVar(value=True)
var_env = tk.BooleanVar(value=True)
var_rms = tk.BooleanVar(value=True)
var_binary = tk.BooleanVar(value=True)

ttk.Checkbutton(top, text="Show Raw",      variable=var_raw).pack(side="left", padx=10)
ttk.Checkbutton(top, text="Show Envelope", variable=var_env).pack(side="left", padx=10)
ttk.Checkbutton(top, text="Show RMS",      variable=var_rms).pack(side="left", padx=10)
ttk.Checkbutton(top, text="Show Binary",   variable=var_binary).pack(side="left", padx=10)

mode_var = tk.StringVar(value="time")
ttk.Radiobutton(top, text="Time View", variable=mode_var, value="time").pack(side="left", padx=10)
ttk.Radiobutton(top, text="Spectrum View (FFT)", variable=mode_var, value="fft").pack(side="left", padx=5)

window_frame = ttk.Frame(root)
window_frame.pack(fill="x", pady=5)

ttk.Label(window_frame, text="Window Size (seconds):").pack(side="left", padx=5)
window_var = tk.DoubleVar(value=3.0)
tk.Scale(window_frame, variable=window_var, from_=1, to=10,
         orient="horizontal", resolution=0.5, length=300)\
    .pack(side="left", padx=10)

thr_frame = ttk.Frame(root)
thr_frame.pack(fill="x", pady=5)

ttk.Label(thr_frame, text="Activation Threshold (Envelope):").pack(side="left", padx=5)

threshold_var = tk.DoubleVar(value=0.2)
tk.Scale(thr_frame, variable=threshold_var, from_=0.0, to=1.5,
         orient="horizontal", resolution=0.01, length=300)\
    .pack(side="left", padx=10)

indicator_frame = tk.Frame(thr_frame, width=250, height=25, bg="darkred")
indicator_frame.pack(side="left", padx=10)
indicator_frame.pack_propagate(False)

indicator_label = tk.Label(indicator_frame, text="Activation: OFF", fg="white", bg="darkred")
indicator_label.pack(fill="both", expand=True)

ttk.Button(thr_frame, text="Calibrate Rest (3s)", command=calibrate_rest)\
    .pack(side="left", padx=10)
ttk.Button(thr_frame, text="Record Flex Trial (1s)", command=record_flex_trial)\
    .pack(side="left", padx=10)

servo_frame = ttk.Frame(root)
servo_frame.pack(fill="x", pady=5)

ttk.Label(servo_frame, text="Control Mode:").pack(side="left", padx=5)
control_mode_var = tk.StringVar(value="pulse")
ttk.Combobox(
    servo_frame,
    textvariable=control_mode_var,
    values=["pulse", "angle", "speed", "strength"],
    width=12,
    state="readonly"
).pack(side="left", padx=5)
ttk.Label(servo_frame, text="(pulse = events, angle/speed = continuous, strength = flex %)").pack(side="left", padx=5)

ttk.Label(servo_frame, text="Servo Output (sim):").pack(side="left", padx=20)
servo_bar = ttk.Progressbar(servo_frame, orient="horizontal", length=200, mode="determinate", maximum=100)
servo_bar.pack(side="left", padx=10)
servo_label = ttk.Label(servo_frame, text="Servo output:   0%")
servo_label.pack(side="left", padx=10)

hand_label = ttk.Label(servo_frame, text="Hand state (pulse): OPEN | Pos=  0%")
hand_label.pack(side="left", padx=10)

info_frame = ttk.Frame(root)
info_frame.pack(fill="x", pady=5)

baseline_label = ttk.Label(info_frame, text="Baseline: (not calibrated yet)")
baseline_label.pack(side="left", padx=10)

metrics_label = ttk.Label(info_frame, text="Peak env (window): N/A | Time since last activation: N/A | Motion artifacts: N/A")
metrics_label.pack(side="left", padx=10)

quality_label = ttk.Label(info_frame, text="Signal quality (SNR-based): N/A")
quality_label.pack(side="left", padx=10)

status_label = ttk.Label(info_frame, text="Status: Idle", foreground="black")
status_label.pack(side="right", padx=10)

autosave_label = ttk.Label(root, text="Autosave: idle")
autosave_label.pack(fill="x", pady=2, padx=10, anchor="w")

# Two stacked axes: main (3/4 height) + binary (1/4)
fig, (ax, ax_bin) = plt.subplots(
    2, 1,
    figsize=(9, 5),
    gridspec_kw={"height_ratios": [3, 1]},
    sharex=True
)
plt.tight_layout()
canvas = FigureCanvasTkAgg(fig, master=root)
canvas.get_tk_widget().pack(fill="both", expand=True, padx=5, pady=5)

update_activation_indicator()
update_autosave_label()

root.mainloop()
