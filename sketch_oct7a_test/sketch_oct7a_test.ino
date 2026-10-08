#include <Arduino.h>
#include <Wire.h>
#include <SPI.h>

// Pins for ESP32 #1 Test Generator
#define UART_TX 17
#define UART_RX 16
#define I2C_SDA 21
#define I2C_SCL 22
#define SPI_SCK 18
#define SPI_MISO 19
#define SPI_MOSI 23
#define SS_PIN 5

HardwareSerial TestUART(2);

void setup() {
  Serial.begin(115200);
  
  // 1. Start UART Test Signal (9600 baud 8N1)
  TestUART.begin(9600, SERIAL_8N1, UART_RX, UART_TX);
  
  // 2. Start I2C Test Signal
  Wire.begin(I2C_SDA, I2C_SCL);
  Wire.setClock(100000);
  
  // 3. Start SPI Test Signal (100kHz)
  pinMode(SS_PIN, OUTPUT);
  digitalWrite(SS_PIN, HIGH);
  SPI.begin(SPI_SCK, SPI_MISO, SPI_MOSI, SS_PIN); 

  Serial.println("==================================================");
  Serial.println("  ESP32 #1 TEST GENERATOR READY");
  Serial.println("  Generating UART (GPIO 17), I2C (21,22), SPI (18,19,23,5)");
  Serial.println("==================================================");
}

void loop() {
  // 1. Generate UART Traffic ("HELLO\n")
  TestUART.print("HELLO\n");
  delay(150);

  // 2. Generate I2C Traffic
  Wire.beginTransmission(0x48);
  Wire.write(0x00);
  Wire.write(0x48); // 'H'
  Wire.write(0x45); // 'E'
  Wire.write(0x4C); // 'L'
  Wire.write(0x4C); // 'L'
  Wire.write(0x4F); // 'O'
  Wire.endTransmission();
  delay(150);

  // 3. Generate SPI Traffic
  SPI.beginTransaction(SPISettings(100000, MSBFIRST, SPI_MODE0)); 
  digitalWrite(SS_PIN, LOW);   // Pull CS low to start SPI transaction
  SPI.transfer('H');
  SPI.transfer('E');
  SPI.transfer('L');
  SPI.transfer('L');
  SPI.transfer('O');
  digitalWrite(SS_PIN, HIGH);  // Pull CS high to end SPI transaction
  SPI.endTransaction();
  delay(150);
}
