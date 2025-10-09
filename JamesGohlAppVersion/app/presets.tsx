import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For back arrow and menu dots

export default function PresetsScreen() {
  const presets = ["Utility", "Strength", "Sport", "Custom"];

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
        {presets.map((preset, index) => (
          <View key={index} style={styles.presetCard}>
            <Text style={styles.presetText}>{preset}</Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={20} color="black" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* New Preset Button */}
      <TouchableOpacity style={styles.newPresetButton}>
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
