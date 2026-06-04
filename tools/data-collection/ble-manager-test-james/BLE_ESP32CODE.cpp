#include <Arduino.h> 
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLE2902.h>


// BLE Identifiers
#define SERVICE_UUID "b36ffaec-2ef4-4f92-8240-05877b9d71e6"
#define RX_CHAR_UUID "36e89808-bb82-471d-9791-a2dc10994675"

//for sending to python
#define TX_CHAR_UUID "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"


//Global tx characterists
BLECharacteristic *txCharacteristic = nullptr;


//helper send message to Python
void sendMessage(const String &msg) {
  //Serial.println("attemp to send esp to python");

  if (txCharacteristic) {
    txCharacteristic->setValue(msg.c_str());
    txCharacteristic->notify();
  }
}
// BLE Callbacks Class - Manages retrieved data
class MyCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) override // onWrite : rx function for BLE communication
  {
    std::string rxValue = pCharacteristic->getValue(); // Gets string value from tx (python module)
    if (rxValue.empty()) return;


    String recieved_message = String(rxValue.c_str()); // convert the bytes to a string
    Serial.println("Recieved String is: " + recieved_message);
    int servo_angle = recieved_message.toInt();
    //Serial.print("Servo angle: ");
    //Serial.println(servo_angle);

    //digitalWrite(2, servo_angle > 90 ? HIGH : LOW);


    // SEND RESPONSE BACK TO PYTHON
    delay(50);
    sendMessage("TEST esp to python: " );

  }

};



void setup() {
  Serial.begin(115200);
  pinMode(2, OUTPUT);
  //myServo.attach(servoPin);

  

  BLEDevice::init("BioCare_ProstheticESP32");
  BLEServer *pServer = BLEDevice::createServer(); // Initializes server

  BLEService *pService = pServer->createService(SERVICE_UUID);


  // RX characteristic (Python → ESP32)
  BLECharacteristic *rxCharacteristic = pService->createCharacteristic(
    RX_CHAR_UUID,
    BLECharacteristic::PROPERTY_WRITE
  );
  rxCharacteristic->setCallbacks(new MyCallbacks());

  // TX characteristic (ESP32 → Python)
  txCharacteristic = pService->createCharacteristic(
    TX_CHAR_UUID,
    BLECharacteristic::PROPERTY_NOTIFY | BLECharacteristic::PROPERTY_READ
  );
  txCharacteristic->addDescriptor(new BLE2902());  // REQUIRED for notify

 // pCharacteristic->setCallbacks(new MyCallbacks());
  pService->start(); // starts BLE Service

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  BLEDevice::startAdvertising();

  Serial.print("BLE Receiver is read and advertising...");

  



}

void loop() {
}