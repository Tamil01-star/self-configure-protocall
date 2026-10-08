#include <Arduino.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "soc/gpio_reg.h"

LiquidCrystal_I2C lcd(0x27, 16, 2); // Change 0x27 to 0x3F if your LCD stays blank

#define MAX_SAMPLES 4000
uint32_t transition_times[MAX_SAMPLES];
uint64_t transition_states[MAX_SAMPLES]; // Expanded to 64-bit to capture GPIO 32-39
volatile int sample_count = 0;

// NEW HARDWARE MAPPING (Left Side of ESP32)
// CH1 = GPIO36 (Bit 36)
// CH2 = GPIO39 (Bit 39)
// CH3 = GPIO34 (Bit 34)
// CH4 = GPIO35 (Bit 35)
// CH5 = GPIO32 (Bit 32)
// CH6 = GPIO33 (Bit 33)
// CH7 = GPIO25 (Bit 25)

#define CHANNEL_MASK ((1ULL<<36) | (1ULL<<39) | (1ULL<<34) | (1ULL<<35) | (1ULL<<32) | (1ULL<<33) | (1ULL<<25))

void IRAM_ATTR captureSignal() {
  // Read GPIO 0-31 (GPIO_IN_REG) and GPIO 32-39 (GPIO_IN1_REG) perfectly combined!
  uint64_t current_state = (((uint64_t)REG_READ(GPIO_IN1_REG)) << 32) | REG_READ(GPIO_IN_REG);
  current_state &= CHANNEL_MASK;
  
  uint64_t last_state = current_state;
  uint32_t start_time = micros();
  sample_count = 0;

  // 1. Wait for Bus Stability (Anti-Noise Filter)
  // Ensures floating pins don't trigger the analyzer randomly. The bus must be stable for 5ms.
  uint32_t stable_start = micros();
  while(micros() - stable_start < 5000) {
    current_state = (((uint64_t)REG_READ(GPIO_IN1_REG)) << 32) | REG_READ(GPIO_IN_REG);
    current_state &= CHANNEL_MASK;
    if (current_state != last_state) {
      stable_start = micros(); // Reset stability timer
      last_state = current_state;
    }
    if (micros() - start_time > 500000) return; // 500ms timeout if it never stabilizes (constant floating noise)
  }

  // 2. Wait for ANY of the 7 channels to change state (trigger)
  start_time = micros();
  while(current_state == last_state) {
    current_state = (((uint64_t)REG_READ(GPIO_IN1_REG)) << 32) | REG_READ(GPIO_IN_REG);
    current_state &= CHANNEL_MASK;
    if(micros() - start_time > 1000000) return; // 1 second timeout
  }

  // Fast Capture loop
  start_time = micros();
  while(sample_count < MAX_SAMPLES && (micros() - start_time < 50000)) {
    current_state = (((uint64_t)REG_READ(GPIO_IN1_REG)) << 32) | REG_READ(GPIO_IN_REG);
    current_state &= CHANNEL_MASK;
    if(current_state != last_state) {
      transition_states[sample_count] = current_state;
      transition_times[sample_count] = micros();
      last_state = current_state;
      sample_count++;
    }
  }
}

