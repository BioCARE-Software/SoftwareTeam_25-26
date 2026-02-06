#include <Arduino.h> 
#include <BLEDevice.h>
#include <BLEServer.h>
#include <string>

// BLE Identifiers
#define SERVICE_UUID "b36ffaec-2ef4-4f92-8240-05877b9d71e6"
#define CHAR_UUID "36e89808-bb82-471d-9791-a2dc10994675"

const int LED = 2;

// BLE Callbacks Class - Manages retrieved data
class MyCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) override // onWrite : rx function for BLE communication
  {
    std::string rxValue = pCharacteristic->getValue(); // Gets string value from tx (python module)

      if (rxValue.length() == 4) // ensuring 4-bytes for 32 bit int
      {
        int32_t rxData = *(int32_t*)rxValue.data(); // Re - interprets byte -> int
        Serial.println("Data Recieved: ");
        Serial.println(rxData);

        if (rxData > 90)
        {
          digitalWrite(LED, HIGH);
        }

        else
        {
          digitalWrite(LED, LOW);
        }

      }

  }

};

void setup() {
  Serial.begin(115200);
  pinMode(LED, OUTPUT);

  BLEDevice::init("BioCare_ProstheticESP32");
  BLEServer *pServer = BLEDevice::createServer(); // Initializes server

  BLEService *pService = pServer->createService(SERVICE_UUID);
  BLECharacteristic *pCharacteristic = pService->createCharacteristic(CHAR_UUID, BLECharacteristic::PROPERTY_WRITE);

  pCharacteristic->setCallbacks(new MyCallbacks());
  pService->start(); // starts BLE Service

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  BLEDevice::startAdvertising();

  Serial.print("BLE Receiver is read and advertising...");

}

void loop() {
}