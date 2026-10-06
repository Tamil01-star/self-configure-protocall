import serial
import json
import psycopg2
import time
from datetime import datetime

import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# ==========================================
# CONFIGURATION
# ==========================================
# Change this to your ESP32's COM port (e.g., "COM3" for Windows, "/dev/ttyUSB0" for Linux)
SERIAL_PORT = os.getenv("SERIAL_PORT", "COM3")
BAUD_RATE = int(os.getenv("BAUD_RATE", 115200))

# Your Neon Database Connection String
DB_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://neondb_owner:npg_cxd3nW6oSmYK@ep-plain-math-b5jlzssb-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
)

def setup_database():
    """Connects to NeonDB and ensures our logging table exists."""
    print("Connecting to Neon PostgreSQL...")
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    # Create the table if it doesn't exist. We use JSONB to flexibly store whatever the ESP32 sends.
    cur.execute("""
        CREATE TABLE IF NOT EXISTS autoscope_logs (
            id SERIAL PRIMARY KEY,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            protocol VARCHAR(50),
            confidence REAL,
            raw_json JSONB
        )
    """)
    conn.commit()
    print("Database table ready!")
    return conn, cur

def listen_to_esp32(conn, cur):
    """Listens to the ESP32 over USB and uploads detected protocols to NeonDB."""
    print(f"Opening Serial Port {SERIAL_PORT}...")
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        print("Waiting for AutoScope signals...\n")
        
        while True:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8').strip()
                
                # Check if it's our JSON output
                if line.startswith("{") and line.endswith("}"):
                    try:
                        data = json.loads(line)
                        print(f"🎯 Detected: {data.get('protocol')} (Confidence: {data.get('confidence')}%)")
                        
                        # Insert into Neon DB
                        cur.execute("""
                            INSERT INTO autoscope_logs (protocol, confidence, raw_json)
                            VALUES (%s, %s, %s)
                        """, (
                            data.get('protocol', 'UNKNOWN'),
                            data.get('confidence', 0.0),
                            json.dumps(data)
                        ))
                        conn.commit()
                        print("✅ Saved to Neon Database!")
                        
                    except json.JSONDecodeError:
                        print("Failed to parse JSON:", line)
                    except Exception as e:
                        print("Database Error:", e)
                        conn.rollback() # Rollback on error so we can keep inserting
                else:
                    # Just normal debug print from ESP32
                    print(f"[ESP32]: {line}")
                    
    except serial.SerialException:
        print(f"❌ Error: Could not open {SERIAL_PORT}. Is it plugged in and is the port correct?")

if __name__ == "__main__":
    try:
        db_conn, db_cursor = setup_database()
        listen_to_esp32(db_conn, db_cursor)
    except KeyboardInterrupt:
        print("\nExiting...")
    except Exception as e:
        print("Fatal error:", e)
    finally:
        if 'db_cursor' in locals(): db_cursor.close()
        if 'db_conn' in locals(): db_conn.close()
