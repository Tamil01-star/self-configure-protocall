#include <Arduino.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "soc/gpio_reg.h"

LiquidCrystal_I2C lcd(0x27, 16, 2);

volatile bool lcd_busy = false;

#define MAX_SAMPLES 4000
uint32_t transition_times[MAX_SAMPLES];
uint64_t transition_states[MAX_SAMPLES];
volatile int sample_count = 0;

// CHANNEL MAPPING (Left Side of ESP32)
// CH1 = GPIO36 (Bit 36) -> UART TX
// CH2 = GPIO39 (Bit 39) -> I2C SDA
// CH3 = GPIO34 (Bit 34) -> I2C SCL
// CH4 = GPIO35 (Bit 35) -> SPI SCK
// CH5 = GPIO32 (Bit 32) -> SPI MOSI
// CH6 = GPIO33 (Bit 33) -> SPI MISO
// CH7 = GPIO25 (Bit 25) -> SPI CS

#define CHANNEL_MASK ((1ULL<<36) | (1ULL<<39) | (1ULL<<34) | (1ULL<<35) | (1ULL<<32) | (1ULL<<33) | (1ULL<<25))

void IRAM_ATTR captureSignal() {
  if (lcd_busy) return;

  uint64_t initial_state = (((uint64_t)REG_READ(GPIO_IN1_REG)) << 32) | REG_READ(GPIO_IN_REG);
  initial_state &= CHANNEL_MASK;
  
  uint64_t current_state = initial_state;
  uint64_t last_state = initial_state;
  sample_count = 0;

  // 1. Wait for bus stability (1ms of no transitions across monitored pins)
  uint32_t stable_start = micros();
  uint32_t start_time = micros();
  while(micros() - stable_start < 1000) {
    current_state = (((uint64_t)REG_READ(GPIO_IN1_REG)) << 32) | REG_READ(GPIO_IN_REG);
    current_state &= CHANNEL_MASK;
    if (current_state != last_state) {
      stable_start = micros();
      last_state = current_state;
    }
    if (micros() - start_time > 200000) return; // 200ms timeout
  }

  // 2. Record initial idle state as Sample 0 (ensures first edge is properly detected)
  transition_states[0] = current_state;
  transition_times[0] = micros();
  sample_count = 1;

  // 3. Wait for ANY channel trigger (change from idle)
  start_time = micros();
  while(current_state == last_state) {
    current_state = (((uint64_t)REG_READ(GPIO_IN1_REG)) << 32) | REG_READ(GPIO_IN_REG);
    current_state &= CHANNEL_MASK;
    if(micros() - start_time > 1000000) return; // 1s timeout
  }

  // 4. Record trigger transition as Sample 1
  transition_states[1] = current_state;
  transition_times[1] = micros();
  last_state = current_state;
  sample_count = 2;

  // 5. Fast capture remaining transitions (50ms window)
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
  if (sample_count < 4) return; 

  int uart_transitions = 0; // CH1 (GPIO36)
  int sda_transitions = 0;  // CH2 (GPIO39)
  int scl_transitions = 0;  // CH3 (GPIO34)
  int spi_sck = 0;          // CH4 (GPIO35)
  int spi_data = 0;         // CH5,6,7 (GPIO32, 33, 25)

  for(int i=1; i<sample_count; i++) {
    uint64_t diff = transition_states[i] ^ transition_states[i-1];
    if(diff & (1ULL<<36)) uart_transitions++;
    if(diff & (1ULL<<39)) sda_transitions++;
    if(diff & (1ULL<<34)) scl_transitions++;
    if(diff & (1ULL<<35)) spi_sck++;
    if(diff & ((1ULL<<32) | (1ULL<<33) | (1ULL<<25))) spi_data++;
  }

  // Strict physical bus validation:
  // I2C requires BOTH clock (SCL >= 16 transitions) AND data (SDA >= 4 transitions).
  int i2c_transitions = (scl_transitions >= 16 && sda_transitions >= 4) ? (sda_transitions + scl_transitions) : 0;
  int spi_transitions = (spi_sck >= 16 && spi_data >= 2) ? (spi_sck + spi_data) : 0;

  int max_transitions = max(uart_transitions, max(i2c_transitions, spi_transitions));
  if (max_transitions < 4) return;

  auto printChannel = [&](const char* id, const char* label, int bit_pos) {
    Serial.print("{\"id\":\""); Serial.print(id); 
    Serial.print("\",\"label\":\""); Serial.print(label); 
    Serial.print("\",\"data\":[");
    int limit = min((int)sample_count, 64);
    for(int i=0; i<limit; i++) {
      Serial.print((transition_states[i] & (1ULL<<bit_pos)) ? 1 : 0);
      if (i < limit - 1) Serial.print(",");
    }
    Serial.print("]}");
  };

  auto getMinDiff = [&](int bit_pos) {
    uint32_t min_d = 999999;
    uint32_t last_t = 0;
    for(int i=1; i<sample_count; i++) {
      bool prev = (transition_states[i-1] & (1ULL<<bit_pos));
      bool curr = (transition_states[i] & (1ULL<<bit_pos));
      if(prev != curr) {
        if(last_t > 0) {
          uint32_t d = transition_times[i] - last_t;
          if(d >= 4 && d < min_d) min_d = d;
        }
        last_t = transition_times[i];
      }
    }
    return min_d;
  };

  // =========================================================================
  // 1. UART DETECTION (CH1 = GPIO36)
  // =========================================================================
  if (max_transitions == uart_transitions && uart_transitions >= 2) {
    uint32_t min_diff = getMinDiff(36);
    long est_baud = (min_diff < 999999) ? (1000000 / min_diff) : 9600;
    
    // Snap to standard baud rates
    if (est_baud < 14000) est_baud = 9600;
    else if (est_baud < 28000) est_baud = 19200;
    else if (est_baud < 48000) est_baud = 38400;
    else if (est_baud < 80000) est_baud = 57600;
    else est_baud = 115200;

    long bit_time = 1000000 / est_baud;

    uint8_t decoded_bytes[32];
    uint32_t decoded_start_times[32];
    int decoded_count = 0;

    for(int i=0; i<sample_count-1; i++) {
      // Look for Start Bit: transition from HIGH (1) to LOW (0)
      if ((transition_states[i] & (1ULL<<36)) && !(transition_states[i+1] & (1ULL<<36))) {
        uint32_t start_t = transition_times[i+1];
        uint8_t byte_val = 0;
        
        // Sample all 8 data bits in the exact center of each bit
        for(int b=0; b<8; b++) {
          uint32_t sample_t = start_t + bit_time + (bit_time / 2) + (b * bit_time);
          int state_val = 0;
          for(int j=i+1; j<sample_count; j++) {
            if (transition_times[j] > sample_t) { 
              state_val = (transition_states[j-1] & (1ULL<<36)) ? 1 : 0; 
              break; 
            }
            if (j == sample_count - 1) {
              state_val = (transition_states[j] & (1ULL<<36)) ? 1 : 0;
            }
          }
          if (state_val) byte_val |= (1 << b);
        }
        
        // Accept valid decoded bytes
        if (byte_val > 0) {
          if (decoded_count < 32) {
            decoded_bytes[decoded_count] = byte_val;
            decoded_start_times[decoded_count] = start_t;
            decoded_count++;
          }
        }
        
        // Advance past the 10-bit frame (1 start + 8 data + 1 stop)
        uint32_t end_of_byte_t = start_t + (10 * bit_time) - (bit_time / 4);
        while(i < sample_count-1 && transition_times[i+1] < end_of_byte_t) {
          i++;
        }
      }
    }

    // Output complete JSON packet to Serial
    Serial.print("{\"protocol\":\"UART\",\"channel\":\"CH1\",\"electrical_interface\":\"TTL 3.3V\",\"confidence\":98.0,\"baud_rate\":");
    Serial.print(est_baud);
    Serial.print(",\"data_bits\":8,\"parity\":\"None\",\"stop_bits\":1,\"bus_speed\":\"");
    Serial.print(est_baud / 1000.0, 1);
    Serial.print(" kbps\",\"channels\":[");
    printChannel("CH1", "TX", 36);
    Serial.print("],\"decoded\":[");

    uint32_t base_t = (decoded_count > 0) ? decoded_start_times[0] : 0;
    for(int k=0; k<decoded_count; k++) {
      if (k > 0) Serial.print(",");
      Serial.print("{\"channel\":\"CH1\",\"timeMs\":");
      Serial.print((decoded_start_times[k] - base_t) / 1000.0, 3);
      Serial.print(",\"hex\":\"0x");
      if(decoded_bytes[k] < 16) Serial.print("0");
      Serial.print(decoded_bytes[k], HEX);
      Serial.print("\",\"dec\":");
      Serial.print(decoded_bytes[k]);
      Serial.print(",\"ascii\":\"");
      if (decoded_bytes[k] >= 32 && decoded_bytes[k] <= 126 && decoded_bytes[k] != '"' && decoded_bytes[k] != '\\') {
        Serial.print((char)decoded_bytes[k]);
      } else {
        Serial.print(".");
      }
      Serial.print("\"}");
    }
    Serial.println("]}");
    
    // Update LCD with clean assembled text
    if (decoded_count > 0) {
      char ascii_str[17];
      int copy_len = min(decoded_count, 16);
      for(int m=0; m<copy_len; m++) ascii_str[m] = (char)decoded_bytes[m];
      ascii_str[copy_len] = '\0';
      
      static String last_uart = "";
      String new_uart = String(ascii_str);
      if (last_uart != new_uart) {
        lcd_busy = true;
        lcd.clear();
        lcd.print("UART: ");
        lcd.print(new_uart);
        lcd.setCursor(0, 1);
        lcd.print(est_baud);
        lcd.print(" Baud 8N1");
        lcd_busy = false;
        last_uart = new_uart;
      }
    }
  }

  // =========================================================================
  // 2. I2C DETECTION (CH2 = SDA, CH3 = SCL) — Only when BOTH pins are ACTIVE!
  // =========================================================================
  else if (max_transitions == i2c_transitions && i2c_transitions >= 20) {
    uint32_t min_diff = getMinDiff(34); // SCL (34)
    long est_clock = (min_diff < 999999) ? (1000000 / (min_diff * 2)) : 100000;
    if (est_clock > 80000 && est_clock < 120000) est_clock = 100000;

    // Decode I2C bytes
    uint8_t decoded_bytes[32];
    int decoded_count = 0;
    uint8_t current_byte = 0;
    int bit_count = 0;

    for(int i=1; i<sample_count; i++) {
      if (!(transition_states[i-1] & (1ULL<<34)) && (transition_states[i] & (1ULL<<34))) {
        bool sda_val = (transition_states[i] & (1ULL<<39));
        current_byte = (current_byte << 1) | (sda_val ? 1 : 0);
        bit_count++;
        if (bit_count == 8) {
          if (decoded_count < 32) decoded_bytes[decoded_count++] = current_byte;
        } else if (bit_count == 9) bit_count = 0;
      }
    }

    if (decoded_count < 2) return;

    Serial.print("{\"protocol\":\"I2C\",\"sda\":\"CH2\",\"scl\":\"CH3\",\"electrical_interface\":\"TTL 3.3V\",\"confidence\":97.0,\"clock_frequency\":");
    Serial.print(est_clock);
    Serial.print(",\"data_bits\":8,\"parity\":\"None\",\"stop_bits\":1,\"bus_speed\":\"");
    Serial.print(est_clock / 1000.0, 1);
    Serial.print(" kbps\",\"channels\":[");
    printChannel("CH2", "SDA", 39); Serial.print(","); printChannel("CH3", "SCL", 34);
    Serial.print("],\"decoded\":[");

    for(int k=0; k<decoded_count; k++) {
      if (k > 0) Serial.print(",");
      Serial.print("{\"channel\":\"CH2\",\"hex\":\"0x");
      if(decoded_bytes[k] < 16) Serial.print("0");
      Serial.print(decoded_bytes[k], HEX);
      Serial.print("\",\"dec\":");
      Serial.print(decoded_bytes[k]);
      Serial.print(",\"ascii\":\"");
      if (decoded_bytes[k] >= 32 && decoded_bytes[k] <= 126 && decoded_bytes[k] != '"' && decoded_bytes[k] != '\\') {
        Serial.print((char)decoded_bytes[k]);
      } else {
        Serial.print(".");
      }
      Serial.print("\"}");
    }
    Serial.println("]}");
    
    // Update LCD
    static String last_i2c = "";
    String new_i2c = String(est_clock/1000) + " kHz Clock";
    if (last_i2c != new_i2c) {
      lcd_busy = true;
      lcd.clear();
      lcd.print("I2C DETECTED");
      lcd.setCursor(0, 1);
      lcd.print(new_i2c);
      lcd_busy = false;
      last_i2c = new_i2c;
    }
  }

  // =========================================================================
  // 3. SPI DETECTION (CH4 = SCK, CH5 = MOSI, CH6 = MISO, CH7 = CS)
  // =========================================================================
  else if (max_transitions == spi_transitions && spi_transitions >= 20) {
    uint32_t min_diff = getMinDiff(35); // SCK (35)
    long est_clock = (min_diff < 999999) ? (1000000 / (min_diff * 2)) : 100000;
    if (est_clock > 80000 && est_clock < 120000) est_clock = 100000;

    uint8_t decoded_bytes[32];
    int decoded_count = 0;
    uint8_t current_byte = 0;
    int bit_count = 0;

    for(int i=1; i<sample_count; i++) {
      if (!(transition_states[i-1] & (1ULL<<35)) && (transition_states[i] & (1ULL<<35))) {
        bool mosi_val = (transition_states[i] & (1ULL<<32));
        current_byte = (current_byte << 1) | (mosi_val ? 1 : 0);
        bit_count++;
        if (bit_count == 8) {
          if (decoded_count < 32) decoded_bytes[decoded_count++] = current_byte;
          bit_count = 0;
        }
      }
    }

    if (decoded_count < 2) return;

    Serial.print("{\"protocol\":\"SPI\",\"sclk\":\"CH4\",\"mosi\":\"CH5\",\"miso\":\"CH6\",\"cs\":\"CH7\",\"electrical_interface\":\"TTL 3.3V\",\"confidence\":96.0,\"clock_frequency\":");
    Serial.print(est_clock);
    Serial.print(",\"CPOL\":0,\"CPHA\":0,\"data_bits\":8,\"bus_speed\":\"");
    Serial.print(est_clock / 1000.0, 1);
    Serial.print(" kbps\",\"channels\":[");
    printChannel("CH4", "SCK", 35); Serial.print(","); printChannel("CH5", "MOSI", 32); Serial.print(",");
    printChannel("CH6", "MISO", 33); Serial.print(","); printChannel("CH7", "CS", 25);
    Serial.print("],\"decoded\":[");

    for(int k=0; k<decoded_count; k++) {
      if (k > 0) Serial.print(",");
      Serial.print("{\"channel\":\"CH5\",\"hex\":\"0x");
      if(decoded_bytes[k] < 16) Serial.print("0");
      Serial.print(decoded_bytes[k], HEX);
      Serial.print("\",\"dec\":");
      Serial.print(decoded_bytes[k]);
      Serial.print(",\"ascii\":\"");
      if (decoded_bytes[k] >= 32 && decoded_bytes[k] <= 126 && decoded_bytes[k] != '"' && decoded_bytes[k] != '\\') {
        Serial.print((char)decoded_bytes[k]);
      } else {
        Serial.print(".");
      }
      Serial.print("\"}");
    }
    Serial.println("]}");
    
    // Update LCD
    static String last_spi = "";
    String new_spi = String(est_clock/1000) + " kHz Clock";
    if (last_spi != new_spi) {
      lcd_busy = true;
      lcd.clear();
      lcd.print("SPI DETECTED");
      lcd.setCursor(0, 1);
      lcd.print(new_spi);
      lcd_busy = false;
      last_spi = new_spi;
    }
  }
}

