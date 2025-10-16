const int numLEDs = 5;                        
const int pinLEDs[numLEDs] = {2, 3, 4, 5, 6}; 
const int EMGPin = A0;                        

int thresholds[numLEDs] = {100, 200, 300, 400, 500};

void setup() {
  for (int i = 0; i < numLEDs; i++) {
    pinMode(pinLEDs[i], OUTPUT);
    digitalWrite(pinLEDs[i], LOW);
  }
  Serial.begin(9600);
}

void loop() {
  int sensorVal = analogRead(EMGPin);
  Serial.println(sensorVal); 

  for (int i = 0; i < numLEDs; i++) {
    if (sensorVal > thresholds[i]) {
      digitalWrite(pinLEDs[i], HIGH);
    } else {
      digitalWrite(pinLEDs[i], LOW);
    }
  }

  delay(50); 
}