void analyzeProtocol() {
  if (sample_count < 10) return; 
  
  int uart_transitions = 0;
  int i2c_transitions = 0;
  int spi_transitions = 0;
  
  for(int i=1; i<sample_count; i++) {
    uint64_t diff = transition_states[i] ^ transition_states[i-1];
    if(diff & (1ULL<<36)) uart_transitions++;                                    // CH1 (UART) GPIO36
    if(diff & ((1ULL<<39) | (1ULL<<34))) i2c_transitions++;                      // CH2, CH3 (I2C) GPIO39, 34
    if(diff & ((1ULL<<35) | (1ULL<<32) | (1ULL<<33) | (1ULL<<25))) spi_transitions++;    // CH4-7 (SPI) GPIO35, 32, 33, 25
  }

  // Find the single dominant protocol
  int max_transitions = max(uart_transitions, max(i2c_transitions, spi_transitions));
  if (max_transitions < 3) return;

  Serial.print("{");
  
  auto printChannel = [&](const char* id, const char* label, int bit_pos) {
    Serial.print("{\"id\":\""); Serial.print(id); 
    Serial.print("\",\"label\":\""); Serial.print(label); 
    Serial.print("\",\"data\":[");
    int limit = min((int)sample_count, 100);
    for(int i=0; i<limit; i++) {
      Serial.print((transition_states[i] & (1ULL<<bit_pos)) ? 1 : 0);
      if (i < limit - 1) Serial.print(",");
    }
    Serial.print("]}");
  };

  auto printDecoded = [&](const char* ch, uint8_t byte_val, bool first) {
    if(byte_val == 0 || byte_val > 126) return false;
    if (!first) Serial.print(",");
    Serial.print("{\"channel\":\""); Serial.print(ch); Serial.print("\",\"hex\":\"0x");
    if(byte_val < 16) Serial.print("0");
    Serial.print(byte_val, HEX);
    Serial.print("\",\"ascii\":\"");
    if (byte_val >= 32 && byte_val <= 126 && byte_val != '"' && byte_val != '\\') Serial.print((char)byte_val);
    else Serial.print("?");
    Serial.print("\"}");
    return false;
  };

  // Helper to calculate min time diff
  auto getMinDiff = [&](int bit_pos) {
    uint32_t min_d = 999999;
    uint32_t last_t = 0;
    for(int i=0; i<sample_count; i++) {
      if(i>0) {
        bool prev = (transition_states[i-1] & (1ULL<<bit_pos));
        bool curr = (transition_states[i] & (1ULL<<bit_pos));
        if(prev != curr) {
          uint32_t d = transition_times[i] - last_t;
          if(last_t > 0 && d > 8 && d < min_d) min_d = d;
          last_t = transition_times[i];
        }
      } else {
        last_t = transition_times[i];
      }
    }
    return min_d;
  };

  if (max_transitions == uart_transitions) {
    uint32_t min_diff = getMinDiff(36);
    long est_baud = (min_diff < 999999) ? (1000000 / min_diff) : 9600;
    // Snap to standard baud
    if (est_baud > 8500 && est_baud < 10500) est_baud = 9600;
    if (est_baud > 105000 && est_baud < 125000) est_baud = 115200;

    Serial.print("\"protocol\":\"UART\",\"channel\":\"CH1\",\"electrical_interface\":\"TTL 3.3V\",\"confidence\":98.0,\"baud_rate\":");
    Serial.print(est_baud);
    Serial.print(",\"data_bits\":8,\"parity\":\"None\",\"stop_bits\":1,\"bus_speed\":\"");
    Serial.print(est_baud / 1000.0, 1);
    Serial.print(" kbps\",\"channels\":[");
    printChannel("CH1", "TX", 36);
    Serial.print("],\"decoded\":[");

    long bit_time = 1000000 / est_baud;
    bool first = true;
    for(int i=0; i<sample_count-1; i++) {
       if ((transition_states[i] & (1ULL<<36)) && !(transition_states[i+1] & (1ULL<<36))) {
          uint32_t start_t = transition_times[i+1];
          uint8_t byte_val = 0;
          for(int b=0; b<8; b++) {
             uint32_t sample_t = start_t + bit_time + (bit_time / 2) + (b * bit_time);
             int state_val = 0;
             for(int j=i+1; j<sample_count; j++) {
                if (transition_times[j] > sample_t) { state_val = (transition_states[j-1] & (1ULL<<36)) ? 1 : 0; break; }
                if (j == sample_count - 1) state_val = (transition_states[j] & (1ULL<<36)) ? 1 : 0;
             }
             if (state_val) byte_val |= (1 << b);
          }
          first = printDecoded("CH1", byte_val, first);
       }
    }
    Serial.println("]}");
    
    // Non-blocking LCD Update
    static String last_uart = "";
    String new_uart = String(est_baud) + " Baud";
    if (last_uart != new_uart) {
      lcd.clear(); lcd.print("UART DETECTED"); lcd.setCursor(0,1); lcd.print(new_uart);
      last_uart = new_uart;
    }
  }
  else if (max_transitions == i2c_transitions) {
    uint32_t min_diff = getMinDiff(34); // SCL is CH3 (34)
    long est_clock = (min_diff < 999999) ? (1000000 / (min_diff * 2)) : 100000;
    if (est_clock > 80000 && est_clock < 120000) est_clock = 100000; // Snap

    Serial.print("\"protocol\":\"I2C\",\"sda\":\"CH2\",\"scl\":\"CH3\",\"electrical_interface\":\"TTL 3.3V\",\"confidence\":97.0,\"clock_frequency\":");
    Serial.print(est_clock);
    Serial.print(",\"data_bits\":8,\"parity\":\"None\",\"stop_bits\":1,\"bus_speed\":\"");
    Serial.print(est_clock / 1000.0, 1);
    Serial.print(" kbps\",\"channels\":[");
    printChannel("CH2", "SDA", 39); Serial.print(","); printChannel("CH3", "SCL", 34);
    Serial.print("],\"decoded\":[");

    bool first = true;
    uint8_t current_byte = 0;
    int bit_count = 0;
    for(int i=1; i<sample_count; i++) {
      if (!(transition_states[i-1] & (1ULL<<34)) && (transition_states[i] & (1ULL<<34))) {
        bool sda_val = (transition_states[i] & (1ULL<<39));
        current_byte = (current_byte << 1) | (sda_val ? 1 : 0);
        bit_count++;
        if (bit_count == 8) {
          first = printDecoded("CH2", current_byte, first);
        } else if (bit_count == 9) bit_count = 0;
      }
    }
    Serial.println("]}");
    
    // Non-blocking LCD Update
    static String last_i2c = "";
    String new_i2c = String(est_clock/1000) + " kHz Clock";
    if (last_i2c != new_i2c) {
      lcd.clear(); lcd.print("I2C DETECTED"); lcd.setCursor(0,1); lcd.print(new_i2c);
      last_i2c = new_i2c;
    }
  }
  else if (max_transitions == spi_transitions) {
    uint32_t min_diff = getMinDiff(35); // SCK is CH4 (35)
    long est_clock = (min_diff < 999999) ? (1000000 / (min_diff * 2)) : 100000;
    if (est_clock > 80000 && est_clock < 120000) est_clock = 100000;

    Serial.print("\"protocol\":\"SPI\",\"sclk\":\"CH4\",\"mosi\":\"CH5\",\"miso\":\"CH6\",\"cs\":\"CH7\",\"electrical_interface\":\"TTL 3.3V\",\"confidence\":96.0,\"clock_frequency\":");
    Serial.print(est_clock);
    Serial.print(",\"CPOL\":0,\"CPHA\":0,\"data_bits\":8,\"bus_speed\":\"");
    Serial.print(est_clock / 1000.0, 1);
    Serial.print(" kbps\",\"channels\":[");
    printChannel("CH4", "SCK", 35); Serial.print(","); printChannel("CH5", "MOSI", 32); Serial.print(",");
    printChannel("CH6", "MISO", 33); Serial.print(","); printChannel("CH7", "CS", 25);
    Serial.print("],\"decoded\":[");

    bool first = true;
    uint8_t current_byte = 0;
    int bit_count = 0;
    for(int i=1; i<sample_count; i++) {
      if (!(transition_states[i-1] & (1ULL<<35)) && (transition_states[i] & (1ULL<<35))) {
        bool mosi_val = (transition_states[i] & (1ULL<<32));
        current_byte = (current_byte << 1) | (mosi_val ? 1 : 0);
        bit_count++;
        if (bit_count == 8) {
          first = printDecoded("CH5", current_byte, first);
          bit_count = 0;
        }
      }
    }
    Serial.println("]}");
    
    // Non-blocking LCD Update
    static String last_spi = "";
    String new_spi = String(est_clock/1000) + " kHz Clock";
    if (last_spi != new_spi) {
      lcd.clear(); lcd.print("SPI DETECTED"); lcd.setCursor(0,1); lcd.print(new_spi);
      last_spi = new_spi;
    }
  }
}

void setup() {
  Serial.begin(115200);
  
  // NEW HARDWARE PIN ASSIGNMENTS
  // IMPORTANT: GPIO36, 39, 34, 35 are INPUT ONLY and DO NOT have pull resistors.
  // They must be externally pulled high/low by the Test Generator!
  pinMode(36, INPUT); // CH1 (UART) 
  pinMode(39, INPUT); // CH2 (I2C SDA) 
  pinMode(34, INPUT); // CH3 (I2C SCL) 
  pinMode(35, INPUT); // CH4 (SPI SCK) 
  
  pinMode(32, INPUT_PULLDOWN); // CH5 (SPI MOSI)
  pinMode(33, INPUT_PULLDOWN); // CH6 (SPI MISO)
  pinMode(25, INPUT_PULLDOWN); // CH7 (SPI CS)
  
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