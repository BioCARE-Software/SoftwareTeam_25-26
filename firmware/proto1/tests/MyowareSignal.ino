/*
 * Myoware Muscle Sensor - Simple ON/OFF Threshold Detector
 * For prosthetic limb gesture control
 * 
 * WIRING:
 * Connect AUX cord to myoware
 * Connect other end of AUX to the TRS breakout
 * TRS breakout wiring on breadboard to Arduino: SLEEVE -> GND, RING1 -> 5V, TIP -> A0 (Or analog input pin used)
 * 
 * COMMANDS:
 * Enter "c" in the terminal to calibrate muscle signal
 * Enter "t" in terminal to set a new threshold (0-999)
 */

// Pin definitions
const int SENSOR_PIN = A0;       // Myoware signal output pin
const int LED_PIN = 13;          // Built-in LED for visual feedback

// Threshold settings
int threshold = 500;             // Adjust this value (0-1023)
const int HYSTERESIS = 50;       // Prevents flickering at threshold boundary

// Debouncing settings
const unsigned long DEBOUNCE_TIME = 50;  // milliseconds
unsigned long lastChangeTime = 0;

// State variables
bool muscleActive = false;
bool lastState = false;

// Smoothing variables
const int NUM_READINGS = 10;     // Number of readings to average
int readings[NUM_READINGS];      // Array to store readings
int readIndex = 0;               // Current position in array
int total = 0;                   // Running total
int average = 0;                 // Averaged value

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
  
  // Initialize smoothing array
  for (int i = 0; i < NUM_READINGS; i++) {
    readings[i] = 0;
  }
  
  Serial.println("Myoware Muscle Sensor - Threshold Detector");
  Serial.println("=========================================");
  Serial.println("Commands:");
  Serial.println("  't###' - Set threshold (e.g., t400)");
  Serial.println("  'c' - Calibrate (find resting baseline)");
  Serial.println("=========================================");
  Serial.println();
  
  delay(1000);
  Serial.println("Ready! Flex your muscle to test.");
  Serial.println();
}

void loop() {
  // Read and smooth the sensor value
  int rawValue = analogRead(SENSOR_PIN);
  
  // Subtract oldest reading and add new one
  total = total - readings[readIndex];
  readings[readIndex] = rawValue;
  total = total + readings[readIndex];
  readIndex = (readIndex + 1) % NUM_READINGS;
  
  // Calculate average
  average = total / NUM_READINGS;
  
  // Apply hysteresis to prevent flickering
  if (!muscleActive && average > threshold + HYSTERESIS) {
    // Check debounce time
    if (millis() - lastChangeTime > DEBOUNCE_TIME) {
      muscleActive = true;
      lastChangeTime = millis();
    }
  } 
  else if (muscleActive && average < threshold - HYSTERESIS) {
    // Check debounce time
    if (millis() - lastChangeTime > DEBOUNCE_TIME) {
      muscleActive = false;
      lastChangeTime = millis();
    }
  }
  
  // Output state change
  if (muscleActive != lastState) {
    lastState = muscleActive;
    
    if (muscleActive) {
      Serial.println(">>> MUSCLE ON <<<");
      digitalWrite(LED_PIN, HIGH);
    } else {
      Serial.println(">>> MUSCLE OFF <<<");
      digitalWrite(LED_PIN, LOW);
    }
  }
  
  // Continuous output for monitoring
  Serial.print("Raw: ");
  Serial.print(rawValue);
  Serial.print(" | Smoothed: ");
  Serial.print(average);
  Serial.print(" | Threshold: ");
  Serial.print(threshold);
  Serial.print(" | State: ");
  Serial.println(muscleActive ? "ON" : "OFF");
  
  // Check for serial commands
  if (Serial.available() > 0) {
    char command = Serial.read();
    
    // Set threshold command
    if (command == 't') {
      int newThreshold = Serial.parseInt();
      if (newThreshold >= 0 && newThreshold <= 1023) {
        threshold = newThreshold;
        Serial.print("Threshold set to: ");
        Serial.println(threshold);
      }
    }
    
    // Calibration command
    if (command == 'c') {
      calibrate();
    }
  }
  
  delay(50);  // Adjust for desired update rate
}

// Calibration function to find resting baseline
void calibrate() {
  Serial.println("\n--- CALIBRATION MODE ---");
  Serial.println("Relax your muscle for 3 seconds...");
  delay(1000);
  
  long sum = 0;
  int samples = 60;  // 3 seconds at 50ms delay
  
  for (int i = 0; i < samples; i++) {
    sum += analogRead(SENSOR_PIN);
    delay(50);
  }
  
  int baseline = sum / samples;
  threshold = baseline + 100;  // Set threshold above baseline
  
  Serial.print("Baseline: ");
  Serial.print(baseline);
  Serial.print(" | New threshold: ");
  Serial.println(threshold);
  Serial.println("--- CALIBRATION COMPLETE ---\n");
}