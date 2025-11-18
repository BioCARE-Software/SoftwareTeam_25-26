import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

export default function CreateGestureScreen() {
  const router = useRouter();
  const [gestureName, setGestureName] = useState('');
  const [fingerStates, setFingerStates] = useState({
    finger1: false,
    finger2: false,
    finger3: false,
    thumb: false,
  });

  const toggleFinger = (finger: keyof typeof fingerStates) => {
    setFingerStates(prev => ({
      ...prev,
      [finger]: !prev[finger],
    }));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GESTURE</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Save Gesture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.newButton]}>
            <Text style={styles.actionButtonText}>New</Text>
          </TouchableOpacity>
        </View>

        {/* Gesture Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gesture Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Gesture Name"
            placeholderTextColor="#666666"
            value={gestureName}
            onChangeText={setGestureName}
          />
        </View>

        {/* Hand Diagram */}
        <View style={styles.handContainer}>
          <Text style={styles.sectionTitle}>Select Fingers</Text>
          <View style={styles.handDiagram}>
            {/* Simple hand representation */}
            <View style={styles.fingersRow}>
              <TouchableOpacity
                style={[styles.finger, fingerStates.finger1 && styles.fingerActive]}
                onPress={() => toggleFinger('finger1')}
              >
                <Text style={styles.fingerText}>1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.finger, fingerStates.finger2 && styles.fingerActive]}
                onPress={() => toggleFinger('finger2')}
              >
                <Text style={styles.fingerText}>2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.finger, fingerStates.finger3 && styles.fingerActive]}
                onPress={() => toggleFinger('finger3')}
              >
                <Text style={styles.fingerText}>3</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.thumb, fingerStates.thumb && styles.fingerActive]}
              onPress={() => toggleFinger('thumb')}
            >
              <Text style={styles.fingerText}>Thumb</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Finger Labels */}
        <View style={styles.fingerLabels}>
          <View style={styles.labelItem}>
            <View style={[styles.labelDot, fingerStates.finger1 && styles.labelDotActive]} />
            <Text style={styles.labelText}>Finger 1</Text>
          </View>
          <View style={styles.labelItem}>
            <View style={[styles.labelDot, fingerStates.finger2 && styles.labelDotActive]} />
            <Text style={styles.labelText}>Finger 2</Text>
          </View>
          <View style={styles.labelItem}>
            <View style={[styles.labelDot, fingerStates.finger3 && styles.labelDotActive]} />
            <Text style={styles.labelText}>Finger 3</Text>
          </View>
          <View style={styles.labelItem}>
            <View style={[styles.labelDot, fingerStates.thumb && styles.labelDotActive]} />
            <Text style={styles.labelText}>Thumb</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '300',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 2,
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#E50000',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  newButton: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E50000',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  handContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  handDiagram: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
  },
  fingersRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },
  finger: {
    width: 60,
    height: 100,
    backgroundColor: '#2A2A2A',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444444',
  },
  thumb: {
    width: 80,
    height: 80,
    backgroundColor: '#2A2A2A',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444444',
  },
  fingerActive: {
    backgroundColor: '#E50000',
    borderColor: '#E50000',
  },
  fingerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fingerLabels: {
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  labelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  labelDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#444444',
    marginRight: 15,
  },
  labelDotActive: {
    backgroundColor: '#E50000',
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});