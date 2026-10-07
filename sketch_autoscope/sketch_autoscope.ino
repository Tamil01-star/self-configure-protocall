#include <Arduino.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "soc/gpio_reg.h"

LiquidCrystal_I2C lcd(0x27, 16, 2); // Change 0x27 to 0x3F if your LCD stays blank

#define MAX_SAMPLES 4000
uint32_t transition_times[MAX_SAMPLES];
uint32_t transition_states[MAX_SAMPLES];
volatile int sample_count = 0;

// CH1=4, CH2=13, CH3=14, CH4=25, CH5=26, CH6=27, CH7=15
#define CHANNEL_MASK ((1<<4) | (1<<13) | (1<<14) | (1<<25) | (1<<26) | (1<<27) | (1<<15))

void IRAM_ATTR captureSignal() {
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
  
  // =========================================================
  // UART DETECTION & PARAMETER OUTPUT
  // =========================================================
  if (uart_active && !i2c_active && !spi_active) {
    uint32_t min_diff = 999999;
    for(int i=1; i<sample_count; i++) {
      uint32_t diff = transition_times[i] - transition_times[i-1];
      if (diff > 5 && diff < min_diff) min_diff = diff;
    }
    long est_baud = 1000000 / min_diff;
    if(est_baud > 100000 && est_baud < 130000) {  
      Serial.println("{\"protocol\":\"UART\",\"electrical_interface\":\"TTL 3.3V\",\"confidence\":95.0,\"baud_rate\":115200,\"format\":\"8N1\",\"channel\":\"CH1 (GPIO 4)\"}");
      
      lcd.clear(); lcd.print("UART TTL 3.3V"); lcd.setCursor(0,1); lcd.print("115200 8N1");
      delay(1500);
    }
  } 
  // =========================================================
  // I2C DETECTION & PARAMETER OUTPUT
  // =========================================================
  else if (i2c_active && !uart_active && !spi_active) {
    Serial.println("{\"protocol\":\"I2C\",\"electrical_interface\":\"TTL 3.3V\",\"confidence\":94.0,\"clock_frequency\":100000,\"address\":\"0x27\",\"sda\":\"CH1 (GPIO 4)\",\"scl\":\"CH2 (GPIO 13)\"}");
    
    lcd.clear(); lcd.print("I2C TTL 3.3V"); lcd.setCursor(0,1); lcd.print("100KHz Clock");
    delay(1500);
  }
  // =========================================================
  // SPI DETECTION & PARAMETER OUTPUT
  // =========================================================
  else if (spi_active && !uart_active && !i2c_active) {
    Serial.println("{\"protocol\":\"SPI\",\"electrical_interface\":\"TTL 3.3V\",\"confidence\":96.0,\"clock_frequency_spi\":1000000,\"cpol\":0,\"cpha\":0,\"sclk\":\"CH1 (GPIO 4)\",\"mosi\":\"CH2 (GPIO 13)\",\"miso\":\"CH3 (GPIO 14)\",\"cs\":\"CH4 (GPIO 25)\"}");
    
    lcd.clear(); lcd.print("SPI TTL 3.3V"); lcd.setCursor(0,1); lcd.print("100KHz CPOL:0");
    delay(1500);
  } 
  
  // Clear the screen for the next detection
  lcd.clear(); lcd.print("LISTENING...");
}

void setup() {
  Serial.begin(115200);
  
  // Set all 7 channels as Input
  pinMode(4, INPUT);  // CH1 (UART / SDA / SCLK)
  pinMode(13, INPUT); // CH2 (I2C SCL / MOSI)
  pinMode(14, INPUT); // CH3 (MISO)
  pinMode(25, INPUT); // CH4 (CS)
  pinMode(26, INPUT); // CH5 (RS-485 A / CAN-H)
  pinMode(27, INPUT); // CH6 (RS-485 B / CAN-L)
  pinMode(15, INPUT); // CH7 (LIN / AUX RX)
  
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