import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";

export default function SensorDataScreen() {
  const screenWidth = Dimensions.get("window").width;

  const data = {
    labels: [],
    datasets: [
      {
        data: [10, 15, 25, 10, 30, 20],
        color: () => "#4fc3f7", // EMG line color
        strokeWidth: 5,
      },
      {
        data: [15, 20, 10, 30, 15, 10],
        color: () => "#ef5350", // Force line color
        strokeWidth: 5,
      },
    ],
    legend: ["EMG", "Force"],
  };

  return (
    <View style={styles.container}>
      <Ionicons name="arrow-back" size={30} color="white" style={styles.backIcon} />

      <View style={styles.header}>
        <Text style={styles.liveText}>Live</Text>
        <Text style={styles.title}>SENSOR DATA</Text>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          width={screenWidth * 0.85}
          height={350}
          withDots={false}
          withInnerLines={false}
          chartConfig={{
            backgroundColor: "#000",
            backgroundGradientFrom: "#000",
            backgroundGradientTo: "#000",
            color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
            labelColor: () => "#fff",
          }}
          bezier
          style={{ borderRadius: 20 }}
        />
      </View>

      {/* --- Buttons Section --- */}
      <TouchableOpacity style={styles.exportButton}>
        <Text style={styles.exportText}>EXPORT DATA</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveText}>SAVE DATA</Text>
      </TouchableOpacity>

       <TouchableOpacity style={styles.anotherButton}>
        <Text style={styles.anotherText}>ANOTHER DATA</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    paddingTop: 30,
  },
  backIcon: {
    position: "absolute",
    top: 20,
    left: 25,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  liveText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "900",
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 15,
    marginBottom: 30,
  },
  exportButton: {
    backgroundColor: "#d50f0f",
    paddingVertical: 15,
    paddingHorizontal: 55,
    borderRadius: 10,
    marginBottom: 20,
  },
  exportText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  saveButton: {
    backgroundColor: "#d50f0f", // Blue
    paddingVertical: 15,
    paddingHorizontal: 70,
    borderRadius: 10,
    marginBottom: 20,
  },
  saveText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
   anotherButton: {
    backgroundColor: "#d50f0f", // Blue
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginBottom: 20,
  },
  anotherText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
});
