import json

class fingerPosition:
    def __init__(self, positions: list):
        """positions = [0, 0, 180, 0, 0]
        - Using a list to easily map iteration with motors after BLE comm.
        """
        self.positions = positions
            
    def to_list(self):
        return self.positions
    

class Gesture:
    def __init__(self, name: str):
        self.name = name
        self.keyframes: list[fingerPosition] =[]

    def add_keyframe(self, finger_pos = fingerPosition):
        """"Adds finger_positions <list> to a gesture"""
        self.keyframes.append(finger_pos)

    def remove_keyframe(self, index: int):
        if 0 <= index < len(self.keyframes):
            self.keyframes.pop(index) # Removes gesture list from index

    def to_dict(self):
        """Gesture <dict> as {"Gesture_name": [finger_positions]}"""
        return {
            "name": self.name,
            "keyframes": [kf.to_list() for kf in self.keyframes]

        }
    
class Presets:

    MAX_GESTURES = 3

    def __init__(self, name: str):
        self.name = name
        self.gestures: dict[str, Gesture] = {} # Creates a dict of {"Preset": {"Gesture1": [Positions]}, ....""}

    def add_gesture(self, gesture: Gesture):
        if len(self.gestures) >= Presets.MAX_GESTURES:
            raise ValueError(f"Preset {self.name} already has the maximum of 3 gestures")
        
        self.gestures[gesture.name] = gesture

    def remove_gesture(self, gesture_name: str):
        if gesture_name in self.gestures:
            del self.gestures[gesture_name] # Deletes gestures set from Presets

    def get_gesture(self, gesture_name: str):
        return self.gestures.get(gesture_name)
    
    def to_dict(self):
        return {
            "name": self.name,
            "gestures": {
                name: g.to_dict() for name, g in self.gestures.items()
            }

        }
    
class PresetManager:
    def __init__(self):
        self.presets: dict [str, Presets] = {}
    
    def create_preset(self, name: str) -> Presets:
        preset = Presets(name)
        self.presets[name] = preset
        return preset
    
    def get_preset(self, name: str):
        return self.presets.get(name)
    
    def delete_preset(self, name: str):
        if name in self.presets:
            del self.presets[name]

    def save_to_file(self, filepath: str):
        data = {
            name: preset.to_dict()
            for name, preset in self.presets.items()

        }
        with open(filepath, "w") as file: # Adds file to .json file
            json.dump(data, file, indent=4)

    def load_from_file(self, filepath, str):
        with open(filepath, "r") as file:
            data = json.load(file)

        for name, preset_data in data.items():
            preset = Presets(name)
            for gesture_name, gesture_data in preset_data["gestures"].items():
                gesture = Gesture(gesture_name)
                for kf in gesture_data["keyframes"]:
                    finger_pos = fingerPosition(kf)
                    gesture.add_keyframe(finger_pos)
                preset.add_gesture(gesture)
            self.presets[name] = preset


def CLI_createPreset():
    print("\n ==== Create a New Preset ====")
    preset_name = input("What would you like to call this preset? ")

    preset = Presets(preset_name)
    pm = PresetManager()

    while True:
        if len(preset.gestures) >= Presets.MAX_GESTURES:
            print("\n Max number of gestures reached. ")
            break

        gesture_name = input("\nPlease enter a gesture name (or type done if you no longer want to upload a new gesture):   ")
        if gesture_name.lower() == "done":
            break

        gesture = Gesture(gesture_name)

        # Add keyframes / Finger Positions
        fingerPos_lst = [180, 180, 180, 180, 180] # Default 180 for all (Open Hand) 
        for fingers in range(0, 5): # Prompts 5 Finger positions, based on following index: 0 - Thumb, 1 - Index, 2 - Middle, 3 - Ring, 4 - Pinky
            fingerPos = int(input(f"Motor Position for Finger {fingers} : "))
            fingerPos_lst[fingers] = fingerPos
            
        gesture.add_keyframe(fingerPosition(fingerPos_lst))
        preset.add_gesture(gesture)
        
    

    save = int(input("Would you like to save this Preset? 1 - Yes | 2 - No "))
    if (save == 1):
        pm.presets[preset_name] = preset
        pm.save_to_file("presets.json")

    
    return preset


cmd = int(input("Would you like to create a new gesture? 1 - Yes | 2 - No :  "))

if (cmd == 1):
    CLI_createPreset()
else:
    print("Wah Wah Wah")

