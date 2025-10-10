#include <Servo.h>

Servo finger;

int sensorValue = 0;
bool state = false;  

const int TH_high = 450;  
const int TH_low = 350;   

void setup() {
  pinMode(A0, INPUT);   
  finger.attach(8);     
  Serial.begin(9600);
}

void loop() {
  sensorValue = analogRead(A0);
  Serial.println(sensorValue);


  if (sensorValue > TH_high) {
    state = true;   
  } else if (sensorValue < TH_low) {
    state = false;  
  }

  if (state) {
    finger.write(0); 
  } else {
    finger.write(180);   
  }

  delay(50);  
}

