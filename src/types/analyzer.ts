export type ProtocolType = 'UART' | 'I2C' | 'SPI' | 'UNKNOWN' | 'RS485' | 'RS232' | 'CAN' | 'LIN';

export type DemoPreset = 'UART_DEMO' | 'I2C_DEMO' | 'SPI_DEMO' | 'UNKNOWN_DEMO' | 'FAULT_DEMO';

export type CaptureState = 'IDLE' | 'CAPTURING' | 'ANALYZING' | 'PAUSED' | 'ERROR';

export type NavigationTab = 
  | 'overview'
  | 'analyzer'
  | 'waveform'
  | 'detection'
  | 'decoded'
  | 'health'
  | 'fault'
  | 'unknown'
  | 'history'
  | 'settings';

export interface ChannelSignal {
  id: string; // e.g. 'CH1'
  name: string; // e.g. 'TX', 'SCLK', 'SDA'
  color: string;
  enabled: boolean;
  highVoltage: number;
  lowVoltage: number;
  dutyCycle: number; // percentage
  frequencyHz: number;
  digitalData: number[]; // binary stream 0s and 1s for rendering waveform
}

export interface ProtocolConfidenceItem {
  protocol: ProtocolType;
  displayName: string;
  confidence: number; // 0 - 100
  isDetected: boolean;
}

export interface DetectionEvidenceItem {
  id: string;
  text: string;
  verified: boolean;
}

export interface ProtocolParameters {
  // UART
  baudRate?: number;
  dataBits?: number;
  parity?: 'NONE' | 'EVEN' | 'ODD';
  stopBits?: number;
  bitTimeUs?: number;

  // I2C
  busSpeedKhz?: number;
  addressHex?: string;
  rwMode?: 'READ' | 'WRITE';
  ackState?: 'ACK' | 'NACK';

  // SPI
  clockMhz?: number;
  cpol?: 0 | 1;
  cpha?: 0 | 1;
  bitOrder?: 'MSB FIRST' | 'LSB FIRST';
  dataWidth?: number;

  // General
  logicLevelV: number;
  estimatedFrameLenBits?: number;
  dominantFreqMhz?: number;
}

export interface DecodedRow {
  id: string;
  timeMs: number;
  channel: string;
  hex: string;
  dec: number;
  ascii: string;
  binary: string;
  status: 'OK' | 'ERROR' | 'START' | 'STOP' | 'ACK' | 'NACK';
  // Extra protocol-specific fields
  addressHex?: string;
  rw?: 'R' | 'W';
  ackState?: 'ACK' | 'NACK';
  mosiHex?: string;
  misoHex?: string;
  csState?: 'LOW' | 'HIGH';
}

export interface ElectricalLevelData {
  vLow: number;
  vHigh: number;
  vAmplitude: number;
  detectedStandard: string; // '3.3 V TTL', '1.8 V', '5 V', etc.
  availableStandards: { name: string; voltage: number; active: boolean }[];
}

export interface ChannelMapping {
  channelId: string;
  assignedRole: string;
  confidence: number;
}

export interface SignalHealthData {
  healthScore: number; // 0 - 100
  frameErrors: number;
  parityErrors: number;
  timingJitterPercent: number;
  noiseEvents: number;
  invalidFrames: number;
  status: 'HEALTHY' | 'WARNING' | 'FAULT';
}

export interface FaultDiagnosisData {
  hasFault: boolean;
  title: string;
  errorPercentage: number;
  possibleCauses: string[];
  recommendedAction: string;
}

export interface UnknownProtocolData {
  confidence: number;
  logicVoltage: number;
  channelCount: number;
  dominantFreqMhz: number;
  estimatedFrameBits: number;
  patternDetected: boolean;
  rawBytes: string[];
}

export interface TimelineEvent {
  id: string;
  timestampMs: number;
  formattedTime: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface SavedCapture {
  id: string;
  name: string;
  timestamp: string;
  protocol: ProtocolType;
  baudOrFreq: string;
  healthStatus: 'HEALTHY' | 'WARNING' | 'FAULT';
  healthScore: number;
  dataCount: number;
  notes: string;
}

export interface HardwareStatus {
  connected: boolean;
  deviceName: string;
  connectionType: 'USB' | 'WEBSOCKET' | 'SIMULATION';
  samplingRate: string; // e.g. "2 MS/s"
  channelsAvailable: number;
  bufferKb: number;
}

export interface ProtocolDetectionPayload {
  protocol: ProtocolType;
  confidence: number;
  parameters: ProtocolParameters;
  channels: ChannelSignal[];
  decodedRows: DecodedRow[];
  evidence: DetectionEvidenceItem[];
  confidences: ProtocolConfidenceItem[];
  health: SignalHealthData[];
  electrical: ElectricalLevelData;
  mappings: ChannelMapping[];
  fault: FaultDiagnosisData;
  unknown: UnknownProtocolData;
}
