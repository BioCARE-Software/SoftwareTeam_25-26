/*
  BioCARE PoC — MyoWare (bicep) -> ADS1115 -> burst-count state machine

  Board: ESP32 Dev Module (PlatformIO: esp32dev)
  Sensor: one MyoWare on ADS1115 AIN0

  Burst encoding (held until next commit):
    1 burst -> STATE_1
    2 burst -> STATE_2
    3 burst -> STATE_3
    4 burst -> STATE_4

  Serial 115200:
    c        calibrate resting baseline
    t###     envelope threshold above baseline
    s        print current held state
    0        reset to STATE_IDLE
    p        plotter <-> monitor
    h        help

  Plotter columns: env  thresh  pendingBursts  stateId
*/

#include <Arduino.h>
#include "config.h"
#include "ads_emg.h"
#include "burst_detector.h"
#include "state_machine.h"

AdsEmg adc;
BurstDetector detector;
StateMachine fsm;

static bool plotter = true;
static uint32_t lastSampleUs = 0;
static uint32_t ledUntilMs = 0;

static void setLed(bool on) {
  digitalWrite(PIN_LED, (on == LED_ACTIVE_HIGH) ? HIGH : LOW);
}

static void pulseLed(uint16_t ms) {
  setLed(true);
  ledUntilMs = millis() + ms;
}

static void blinkState(uint8_t n) {
  for (uint8_t i = 0; i < n; i++) {
    setLed(true);
    delay(70);
    setLed(false);
    delay(70);
  }
}

static void printHelp() {
  Serial.println(F("BioCARE — MyoWare + ADS1115 + ESP32 burst states"));
  Serial.println(F("1/2/3/4 quick flexes -> hold STATE_1..STATE_4"));
  Serial.println(F("cmds: c | t### | s | 0 | p | h"));
}

static void calibrate() {
  Serial.println(F("\n--- CALIBRATE: relax bicep ~2 s ---"));
  delay(400);

  const int N = 60;
  int32_t sum = 0;
  for (int i = 0; i < N; i++) {
    sum += adc.readRaw();
    delay(25);
  }

  const int16_t mean = (int16_t)(sum / N);
  detector.applyCalibration(mean);
  fsm.reset();

  Serial.print(F("baseline="));
  Serial.print(mean);
  Serial.print(F("  thresh="));
  Serial.println(g_thresh);
  Serial.println(F("--- ready: use quick burst trains ---\n"));
}

static void handleSerial() {
  if (!Serial.available()) {
    return;
  }

  const char c = Serial.read();
  if (c == 'c' || c == 'C') {
    calibrate();
  } else if (c == 'p' || c == 'P') {
    plotter = !plotter;
    Serial.println(plotter ? F("PLOTTER") : F("MONITOR"));
  } else if (c == 's' || c == 'S') {
    Serial.print(F("state="));
    Serial.print((int)fsm.state());
    Serial.print(' ');
    Serial.println(StateMachine::name(fsm.state()));
  } else if (c == '0') {
    fsm.reset();
    Serial.println(F(">>> STATE_IDLE"));
  } else if (c == 'h' || c == 'H' || c == '?') {
    printHelp();
  } else if (c == 't' || c == 'T') {
    const int v = Serial.parseInt();
    if (v >= 0 && v <= 30000) {
      g_thresh = (int16_t)v;
      Serial.print(F("thresh="));
      Serial.println(g_thresh);
    }
  }
}

void setup() {
  Serial.begin(SERIAL_BAUD);
  delay(300);

  pinMode(PIN_LED, OUTPUT);
  setLed(false);

  if (!adc.begin()) {
    Serial.println(F("ERROR: ADS1115 not found on I2C 0x48."));
    Serial.println(F("Check SDA=21 SCL=22 VDD GND ADDR->GND"));
    while (true) {
      setLed(true);
      delay(150);
      setLed(false);
      delay(150);
    }
  }

  detector.begin();
  fsm.begin();
  printHelp();
  Serial.println(F("Type c to calibrate, then encode states with bursts."));
  lastSampleUs = micros();
}

void loop() {
  handleSerial();

  const uint32_t now = millis();
  if (ledUntilMs && now >= ledUntilMs) {
    setLed(false);
    ledUntilMs = 0;
  }

  const uint32_t periodUs = 1000000UL / SAMPLE_HZ;
  const uint32_t tUs = micros();
  if ((uint32_t)(tUs - lastSampleUs) < periodUs) {
    return;
  }
  lastSampleUs = tUs;

  const int16_t raw = adc.readRaw();
  if (detector.update(raw, now)) {
    pulseLed(35);
    if (!plotter) {
      Serial.print(F("burst #"));
      Serial.println(detector.pendingCount());
    }
  }

  const uint8_t committed = detector.pollCommit(now);
  if (committed > 0) {
    const bool changed = fsm.commitBursts(committed);
    Serial.print(F(">>> "));
    Serial.print(StateMachine::name(fsm.state()));
    Serial.print(F("  (bursts="));
    Serial.print(committed);
    if (!changed) {
      Serial.print(F(", held"));
    }
    Serial.println(')');
    blinkState(committed);
  }

  if (plotter) {
    Serial.print(detector.envelope());
    Serial.print('\t');
    Serial.print(g_thresh);
    Serial.print('\t');
    Serial.print(detector.pendingCount());
    Serial.print('\t');
    Serial.println((int)fsm.state());
  }
}
