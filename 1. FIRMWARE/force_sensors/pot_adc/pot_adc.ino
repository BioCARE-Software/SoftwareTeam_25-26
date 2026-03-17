const int LDR_PIN = 34;
const int SAMPLE_RATE_MS = 5;
const int OVERSAMPLE = 1;

unsigned long lastSampleTime = 0;

void setup() {
  Serial.begin(115200);
  analogSetAttenuation(ADC_11db);
  delay(1000);
}

int smoothRead(int pin) {
  long sum = 0;
  for (int i = 0; i < OVERSAMPLE; i++) {
    sum += analogRead(pin);
  }
  return sum / OVERSAMPLE;
}

void loop() {
  unsigned long now = millis();

  if (now - lastSampleTime >= SAMPLE_RATE_MS) {
    lastSampleTime = now;
    int raw = smoothRead(LDR_PIN);
    Serial.println(raw);
  }
}