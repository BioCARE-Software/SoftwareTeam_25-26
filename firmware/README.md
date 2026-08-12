# Firmware

Embedded code for prosthetic arm control, sensor input, signal processing, and firmware experiments.

- `proto1/` and `proto2/` contain prototype-specific firmware.
- `proto2/myowareads1115/` is a single-channel MyoWare → ADS1115 → ESP32 burst-count state machine PoC.
- `force-sensors/` contains force sensor data collection and inference work.
- `lowpass-filter/` contains ESP-IDF low-pass filter work.
