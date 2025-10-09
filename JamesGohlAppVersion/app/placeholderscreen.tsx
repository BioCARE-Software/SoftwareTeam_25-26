import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DefaultScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Default</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                  // Fill the whole screen
    justifyContent: 'center', // Center vertically
    alignItems: 'center',     // Center horizontally
    backgroundColor: '#fff',  // White background
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
