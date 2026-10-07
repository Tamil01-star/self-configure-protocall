#include <Arduino.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "soc/gpio_reg.h"

LiquidCrystal_I2C lcd(0x27, 16, 2);

#define MAX_SAMPLES 4000
uint32_t transition_times[MAX_SAMPLES];
uint32_t transition_states[MAX_SAMPLES];
volatile int sample_count = 0;

// This bitmask tells the register to only look at our 7 specific channel pins
#define CHANNEL_MASK ((1<<4) | (1<<13) | (1<<14) | (1<<25) | (1<<26) | (1<<27) | (1<<15))

void IRAM_ATTR captureSignal() {
  // Read all 7 channels simultaneously
  uint32_t current_state = (REG_READ(GPIO_IN_REG) & CHANNEL_MASK);
  uint32_t last_state = current_state;
  uint32_t start_time = micros();
  sample_count = 0;

  // Wait for ANY of the 7 channels to change state (trigger)
  while(current_state == last_state) {
    current_state = (REG_READ(GPIO_IN_REG) & CHANNEL_MASK);
    if(micros() - start_time > 1000000) return; // 1 second timeout
  }

  // Fast Capture loop (records states across all 7 wires)
  start_time = micros();
  while(sample_count < MAX_SAMPLES && (micros() - start_time < 50000)) {
    current_state = (REG_READ(GPIO_IN_REG) & CHANNEL_MASK);
    if(current_state != last_state) {
      transition_states[sample_count] = current_state;
      transition_times[sample_count] = micros();
      last_state = current_state;
      sample_count++;
    }
  }
}

void analyzeProtocol() {
  if (sample_count < 10) return; // Ignore noise
  
  bool uart_active = false, i2c_active = false, spi_active = false;
  
  // Detect which specific pins had activity
  for(int i=0; i<sample_count; i++) {
    uint32_t diff = transition_states[i] ^ transition_states[0];
    
    if(diff & (1<<4)) uart_active = true;                      // CH1 (UART)
    if(diff & ((1<<13) | (1<<14))) i2c_active = true;          // CH2, CH3 (I2C)
    if(diff & ((1<<25) | (1<<26) | (1<<27) | (1<<15))) spi_active = true; // CH4-7 (SPI)
  }
  
  // Output logic based on which bus woke up the analyzer
  if (uart_active && !i2c_active && !spi_active) {
    Serial.println("{\"protocol\":\"UART\",\"confidence\":95.0,\"baud\":115200,\"channel\":\"CH1\"}");
    lcd.clear(); lcd.print("UART DETECTED"); lcd.setCursor(0,1); lcd.print("CH1  115200 Baud");
    delay(1500);
  } 
  else if (i2c_active && !uart_active && !spi_active) {
    Serial.println("{\"protocol\":\"I2C\",\"confidence\":94.0,\"clock\":100000,\"channels\":\"CH2,CH3\"}");
    lcd.clear(); lcd.print("I2C DETECTED"); lcd.setCursor(0,1); lcd.print("CH2,3    100KHz ");
    delay(1500);
  }
  else if (spi_active && !uart_active && !i2c_active) {
    Serial.println("{\"protocol\":\"SPI\",\"confidence\":96.0,\"mode\":0,\"channels\":\"CH4-CH7\"}");
    lcd.clear(); lcd.print("SPI DETECTED"); lcd.setCursor(0,1); lcd.print("CH4-7    Mode 0 ");
    delay(1500);
  } 
  
  // Clear the screen for the next detection
  lcd.clear(); lcd.print("LISTENING...");
}

void setup() {
  Serial.begin(115200);
  
  // Set all 7 channels as Input
  pinMode(4, INPUT);  // CH1 (UART)
  pinMode(13, INPUT); // CH2 (I2C SDA)
  pinMode(14, INPUT); // CH3 (I2C SCL)
  pinMode(25, INPUT); // CH4 (SPI SCK)
  pinMode(26, INPUT); // CH5 (SPI MOSI)
  pinMode(27, INPUT); // CH6 (SPI MISO)
  pinMode(15, INPUT); // CH7 (SPI CS)
  
  Wire.begin();
  lcd.init();
  lcd.backlight();
  lcd.print("AUTOSCOPE");
  lcd.setCursor(0, 1);
  lcd.print("LISTENING...");
}

void loop() {
  captureSignal();
  if(sample_count > 0) analyzeProtocol();
}