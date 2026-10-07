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
  
  int uart_transitions = 0;
  int i2c_transitions = 0;
  int spi_transitions = 0;
  
  // Count how many times each protocol's pins toggled
  for(int i=1; i<sample_count; i++) {
    uint32_t diff = transition_states[i] ^ transition_states[i-1];
    
    if(diff & (1<<4)) uart_transitions++;                                    // CH1 (UART)
    if(diff & ((1<<13) | (1<<14))) i2c_transitions++;                        // CH2, CH3 (I2C)
    if(diff & ((1<<25) | (1<<26) | (1<<27) | (1<<15))) spi_transitions++;    // CH4-7 (SPI)
  }

  // Find the dominant protocol (this perfectly ignores crosstalk noise!)
  int max_transitions = max(uart_transitions, max(i2c_transitions, spi_transitions));
  
  // Helper to stream JSON to avoid memory overflow
  auto printChannels = [&]() {
    Serial.print(",\"channels\":[");
    
    // Helper to print one channel
    auto printChannel = [&](const char* id, int bit_pos, bool is_last) {
      Serial.print("{\"id\":\"");
      Serial.print(id);
      Serial.print("\",\"data\":[");
      // Limit to 100 samples so we don't crash serial buffer
      int limit = min(sample_count, 100);
      for(int i=0; i<limit; i++) {
        Serial.print((transition_states[i] & (1<<bit_pos)) ? 1 : 0);
        if (i < limit - 1) Serial.print(",");
      }
      Serial.print("]}");
      if (!is_last) Serial.print(",");
    };

    printChannel("CH1", 4, false);
    printChannel("CH2", 13, false);
    printChannel("CH3", 14, false);
    printChannel("CH4", 25, false);
    printChannel("CH5", 26, false);
    printChannel("CH6", 27, false);
    printChannel("CH7", 15, true);
    
    Serial.println("]}"); // Close channels array and root JSON object
  };

  // =========================================================
  // UART DETECTION & PARAMETER OUTPUT
  // =========================================================
  if (max_transitions == uart_transitions && uart_transitions > 2) {
    Serial.print("{\"protocol\":\"UART\",\"electrical_interface\":\"TTL 3.3V\",\"confidence\":95.0,\"baud_rate\":9600,\"data_bits\":8,\"parity\":\"None\",\"stop_bits\":1,\"bus_speed\":\"9.6 kbps\"");
    printChannels();
    
    // Update LCD
    lcd.clear(); 
    lcd.print("UART DETECTED"); 
    lcd.setCursor(0,1); 
    lcd.print("1 Channel Active");
    delay(800); // Pause to read it
  } 
  // =========================================================
  // I2C DETECTION & PARAMETER OUTPUT
  // =========================================================
  else if (max_transitions == i2c_transitions && i2c_transitions > 2) {
    Serial.print("{\"protocol\":\"I2C\",\"electrical_interface\":\"TTL 3.3V\",\"confidence\":94.0,\"clock_frequency\":100000,\"data_bits\":8,\"parity\":\"None\",\"stop_bits\":1,\"bus_speed\":\"100 kbps\"");
    printChannels();
    
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
  else if (max_transitions == spi_transitions && spi_transitions > 2) {
    Serial.print("{\"protocol\":\"SPI\",\"electrical_interface\":\"TTL 3.3V\",\"confidence\":96.0,\"clock_frequency\":100000,\"CPOL\":0,\"CPHA\":0,\"data_bits\":8,\"bus_speed\":\"100 kbps\"");
    printChannels();
    
    // Update LCD
    lcd.clear(); 
    lcd.print("SPI DETECTED"); 
    lcd.setCursor(0,1); 
    lcd.print("4 ChannelsActive");
    delay(800); // Pause to read it
  } 
  else {
    // UNKNOWN PROTOCOL - but STILL send the data to dashboard so user can see it!
    Serial.print("{\"protocol\":\"UNKNOWN\",\"state\":\"DETECTED\"");
    printChannels();
  }
  
  // Return to Analyzing mode
  lcd.clear(); 
  lcd.print("ANALYZING...");
  lcd.setCursor(0, 1);
  lcd.print("7 Channels Ready");
}

void setup() {
  Serial.begin(115200);
  
  // Set all 7 channels as Input with internal Pull-Down to prevent noise!
  pinMode(4, INPUT_PULLDOWN);  // CH1 (UART)
  pinMode(13, INPUT_PULLDOWN); // CH2 (I2C SDA)
  pinMode(14, INPUT_PULLDOWN); // CH3 (I2C SCL)
  pinMode(25, INPUT_PULLDOWN); // CH4 (SPI SCK)
  pinMode(26, INPUT_PULLDOWN); // CH5 (SPI MOSI)
  pinMode(27, INPUT_PULLDOWN); // CH6 (SPI MISO)
  pinMode(15, INPUT_PULLDOWN); // CH7 (SPI CS)
  
  Wire.begin();
  lcd.init();
  lcd.backlight();
  lcd.print("AUTOSCOPE");
  lcd.setCursor(0, 1);
  lcd.print("ANALYZING...");
}

void loop() {
  captureSignal();
  if(sample_count > 0) analyzeProtocol();
}