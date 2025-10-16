import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function PresetsScreen() {
  const [presets, setPresets] = useState([]);

  // Load presets on startup
  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      const stored = await AsyncStorage.getItem("presets");
      if (stored) setPresets(JSON.parse(stored));
    } catch (error) {
      console.error("Failed to load presets:", error);
    }
  };

  const savePresets = async (newPresets) => {
    try {
      await AsyncStorage.setItem("presets", JSON.stringify(newPresets));
    } catch (error) {
      console.error("Failed to save presets:", error);
    }
  };

  const handleNewPreset = () => {
    Alert.prompt(
      "New Preset",
      "Enter a name for your new preset:",
      (text) => {
        if (text && text.trim() !== "") {
          const newPresets = [...presets, text.trim()];
          setPresets(newPresets);
          savePresets(newPresets);
        }
      }
    );
  };

  const handleDeletePreset = (index) => {
    const newPresets = presets.filter((_, i) => i !== index);
    setPresets(newPresets);
    savePresets(newPresets);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>PRESETS</Text>
      </View>

      {/* Preset List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {presets.length === 0 ? (
          <Text style={{ color: "gray", textAlign: "center", marginTop: 50 }}>
            No presets yet. Press “New Preset” to create one.
          </Text>
        ) : (
          presets.map((preset, index) => (
            <View key={index} style={styles.presetCard}>
              <Text style={styles.presetText}>{preset}</Text>
              <TouchableOpacity onPress={() => handleDeletePreset(index)}>
                <Ionicons name="trash" size={20} color="black" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* New Preset Button */}
      <TouchableOpacity style={styles.newPresetButton} onPress={handleNewPreset}>
        <Text style={styles.newPresetText}>New Preset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginLeft: 10,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  presetCard: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  presetText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  newPresetButton: {
    backgroundColor: "red",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  newPresetText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
