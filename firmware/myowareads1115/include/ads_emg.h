#pragma once

#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_ADS1X15.h>
#include "config.h"

/*
  ADS1115 front-end for one MyoWare SIG channel (AIN0).
*/

class AdsEmg {
public:
  bool begin() {
    Wire.begin();  // ESP32: SDA=21, SCL=22
    if (!_ads.begin(ADS_I2C_ADDR)) {
      return false;
    }
    // ±4.096 V covers 0–3.3 V MyoWare envelope with headroom
    _ads.setGain(GAIN_ONE);
    _ads.setDataRate(RATE_ADS1115_860SPS);
    return true;
  }

  int16_t readRaw() {
    return _ads.readADC_SingleEnded(ADS_CHANNEL);
  }

  float toVolts(int16_t counts) {
    return _ads.computeVolts(counts);
  }

private:
  Adafruit_ADS1115 _ads;
};
