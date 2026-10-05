import type { DemoPreset, ProtocolDetectionPayload } from '../types/analyzer';

export function getPresetData(preset: DemoPreset): ProtocolDetectionPayload {
  switch (preset) {
    case 'I2C_DEMO':
      return {
        protocol: 'I2C',
        confidence: 94.8,
        parameters: {
          busSpeedKhz: 100,
          addressHex: '0x27',
          rwMode: 'WRITE',
          ackState: 'ACK',
          logicLevelV: 3.3,
          estimatedFrameLenBits: 9,
          dominantFreqMhz: 0.1,
        },
        channels: [
          {
            id: 'CH1',
            name: 'SCL',
            color: '#00f0ff',
            enabled: true,
            highVoltage: 3.3,
            lowVoltage: 0.08,
            dutyCycle: 50.0,
            frequencyHz: 100000,
            digitalData: [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1],
          },
          {
            id: 'CH2',
            name: 'SDA',
            color: '#10b981',
            enabled: true,
            highVoltage: 3.28,
            lowVoltage: 0.07,
            dutyCycle: 42.5,
            frequencyHz: 50000,
            digitalData: [1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1],
          },
          {
            id: 'CH3',
            name: 'CH3',
            color: '#64748b',
            enabled: false,
            highVoltage: 0.0,
            lowVoltage: 0.0,
            dutyCycle: 0,
            frequencyHz: 0,
            digitalData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          {
            id: 'CH4',
            name: 'CH4',
            color: '#64748b',
            enabled: false,
            highVoltage: 0.0,
            lowVoltage: 0.0,
            dutyCycle: 0,
            frequencyHz: 0,
            digitalData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          }
        ],
        decodedRows: [
          { id: '1', timeMs: 0.000, channel: 'I2C', hex: '0x27', dec: 39, ascii: '\'', binary: '00100111', status: 'START', addressHex: '0x27', rw: 'W', ackState: 'ACK' },
          { id: '2', timeMs: 0.120, channel: 'I2C', hex: '0x00', dec: 0, ascii: 'NUL', binary: '00000000', status: 'ACK', addressHex: '0x27', rw: 'W', ackState: 'ACK' },
          { id: '3', timeMs: 0.240, channel: 'I2C', hex: '0x48', dec: 72, ascii: 'H', binary: '01001000', status: 'ACK', addressHex: '0x27', rw: 'W', ackState: 'ACK' },
          { id: '4', timeMs: 0.360, channel: 'I2C', hex: '0x65', dec: 101, ascii: 'e', binary: '01100101', status: 'ACK', addressHex: '0x27', rw: 'W', ackState: 'ACK' },
          { id: '5', timeMs: 0.480, channel: 'I2C', hex: '0x6C', dec: 108, ascii: 'l', binary: '01101100', status: 'ACK', addressHex: '0x27', rw: 'W', ackState: 'ACK' },
          { id: '6', timeMs: 0.600, channel: 'I2C', hex: '0x6C', dec: 108, ascii: 'l', binary: '01101100', status: 'ACK', addressHex: '0x27', rw: 'W', ackState: 'ACK' },
          { id: '7', timeMs: 0.720, channel: 'I2C', hex: '0x6F', dec: 111, ascii: 'o', binary: '01101111', status: 'STOP', addressHex: '0x27', rw: 'W', ackState: 'ACK' },
        ],
        evidence: [
          { id: 'e1', text: 'Open-drain pull-up topology detected (3.3V)', verified: true },
          { id: 'e2', text: 'Clock line (CH1 SCL) regular square wave at 100.0 kHz', verified: true },
          { id: 'e3', text: 'SDA state transition during SCL HIGH (START condition)', verified: true },
          { id: 'e4', text: '7-bit slave address byte + R/W bit sequence confirmed', verified: true },
          { id: 'e5', text: 'ACK bit low pulse on 9th clock edge detected', verified: true },
          { id: 'e6', text: 'SDA rising transition while SCL is HIGH (STOP condition)', verified: true },
        ],
        confidences: [
          { protocol: 'I2C', displayName: 'I²C', confidence: 94.8, isDetected: true },
          { protocol: 'SPI', displayName: 'SPI', confidence: 12.4, isDetected: false },
          { protocol: 'UART', displayName: 'UART TTL', confidence: 6.1, isDetected: false },
          { protocol: 'RS485', displayName: 'RS-485', confidence: 3.0, isDetected: false },
        ],
        health: [{
          healthScore: 98,
          frameErrors: 0,
          parityErrors: 0,
          timingJitterPercent: 0.8,
          noiseEvents: 0,
          invalidFrames: 0,
          status: 'HEALTHY'
        }],
        electrical: {
          vLow: 0.07,
          vHigh: 3.30,
          vAmplitude: 3.23,
          detectedStandard: '3.3 V TTL',
          availableStandards: [
            { name: '1.8 V', voltage: 1.8, active: false },
            { name: '3.3 V TTL', voltage: 3.3, active: true },
            { name: '5 V CMOS', voltage: 5.0, active: false },
            { name: 'RS-232', voltage: 12.0, active: false },
            { name: 'RS-485', voltage: 5.0, active: false },
          ]
        },
        mappings: [
          { channelId: 'CH1', assignedRole: 'SCL (Serial Clock)', confidence: 98 },
          { channelId: 'CH2', assignedRole: 'SDA (Serial Data)', confidence: 96 },
          { channelId: 'CH3', assignedRole: 'Unused / Ground', confidence: 100 },
          { channelId: 'CH4', assignedRole: 'Unused / Ground', confidence: 100 },
        ],
        fault: {
          hasFault: false,
          title: 'NORMAL OPERATION',
          errorPercentage: 0,
          possibleCauses: [],
          recommendedAction: 'No action required. Signal integrity is within normal specification.'
        },
        unknown: {
          confidence: 94.8,
          logicVoltage: 3.3,
          channelCount: 2,
          dominantFreqMhz: 0.1,
          estimatedFrameBits: 9,
          patternDetected: true,
          rawBytes: ['0x27', '0x00', '0x48', '0x65', '0x6C', '0x6C', '0x6F']
        }
      };

    case 'SPI_DEMO':
      return {
        protocol: 'SPI',
        confidence: 96.2,
        parameters: {
          clockMhz: 1.0,
          cpol: 0,
          cpha: 0,
          bitOrder: 'MSB FIRST',
          dataWidth: 8,
          logicLevelV: 3.3,
          estimatedFrameLenBits: 8,
          dominantFreqMhz: 1.0,
        },
        channels: [
          { id: 'CH1', name: 'SCLK', color: '#00f0ff', enabled: true, highVoltage: 3.3, lowVoltage: 0.05, dutyCycle: 50.0, frequencyHz: 1000000, digitalData: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1] },
          { id: 'CH2', name: 'MOSI', color: '#10b981', enabled: true, highVoltage: 3.29, lowVoltage: 0.06, dutyCycle: 45.0, frequencyHz: 500000, digitalData: [1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1] },
          { id: 'CH3', name: 'MISO', color: '#f59e0b', enabled: true, highVoltage: 3.25, lowVoltage: 0.08, dutyCycle: 40.0, frequencyHz: 500000, digitalData: [0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1] },
          { id: 'CH4', name: 'CS', color: '#a855f7', enabled: true, highVoltage: 3.3, lowVoltage: 0.04, dutyCycle: 10.0, frequencyHz: 100000, digitalData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1] },
        ],
        decodedRows: [
          { id: '1', timeMs: 0.000, channel: 'SPI', hex: '9A', dec: 154, ascii: '?', binary: '10011010', status: 'OK', mosiHex: '9A', misoHex: '55', csState: 'LOW' },
          { id: '2', timeMs: 0.010, channel: 'SPI', hex: '20', dec: 32, ascii: 'SPC', binary: '00100000', status: 'OK', mosiHex: '20', misoHex: 'FF', csState: 'LOW' },
          { id: '3', timeMs: 0.020, channel: 'SPI', hex: '55', dec: 85, ascii: 'U', binary: '01010101', status: 'OK', mosiHex: '55', misoHex: '12', csState: 'LOW' },
          { id: '4', timeMs: 0.030, channel: 'SPI', hex: '41', dec: 65, ascii: 'A', binary: '01000001', status: 'OK', mosiHex: '41', misoHex: '34', csState: 'LOW' },
        ],
        evidence: [
          { id: 'e1', text: '4 synchronous channel activity pattern detected', verified: true },
          { id: 'e2', text: 'Chip Select (CH4 CS) active LOW framing detected', verified: true },
          { id: 'e3', text: 'Clock signal (CH1 SCLK) bursts at 1.000 MHz', verified: true },
          { id: 'e4', text: 'Data sampled on rising edge (CPOL=0, CPHA=0 / Mode 0)', verified: true },
          { id: 'e5', text: 'Full-duplex MOSI & MISO line byte alignment verified', verified: true },
        ],
        confidences: [
          { protocol: 'SPI', displayName: 'SPI Bus', confidence: 96.2, isDetected: true },
          { protocol: 'I2C', displayName: 'I²C', confidence: 18.5, isDetected: false },
          { protocol: 'UART', displayName: 'UART TTL', confidence: 4.2, isDetected: false },
          { protocol: 'CAN', displayName: 'CAN Bus', confidence: 2.1, isDetected: false },
        ],
        health: [{
          healthScore: 97,
          frameErrors: 0,
          parityErrors: 0,
          timingJitterPercent: 0.5,
          noiseEvents: 1,
          invalidFrames: 0,
          status: 'HEALTHY'
        }],
        electrical: {
          vLow: 0.04,
          vHigh: 3.30,
          vAmplitude: 3.26,
          detectedStandard: '3.3 V TTL',
          availableStandards: [
            { name: '1.8 V', voltage: 1.8, active: false },
            { name: '3.3 V TTL', voltage: 3.3, active: true },
            { name: '5 V CMOS', voltage: 5.0, active: false },
            { name: 'RS-232', voltage: 12.0, active: false },
            { name: 'RS-485', voltage: 5.0, active: false },
          ]
        },
        mappings: [
          { channelId: 'CH1', assignedRole: 'SCLK (Serial Clock)', confidence: 98 },
          { channelId: 'CH2', assignedRole: 'MOSI (Master Out Slave In)', confidence: 96 },
          { channelId: 'CH3', assignedRole: 'MISO (Master In Slave Out)', confidence: 91 },
          { channelId: 'CH4', assignedRole: 'CS / SS (Chip Select)', confidence: 94 },
        ],
        fault: {
          hasFault: false,
          title: 'HEALTHY SPI SIGNAL',
          errorPercentage: 0,
          possibleCauses: [],
          recommendedAction: 'Bus timing and CS setup/hold times are optimal.'
        },
        unknown: {
          confidence: 96.2,
          logicVoltage: 3.3,
          channelCount: 4,
          dominantFreqMhz: 1.0,
          estimatedFrameBits: 8,
          patternDetected: true,
          rawBytes: ['9A', '20', '55', '41']
        }
      };

    case 'FAULT_DEMO':
      return {
        protocol: 'UART',
        confidence: 84.1,
        parameters: {
          baudRate: 115200,
          dataBits: 8,
          parity: 'NONE',
          stopBits: 1,
          bitTimeUs: 8.68,
          logicLevelV: 3.3,
          estimatedFrameLenBits: 10,
          dominantFreqMhz: 0.115,
        },
        channels: [
          { id: 'CH1', name: 'TX (Faulty)', color: '#ef4444', enabled: true, highVoltage: 3.10, lowVoltage: 0.45, dutyCycle: 48.0, frequencyHz: 115200, digitalData: [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0] },
          { id: 'CH2', name: 'CH2', color: '#64748b', enabled: false, highVoltage: 0, lowVoltage: 0, dutyCycle: 0, frequencyHz: 0, digitalData: [] },
          { id: 'CH3', name: 'CH3', color: '#64748b', enabled: false, highVoltage: 0, lowVoltage: 0, dutyCycle: 0, frequencyHz: 0, digitalData: [] },
          { id: 'CH4', name: 'CH4', color: '#64748b', enabled: false, highVoltage: 0, lowVoltage: 0, dutyCycle: 0, frequencyHz: 0, digitalData: [] },
        ],
        decodedRows: [
          { id: '1', timeMs: 0.000, channel: 'CH1', hex: '48', dec: 72, ascii: 'H', binary: '01001000', status: 'OK' },
          { id: '2', timeMs: 0.087, channel: 'CH1', hex: '12', dec: 18, ascii: 'DC2', binary: '00010010', status: 'ERROR' },
          { id: '3', timeMs: 0.174, channel: 'CH1', hex: '4C', dec: 76, ascii: 'L', binary: '01001100', status: 'OK' },
          { id: '4', timeMs: 0.261, channel: 'CH1', hex: '00', dec: 0, ascii: 'ERR', binary: '00000000', status: 'ERROR' },
        ],
        evidence: [
          { id: 'e1', text: 'Asynchronous single wire structure detected', verified: true },
          { id: 'e2', text: '18.4% frame framing errors detected on stop bit boundaries', verified: false },
          { id: 'e3', text: 'Elevated low-level voltage (0.45V grounding offset)', verified: false },
          { id: 'e4', text: 'Timing jitter ±8.4% exceeds standard RS-232/TTL tolerance', verified: false },
        ],
        confidences: [
          { protocol: 'UART', displayName: 'UART TTL (Degraded)', confidence: 84.1, isDetected: true },
          { protocol: 'UNKNOWN', displayName: 'Unknown Signal', confidence: 45.0, isDetected: false },
          { protocol: 'RS232', displayName: 'RS-232', confidence: 22.0, isDetected: false },
          { protocol: 'LIN', displayName: 'LIN Bus', confidence: 8.5, isDetected: false },
        ],
        health: [{
          healthScore: 62,
          frameErrors: 18,
          parityErrors: 4,
          timingJitterPercent: 8.4,
          noiseEvents: 14,
          invalidFrames: 6,
          status: 'WARNING'
        }],
        electrical: {
          vLow: 0.45,
          vHigh: 3.10,
          vAmplitude: 2.65,
          detectedStandard: '3.3 V TTL (NOISE ANOMALY)',
          availableStandards: [
            { name: '1.8 V', voltage: 1.8, active: false },
            { name: '3.3 V TTL', voltage: 3.3, active: true },
            { name: '5 V CMOS', voltage: 5.0, active: false },
            { name: 'RS-232', voltage: 12.0, active: false },
            { name: 'RS-485', voltage: 5.0, active: false },
          ]
        },
        mappings: [
          { channelId: 'CH1', assignedRole: 'TX (Data with Jitter)', confidence: 84 },
          { channelId: 'CH2', assignedRole: 'Unassigned', confidence: 0 },
          { channelId: 'CH3', assignedRole: 'Unassigned', confidence: 0 },
          { channelId: 'CH4', assignedRole: 'Unassigned', confidence: 0 },
        ],
        fault: {
          hasFault: true,
          title: 'TIMING ANOMALY & SIGNAL DEGRADATION DETECTED',
          errorPercentage: 18.4,
          possibleCauses: [
            '1. Baud-rate mismatch between transmitter & sampler',
            '2. Ground loop or insufficient pull-up resistance (VOL elevated to 0.45V)',
            '3. Excessive capacitive loading causing bit-edge slew and timing jitter'
          ],
          recommendedAction: 'Verify transmitter baud rate settings, inspect cable shielding, and measure ground wire resistance.'
        },
        unknown: {
          confidence: 84.1,
          logicVoltage: 3.1,
          channelCount: 1,
          dominantFreqMhz: 0.115,
          estimatedFrameBits: 10,
          patternDetected: true,
          rawBytes: ['48', '12', '4C', '00']
        }
      };

    case 'UNKNOWN_DEMO':
      return {
        protocol: 'UNKNOWN',
        confidence: 41.2,
        parameters: {
          logicLevelV: 3.3,
          estimatedFrameLenBits: 16,
          dominantFreqMhz: 2.4,
        },
        channels: [
          { id: 'CH1', name: 'SIG_A', color: '#a855f7', enabled: true, highVoltage: 3.3, lowVoltage: 0.05, dutyCycle: 33.3, frequencyHz: 2400000, digitalData: [1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1] },
          { id: 'CH2', name: 'SIG_B', color: '#00f0ff', enabled: true, highVoltage: 3.28, lowVoltage: 0.08, dutyCycle: 66.6, frequencyHz: 2400000, digitalData: [0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0] },
          { id: 'CH3', name: 'CH3', color: '#64748b', enabled: false, highVoltage: 0, lowVoltage: 0, dutyCycle: 0, frequencyHz: 0, digitalData: [] },
          { id: 'CH4', name: 'CH4', color: '#64748b', enabled: false, highVoltage: 0, lowVoltage: 0, dutyCycle: 0, frequencyHz: 0, digitalData: [] },
        ],
        decodedRows: [
          { id: '1', timeMs: 0.000, channel: 'CH1', hex: 'A5C3', dec: 42435, ascii: '??', binary: '1010010111000011', status: 'OK' },
          { id: '2', timeMs: 0.007, channel: 'CH1', hex: 'F00F', dec: 61455, ascii: '??', binary: '1111000000001111', status: 'OK' },
          { id: '3', timeMs: 0.014, channel: 'CH1', hex: '5A3C', dec: 23100, ascii: 'Z<', binary: '0101101000111100', status: 'OK' },
        ],
        evidence: [
          { id: 'e1', text: 'Synchronous clock pattern absent', verified: false },
          { id: 'e2', text: 'Non-standard baud rate detected (2.400 MHz)', verified: false },
          { id: 'e3', text: '16-bit repeating pulse frame detected', verified: true },
          { id: 'e4', text: 'High frequency differential pulse train', verified: true },
        ],
        confidences: [
          { protocol: 'UNKNOWN', displayName: 'Unknown Custom Protocol', confidence: 41.2, isDetected: true },
          { protocol: 'SPI', displayName: 'SPI Variant', confidence: 24.0, isDetected: false },
          { protocol: 'CAN', displayName: 'CAN Bus', confidence: 18.5, isDetected: false },
          { protocol: 'RS485', displayName: 'RS-485 Differential', confidence: 11.2, isDetected: false },
        ],
        health: [{
          healthScore: 85,
          frameErrors: 0,
          parityErrors: 0,
          timingJitterPercent: 2.1,
          noiseEvents: 3,
          invalidFrames: 0,
          status: 'HEALTHY'
        }],
        electrical: {
          vLow: 0.05,
          vHigh: 3.30,
          vAmplitude: 3.25,
          detectedStandard: '3.3 V Logic (Custom)',
          availableStandards: [
            { name: '1.8 V', voltage: 1.8, active: false },
            { name: '3.3 V TTL', voltage: 3.3, active: true },
            { name: '5 V CMOS', voltage: 5.0, active: false },
            { name: 'RS-232', voltage: 12.0, active: false },
            { name: 'RS-485', voltage: 5.0, active: false },
          ]
        },
        mappings: [
          { channelId: 'CH1', assignedRole: 'Signal Channel A (Primary)', confidence: 41 },
          { channelId: 'CH2', assignedRole: 'Signal Channel B (Inverted)', confidence: 38 },
          { channelId: 'CH3', assignedRole: 'Unused', confidence: 0 },
          { channelId: 'CH4', assignedRole: 'Unused', confidence: 0 },
        ],
        fault: {
          hasFault: false,
          title: 'NO KNOWN PROTOCOL MATCH',
          errorPercentage: 0,
          possibleCauses: [
            '1. Custom or proprietary microcontroller bit-banging protocol',
            '2. Non-standard clock multiplier (2.4 MHz)',
            '3. Encrypted or line-coded telemetry (e.g. Manchester, NRZ)'
          ],
          recommendedAction: 'AutoScope reverse-engineering signal intelligence panel activated below.'
        },
        unknown: {
          confidence: 41.2,
          logicVoltage: 3.3,
          channelCount: 2,
          dominantFreqMhz: 2.4,
          estimatedFrameBits: 16,
          patternDetected: true,
          rawBytes: ['A5C3', 'F00F', '5A3C', '7788']
        }
      };

    case 'UART_DEMO':
    default:
      return {
        protocol: 'UART',
        confidence: 97.4,
        parameters: {
          baudRate: 115200,
          dataBits: 8,
          parity: 'NONE',
          stopBits: 1,
          bitTimeUs: 8.68,
          logicLevelV: 3.3,
          estimatedFrameLenBits: 10,
          dominantFreqMhz: 0.1152,
        },
        channels: [
          { id: 'CH1', name: 'TX', color: '#00f0ff', enabled: true, highVoltage: 3.3, lowVoltage: 0.08, dutyCycle: 52.0, frequencyHz: 115200, digitalData: [1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1] },
          { id: 'CH2', name: 'CH2', color: '#64748b', enabled: false, highVoltage: 0, lowVoltage: 0, dutyCycle: 0, frequencyHz: 0, digitalData: [] },
          { id: 'CH3', name: 'CH3', color: '#64748b', enabled: false, highVoltage: 0, lowVoltage: 0, dutyCycle: 0, frequencyHz: 0, digitalData: [] },
          { id: 'CH4', name: 'CH4', color: '#64748b', enabled: false, highVoltage: 0, lowVoltage: 0, dutyCycle: 0, frequencyHz: 0, digitalData: [] },
        ],
        decodedRows: [
          { id: '1', timeMs: 0.000, channel: 'CH1', hex: '48', dec: 72, ascii: 'H', binary: '01001000', status: 'OK' },
          { id: '2', timeMs: 0.087, channel: 'CH1', hex: '45', dec: 69, ascii: 'E', binary: '01000101', status: 'OK' },
          { id: '3', timeMs: 0.174, channel: 'CH1', hex: '4C', dec: 76, ascii: 'L', binary: '01001100', status: 'OK' },
          { id: '4', timeMs: 0.261, channel: 'CH1', hex: '4C', dec: 76, ascii: 'L', binary: '01001100', status: 'OK' },
          { id: '5', timeMs: 0.348, channel: 'CH1', hex: '4F', dec: 79, ascii: 'O', binary: '01001111', status: 'OK' },
          { id: '6', timeMs: 0.435, channel: 'CH1', hex: '20', dec: 32, ascii: ' ', binary: '00100000', status: 'OK' },
          { id: '7', timeMs: 0.522, channel: 'CH1', hex: '41', dec: 65, ascii: 'A', binary: '01000001', status: 'OK' },
          { id: '8', timeMs: 0.609, channel: 'CH1', hex: '55', dec: 85, ascii: 'U', binary: '01010101', status: 'OK' },
          { id: '9', timeMs: 0.696, channel: 'CH1', hex: '54', dec: 84, ascii: 'T', binary: '01010100', status: 'OK' },
          { id: '10', timeMs: 0.783, channel: 'CH1', hex: '4F', dec: 79, ascii: 'O', binary: '01001111', status: 'OK' },
          { id: '11', timeMs: 0.870, channel: 'CH1', hex: '53', dec: 83, ascii: 'S', binary: '01010011', status: 'OK' },
          { id: '12', timeMs: 0.957, channel: 'CH1', hex: '43', dec: 67, ascii: 'C', binary: '01000011', status: 'OK' },
          { id: '13', timeMs: 1.044, channel: 'CH1', hex: '4F', dec: 79, ascii: 'O', binary: '01001111', status: 'OK' },
          { id: '14', timeMs: 1.131, channel: 'CH1', hex: '50', dec: 80, ascii: 'P', binary: '01010000', status: 'OK' },
          { id: '15', timeMs: 1.218, channel: 'CH1', hex: '45', dec: 69, ascii: 'E', binary: '01000101', status: 'OK' },
        ],
        evidence: [
          { id: 'e1', text: 'Single dominant data line (CH1 TX)', verified: true },
          { id: 'e2', text: 'Idle state HIGH (3.3V)', verified: true },
          { id: 'e3', text: 'Start-bit pattern detected (HIGH → LOW transition)', verified: true },
          { id: 'e4', text: 'Stable bit period measured across 128 edges', verified: true },
          { id: 'e5', text: '8.68 μs estimated bit width (±0.04 μs error)', verified: true },
          { id: 'e6', text: 'Valid stop bits (LOW → HIGH return)', verified: true },
          { id: 'e7', text: '115200 baud rate standard candidate match (99.8%)', verified: true },
        ],
        confidences: [
          { protocol: 'UART', displayName: 'UART TTL', confidence: 97.4, isDetected: true },
          { protocol: 'I2C', displayName: 'I²C', confidence: 8.2, isDetected: false },
          { protocol: 'SPI', displayName: 'SPI', confidence: 5.1, isDetected: false },
          { protocol: 'RS485', displayName: 'RS-485', confidence: 2.8, isDetected: false },
        ],
        health: [{
          healthScore: 94,
          frameErrors: 0,
          parityErrors: 0,
          timingJitterPercent: 1.2,
          noiseEvents: 2,
          invalidFrames: 0,
          status: 'HEALTHY'
        }],
        electrical: {
          vLow: 0.08,
          vHigh: 3.28,
          vAmplitude: 3.20,
          detectedStandard: '3.3 V TTL',
          availableStandards: [
            { name: '1.8 V', voltage: 1.8, active: false },
            { name: '3.3 V TTL', voltage: 3.3, active: true },
            { name: '5 V CMOS', voltage: 5.0, active: false },
            { name: 'RS-232', voltage: 12.0, active: false },
            { name: 'RS-485', voltage: 5.0, active: false },
          ]
        },
        mappings: [
          { channelId: 'CH1', assignedRole: 'TX (Transmit Data)', confidence: 97 },
          { channelId: 'CH2', assignedRole: 'Unused / Floating', confidence: 100 },
          { channelId: 'CH3', assignedRole: 'Unused / Floating', confidence: 100 },
          { channelId: 'CH4', assignedRole: 'Unused / Floating', confidence: 100 },
        ],
        fault: {
          hasFault: false,
          title: 'NORMAL OPERATION',
          errorPercentage: 0,
          possibleCauses: [],
          recommendedAction: 'Signal timing and voltage levels strictly match standard 3.3V UART at 115200 baud.'
        },
        unknown: {
          confidence: 97.4,
          logicVoltage: 3.3,
          channelCount: 1,
          dominantFreqMhz: 0.1152,
          estimatedFrameBits: 10,
          patternDetected: true,
          rawBytes: ['48', '45', '4C', '4C', '4F', '20', '41', '55', '54', '4F', '53', '43', '4F', '50', '45']
        }
      };
  }
}
