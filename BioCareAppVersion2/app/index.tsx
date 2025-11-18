import { Link } from "expo-router";
import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

export default function HomeScreen() {
  return (
   <View style={{ flex:1, justifyContent:"center", alignItems:"center", backgroundColor: "#111" }}>
      {"BIOCARE APP"}
      <Image
        source={require("./assets/biocare-logo.png")}
        style={{ width: 170, height: 160, marginBottom: 24 }}
        resizeMode="contain"
        />

      <Text style={{ color: "#ffff", fontSize: 47, fontWeight:     "bold" }}>
        BioCare Home
         </Text>

      <Link href="/presets" asChild>
        <TouchableOpacity style={styles.button}>
          <Text>PRESETS</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/create-gesture" asChild>
        <TouchableOpacity style={styles.button}>
          <Text>CREATE GESTURE</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/live-data" asChild>
        <TouchableOpacity style={styles.button}>
          <Text>LIVE DATA</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/settings" asChild>
        <TouchableOpacity style={styles.button}>
          <Text>SETTINGS</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff8f8ff" },
  header: { fontSize: 32, fontWeight: "bold", marginBottom: 40 },
  button: { padding: 20, margin: 10, backgroundColor: "#E50000", borderRadius: 20 }
});
