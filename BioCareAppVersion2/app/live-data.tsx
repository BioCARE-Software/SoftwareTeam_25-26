import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function LiveData() {
  return (
    <View style={styles.container}>
      {/* Back Arrow + Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <Text style={styles.backArrow}>←</Text>
        <View>
          <Text style={styles.liveText}>Live</Text>
          <Text style={styles.sensorDataText}>SENSOR DATA</Text>
        </View>
      </View>

      {/* Graph Card */}
      <View style={styles.graphCard}>
        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: "#3fa7df" }]} />
            <Text style={styles.legendLabel}>EMG</Text>
            <View style={[styles.legendDot, { backgroundColor: "#d33c32", marginLeft: 18 }]} />
            <Text style={styles.legendLabel}>Force</Text>
          </View>
        </View>
        {/* Fake graphified lines - replace with a chart library later */}
        <View style={styles.graphLines}>
          <View style={[styles.line, { borderColor: "#3fa7df", height: 62 }]} />
          <View style={[styles.line, { borderColor: "#d33c32", height: 40, top: 35 }]} />
        </View>
      </View>

      {/* Export Data Button */}
      <TouchableOpacity style={styles.exportBtn}>
        <Text style={styles.exportText}>EXPORT DATA</Text>
      </TouchableOpacity>
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
  liveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 26,
    marginBottom: -5,
  },
  sensorDataText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 38,
  },
  graphCard: {
    backgroundColor: "#fff",
    borderRadius: 34,
    marginTop: 32,
    marginBottom: 24,
    alignSelf: "center",
    width: "93%",
    height: 310,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 24,
  },
  legend: {
    position: "absolute",
    top: 18,
    right: 30,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 15,
    height: 15,
    borderRadius: 8,
    marginRight: 6,
  },
  legendLabel: {
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 8,
    color: "#222",
  },
  graphLines: {
    flex: 1,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    top: 70,
  },
  line: {
    position: "absolute",
    left: 0,
    right: 0,
    borderWidth: 6,
    borderRadius: 6,
    top: 0,
  },
  exportBtn: {
    backgroundColor: "#d33c32",
    borderRadius: 28,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    width: "90%",
    alignSelf: "center",
  },
  exportText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 26,
  },
});
