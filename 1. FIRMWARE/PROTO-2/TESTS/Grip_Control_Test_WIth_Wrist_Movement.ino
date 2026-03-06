#include <Servo.h>


int servoPin = A2;
int touchSensor = A5;
Servo myServo;

// --- Wrist servo ---
int wristPin = A3;
Servo wristServo;
int wristPos = 90;
const int WRIST_MIN = 0;
const int WRIST_MAX = 180;
const int WRIST_STEP = 30;

int forceVal;
int servoPos = 0;


// --- Force Thresholds ---
const int FORCE_LIGHT = 100;
const int FORCE_MEDIUM = 200;
const int FORCE_HEAVY = 300;


// --- Timing and State Variables ---
unsigned long previousMillis = 0;
int stepDelay = 15;


// Replaced the auto-looping boolean with a command-driven state
bool isGrippingCommand = false;


void setup() {
 pinMode(13, OUTPUT);
  // We MUST enable Serial to read keyboard commands
 Serial.begin(115200);
 Serial.println("System Ready. Send 'g' to GRIP, 'r' to RETRACT, 'a' wrist left, 'd' wrist right, 'c' wrist center.");
  myServo.attach(servoPin);
 myServo.write(servoPos);
 wristServo.attach(wristPin);
 wristServo.write(wristPos);
}


void loop() {
 digitalWrite(13, LOW);
  // --- Check for Keyboard Commands ---
 // If you type something into the Serial Monitor, read it
 if (Serial.available() > 0) {
   char incomingChar = Serial.read();
  
   if (incomingChar == 'g' || incomingChar == 'G') {
     isGrippingCommand = true;
     Serial.println("Command received: GRIPPING / HOLDING");
   }
   else if (incomingChar == 'r' || incomingChar == 'R') {
     isGrippingCommand = false;
     Serial.println("Command received: RETRACTING");
   }
   else if (incomingChar == 'a' || incomingChar == 'A') {
     wristPos -= WRIST_STEP;
     if (wristPos < WRIST_MIN) wristPos = WRIST_MIN;
     wristServo.write(wristPos);
     Serial.print("Wrist left: ");
     Serial.println(wristPos);
   }
   else if (incomingChar == 'd' || incomingChar == 'D') {
     wristPos += WRIST_STEP;
     if (wristPos > WRIST_MAX) wristPos = WRIST_MAX;
     wristServo.write(wristPos);
     Serial.print("Wrist right: ");
     Serial.println(wristPos);
   }
   else if (incomingChar == 'c' || incomingChar == 'C') {
     wristPos = 90;
     wristServo.write(wristPos);
     Serial.println("Wrist center: 90");
   }
 }


 // Read the ADC sensor instantly on every single loop
 forceVal = analogRead(touchSensor);
 unsigned long currentMillis = millis();


 // --- GRIP AND HOLD STATE ---
 if (isGrippingCommand) {
  
   // IMMEDIATE OVERRIDE: Stop moving if resistance is heavy
   if (forceVal >= FORCE_HEAVY) {
     // Hold position. Update the timer so it doesn't jump forward if force drops.
     previousMillis = currentMillis;
   }
   else {
     // Dynamic Speeds (Only calculated if we are safe to move)
     int stepSize = 0;
    
     if (forceVal >= FORCE_MEDIUM) {
       stepSize = 1;
       stepDelay = 40;  // Very slow, tight grip
     }
     else if (forceVal >= FORCE_LIGHT) {
       stepSize = 3;
       stepDelay = 20;  // Slowing down as contact  made
     }
     else {
       stepSize = 8;
       stepDelay = 15;  // Extremely fast closing speed through empty air
     }


     // Movement Execution
     if (currentMillis - previousMillis >= stepDelay) {
       previousMillis = currentMillis;


       if (servoPos < 180) {
         servoPos += stepSize;
        
         if (servoPos > 180) {
           servoPos = 180;
         }
        
         myServo.write(servoPos);
       }
      
       // Note: The auto-reset logic has been entirely removed.
       // If it reaches 180, or hits FORCE_HEAVY, it will just hold
       // that position indefinitely until 'r' is pressed.
     }
   }
 }
  // --- RETRACT STATE ---
 else {
   // If commanded to retract, instantly snap back to 0 degrees
   if (servoPos != 0) {
     servoPos = 0;
     myServo.write(servoPos);
   }
 }
}