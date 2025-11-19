#include <Servo.h>
#include <Arduino.h>

Servo finger;

int emgSensorValue = 0;
int filteredValue = 0;

int previousState = 0;
int lastThreePoints[3] = {0, 0, 0};
int numberOfEncounteredPoints = 0;

const int lowerThreshold = 200;
const int upperThreshold = 500;     

void setup() {
    pinMode(A0, INPUT);   
    finger.attach(8);     
    Serial.begin(9600);
}

void loop() {
    emgSensorValue = analogRead(A0);
    filteredValue = binaryFilter(emgSensorValue, lowerThreshold, upperThreshold);

    Serial.println(emgSensorValue + " "+ filteredValue);

    if (filteredValue) {
        finger.write(0); 
    } else {
        finger.write(180);   
    }
    
    delay(50);  
}

void updateWindow(int value) {
    lastThreePoints[0] = lastThreePoints[1];
    lastThreePoints[1] = lastThreePoints[2];
    lastThreePoints[2] = value;
}

/*
* Performs a binary filter based on upper and lower thresholds and the previous state.
*/
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
    previousState = 0;
    return 0;
  }

  // Upper threshold
  if (lastThreePoints[0] > upperThreshold &&
      lastThreePoints[1] > upperThreshold &&
      lastThreePoints[2] > upperThreshold) 
  {
    previousState = 1;
    return 1;
  }

  // Otherwise hold last value
  return previousState;
}
