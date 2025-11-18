import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

export default function SettingsScreen() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleFindDevice = () => {
    setIsSearching(true);
    // Simulate device search
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SETTINGS</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Connection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Connection</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Enable Connect</Text>
              <Text style={styles.settingDescription}>
                Allow app to connect to BioCARE device
              </Text>
            </View>
            <Switch
              value={isConnected}
              onValueChange={setIsConnected}
              trackColor={{ false: '#2A2A2A', true: '#E50000' }}
              thumbColor={isConnected ? '#FFFFFF' : '#999999'}
            />
          </View>

          {isConnected && (
            <View style={styles.deviceContainer}>
              <View style={styles.deviceInfo}>
                <View style={styles.deviceStatus}>
                  <View style={[styles.statusDot, isSearching && styles.statusDotSearching]} />
                  <Text style={styles.deviceText}>
                    {isSearching ? 'Searching...' : 'No device connected'}
                  </Text>
                </View>
                {!isSearching && (
                  <Text style={styles.deviceSubtext}>
                    Tap "Find Device" to scan for available devices
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={[styles.findButton, isSearching && styles.findButtonDisabled]}
                onPress={handleFindDevice}
                disabled={isSearching}
              >
                <Text style={styles.findButtonText}>
                  {isSearching ? 'Searching...' : 'Find Device'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>Notifications</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>Data Management</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>About</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>BioCARE App</Text>
          <Text style={styles.infoVersion}>Version 1.0.0</Text>
          <Text style={styles.infoText}>
            Prosthetic control interface for advanced gesture recognition and sensor data monitoring.
          </Text>
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
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  settingDescription: {
    color: '#666666',
    fontSize: 13,
    fontWeight: '400',
  },
  deviceContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
  },
  deviceInfo: {
    marginBottom: 20,
  },
  deviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#666666',
    marginRight: 10,
  },
  statusDotSearching: {
    backgroundColor: '#E50000',
  },
  deviceText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deviceSubtext: {
    color: '#666666',
    fontSize: 13,
    fontWeight: '400',
    marginLeft: 20,
  },
  findButton: {
    backgroundColor: '#E50000',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  findButtonDisabled: {
    backgroundColor: '#666666',
  },
  findButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 20,
    marginBottom: 12,
  },
  settingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  settingArrow: {
    color: '#666666',
    fontSize: 24,
    fontWeight: '300',
  },
  infoSection: {
    backgroundColor: '#0A0A0A',
    borderRadius: 15,
    padding: 25,
    marginBottom: 40,
    alignItems: 'center',
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 5,
  },
  infoVersion: {
    color: '#E50000',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 15,
  },
  infoText: {
    color: '#666666',
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
  },
});
