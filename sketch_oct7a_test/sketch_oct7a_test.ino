#include <Arduino.h>
#include <SPI.h>
#include <MFRC522.h>

// =========================================================================
// ESP32 #1: CONTINUOUS "HELLO" STREAMER + RC522 RFID SENSOR
// =========================================================================
#define UART_TX 17
#define UART_RX 16

// RC522 RFID SPI Pins
#define SS_PIN   5   // SDA / SS on RC522
#define RST_PIN  4   // RST on RC522
#define SPI_SCK  18  // SCK on RC522
#define SPI_MISO 19  // MISO on RC522
#define SPI_MOSI 23  // MOSI on RC522

#define BOOT_BTN 0

MFRC522 mfrc522(SS_PIN, RST_PIN);
HardwareSerial TestUART(2);

bool rc522_connected = false;

// Transmit a string character-by-character with a 2ms inter-byte gap
// This gives every UART character a clean, isolated Start Bit so all letters decode 100% perfectly!
void sendStringWithGap(const String& str) {
  for (unsigned int i = 0; i < str.length(); i++) {
    TestUART.write(str[i]);
    TestUART.flush(); // Wait until byte is completely transmitted over wire
    delay(2); // 2ms gap between characters for clean framing
  }
}

void initRC522() {
  pinMode(SS_PIN, OUTPUT);
  digitalWrite(SS_PIN, HIGH);
  pinMode(RST_PIN, OUTPUT);
  digitalWrite(RST_PIN, HIGH);
  delay(10);

  SPI.begin(SPI_SCK, SPI_MISO, SPI_MOSI);

  mfrc522.PCD_Init();
  delay(10);
  mfrc522.PCD_SetAntennaGain(mfrc522.RxGain_max);

  byte v = mfrc522.PCD_ReadRegister(mfrc522.VersionReg);
  Serial.print("RC522 Firmware: 0x");
  Serial.println(v, HEX);
  if (v == 0x00 || v == 0xFF) {
    Serial.println("[NOTE] RC522 not detected. Running UART HELLO streaming mode.");
    rc522_connected = false;
  } else {
    Serial.println("[SUCCESS] RC522 RFID Reader is ONLINE!");
    rc522_connected = true;
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(BOOT_BTN, INPUT_PULLUP);

  // Initialize UART channel to AutoScope (CH1 = GPIO36) at 9600 baud 8N1
  TestUART.begin(9600, SERIAL_8N1, UART_RX, UART_TX);

  Serial.println("==================================================");
  Serial.println("  ESP32 #1 TEST GENERATOR READY");
  Serial.println("  Streaming 'HELLO' with 2ms inter-byte framing");
  Serial.println("==================================================");

  initRC522();
}

void loop() {
  // 1. Check if the user pressed the BOOT button (Manual Test Trigger)
  if (digitalRead(BOOT_BTN) == LOW) {
    delay(50);
    if (digitalRead(BOOT_BTN) == LOW) {
      Serial.println(">>> Sending Test UID: 5A7B9C1D");
      sendStringWithGap("UID:5A7B9C1D");
      delay(400);
      return;
    }
  }

  // 2. Check if an RFID card is tapped
  if (rc522_connected) {
    byte bufferATQA[2];
    byte bufferSize = sizeof(bufferATQA);
    bool cardPresent = false;

    if (mfrc522.PICC_WakeupA(bufferATQA, &bufferSize) == MFRC522::STATUS_OK) {
      cardPresent = true;
    } else if (mfrc522.PICC_IsNewCardPresent()) {
      cardPresent = true;
    }

    if (cardPresent && mfrc522.PICC_ReadCardSerial()) {
      String uidPayload = "UID:";
      for (byte i = 0; i < mfrc522.uid.size; i++) {
        if (mfrc522.uid.uidByte[i] < 0x10) uidPayload += "0";
        uidPayload += String(mfrc522.uid.uidByte[i], HEX);
      }
      uidPayload.toUpperCase();

      Serial.print(">>> Card Scanned! Transmitting: ");
      Serial.println(uidPayload);

      sendStringWithGap(uidPayload);

      mfrc522.PICC_HaltA();
      mfrc522.PCD_StopCrypto1();
      delay(500);
      return;
    }
  }

  // 3. CONTINUOUS DEFAULT SIGNAL: Send "HELLO" every 200ms!
  Serial.println("Sending: HELLO");
  sendStringWithGap("HELLO");
  delay(200);
}
