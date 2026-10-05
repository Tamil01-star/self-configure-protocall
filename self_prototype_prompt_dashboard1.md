Build a premium, professional engineering web dashboard called:

AUTOSCOPE
Self-Configuring Protocol Logic Analyzer

This is a hackathon prototype for HW-04.

IMPORTANT:
Do NOT create a generic admin dashboard.
Do NOT create a basic CRUD dashboard.
Do NOT use a standard SaaS dashboard template.
Do NOT make it look like a normal analytics website.

The interface must look like a professional electronic test and measurement instrument / protocol analyzer.

Visual inspiration:
- Modern digital oscilloscope
- Saleae Logic Analyzer
- Keysight test equipment
- Tektronix instrumentation
- Professional embedded debugging tools
- Modern aerospace/engineering software

But DO NOT copy any company's branding, logo, or exact UI.

The final product must look like a real commercial engineering tool.

==================================================
1. CORE PRODUCT PURPOSE
==================================================

AutoScope automatically analyzes an unknown digital communication signal.

The user connects signal wires.

AutoScope:

1. Captures the signal
2. Analyzes voltage levels
3. Analyzes timing characteristics
4. Identifies the likely protocol
5. Detects communication parameters
6. Automatically configures the decoder
7. Decodes the data
8. Displays waveform + decoded data
9. Calculates protocol confidence
10. Explains WHY the protocol was detected
11. Monitors communication health
12. Detects possible faults
13. Supports unknown/custom protocol analysis

Initial supported protocols:

- UART / TTL
- I²C
- SPI

Architecture must be prepared for:

- RS-232
- RS-485
- CAN
- LIN
- Custom protocols

==================================================
2. TECHNOLOGY STACK
==================================================

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React icons
- Recharts where useful
- Framer Motion for subtle animations
- HTML Canvas or SVG for high-performance waveform rendering

Use a clean component architecture.

Do NOT put everything into one component.

Create reusable components such as:

/components
  TopBar
  Sidebar
  ProtocolStatus
  WaveformViewer
  ProtocolConfidence
  ParameterPanel
  DecodedDataTable
  DetectionEvidence
  SignalHealth
  ChannelMap
  EventTimeline
  AnalyzerConsole
  CaptureControls
  UnknownProtocolPanel
  FaultDiagnosis
  ConnectionStatus
  DemoModePanel

==================================================
3. OVERALL VISUAL STYLE
==================================================

The main visual identity should be:

DARK PROFESSIONAL ENGINEERING INSTRUMENT.

Background:
Very dark charcoal / near-black.

Use subtle layered panels rather than flat white cards.

Primary accent:
Electric cyan / blue.

Secondary status colors:

Green = healthy / detected
Amber = warning
Red = fault
Purple = analysis / advanced features

Avoid excessive gradients.

Avoid glassmorphism everywhere.

Avoid huge rounded cards.

Avoid excessive shadows.

Avoid excessive animations.

The design should feel precise, technical and premium.

Use:

- thin borders
- small corner radius
- compact spacing
- monospaced numbers
- technical labels
- small status indicators
- grid backgrounds
- oscilloscope-style graph styling
- subtle scanline/grid details

Typography:

Headings:
modern sans-serif

Technical values:
monospace font

Examples:

115200
3.3 V
97.4 %
0x27
1.000 MHz

These should look like instrument readouts.

==================================================
4. APP LAYOUT
==================================================

Desktop-first engineering workstation layout.

Structure:

----------------------------------------------------
TOP BAR
----------------------------------------------------
SIDEBAR | MAIN ANALYSIS AREA
        |
        | waveform
        | protocol
        | parameters
        | decoded data
        |
----------------------------------------------------

The application should be optimized for a laptop screen because this is a hackathon hardware demonstration.

Also make it responsive for tablet.

==================================================
5. TOP BAR
==================================================

Top bar:

Left:

AUTOSCOPE
Self-Configuring Protocol Logic Analyzer

Use a custom small waveform/signal icon beside the logo.

Center:

