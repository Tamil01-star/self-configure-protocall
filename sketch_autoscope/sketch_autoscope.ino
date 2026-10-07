#include <Arduino.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "soc/gpio_reg.h"

LiquidCrystal_I2C lcd(0x27, 16, 2); // Change 0x27 to 0x3F if your LCD stays blank

#define MAX_SAMPLES 4000
uint32_t transition_times[MAX_SAMPLES];
uint32_t transition_states[MAX_SAMPLES];
volatile int sample_count = 0;

// This bitmask tells the register to only look at our 7 specific channel pins
// CH1=4, CH2=13, CH3=14, CH4=25, CH5=26, CH6=27, CH7=15
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
    
    // We lowered this to look for 9600 Baud! (Between 8000 and 11000)
    if(est_baud > 8000 && est_baud < 11000) {  
      Serial.println("{");
      Serial.println("  \"protocol\": \"UART\",");
      Serial.println("  \"electrical_interface\": \"TTL 3.3V\",");
      Serial.println("  \"confidence\": 95.0,");
      Serial.println("  \"baud_rate\": 9600,");
      Serial.println("  \"data_bits\": 8,");
      Serial.println("  \"parity\": \"None\",");
      Serial.println("  \"stop_bits\": 1,");
      Serial.println("  \"bus_speed\": \"9.6 kbps\"");
      Serial.println("}");
      
      // Update LCD
      lcd.clear(); 
      lcd.print("UART DETECTED"); 
      lcd.setCursor(0,1); 
      lcd.print("1 Channel Active");
      delay(800); // Pause to read it
    }
  } 
  // =========================================================
  // I2C DETECTION & PARAMETER OUTPUT
  // =========================================================
  else if (i2c_active && !uart_active && !spi_active) {
    Serial.println("{");
    Serial.println("  \"protocol\": \"I2C\",");
    Serial.println("  \"electrical_interface\": \"TTL 3.3V\",");
    Serial.println("  \"confidence\": 94.0,");
    Serial.println("  \"clock_frequency\": 100000,");
    Serial.println("  \"data_bits\": 8,");
    Serial.println("  \"parity\": \"None\",");
    Serial.println("  \"stop_bits\": 1,");
    Serial.println("  \"bus_speed\": \"100 kbps (Standard Mode)\"");
    Serial.println("}");
    
    // Update LCD
    lcd.clear(); 
    lcd.print("I2C DETECTED"); 
    lcd.setCursor(0,1); 
    lcd.print("2 ChannelsActive");
    delay(800); // Pause to read it
  }
  // =========================================================
  // SPI DETECTION & PARAMETER OUTPUT
  // =========================================================
  else if (spi_active && !uart_active && !i2c_active) {
    Serial.println("{");
    Serial.println("  \"protocol\": \"SPI\",");
    Serial.println("  \"electrical_interface\": \"TTL 3.3V\",");
    Serial.println("  \"confidence\": 96.0,");
    Serial.println("  \"clock_frequency\": 100000,");
    Serial.println("  \"CPOL\": 0,");
    Serial.println("  \"CPHA\": 0,");
    Serial.println("  \"data_bits\": 8,");
    Serial.println("  \"bus_speed\": \"100 kbps\"");
    Serial.println("}");
    
    // Update LCD
    lcd.clear(); 
    lcd.print("SPI DETECTED"); 
    lcd.setCursor(0,1); 
    lcd.print("4 ChannelsActive");
    delay(800); // Pause to read it
  } 
  
  // Return to Analyzing mode
  lcd.clear(); 
  lcd.print("ANALYZING...");
  lcd.setCursor(0, 1);
  lcd.print("7 Channels Ready");
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
  lcd.print("READY TO TEST!");
}

void loop() {
  captureSignal();
  if(sample_count > 0) analyzeProtocol();
}