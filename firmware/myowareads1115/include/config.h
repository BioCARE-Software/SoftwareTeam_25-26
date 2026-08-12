#pragma once

#include <Arduino.h>

/*
  BioCARE PoC — single MyoWare (bicep) via external ADS1115 on ESP32 Dev.
*/

// ---------- I2C / ADS1115 ----------
// ESP32 default I2C: SDA=21, SCL=22
static const uint8_t ADS_I2C_ADDR = 0x48;  // ADDR pin -> GND
static const uint8_t ADS_CHANNEL  = 0;     // AIN0 <- MyoWare SIG

// ---------- Status LED ----------
static const uint8_t PIN_LED = 2;  // DevKit onboard LED
static const bool LED_ACTIVE_HIGH = true;

// ---------- Sampling ----------
#ifndef BIOCARE_SAMPLE_HZ
#define BIOCARE_SAMPLE_HZ 100
#endif
static const uint16_t SAMPLE_HZ   = BIOCARE_SAMPLE_HZ;
static const uint8_t  SMOOTH_N    = 6;

// ---------- Spike / burst detection ----------
// Envelope threshold above resting baseline (ADS1115 counts @ GAIN_ONE).
// MyoWare SIG ~0–3.3 V; tune after calibration with serial 't'.
static int16_t g_thresh = 2500;
static const int16_t  HYSTERESIS     = 400;
static const uint16_t BURST_WINDOW_MS = 450;  // wait for next burst
static const uint16_t REFRACTORY_MS   = 180;  // min time between bursts
static const uint8_t  MAX_BURSTS      = 4;

// ---------- Held operating states ----------
enum StateId : uint8_t {
  STATE_IDLE = 0,
  STATE_1    = 1,  // 1 burst
  STATE_2    = 2,  // 2 bursts
  STATE_3    = 3,  // 3 bursts
  STATE_4    = 4,  // 4 bursts
};

static const uint32_t SERIAL_BAUD = 115200;
