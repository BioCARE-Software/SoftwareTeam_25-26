import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function PresetsScreen() {
  const router = useRouter();

  const presets = [
    { id: 1, name: 'Utility', selected: true },
    { id: 2, name: 'Strength', selected: false },
    { id: 3, name: 'Sport', selected: false },
    { id: 4, name: 'Custom', selected: false },
  ];

  const gestures = [
    'Lateral Grip',
    'Precision Grip',
    'Point Gesture',
    'OK Gesture',
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PRESETS</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Preset Categories */}
        <View style={styles.presetsContainer}>
          {presets.map((preset) => (
            <TouchableOpacity
              key={preset.id}
              style={[
                styles.presetButton,
                preset.selected && styles.presetButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.presetText,
                  preset.selected && styles.presetTextSelected,
                ]}
              >
                {preset.name}
              </Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.newPresetButton}>
            <Text style={styles.newPresetText}>+ New Preset</Text>
          </TouchableOpacity>
        </View>

        {/* Current Selection */}
        <View style={styles.selectionBox}>
          <Text style={styles.gestureTitle}>Lateral Grip</Text>
          <Text style={styles.gestureSubtitle}>UTILITY</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Gesture Set:</Text>
          {gestures.map((gesture, index) => (
            <Text key={index} style={styles.gestureItem}>
              {gesture}
            </Text>
          ))}
          
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>EDIT SET</Text>
          </TouchableOpacity>
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
  presetsContainer: {
    marginBottom: 30,
  },
  presetButton: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  presetButtonSelected: {
    backgroundColor: '#E50000',
    borderColor: '#E50000',
  },
  presetText: {
    color: '#AAAAAA',
    fontSize: 18,
    fontWeight: '600',
  },
  presetTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  newPresetButton: {
    backgroundColor: '#0A0A0A',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E50000',
    borderStyle: 'dashed',
  },
  newPresetText: {
    color: '#E50000',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectionBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
  },
  gestureTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5,
  },
  gestureSubtitle: {
    color: '#E50000',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#333333',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 15,
  },
  gestureItem: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    paddingLeft: 10,
  },
  editButton: {
    backgroundColor: '#E50000',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});