LIVE ANALYSIS

Right:

● DEVICE CONNECTED
ESP32 Capture Engine

Also show:

Sampling:
2 MS/s

Channels:
4

Status:

READY

Buttons:

[START CAPTURE]
[STOP]
[AUTO DETECT]

Make START CAPTURE the primary action.

==================================================
6. SIDEBAR
==================================================

Create a compact professional instrument-style sidebar.

Menu:

Overview
Live Analyzer
Waveform
Protocol Detection
Decoded Data
Signal Health
Fault Diagnosis
Unknown Protocol
Capture History
Settings

At bottom:

DEVICE

ESP32 Capture Engine
USB Connected

Show a small green connection indicator.

==================================================
7. MAIN OVERVIEW
==================================================

The first screen must immediately communicate:

"Connect a signal and AutoScope identifies it."

Create a large protocol detection section.

Example:

DETECTED PROTOCOL

UART TTL

97.4%

Detected automatically

Below:

Protocol:
UART TTL

Confidence:
97.4%

Logic Level:
3.3 V

Status:
HEALTHY

Use a large but compact instrument-style readout.

Do NOT make this look like a generic KPI card.

==================================================
8. LIVE WAVEFORM VIEWER
==================================================

This is the MOST IMPORTANT visual component.

Create a realistic oscilloscope-style waveform viewer.

Requirements:

- dark background
- fine grid
- horizontal time axis
- vertical voltage axis
- channel labels
- trigger marker
- timestamp
- measurement markers
- zoom controls
- horizontal scroll
- channel enable/disable
- pause/resume
- auto-scale

Example:

CH1 3.3V

      ┌──────┐       ┌───────┐
──────┘      └───────┘       └────

Time:
0 μs       20 μs       40 μs       60 μs

Show realistic digital square-wave data.

The waveform must animate smoothly in LIVE mode.

Do not use a fake static image.

Use Canvas or SVG to render the waveform.

Provide controls:

[ZOOM IN]
[ZOOM OUT]
[AUTO SCALE]
[PAUSE]
[TRIGGER]
[1X]
[2X]
[4X]

==================================================
9. MULTI-CHANNEL WAVEFORM
==================================================

When SPI or I²C is detected, display multiple channels.

Example:

CH1  SCLK
CH2  MOSI
CH3  MISO
CH4  CS

Each channel should have:

- label
- voltage scale
- enable/disable button
- activity indicator

For I²C:

CH1 SCL
CH2 SDA

For UART:

CH1 TX

Allow automatic channel naming.

==================================================
10. AUTO PROTOCOL DETECTION
==================================================

Create a dedicated panel:

PROTOCOL ANALYSIS

Display:

UART TTL     97.4%
I²C           8.2%
SPI           5.1%
RS-485        2.8%

Use horizontal confidence bars.

The selected protocol should be visually emphasized.

Below:

DETECTED:

UART TTL

Confidence:
97.4%

Do not make the confidence bars look like generic dashboard progress bars.

Make them look like instrument measurement indicators.

==================================================
11. EXPLAINABLE DETECTION
==================================================

Create a panel:

WHY WAS UART DETECTED?

Display:

✓ Single dominant data line
✓ Idle state HIGH
✓ Start-bit pattern detected
✓ Stable bit period
✓ 8.68 μs estimated bit width
✓ Valid stop bits
✓ 115200 baud candidate

Each item should animate into view when analysis completes.

Show:

Detection confidence:
97.4%

This is one of the core innovations.

==================================================
12. AUTOMATIC PARAMETER DETECTION
==================================================

Create an engineering-style parameter panel.

For UART:

PROTOCOL
UART TTL

BAUD RATE
115200 baud

DATA BITS
8

PARITY
NONE

STOP BITS
1

LOGIC LEVEL
3.3 V

BIT TIME
8.68 μs

For I²C:

BUS SPEED
100 kHz

ADDRESS
0x27

R/W
WRITE

ACK
YES

For SPI:

CLOCK
1 MHz

CPOL
0

CPHA
0

