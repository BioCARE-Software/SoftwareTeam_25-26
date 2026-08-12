# BioCARE EMG PoC

Single-channel bicep EMG → **ADS1115** → burst-count **state machine** on an **ESP32 Dev Module**.

Quick muscle pulses are counted in one burst train. When the train ends, the count becomes a **held state**:

| Bursts | Held state |
|--------|------------|
| 1 | `STATE_1` |
| 2 | `STATE_2` |
| 3 | `STATE_3` |
| 4 | `STATE_4` |

The state stays active until another burst train commits a new state (or you send `0` for idle).

```
MyoWare (bicep SIG) → ADS1115 AIN0 → ESP32 (I2C) → BurstDetector → StateMachine
```

## Hardware

| Part | Notes |
|------|--------|
| ESP32 Dev Module | PlatformIO board `esp32dev` |
| ADS1115 breakout | 16-bit ADC, I2C address `0x48` (ADDR→GND) |
| 1× MyoWare muscle sensor | Envelope / SIG output |
| Electrodes | MID + END on biceps belly, REF on bone (e.g. elbow) |

### Wiring

| From | To |
|------|----|
| MyoWare `SIG` | ADS1115 `AIN0` |
| MyoWare `+` | ESP32 `5V` (or 3V3 if your sensor supports it) |
| MyoWare `GND` | common `GND` |
| ADS1115 `VDD` | ESP32 `3V3` or `5V` (per breakout) |
| ADS1115 `GND` | ESP32 `GND` |
| ADS1115 `SDA` | ESP32 **GPIO21** |
| ADS1115 `SCL` | ESP32 **GPIO22** |
| ADS1115 `ADDR` | `GND` → address **0x48** |

```
                 +5V ---- MyoWare +
                          |
MyoWare SIG -----------> ADS1115 AIN0
MyoWare GND ----+------> ADS1115 GND ---- ESP32 GND
                |        ADS1115 VDD ---- ESP32 3V3/5V
                |        ADS1115 SDA ---- ESP32 GPIO21
                |        ADS1115 SCL ---- ESP32 GPIO22
                |        ADS1115 ADDR --- GND
               GND
```

If you use a 3.5mm AUX / TRS breakout from MyoWare: **Tip→SIG/AIN0**, **Ring→5V**, **Sleeve→GND**.

## Software (PlatformIO / VS Code)

1. Open this folder in VS Code with the PlatformIO extension.
2. Build → Upload → Monitor at **115200**.
3. Relax the arm and send **`c`** to calibrate.
4. Perform 1–4 quick flex pulses. After a short pause, the held state is printed.

### Serial commands

| Command | Action |
|---------|--------|
| `c` | Calibrate resting baseline |
| `t2500` | Set envelope threshold (above baseline) |
| `s` | Print current held state |
| `0` | Reset to `STATE_IDLE` |
| `p` | Toggle plotter / monitor text |
| `h` | Help |

Plotter columns: `env`, `thresh`, `pendingBursts`, `stateId`

## Project layout

```
firmware/proto2/myowareads1115/
  platformio.ini
  include/config.h
  include/ads_emg.h
  include/burst_detector.h
  include/state_machine.h
  src/main.cpp
  README.md
```

## Notes

- This is a research / education PoC for sensing and state encoding only.
- Tune `t####` if bursts are missed or noise triggers false counts.
- States are latched (held) so a later command arbiter / actuator layer can read a stable `StateId`.
