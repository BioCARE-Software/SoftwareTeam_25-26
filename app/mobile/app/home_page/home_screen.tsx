import { useRouter } from 'expo-router';
import React from 'react';

import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('./logo.png')} style={styles.logo} />
      <TouchableOpacity style={styles.redButton} onPress={() => router.push('/presets')}>
        <Text style={styles.buttonText}>PRESETS</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.redButton} onPress={() => router.push('/manual/slide_control')}>
        <Text style={styles.buttonText}>MANUAL</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.redButton}
        onPress={() =>
          router.push({ pathname: '/placeholderscreen', params: { feature: 'Create Gesture' } })
        }>
        <Text style={styles.buttonText}>CREATE GESTURE</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.redButton}
        onPress={() =>
          router.push({ pathname: '/placeholderscreen', params: { feature: 'Live Data' } })
        }>
        <Text style={styles.buttonText}>LIVE DATA</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.blackButton}
        onPress={() =>
          router.push({ pathname: '/placeholderscreen', params: { feature: 'Settings' } })
        }>
        <Text style={styles.buttonText}>SETTINGS</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

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
