import sys
import qtawesome as qta
from PyQt6.QtWidgets import QApplication, QMainWindow, QWidget, QHBoxLayout, QVBoxLayout, QPushButton, QLabel, QStackedWidget, QListWidget, QFrame, QMessageBox
from PyQt6.QtCore import Qt
from PyQt6.QtGui import QPixmap
import asyncio
from ble_client import BioCareBLEClient

import nest_asyncio
nest_asyncio.apply()

import asyncio
import sys

if sys.platform == "win32":
    # Use Selector loop (compatible with GUI threads)
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
# ── END FIX ──

# Defining CI App Style -> Goal: Notion -esque with BioCare Colors lol
APP_STYLE = """
QWidget {
    background-color: #000000;  /* Main background */
    color: #EAEAEA;             /* Default text */
    font-family: Segoe UI, Arial, sans-serif;
    font-size: 15px;
}

/* Sidebar */
QFrame#sidebar {
    background-color: #0A0A0A;

}

/* Sidebar buttons */
QPushButton {
    background-color: #000000;
    border-radius: 6px;
    padding: 8px 12px;
    text-align: left;
    color: #EAEAEA;
}
QPushButton:hover {
    background-color: #CC0000;   /* Carleton Red on hover */
    border-radius: 6px;
}
QPushButton:pressed {
    background-color: #990000;   /* Darker red on press */
}

/* Titles */
QLabel#title {
    font-size: 20px;
    font-weight: bold;
    color: #CC0000;  /* Carleton red headings */
}

/* Cards / panels */
QFrame#card {
    background-color: #262626;
    border-radius: 8px;
    padding: 12px;
    margin: 8px 0;
}

/* Selected items (lists) */
QListWidget::item:selected {
    background-color: #CC0000;
    color: #FFFFFF;
    border-radius: 6px;
}
"""

