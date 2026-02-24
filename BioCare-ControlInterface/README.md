# BioCare-PROTO-ControlInterface
GUI devloped in Python to communicate with an ESP32 controlled prosthetic arm using BLE. 

--------------How to Run the Code------------

#Step 1:

Clone the github repo and clone it to your vscode or prefered IDE

#Step 2:

Go on the ```BioCare_Appv2_python``` branch

#Step 3:

Install the following packages from python (also in your env you've created):

```pip install py```
```pip install PyQt6```
```pip install qtawesome```
```pip install platformio```
```pio run --target clean```
```pip install --upgrade platformio```
```pio project init --ide vscode```
```pio platform install espressif32 --force```
```pio pkg install```
```pip install pyqt6 bleak pyinstaller```
```pip install bleak```
```pip install nest_asyncio```
```pip install nest_asyncio bleak pyqt6 qtawesome```

then create a .venv -- this is a virtual environment


#Step 4:


Install the extension: 
```Platformio```
```Arduino```
```Arduino Community Edition```

#Step 5:

Open this project in the Platformio extension
![alt text](image.png)

#Step 6: 

To run code use this: ```pio run```
or
Press ```Ctrl + Shift + P``` to open a list of commands
Search for ```PlatformIO: Build``` to build the project -- a tempCodeRunnerFile should appear when you are building the project

or to run the GUI only
```python GUI.py```


### Are you having trouble with your BLE connecting to your computer?
#Step 1:
Connect the ESP32 to your computer via a wire 

#Step 2: 
Press ```windows + X``` then go to ```device manager```

#Step 3:
Scroll down to ```Ports```
There should be a PORT/COM connected to your computer, note that number ```USB-SERIAL-CH340```

#Step 4:
Go to VS Code and open the extention ```Platformio``` and go to ```devices```

~~~If nothing is showing up for you, unplug for 30 seconds and try again~~~

#Step 5:
Select correct COM

#Step 6:
At the bottom of your screen, there should be a very small plug icon (2 prongs). Click it and select your COM port.

#Step 7:
Go to ```SERIAL MONITOR``` and selec Baud rate = 115200



## Other Helpful commands 

```pio device monitor``` -- helps with checking what PORT your ESP32 is connected to via a cord