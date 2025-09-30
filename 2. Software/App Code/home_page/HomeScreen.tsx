import React from 'react';
import { useRouter } from 'expo-router';

import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

{/* Note that the routing may not work as it hasn't been tested with the other screens
  the placeholder screen is also not real so there may be navigation bugs*/}
export function HomeScreen() {

  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <Image source={require('/app/home_page/logo.png')} style={styles.logo} />

      {/* Buttons */}
      <TouchableOpacity style={styles.redButton} onPress={() => router.push('/Placeholderscreen')}>
        <Text style={styles.buttonText}>PRESETS</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.redButton} onPress={() => router.push('/manual/slide_control')}>
        <Text style={styles.buttonText}>MANUAL</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.redButton} onPress={() => router.push('/Placeholderscreen')}>
        <Text style={styles.buttonText}>CREATE GESTURE</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.redButton} onPress={() => router.push('/Placeholderscreen')}>
        <Text style={styles.buttonText}>LIVE DATA</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.blackButton} onPress={() =>router.push('/Placeholderscreen')}>
        <Text style={styles.buttonText}>SETTINGS</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
    marginBottom: 40,
    marginTop: 20,
  },
  redButton: {
    backgroundColor: '#e53935',
    paddingVertical: 20,
    borderRadius: 12,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  blackButton: {
    backgroundColor: '#333',
    paddingVertical: 20,
    borderRadius: 12,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
