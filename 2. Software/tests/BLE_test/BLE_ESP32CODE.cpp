#include <Arduino.h> 
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#define LED 2 // Built - in LED

// BLE Identifiers
#define SERVICE_UUID "b36ffaec-2ef4-4f92-8240-05877b9d71e6"
#define CHAR_UUID "36e89808-bb82-471d-9791-a2dc10994675"


// BLE Callbacks Class - Manages retrieved data
class MyCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) override
  {
    std::string rxValue = pCharacteristic->getValue(); // Gets string value from tx (python module)

    if (rxValue.length() > 0)
    {
      Serial.print("Received Value: ");
      Serial.println(rxValue.c_str());

      if (rxValue == "LED_ON")
      {
        digitalWrite(LED, HIGH);
        Serial.print("LED turned ON");
      }
      else if (rxValue == "LED_OFF")
      {
        digitalWrite(LED, LOW);
        digitalWrite(LED, LOW);
        Serial.println("LED turned OFF");
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
