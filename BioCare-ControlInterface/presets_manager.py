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

        with open("presets.json", "r") as file:
            data = json.load(file)

        return data.get(name)
    
    def delete_preset(self, name: str):

        with open("presets.json", "r") as file:
            data = json.load(file)

        if name in data:
            del data[name]
            print(f"Preset {name} deleted successfully")
        else:
            print(f"ERROR: Preset {name} not found...")


        with open("presets.json", "w") as file: # Saves update JSON
            json.dump(data, file, indent=4)

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


def CLI():
    pm = PresetManager()

    while True:
        print("=============================")
        print("Welcome to BioCare's Preset Manager...")
        print("What would you like to do? Type 1, 2, or 3....")
        cmd = int(input((" 1. Create a New Preset \n 2. View Existing Presets \n 3. Upload Presets \n 4. Delete a Preset \n 5. Exit \n")))
        

        # =============== Option 1 : Create a New Preset ===================
        if cmd == 1:          
            # Prompt Presets
            print("\n ==== Create a New Preset ====")
            preset_name = input("What would you like to call this preset? ")
            preset = Presets(preset_name)

            while ( len(preset.gestures) < Presets.MAX_GESTURES) :
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

        ## Search Up Existing Preset
        elif cmd == 2:
            preset_target = input("What Preset would you like to lookup? ")
            found = pm.get_preset(preset_target)
            if (found == None):
                print(f"Sorry, there is no Preset by the name {preset_target}")
            
            else:
                print(json.dumps(found))

                print(f"Data for the Preset {found["name"]}")
                gesture_data = found["gestures"]

                i = 0
                for gesture_name, gesture_info in gesture_data.items():
                    print(f"Gesture {i}: {gesture_name}")
                    print(f"\t Finger Positions: {gesture_info['keyframes']}")
                    i += 1

        elif cmd == 4:
            preset_target = input("What Preset would you like to delete? ")
            pm.delete_preset(preset_target)
        
        elif cmd == 5:
            break
            
CLI()