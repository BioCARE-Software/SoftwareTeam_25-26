import { Link } from 'expo-router';
import * as React from 'react';
//import * as Link from 'expo-router/link';
//import * as Link from 'expo-linking';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Logo with red heartbeat line */}
      <View style={styles.logoContainer}>
        <View style={styles.heartbeatLine} />
        <Text style={styles.logoB}>B</Text>
        <Text style={styles.logoText}>BioCARE</Text>
      </View>

      {/* Menu Buttons */}
      <View style={styles.buttonsContainer}>
        <Link href="/presets" asChild>
          <TouchableOpacity style={styles.redButton}>
            <Text style={styles.buttonText}>PRESETS</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/create-gesture" asChild>
          <TouchableOpacity style={styles.redButton}>
            <Text style={styles.buttonText}>CREATE GESTURE</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/live-data" asChild>
          <TouchableOpacity style={styles.redButton}>
            <Text style={styles.buttonText}>LIVE DATA</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.buttonText}>SETTINGS</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartbeatLine: {
    position: 'absolute',
    top: '47%',
    width: 160,
    height: 10,
    backgroundColor: '#E50000',
    borderRadius: 5,
  },
  logoB: {
    fontSize: 200,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -8,
  },
  logoText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 8,
    marginTop: 10,
  },
  buttonsContainer: {
    paddingHorizontal: 50,
    paddingBottom: 100,
    gap: 22,
  },
  redButton: {
    backgroundColor: '#E50000',
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E50000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 20,
  },
  settingsButton: {
    backgroundColor: '#111111',
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 2,
  },
});