BIT ORDER
MSB FIRST

DATA WIDTH
8 bit

Values should use a monospace font.

==================================================
13. DECODED DATA VIEW
==================================================

Create a professional protocol decoder table.

Columns:

TIME
CHANNEL
HEX
DEC
ASCII
STATUS

Example:

0.000 ms | CH1 | 48 | 72 | H | ✓
0.087 ms | CH1 | 45 | 69 | E | ✓
0.174 ms | CH1 | 4C | 76 | L | ✓
0.261 ms | CH1 | 4C | 76 | L | ✓
0.348 ms | CH1 | 4F | 79 | O | ✓

Add tabs:

HEX
ASCII
DECIMAL
BINARY

Allow:

- search
- filtering
- pause
- export

Use virtualized rendering if necessary.

==================================================
14. I²C DECODER VIEW
==================================================

When I²C is selected, dynamically change the decoder.

Columns:

TIME
ADDRESS
R/W
DATA
ACK

Example:

0.000 ms | 0x27 | W | 0x00 | ✓
0.120 ms | 0x27 | W | 0x48 | ✓
0.240 ms | 0x27 | W | 0x65 | ✓

Highlight:

START
STOP
ACK
NACK

==================================================
15. SPI DECODER VIEW
==================================================

Columns:

TIME
MOSI
MISO
CS
STATUS

Example:

0.000 ms | 9A | 55 | LOW | ✓
0.010 ms | 20 | FF | LOW | ✓
0.020 ms | 55 | 12 | LOW | ✓

Also show:

CPOL
CPHA
Clock
Bit order

==================================================
16. AUTOMATIC ELECTRICAL LEVEL DETECTION
==================================================

Create a compact instrument panel:

ELECTRICAL ANALYSIS

LOW
0.08 V

HIGH
3.28 V

DETECTED LOGIC
3.3 V TTL

Signal amplitude:
3.20 V

Add a small voltage meter visualization.

Possible future interfaces:

1.8 V
3.3 V
5 V
RS-232
RS-485

Only show detected level as active.

==================================================
17. AUTOMATIC CHANNEL IDENTIFICATION
==================================================

Create:

CHANNEL MAPPING

CH1 → SCLK
CH2 → MOSI
CH3 → MISO
CH4 → CS

Each mapping should have a confidence value.

Example:

CH1 → SCLK    98%
CH2 → MOSI    96%
CH3 → MISO    91%
CH4 → CS      94%

Allow manual override.

==================================================
18. COMMUNICATION HEALTH
==================================================

Create a professional diagnostic panel.

COMMUNICATION HEALTH

Health Score:
94 / 100

Frame Errors:
0

Parity Errors:
0

Timing Jitter:
1.2%

Noise Events:
2

Invalid Frames:
0

Use a circular or semi-circular instrument gauge.

Do not use a generic donut chart.

Make it look like a test equipment health meter.

Status:

● HEALTHY

If errors increase:

● WARNING

If severe:

● FAULT

==================================================
19. FAULT DIAGNOSIS
==================================================

Create:

AUTOMATIC FAULT DIAGNOSIS

Example:

⚠ TIMING ANOMALY DETECTED

18% frame errors detected.

Possible causes:

1. Baud-rate mismatch
2. Signal integrity issue
3. Timing instability

Recommended action:

Verify transmitter and receiver baud-rate configuration.

Make this section visually distinct.

==================================================
20. UNKNOWN PROTOCOL MODE
==================================================

Create a dedicated screen:

UNKNOWN / CUSTOM PROTOCOL

If no known protocol has sufficient confidence:

Display:

Protocol:
UNKNOWN

Confidence:
41%

Voltage:
3.3 V

Channels:
2

Dominant Frequency:
2.4 MHz

Estimated Frame Length:
16 bits

Repeating Pattern:
DETECTED

Then show:

RAW WAVEFORM

TIMING ANALYSIS

HEX STREAM

PATTERN ANALYSIS

Message:

"No known protocol confidently identified.
AutoScope is providing signal intelligence for reverse engineering."

