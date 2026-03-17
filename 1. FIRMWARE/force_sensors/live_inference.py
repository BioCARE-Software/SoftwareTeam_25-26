import serial
import numpy as np
import pandas as pd
import joblib
from scipy.signal import butter, filtfilt
from collections import deque

# config
PORT        = '/dev/ttyUSB0'
BAUD        = 115200
FS          = 200
WINDOW_SIZE = 60

# load trained model and normalization params 
saved      = joblib.load('gesture_classifier.pkl')
clf        = saved['model']
global_min = saved['global_min']
global_max = saved['global_max']
print(f"Model loaded. Normalization range: {global_min:.2f} to {global_max:.2f}")
print("Ctrl+C to stop\n")

# filter
def lowpass(data, fs=FS, high=10):
    b, a = butter(4, high, btype='low', fs=fs)
    return filtfilt(b, a, data)

def normalize_with_training_params(data):
    return (data - global_min) / (global_max - global_min + 1e-6)

# feature extraction
def extract_features(window):
    slope = np.polyfit(range(len(window)), window, 1)[0]
    return {
        'mean':         np.mean(window),
        'max':          np.max(window),
        'min':          np.min(window),
        'std':          np.std(window),
        'range':        np.max(window) - np.min(window),
        'slope':        slope,
        'energy':       np.sum(np.square(window)),
        'median':       np.median(window),
        'peak_to_peak': np.max(window) - np.min(window),
        'rms':          np.sqrt(np.mean(np.square(window))),
        'skewness':     pd.Series(window).skew(),
        'kurtosis':     pd.Series(window).kurt()
    }

buffer = deque(maxlen=WINDOW_SIZE * 10)  # large rolling buffer
last_prediction = None
sample_count = 0

with serial.Serial(PORT, BAUD, timeout=1) as ser:
    ser.reset_input_buffer()
    while True:
        try:
            line = ser.readline().decode('utf-8', errors='ignore').strip()
            if line and line.isdigit():
                buffer.append(int(line))
                sample_count += 1

                # wait for buffer to fill, then predict every 20 new samples
                if len(buffer) >= WINDOW_SIZE and sample_count % 20 == 0:
                    window     = np.array(list(buffer)[-WINDOW_SIZE:])
                    filtered   = lowpass(window)
                    normalized = normalize_with_training_params(filtered)
                    features   = extract_features(normalized)
                    X_live     = pd.DataFrame([features])

                    prediction = clf.predict(X_live)[0]
                    confidence = np.max(clf.predict_proba(X_live)) * 100

                    marker = " <--" if prediction != last_prediction else ""
                    print(f"Gesture: {prediction:12s} | Confidence: {confidence:.1f}%{marker}")
                    last_prediction = prediction

        except KeyboardInterrupt:
            print("\nStopped.")
            break