void setup() {
  Serial.begin(115200);
  
  // Monitoring channels
  pinMode(36, INPUT); // CH1 (UART) 
  pinMode(39, INPUT); // CH2 (I2C SDA) 
  pinMode(34, INPUT); // CH3 (I2C SCL) 
  pinMode(35, INPUT); // CH4 (SPI SCK) 
  pinMode(32, INPUT_PULLDOWN); // CH5 (SPI MOSI)
  pinMode(33, INPUT_PULLDOWN); // CH6 (SPI MISO)
  pinMode(25, INPUT_PULLDOWN); // CH7 (SPI CS)
  
  // LCD on default ESP32 I2C pins (GPIO 21 = SDA, GPIO 22 = SCL)
  Wire.begin(21, 22);
  Wire.setClock(100000);
  delay(100);

  // Auto-detect LCD I2C address (0x27 or 0x3F)
  Wire.beginTransmission(0x27);
  if (Wire.endTransmission() != 0) {
    Wire.beginTransmission(0x3F);
    if (Wire.endTransmission() == 0) {
      lcd = LiquidCrystal_I2C(0x3F, 16, 2);
    }
  }

  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.print("AUTOSCOPE READY");
  lcd.setCursor(0, 1);
  lcd.print("SCANNING BUS...");
}

void loop() {
  captureSignal();
  if(sample_count > 0) analyzeProtocol();
}