This is important because the problem statement explicitly mentions custom protocols.

==================================================
21. LIVE ANALYSIS ANIMATION
==================================================

When AUTO DETECT is clicked:

Show a short professional sequence:

1. CAPTURING SIGNAL
2. ANALYZING VOLTAGE
3. EXTRACTING TIMING FEATURES
4. IDENTIFYING SIGNAL STRUCTURE
5. COMPARING PROTOCOL FINGERPRINTS
6. ESTIMATING PARAMETERS
7. CONFIGURING DECODER
8. DECODING DATA

Use subtle progress animation.

Total animation:
approximately 2 seconds.

Then reveal:

UART TTL
97.4%

Do not make this cartoonish.

==================================================
22. DEMO MODE
==================================================

Create a DEMO MODE button.

The hackathon prototype must work even without the physical ESP32 connected.

Demo modes:

UART DEMO
I²C DEMO
SPI DEMO
UNKNOWN PROTOCOL DEMO
FAULT DEMO

When the user selects UART DEMO:

Generate realistic simulated waveform data.

Show:

UART TTL
115200
8N1
3.3 V

Decoded:

HELLO AUTOSCOPE

When I²C DEMO:

Show:

I²C
100 kHz
0x27
ACK

When SPI DEMO:

Show:

SPI
1 MHz
CPOL 0
CPHA 0

When FAULT DEMO:

Show:

Frame errors
Timing jitter
Warning state

IMPORTANT:
Clearly label simulated data as:

DEMO / SIMULATION

Never pretend simulated data is coming from real hardware.

==================================================
23. REAL HARDWARE API ARCHITECTURE
==================================================

Prepare the frontend for future ESP32 integration.

Create an abstraction:

SignalSource

with:

DemoSignalSource
SerialSignalSource
WebSocketSignalSource

The frontend should be able to receive data such as:

{
  "timestamp": 0.000,
  "channels": {
    "CH1": 1,
    "CH2": 0,
    "CH3": 1,
    "CH4": 0
  }
}

Also support protocol detection messages:

{
  "protocol": "UART",
  "confidence": 0.974,
  "baud": 115200,
  "dataBits": 8,
  "parity": "NONE",
  "stopBits": 1,
  "logicLevel": 3.3
}

Design the application so replacing DEMO data with ESP32 serial/WebSocket data requires minimal changes.

==================================================
24. CAPTURE CONTROL
==================================================

Create a professional control strip:

[● START]
[■ STOP]
[Ⅱ PAUSE]
[AUTO DETECT]
[TRIGGER]
[AUTO SCALE]

Show:

Sampling Rate:
2 MS/s

Buffer:
64 KB

Channels:
4

Capture:
LIVE

==================================================
25. EVENT TIMELINE
==================================================

Create a compact event timeline.

Example:

00:00.000
Signal detected

00:00.032
UART candidate identified

00:00.044
115200 baud confirmed

00:00.051
Decoder configured

00:00.060
Data decoded

This gives the interface a professional engineering-debugging feel.

==================================================
26. CAPTURE HISTORY
==================================================

Allow users to save captures.

Example:

Capture #001
UART
115200
Healthy
10:42:18

Capture #002
I²C
100 kHz
Healthy
10:44:21

Capture #003
SPI
1 MHz
Warning
10:48:10

Clicking a capture should reopen its analysis.

==================================================
27. COMMAND CONSOLE
==================================================

Add an optional terminal-style console.

Example:

[AUTOSCOPE]
> Capturing CH1...
> Sampling rate: 2 MS/s
> Edge analysis complete
> UART candidate detected
> Baud candidate: 115200
> Frame validation: PASS
> Decoder configured
> Capture complete

Use monospace text.

==================================================
28. EXPORT
==================================================

Buttons:

Export CSV
Export JSON
Save Capture
Copy HEX

Prepare download functionality.

==================================================
29. LANDING / INTRO SCREEN
==================================================

Before entering the analyzer, create a minimal professional intro.

Large:

