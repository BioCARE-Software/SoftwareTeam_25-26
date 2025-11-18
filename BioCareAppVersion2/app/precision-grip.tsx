import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Slider } from "react-native";
import { Link } from "expo-router";

export default function PrecisionGripGesture() {
  const [finger1, setFinger1] = useState(50);
  const [finger2, setFinger2] = useState(50);
  const [finger3, setFinger3] = useState(50);
  const [thumb, setThumb] = useState(50);
  const [gestureName, setGestureName] = useState("");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <Text style={styles.backArrow}>←</Text>
        <View>
          <Text style={styles.newText}>New</Text>
          <Text style={styles.gestureText}>GESTURE</Text>
        </View>
      </View>

      {/* Sliders Card */}
      <View style={styles.sliderCard}>
        <SliderRow label="Finger 1" val={finger1} setVal={setFinger1} />
        <SliderRow label="Finger 2" val={finger2} setVal={setFinger2} />
        <SliderRow label="Finger 3" val={finger3} setVal={setFinger3} />
        <SliderRow label="Thumb" val={thumb} setVal={setThumb} />
      </View>

      {/* Gesture Name */}
      <Text style={styles.gestureNameLabel}>Gesture Name</Text>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Gesture Name"
          placeholderTextColor="#bbb"
          value={gestureName}
          onChangeText={setGestureName}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveText}>Save Gesture</Text>
      </TouchableOpacity>
    </View>
  );
}

// Slider row component
function SliderRow({ label, val, setVal }: { label: string; val: number; setVal: (x: number) => void }) {
  return (
    <View style={styles.sliderRow}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <Slider
        value={val}
        onValueChange={setVal}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor="#d33c32"
        maximumTrackTintColor="#444"
        thumbTintColor="#d33c32"
        style={styles.slider}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingHorizontal: 16,
    paddingTop: 42,
  },
  backArrow: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginRight: 14,
    marginTop: 8,
  },
  newText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: -5,
  },
  gestureText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 38,
  },
  sliderCard: {
    backgroundColor: "#222",
    borderRadius: 36,
    marginVertical: 22,
    padding: 18,
  },
  sliderRow: {
    marginBottom: 18,
  },
  sliderLabel: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 2,
  },
  slider: {
    width: "100%",
    height: 36,
    marginTop: 2,
  },
  gestureNameLabel: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 6,
    marginBottom: 6,
  },
  inputBox: {
    backgroundColor: "#222",
    borderRadius: 18,
    marginBottom: 22,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  input: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    padding: 4,
  },
  saveBtn: {
    backgroundColor: "#d33c32",
    borderRadius: 26,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 26,
  },
});
