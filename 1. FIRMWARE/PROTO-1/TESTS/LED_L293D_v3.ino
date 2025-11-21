// ===== BioCARE EMG + Motor + LED Bar =====
// Sends EMG to Python in format: "<millis>,<raw>\n"

#define VIBRATION_PIN_1 9
#define VIBRATION_PIN_2 10
#define EMG_SENSOR A0

int latchPin = 2;
int clockPin = 3;
int dataPin = 4;

int numLEDs = 5;
int startPin = 3;
bool ledState[5] = { false, false, false, false, false };
int upperThresholds[5] = { 200, 300, 400, 500, 600 };
int lowerThresholds[5] = { 150, 250, 350, 450, 550 };

const int motorAPin1 = 6;
const int motorAPin2 = 7;
const int motorAEn = 5;

const int motorBPin1 = 9;
const int motorBPin2 = 10;
const int motorBEn = 11;

int sensor = 0;
bool state = false;

const int TH_high = 300;
const int TH_low = 100;

void setup() {
  pinMode(latchPin, OUTPUT);
  pinMode(clockPin, OUTPUT);
  pinMode(dataPin, OUTPUT);

  pinMode(motorAPin1, OUTPUT);
  pinMode(motorAPin2, OUTPUT);
  pinMode(motorAEn, OUTPUT);

  pinMode(motorBPin1, OUTPUT);
  pinMode(motorBPin2, OUTPUT);
  pinMode(motorBEn, OUTPUT);

  Serial.begin(115200);   // IMPORTANT: Python requires 115200
}

void loop() {

  // ====== 1) READ EMG ======
  sensor = analogRead(EMG_SENSOR);

  // ====== 2) SEND EMG TO PYTHON ======
  // Python expects:  "<millis>,<raw>"
  unsigned long ms = millis();
  Serial.print(ms);
  Serial.print(',');
  Serial.println(sensor);

  // ====== 3) LED BAR PROCESSING ======
  byte leds = 0;

  for (int i = 0; i < numLEDs; i++) {
    if (!ledState[i] && sensor > upperThresholds[i]) {
      ledState[i] = true;
    } else if (ledState[i] && sensor < lowerThresholds[i]) {
      ledState[i] = false;
    }

    if (ledState[i]) {
      leds |= (1 << (i + startPin));
    }
  }

  digitalWrite(latchPin, LOW);
  shiftOut(dataPin, clockPin, MSBFIRST, leds);
  digitalWrite(latchPin, HIGH);

  // ====== 4) MOTOR DIRECTION CONTROL ======
  if (sensor > TH_high) {
    state = true;
  } else if (sensor < TH_low) {
    state = false;
  }

  if (state) {
    digitalWrite(motorAPin1, HIGH);
    digitalWrite(motorAPin2, LOW);
    analogWrite(motorAEn, 255);

    digitalWrite(motorBPin1, HIGH);
    digitalWrite(motorBPin2, LOW);
    analogWrite(motorBEn, 255);
  } else {
    digitalWrite(motorAPin1, LOW);
    digitalWrite(motorAPin2, HIGH);
    analogWrite(motorAEn, 255);

    digitalWrite(motorBPin1, LOW);
    digitalWrite(motorBPin2, HIGH);
    analogWrite(motorBEn, 255);
  }

  delay(1);  // small delay for stability
}