AUTOSCOPE

SELF-CONFIGURING
PROTOCOL LOGIC ANALYZER

Tagline:

"Connect the signal.
Let AutoScope understand it."

Below:

[LAUNCH ANALYZER]

Small feature indicators:

AUTO DETECTION
AUTO CONFIGURATION
AUTO DECODING
FAULT DIAGNOSIS

Do not make this a marketing landing page.
Keep it like professional engineering software.

==================================================
30. MICRO-INTERACTIONS
==================================================

Use subtle animations:

- waveform scrolling
- protocol detection
- confidence percentage counting
- status indicators
- panel transitions
- capture state changes

Avoid:

- bouncing cards
- excessive particle effects
- huge animations
- unnecessary 3D effects

Everything must feel precise and technical.

==================================================
31. DESIGN DETAILS
==================================================

Use a consistent 8px spacing system.

Borders:
thin and subtle.

Panel radius:
small, approximately 6–10px.

Buttons:
compact.

Labels:
uppercase, small, letter-spaced.

Numbers:
monospace.

Waveform:
high contrast.

Grid:
subtle.

Background:
dark technical workspace.

The application should feel like:

"an instrument engineers use"

not:

"a website engineers visit."

==================================================
32. RESPONSIVENESS
==================================================

Primary target:

1366×768 laptop
1920×1080 desktop

Make the waveform area large.

Do not allow the dashboard to become vertically endless.

Use tabs/drawers for secondary information.

On smaller screens:
collapse sidebar.

==================================================
33. ACCESSIBILITY
==================================================

Ensure:

- readable contrast
- keyboard navigation
- tooltips
- accessible buttons
- no color-only meaning

Use icons plus text.

==================================================
34. SAMPLE DATA
==================================================

Create realistic demo datasets.

UART:

Protocol:
UART TTL

Baud:
115200

Data:
HELLO AUTOSCOPE

I²C:

Bus:
100 kHz

Address:
0x27

Data:
0x00
0x48
0x65
0x6C
0x6C
0x6F

SPI:

Clock:
1 MHz

CPOL:
0

CPHA:
0

MOSI:
9A 20 55

MISO:
55 FF 12

Fault Demo:

UART:
115200

Frame errors:
18%

Health:
62/100

==================================================
35. IMPORTANT HACKATHON REQUIREMENT
==================================================

The dashboard must immediately demonstrate the core innovation.

The judge should understand within 10 seconds:

UNKNOWN SIGNAL
↓
AUTO ANALYSIS
↓
UART / I²C / SPI DETECTED
↓
PARAMETERS AUTOMATICALLY IDENTIFIED
↓
DATA DECODED

Make this visual flow obvious.

==================================================
36. DO NOT DO THESE THINGS
==================================================

Do NOT:

- create a generic admin template
- use huge cards
- use excessive rounded corners
- use excessive gradients
- use random stock images
- use unnecessary illustrations
- use fake AI chatbots
- use meaningless statistics
- create a generic sidebar with unrelated analytics
- make it look like a finance dashboard
- make it look like a college project template

This is an ELECTRONIC TEST INSTRUMENT.

==================================================
37. FINAL QUALITY BAR
==================================================

The final result should look like something that could be shown to:

- embedded engineers
- VLSI engineers
- hardware debugging engineers
- electronics researchers
- industrial automation engineers

The UI should communicate:

PRECISION
ENGINEERING
SIGNAL ANALYSIS
AUTOMATION
RELIABILITY

The first screen should be visually impressive but technically credible.

Build the complete frontend with functional demo interactions.

Do not stop at static mockups.

All buttons should work in DEMO MODE.

The waveform should animate.

Protocol detection should transition between UART/I²C/SPI.

Parameters should update dynamically.

Health score should change during fault simulation.

Channel mapping should update depending on protocol.

Unknown protocol mode should work.

Use clean TypeScript architecture so the real ESP32/Pico hardware can be connected later.

Finally, provide a clear project structure and explain where the ESP32 serial/WebSocket integration should be added.