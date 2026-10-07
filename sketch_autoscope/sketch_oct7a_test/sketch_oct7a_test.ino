#include <Arduino.h>
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_BMP085.h> // BMP180 Library

// Pins
#define UART_TX 17
#define UART_RX 16
#define I2C_SDA 21
#define I2C_SCL 22
#define SPI_SCK 18
#define SPI_MISO 19
#define SPI_MOSI 23
#define SS_PIN 5

Adafruit_BMP085 bmp; 
HardwareSerial TestUART(2);

void setup() {
  Serial.begin(115200);
  
  // 1. Start UART Test Signal (Slowed to 9600 baud for rock-solid detection!)
  TestUART.begin(9600, SERIAL_8N1, UART_RX, UART_TX);
  
  // 2. Start I2C (BMP180) Test Signal
  Wire.begin(I2C_SDA, I2C_SCL);
  if (!bmp.begin()) { 
    Serial.println("BMP180 not found! Check wiring.");
  }
  
  // 3. Start SPI Test Signal
  pinMode(SS_PIN, OUTPUT);
  digitalWrite(SS_PIN, HIGH);
  SPI.begin(SPI_SCK, SPI_MISO, SPI_MOSI, SS_PIN); 
}

void loop() {
  // 1. Generate UART Traffic
  TestUART.print("AUTOSCOPE UART TEST\n");
  delay(150);

  // 2. Generate I2C Traffic (Asking BMP180 for Temperature)
  bmp.readTemperature(); 
  delay(150);

  // 3. Generate SPI Traffic (Manual & Slow!)
  // We use 100kHz so the software AutoScope can easily catch the digital pulses.
  SPI.beginTransaction(SPISettings(100000, MSBFIRST, SPI_MODE0)); 
  digitalWrite(SS_PIN, LOW);   // Pull CS low to start SPI transaction
  SPI.transfer(0x55);          // Send dummy data (01010101 in binary)
  digitalWrite(SS_PIN, HIGH);  // Pull CS high to end SPI transaction
  SPI.endTransaction();
  
  delay(150);
}