

int FS_pin = A0;
int const VB_pin = 1;
int FS_value = 0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  FS_value = analogRead(FS_pin);
  Serial.print("Force Sensor Reading = ");
  Serial.println(FS_value);
  delay(100);
}
