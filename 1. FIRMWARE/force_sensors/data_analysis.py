import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

files = {
    'rest':      './data/data_rest.csv',
    'position1': './data/data_position1.csv',
    'position2': './data/data_position2.csv',
    'position3': './data/data_position3.csv',
    # 'position4': './data/data_position4.csv'
}

FS = 200  # sample rate in Hz

# --- Figure 1: Time Domain ---
# fig1, axes1 = plt.subplots(5, 1, figsize=(12, 8))
fig1, axes1 = plt.subplots(4, 1, figsize=(12, 8))
for ax, (label, file) in zip(axes1, files.items()):
    df = pd.read_csv(file)
    ax.plot(df['timestamp_ms'], df['raw_value'])
    ax.set_title(label)
    ax.set_ylabel('ADC value')
fig1.suptitle('Time Domain', fontsize=14)
plt.tight_layout()

# --- Figure 2: Frequency Domain ---
# fig2, axes2 = plt.subplots(5, 1, figsize=(12, 8))
fig2, axes2 = plt.subplots(4, 1, figsize=(12, 8))
for ax, (label, file) in zip(axes2, files.items()):
    df = pd.read_csv(file)
    signal = df['raw_value'].values

    n = len(signal)
    freqs = np.fft.rfftfreq(n, d=1/FS)
    magnitude = np.abs(np.fft.rfft(signal))

    ax.plot(freqs, magnitude)
    ax.set_title(f'{label} spectrum')
    ax.set_ylabel('Magnitude')
    ax.set_xlabel('Frequency (Hz)')
    ax.set_xlim(0, 50)  # zoom into 0-50Hz, where your signal lives
    ax.axvline(x=0.5, color='r', linestyle='--', linewidth=1, label='HPF (0.5Hz)')
    ax.axvline(x=10,  color='g', linestyle='--', linewidth=1, label='LPF (10Hz)')
    ax.axvline(x=60,  color='orange', linestyle='--', linewidth=1, label='Notch (60Hz)')
    ax.legend(loc='upper right', fontsize=7)

fig2.suptitle('Frequency Domain', fontsize=14)
plt.tight_layout()

plt.show()