class CI_Window(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("BioCare Prosthetic Control Interface v1")
        self.setMinimumSize(1200, 700)
        
        self.ble = BioCareBLEClient()
        
        # Main Containers
        container = QWidget()
        main_layout = QHBoxLayout(container)

        # Side Bar (Navigation)
        sidebar_frame = QFrame()
        sidebar_frame.setObjectName("sidebar")
        sidebar_layout = QVBoxLayout(sidebar_frame)

        # Nav buttons
        self.btn_data     = QPushButton("  Live Sensor Display", icon=qta.icon("mdi.chart-line"))
        self.btn_presets  = QPushButton("  Preset Manager", icon=qta.icon("mdi.bookmark"))
        self.btn_ble      = QPushButton("  BLE Manager", icon=qta.icon("mdi.bluetooth"))
        self.btn_settings = QPushButton("  Settings", icon=qta.icon("mdi.cog"))

        for btn in [self.btn_data, self.btn_presets, self.btn_ble, self.btn_settings]:
            btn.setFixedHeight(50)
            sidebar_layout.addWidget(btn)

        sidebar_layout.addStretch()
        
        # BLE Status & Connect Button
        self.ble_status = QLabel("BLE: Disconnected")
        self.ble_status.setStyleSheet("color: #ff5555; font-weight: bold;")
        sidebar_layout.addWidget(self.ble_status)

        self.btn_ble_connect = QPushButton("Connect BLE")
        self.btn_ble_connect.clicked.connect(self.on_ble_connect)
        sidebar_layout.addWidget(self.btn_ble_connect)

        # Adding BioCare Logo <3
        logo_label = QLabel()
        logo_pixmap = QPixmap("assets/BioCare_logo.png").scaled(120, 120, Qt.KeepAspectRatio, Qt.SmoothTransformation)
        logo_label.setPixmap(logo_pixmap)
        logo_label.setStyleSheet("""
            background: transparent;
            border: none;
        """)
        logo_label.setAlignment(Qt.AlignLeft | Qt.AlignBottom)

        sidebar_layout.addWidget(logo_label)
        
        # ======Testing======
        self.btn_test_send = QPushButton("Test Send 90°")
        self.btn_test_send.clicked.connect(self.send_test)
        sidebar_layout.addWidget(self.btn_test_send)
        
        
        # =========== Build Pages ===============
        self.pages = QStackedWidget()
        
        self.data_page = self.build_data_page()
        self.presets_page = self.build_presets_page()

        # Adding Built Pages as Widget
        self.pages.addWidget(self.data_page)
        self.pages.addWidget(self.presets_page)

        main_layout.addWidget(sidebar_frame, 1)
        main_layout.addWidget(self.pages, 4)

        self.setCentralWidget(container)


        # Connecting Buttons
        self.btn_data.clicked.connect(lambda: self.pages.setCurrentIndex(0)) # Data page as Default
        self.btn_presets.clicked.connect(lambda: self.pages.setCurrentIndex(1)) # Data page as Default
        
    def on_ble_connect(self):
        if self.ble.is_connected:
            asyncio.run(self.ble.disconnect())
            self.ble_status.setText("BLE: Disconnected")
            self.ble_status.setStyleSheet("color: #ff5555;")
            self.btn_ble_connect.setText("Connect BLE")
        else:
            # Run async connect in the current thread safely
            loop = asyncio.get_event_loop()
            future = asyncio.run_coroutine_threadsafe(self.async_connect_ble(), loop)
            future.add_done_callback(self.on_connect_done)
    
    def send_test(self):
        if not self.ble.is_connected:
            QMessageBox.warning(self, "Error", "Connect BLE first!")
            return
        asyncio.create_task(self.ble.send_servo_position(90))
        print("Sent test position 90")

    def on_connect_done(self, future):
        try:
            success = future.result()
            if success:
                self.ble_status.setText("BLE: Connected")
                self.ble_status.setStyleSheet("color: lime;")
                self.btn_ble_connect.setText("Disconnect BLE")
            else:
                self.ble_status.setText("BLE: Failed")
        except Exception as e:
            self.ble_status.setText("BLE: Error")
            print("Connect error:", e)
            
    async def async_connect_ble(self):
        success = await self.ble.connect()
        if success:
            # Start receiving sensor data
            await self.ble.start_notifications(self.update_sensor_display)
        return success

    def update_sensor_display(self, value):
        self.sensor_display.setText(f"Latest sensor value: {value}")
        print(f"GUI updated with sensor: {value}")
                

    # ============ Live Sensor Page (Default) ===============
    def build_data_page(self):
        page = QWidget()
        layout = QVBoxLayout(page)
        layout.setContentsMargins(15, 15, 15, 15)
        layout.setSpacing(15) # Shifts page for sidebar positioning

        title = QLabel("Live Sensor Display")
        title.setAlignment(Qt.AlignmentFlag.AlignHCenter)
        title.setStyleSheet("font-size: 22px; font-weight: bold;")
        layout.addWidget(title)

        # ** Temporary Placeholder for Live Sensor Data
        self.sensor_display = QLabel("Live Sensor Data will be displayed here..... ")
        self.sensor_display.setAlignment(Qt.AlignmentFlag.AlignTop)
        self.sensor_display.setStyleSheet("""
                background-color: #202021;
                color: #ffffff;
                padding: 10px;
                border-radius: 8px;
                font-family: Segoe UI;
            """)
        self.sensor_display.setFixedHeight(500)
        self.sensor_display.setWordWrap(True)
        layout.addWidget(self.sensor_display)

        # Buttons: Toggle Notifications & Export 
        btn_layout = QHBoxLayout()
        self.btn_toggle_notifications = QPushButton("Notifications: ON") # Default State
        self.btn_toggle_notifications.setCheckable(True)
        self.btn_toggle_notifications.setChecked(True)
        self.btn_toggle_notifications.clicked.connect(self.toggle_notifications)

        self.btn_export = QPushButton("Export Data")
        self.btn_export.setFixedHeight(40)

        for btn in [self.btn_toggle_notifications, self.btn_export]:
            btn_layout.addWidget(btn)

        layout.addLayout(btn_layout)
        layout.addStretch()

        return page
        

    def toggle_notifications(self):
        if self.btn_toggle_notifications.isChecked():
            # Notifications Turned ON
            self.btn_toggle_notifications.setText("Notifications: ON")
            self.btn_toggle_notifications.setStyleSheet("""
            background-color: #CC0000;  /* Red */
            color: white;
            border-radius: 6px;
        """)
        
        else:
            # Turned Off Style
            self.btn_toggle_notifications.setText("Notifications: OFF")
            self.btn_toggle_notifications.setStyleSheet("""
            background-color: #202021;  /* Grey */
            color: white;
            border-radius: 6px;
        """)
            

    def build_presets_page(self):
        page = QWidget()
        main_layout = QHBoxLayout(page)
        main_layout.setContentsMargins(15, 15, 15, 15)
        main_layout.setSpacing(25)

        # Center Panel : List of Presets
        left_panel = QFrame()
        left_panel.setObjectName("card")
        left_panel.setStyleSheet("""
        QFrame#card {
            background-color: #2b2b2b;
            border-radius: 12px;
            border: 1px solid #3c3c3c;
        }
        """)

        left_layout = QVBoxLayout(left_panel)
        left_layout.setContentsMargins(15, 15, 15, 15)
        left_layout.setSpacing(15)

        # Title
        title = QLabel("Preset Manager")
        title.setStyleSheet("""
                        background-color: #000000; 
                        font-size: 22px; 
                        font-weight: bold; 
                        color: #ffffff""")
        title.setAlignment(Qt.AlignmentFlag.AlignHCenter)
        left_layout.addWidget(title)

        # Presets Lift (Left Panel)
        self.preset_list = QListWidget()
        self.preset_list.setFixedWidth(375)
        self.preset_list.setStyleSheet("background-color: #000000; border: 1px solid #dcdcdc;")
        left_layout.addWidget(self.preset_list)

        # Buttons -> Create | Edit | Delete
        btn_layout = QHBoxLayout()
        self.btn_create = QPushButton("Create New Preset")
        self.btn_edit = QPushButton("Edit Preset")
        self.btn_delete = QPushButton("Delete Preset")

        for btn in [self.btn_create, self.btn_edit, self.btn_delete]:
            btn.setFixedHeight(35)
            btn_layout.addWidget(btn)
        
        left_layout.addLayout(btn_layout)

        # Rigth Side Panel : Display of Preset Information
        right_panel = QFrame()
        right_panel.setObjectName("card")
        right_layout = QVBoxLayout(right_panel)
        right_layout.setContentsMargins(15, 15, 15, 15)
        right_layout.setSpacing(10)

        gestures_list = QLabel("Preset Details : Gesture Set")
        gestures_list.setStyleSheet("font-size: 18px; font-weight: bold;")
        gestures_list.setAlignment(Qt.AlignmentFlag.AlignHCenter)
        right_layout.addWidget(gestures_list)

        position_values = QLabel("Preset Details: Gesture Motor Positions")
        position_values.setStyleSheet("font-size: 18px; font-weight: bold;")
        position_values.setAlignment(Qt.AlignmentFlag.AlignHCenter)
        right_layout.addWidget(position_values)

        main_layout.addWidget(left_panel, 1)
        main_layout.addWidget(right_panel, 2)
        
        return page
    
    def closeEvent(self, event):
        asyncio.run(self.ble.cleanup())
        super().closeEvent(event)
        
if __name__ == "__main__":
    app = QApplication(sys.argv)
    app.setStyleSheet(APP_STYLE)
    window = CI_Window()
    window.show()
    sys.exit(app.exec())











app = QApplication(sys.argv)
app.setStyleSheet(APP_STYLE)
window = CI_Window()
window.show()
sys.exit(app.exec())