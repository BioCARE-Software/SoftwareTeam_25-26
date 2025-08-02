#include <ESP32Servo.h>

Servo myServo;
const int FORCE_SENSOR = 15;


/* This program will turn a servo motor a set amount of incraments, based off 
  how long a force is applied to the sensor. Sensor value of 0 is max force applied.
  Any force < max force (ie. > 0) will cause motor to reverse
*/

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  myServo.attach(18);
}

void loop() {
  // put your main code here, to run repeatedly:
  int sensorVal = analogRead(FORCE_SENSOR);
  int incraments = 5;
  myServo.write(0);
  
  Serial.println(sensorVal);

  for (int servoAngle = 0; sensorVal == HIGH; servoAngle += incraments)
  {
    if (servoAngle >= 180)
    {
      incrament = 0;
      myServo.write(servoAngle);
    }
    else
    {
      myServo.write(servoAngle);
    }
    
  }


}
