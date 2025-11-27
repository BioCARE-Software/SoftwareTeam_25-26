#include <Servo.h>

Servo finger;

int emgSensorValue = 0;
int filteredValue = 0;

int previousState = 0;
int lastThreePoints[3] = {0, 0, 0};
int numberOfEncounteredPoints = 0;

const int lowerThreshold = 200;
const int upperThreshold = 500; 

unsigned long lastCheckTime = 0;

void setup() {
    pinMode(A0, INPUT);   
    finger.attach(8);     
    Serial.begin(115200);
    pinMode(11,OUTPUT);
    pinMode(9,OUTPUT);
    pinMode(10,OUTPUT);
}

void updateWindow(int value) {
    lastThreePoints[0] = lastThreePoints[1];
    lastThreePoints[1] = lastThreePoints[2];
    lastThreePoints[2] = value;
}

int binaryFilter(int value, int lowerThreshold, int upperThreshold) {
  if (numberOfEncounteredPoints < 3) {
    lastThreePoints[numberOfEncounteredPoints] = value;
    numberOfEncounteredPoints++;
    previousState = 0;
    return 0;
  }

  updateWindow(value);

  // Lower threshold
  if (lastThreePoints[0] < lowerThreshold &&
      lastThreePoints[1] < lowerThreshold &&
      lastThreePoints[2] < lowerThreshold) 
  {
    // if (previousState != 0) delay(10); debounce when switching may not be needed
    previousState = 0;
    return 0;
  }

  // Upper threshold
  if (lastThreePoints[0] > upperThreshold &&
      lastThreePoints[1] > upperThreshold &&
      lastThreePoints[2] > upperThreshold) 
  {
    // if (previousState != 1) delay(10); debounce when switching may not be needed
    previousState = 1;
    return 1;
  }

  // Otherwise hold last value
  return previousState; 
}


void loop() {
    emgSensorValue = analogRead(A0);
    filteredValue = binaryFilter(emgSensorValue, lowerThreshold, upperThreshold);
    
    unsigned long currentTime = micros();
    unsigned long elapsedTime = currentTime - lastCheckTime;
    lastCheckTime = currentTime;


    Serial.print(elapsedTime);
    Serial.print("  ");
    Serial.print(emgSensorValue);
    Serial.print(" ");
    Serial.println(filteredValue);

    if (filteredValue) {
        finger.write(0); 
    } else {
        finger.write(180);   
    }
    
    delay(30);  
}