/*
  Myoware Muscle Sensor - Simple ON/OFF Threshold Detector
  For prosthetic limb gesture control
  
  WIRING:
  Connect AUX cord to myoware
  Connect other end of AUX to the TRS breakout
  TRS breakout wiring on breadboard to Arduino: SLEEVE -> GND, RING1 -> 5V, TIP -> A0 (Or analog input pin used)
  
  COMMANDS:
  Enter "c" in the terminal to calibrate muscle signal
  Enter "t" in terminal to set a new threshold (0-999)
  Enter "p" in terminal to toggle between Plotter and Monitor mode
 */

const int SENSOR_PIN = A0; 
const int LED_PIN = 13;

int threshold = 500;             // Adjust value (0-1023)
const int HYSTERESIS = 50;   

const unsigned long DEBOUNCE_TIME = 50;
unsigned long lastChangeTime = 0;

bool muscleActive = false;
bool lastState = false;
bool plotterMode = true;

const int NUM_READINGS = 10;     
int readings[NUM_READINGS];
int readIndex = 0;
int total = 0;
int average = 0;
void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
  
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
  delay(2000);
}

void loop() {
  int rawValue = analogRead(SENSOR_PIN);
  
  total = total - readings[readIndex];
  readings[readIndex] = rawValue;
  total = total + readings[readIndex];
  readIndex = (readIndex + 1) % NUM_READINGS;
  
  average = total / NUM_READINGS;
  
  if (!muscleActive && average > threshold + HYSTERESIS) {
    if (millis() - lastChangeTime > DEBOUNCE_TIME) {
      muscleActive = true;
      lastChangeTime = millis();
    }
  } 
  else if (muscleActive && average < threshold - HYSTERESIS) {
    if (millis() - lastChangeTime > DEBOUNCE_TIME) {
      muscleActive = false;
      lastChangeTime = millis();
    }
  }
  
  if (muscleActive != lastState) {
    lastState = muscleActive;
    
    if (muscleActive) {
      if (!plotterMode) Serial.println(">>> MUSCLE ON <<<");
      digitalWrite(LED_PIN, HIGH);
    } else {
      if (!plotterMode) Serial.println(">>> MUSCLE OFF <<<");
      digitalWrite(LED_PIN, LOW);
    }
  }
  
  // Continuous output — switches format based on plotterMode
  if (plotterMode) {
    Serial.print(rawValue);
    Serial.print("\t");
    Serial.print(average);
    Serial.print("\t");
    Serial.println(threshold);
  } else {
    Serial.print("Raw: ");
    Serial.print(rawValue);
    Serial.print(" | Smoothed: ");
    Serial.print(average);
    Serial.print(" | Threshold: ");
    Serial.print(threshold);
    Serial.print(" | State: ");
    Serial.println(muscleActive ? "ON" : "OFF");
  }
  
  // Check for serial commands
  if (Serial.available() > 0) {
    char command = Serial.read();
    
    // Set threshold command
    if (command == 't') {
      int newThreshold = Serial.parseInt();
      if (newThreshold >= 0 && newThreshold <= 1023) {
        threshold = newThreshold;
        if (!plotterMode) {
          Serial.print("Threshold set to: ");
          Serial.println(threshold);
        }
      }
    }
    
    // Calibration command
    if (command == 'c') {
      calibrate();
    }
    
    // Toggle plotter/monitor mode
    if (command == 'p') {
      plotterMode = !plotterMode;
      Serial.print("Mode: ");
      Serial.println(plotterMode ? "PLOTTER" : "MONITOR");
    }
  }
  
  delay(50);
}

void calibrate() {
  Serial.println("\n--- CALIBRATION MODE ---");
  Serial.println("Relax your muscle for 3 seconds...");
  delay(1000);
  
  long sum = 0;
  int samples = 60; 
  for (int i = 0; i < samples; i++) {
    sum += analogRead(SENSOR_PIN);
    delay(50);
  }
  
  int baseline = sum / samples;
  threshold = baseline + 100;
  
  Serial.print("Baseline: ");
  Serial.print(baseline);
  Serial.print(" | New threshold: ");
  Serial.println(threshold);
  Serial.println("--- CALIBRATION COMPLETE ---\n");
}