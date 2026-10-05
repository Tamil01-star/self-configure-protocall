# AUTOSCOPE - Self-Configuring Protocol Logic Analyzer
**Hackathon Prototype (HW-04)**

AutoScope is a professional engineering web dashboard and self-configuring digital logic analyzer. It automatically connects to digital communication signals (UART/TTL, I²C, SPI, RS-485, CAN, custom protocols), analyzes voltage levels and edge timing characteristics, identifies protocol signatures, configures decoder parameters, decodes data streams, and evaluates signal health and fault conditions.

---

## 🚀 Key Innovations & Features

1. **Automatic Signal Classification**: Automatically detects protocol type (UART, I²C, SPI, UNKNOWN) with real-time confidence scores and explainable fingerprint proof evidence.
2. **Auto-Configured Parameter Extraction**: Computes baud rate (115200), bit width (8.68 μs), bus speeds (100 kHz, 1 MHz), CPOL/CPHA, and slave addresses without manual user configuration.
3. **Oscilloscope Waveform Engine**: High-performance HTML5 Canvas digital waveform viewer with multi-channel rendering, microsecond grid, zoom scaling (1X–4X), horizontal panning, trigger indicators, and pause/resume capabilities.
4. **Multi-Protocol Decoder**: Decodes stream packets into HEX, ASCII, Decimal, and Binary tables with search, filter, freeze, CSV export, and JSON export.
5. **Electrical & Communication Health Metrics**: Measures analog frontend logic levels (VOL, VOH, Vp-p) and computes health score gauges (frame errors, parity errors, timing jitter, noise events).
6. **Automatic Fault Diagnosis**: Detects baud-rate mismatches, signal degradation, and elevated ground offsets with suggested root causes and recommended engineer actions.
7. **Unknown / Custom Protocol Reverse Engineering**: Signal intelligence suite for unclassified signals (dominant frequency, frame length, repeating pattern recognition, raw hex dumps).
8. **Real Hardware API Abstraction**: Prepared for direct USB WebSerial or WiFi WebSocket streaming from ESP32 or RP2040 microcontrollers.

---

## 📁 Component Architecture

```
/src
├── components/
│   ├── TopBar.tsx                 # Instrument header, hardware telemetry & primary actions
│   ├── Sidebar.tsx                # Instrument-style navigation sidebar & device status
│   ├── ProtocolStatus.tsx         # Large instrument readout banner for detected protocol
│   ├── WaveformViewer.tsx         # HTML5 Canvas Oscilloscope waveform viewer with zoom/pan controls
│   ├── ProtocolConfidence.tsx     # Segmented confidence spectrum bars for UART, I2C, SPI, RS-485
│   ├── DetectionEvidence.tsx      # Explainable fingerprint evidence panel ("Why UART?")
│   ├── ParameterPanel.tsx         # Monospace auto-configured parameter readout
│   ├── ElectricalLevelPanel.tsx   # Analog frontend VOL/VOH/Vp-p logic level matcher
│   ├── DecodedDataTable.tsx       # Protocol decoder table with HEX/ASCII/DEC/BINARY streams & CSV export
│   ├── SignalHealth.tsx           # Circular instrument gauge & error metrics
│   ├── FaultDiagnosis.tsx         # Diagnostic warning panel for signal anomalies & root causes
│   ├── ChannelMap.tsx             # Automatic channel mapping (CH1->SCLK 98%, etc.) with manual override
│   ├── UnknownProtocolPanel.tsx   # Reverse engineering panel for custom protocols
│   ├── EventTimeline.tsx          # Chronological signal event log
│   ├── AnalyzerConsole.tsx        # Terminal-style command console
│   ├── CaptureControls.tsx        # Workstation control strip (Start, Stop, Pause, Auto Detect)
│   ├── DemoModePanel.tsx          # Hackathon interactive simulation suite (UART, I2C, SPI, Fault)
│   ├── LandingIntro.tsx           # Product intro screen with 10-second judge innovation flow
│   ├── CaptureHistory.tsx         # Saved capture log archive & re-opener
│   ├── ConnectionStatus.tsx       # Hardware capture engine telemetry
│   ├── SettingsModal.tsx          # Analyzer sampling frequency & device configuration
│   └── AutoDetectModal.tsx        # 2-second animated auto-detection pipeline sequence
├── services/
│   ├── SignalSource.ts            # Hardware API abstraction (Demo, Serial, WebSocket)
│   └── mockData.ts                # Realistic preset telemetry for UART, I2C, SPI, Unknown, Fault
├── types/
│   └── analyzer.ts                # TypeScript interfaces for all data structures
├── App.tsx                        # Main workstation container & tab router
├── index.css                      # Instrument styling, CRT scanlines & dark oscilloscope grid
└── main.tsx                       # React application entry point
```

---

## 🔌 Connecting Physical ESP32 / RP2040 Hardware

AutoScope is built with a clean hardware abstraction layer in `src/services/SignalSource.ts`.

To connect physical hardware:

### Option A: Direct USB Serial (WebSerial API)
1. Flash your ESP32 with the AutoScope DMA Logic Analyzer firmware.
2. Connect ESP32 pin **GPIO 4 (CH1)**, **GPIO 5 (CH2)**, **GPIO 6 (CH3)**, **GPIO 7 (CH4)** to the target circuit under test.
3. In the AutoScope UI, click **Settings** → **WebSerial USB** or use the **Connection Status** panel.
4. AutoScope streams binary/JSON frames over USB at 921,600 baud.

### Option B: WiFi WebSocket Stream
1. Connect ESP32 to local WiFi or AP mode (`192.168.4.1`).
2. Start WebSocket server at `ws://192.168.4.1/ws`.
3. In AutoScope UI, select **WebSocket** mode.

### ESP32 Telemetry JSON Packet Format:
```json
{
  "timestamp": 0.000,
  "channels": {
    "CH1": 1,
    "CH2": 0,
    "CH3": 1,
    "CH4": 0
  }
}
```

---

## 🛠️ Technology Stack

- **React 19**
- **TypeScript 5.6**
- **Vite 5.4**
- **Tailwind CSS 3.4**
- **Lucide React** (Instrument icons)
- **HTML5 Canvas** (High-performance Oscilloscope rendering)

---

## ⚡ Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```
