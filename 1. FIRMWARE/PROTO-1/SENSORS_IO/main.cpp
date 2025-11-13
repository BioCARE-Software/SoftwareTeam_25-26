#include <Arduino.h>


// Motor Pins
const int motorPinA = 15;
const int motorPinB = 4;
const int motorEn = 16;

// Sensor Pins
const int forceSensorA = 34;
const int forceSensorB = 35;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  pinMode(motorPinA, OUTPUT);
  pinMode(motorPinB, OUTPUT);
  pinMode(motorEn, OUTPUT);

  pinMode(forceSensorA, INPUT);
  pinMode(forceSensorB, INPUT);


}
void loop() {
  // put your main code here, to run repeatedly:


  int sensorAVal = analogRead(forceSensorA);
  int sensorBVal = analogRead(forceSensorB);
  //Serial.println(sensorAVal);

  if (sensorAVal > 4000)
  {
     digitalWrite(motorEn, HIGH);
     digitalWrite(motorPinA, HIGH);
     digitalWrite(motorPinB, LOW); 
  }

  else if (sensorBVal > 4000)
  {
    digitalWrite(motorEn, HIGH);
    digitalWrite(motorPinA, LOW);
    digitalWrite(motorPinB, HIGH);
  }

  else{
        digitalWrite(motorEn, LOW);

  }

  
}