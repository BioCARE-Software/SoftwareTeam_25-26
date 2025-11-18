import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

export default function LiveDataScreen() {
  const router = useRouter();
  const [isLive, setIsLive] = useState(true);
  const [dataType, setDataType] = useState<'EMG' | 'Force'>('EMG');

  // Simulated data
  const emgData = [45, 62, 58, 73, 68, 55, 49, 61];
  const forceData = [120, 145, 138, 162, 155, 141, 128, 150];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SENSOR DATA</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Live Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, isLive && styles.toggleButtonActive]}
            onPress={() => setIsLive(true)}
          >
            <Text style={[styles.toggleText, isLive && styles.toggleTextActive]}>
              Live
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !isLive && styles.toggleButtonActive]}
            onPress={() => setIsLive(false)}
          >
            <Text style={[styles.toggleText, !isLive && styles.toggleTextActive]}>
              Recorded
            </Text>
          </TouchableOpacity>
        </View>

        {/* Data Type Selector */}
        <View style={styles.dataTypeContainer}>
          <TouchableOpacity
            style={[styles.dataTypeButton, dataType === 'EMG' && styles.dataTypeButtonActive]}
            onPress={() => setDataType('EMG')}
          >
            <Text style={[styles.dataTypeText, dataType === 'EMG' && styles.dataTypeTextActive]}>
              EMG
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dataTypeButton, dataType === 'Force' && styles.dataTypeButtonActive]}
            onPress={() => setDataType('Force')}
          >
            <Text style={[styles.dataTypeText, dataType === 'Force' && styles.dataTypeTextActive]}>
              Force
            </Text>
          </TouchableOpacity>
        </View>

        {/* Graph Display */}
        <View style={styles.graphContainer}>
          <View style={styles.graph}>
            <View style={styles.graphGrid}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={styles.gridLine} />
              ))}
            </View>
            
            {/* Simple bar chart */}
            <View style={styles.barsContainer}>
              {(dataType === 'EMG' ? emgData : forceData).map((value, index) => (
                <View key={index} style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${(value / (dataType === 'EMG' ? 100 : 200)) * 100}%`,
                      },
                    ]}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Graph Info */}
          <View style={styles.graphInfo}>
            <Text style={styles.graphLabel}>
              {dataType === 'EMG' ? 'Voltage (mV)' : 'Force (N)'}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Current</Text>
                <Text style={styles.statValue}>
                  {dataType === 'EMG' ? '61' : '150'} {dataType === 'EMG' ? 'mV' : 'N'}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Peak</Text>
                <Text style={styles.statValue}>
                  {dataType === 'EMG' ? '73' : '162'} {dataType === 'EMG' ? 'mV' : 'N'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Export Button */}
        <TouchableOpacity style={styles.exportButton}>
          <Text style={styles.exportButtonText}>EXPORT DATA</Text>
        </TouchableOpacity>
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
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 25,
    padding: 5,
    marginBottom: 25,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#E50000',
  },
  toggleText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  dataTypeContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 25,
  },
  dataTypeButton: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  dataTypeButtonActive: {
    backgroundColor: '#E50000',
    borderColor: '#E50000',
  },
  dataTypeText: {
    color: '#AAAAAA',
    fontSize: 18,
    fontWeight: '600',
  },
  dataTypeTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  graphContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
  },
  graph: {
    height: 250,
    position: 'relative',
    marginBottom: 20,
  },
  graphGrid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: '#2A2A2A',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    gap: 8,
    paddingHorizontal: 5,
  },
  barWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    backgroundColor: '#E50000',
    borderRadius: 4,
    minHeight: 5,
  },
  graphInfo: {
    marginTop: 10,
  },
  graphLabel: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 30,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  exportButton: {
    backgroundColor: '#E50000',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
});