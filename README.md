# BioCare Prosthetic Control Interface

A PyQt6 desktop GUI for controlling and monitoring a BLE-enabled prosthetic arm powered by ESP32.

**Current status**:  
- GUI layout works  
- BLE connection to ESP32 works (scan → connect → send test positions)  
- Test send (90°) works (triggers ESP32 logic)  

## Features (Implemented)
- Modern dark Notion-style UI with sidebar navigation  
- BLE connection / disconnection with status indicator  
- Test command sending (90° servo position)  
- Placeholder pages: Live Sensor Display, Preset Manager  

## Planned / To-Do
- Add real sliders for finger/thumb control  
- Display live sensor values in "Live Sensor Display"  
- Save/load gesture presets  
- Notifications from ESP32 (sensor data streaming)  
- Export sensor data to file  

## Prerequisites

- **Python 3.10–3.12**  
  Download: https://www.python.org/downloads/  
  Recommended: 3.11 or 3.12

- **Visual Studio Code**  
  Download: https://code.visualstudio.com/

- **VS Code Extensions** (install via Extensions sidebar):
  - PlatformIO IDE (for ESP32 firmware)
  - Python (by Microsoft)
  - Pylance (optional, better Python support)

- **Hardware**:
  - ESP32 development board (with BLE support)
  - USB cable (for programming & power)
  - Optional: onboard LED on GPIO2 for testing, servos/sensors

## Installation & Setup Steps (All-in-One)

### Step 1: Clone or Download the Repository

```bash
git clone https://github.com/yourusername/BioCare-ControlInterface.git
cd BioCare-ControlInterface
```

### Step 2: Create & Activate Virtual Environment

```PowerShell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

or

```macOS / Linux:
python3 -m venv .venv
source .venv/bin/activate
```

### Step 3: Install All Required Python Packages

```bash
pip install PyQt6 qtawesome bleak nest_asyncio
```

### Step 4: Verify Folder Structure

Have this folder strucutre:

```text
BioCare-ControlInterface/
├── GUI.py               # Main application file
├── ble_client.py        # BLE connection logic
├── assets/              # Folder for images
│   └── BioCare_logo.png # (optional logo)
├── .venv/               # Virtual environment
└── ... (other files)
```

### Step 5: Run the GUI

```bash
python GUI.py
```

-------------------------------------------------------------------------------------------------------------------------------------------------
This is still a work in progress
