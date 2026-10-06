export type ProtocolType = 'UART' | 'I2C' | 'SPI' | 'UNKNOWN';

export type AnalyzerState = 
  | 'DISCONNECTED'
  | 'IDLE'
  | 'CAPTURING'
  | 'ANALYZING'
  | 'TESTING HYPOTHESES'
  | 'VALIDATING'
  | 'DETECTED'
  | 'UNKNOWN'
  | 'ERROR';

export type NavigationTab = 
  | 'overview'
  | 'capture'
  | 'protocol'
  | 'decoded'
  | 'health'
  | 'hardware'
  | 'settings';

export interface DigitalChannelSample {
  id: string; // 'CH1', 'CH2', 'CH3', 'CH4'
  assignedLabel: string; // e.g., 'CH1', 'UART DATA', 'SDA', 'SCL', 'SCLK', 'MOSI', 'MISO', 'CS'
  data: number[]; // 0s and 1s received from hardware
}

export interface RealProtocolParameters {
  // Common
  channel?: string;
  
  // UART
  baudRate?: number;
  format?: string; // e.g. "8N1"
  idle?: 'HIGH' | 'LOW';
  bitPeriodUs?: number;

  // I2C
  sdaChannel?: string;
  sclChannel?: string;
  clockHz?: number;
  addressHex?: string;
  rwMode?: 'READ' | 'WRITE';
  ackState?: boolean;

  // SPI
  sclkChannel?: string;
  mosiChannel?: string;
  misoChannel?: string;
  csChannel?: string;
  clockHzSpi?: number;
  spiMode?: number; // 0, 1, 2, 3
  cpol?: number;
  cpha?: number;
  bitOrder?: 'MSB' | 'LSB';

  // Unknown / Custom
  activeChannelsCount?: number;
  idleState?: string;
  transitionCount?: number;
  timingInfo?: string;
  uartScore?: number;
  i2cScore?: number;
  spiScore?: number;
}

export interface RealDecodedRow {
  id: string;
  timeMs: number;
  channel: string;
  hex: string;
  dec: number;
  ascii: string;
  status: string;
  // Protocol specific optional fields
  addressHex?: string;
  rw?: 'R' | 'W';
  ack?: boolean;
  mosiHex?: string;
  misoHex?: string;
  csState?: 'LOW' | 'HIGH';
}

export interface RealSignalHealth {
  validFrames: number | null;
  invalidFrames: number | null;
  timingConsistencyPercent: number | null;
  transitionConsistencyPercent: number | null;
  clockConsistencyPercent: number | null;
  errorCount: number | null;
}

export interface RealAnalyzerPayload {
  state: AnalyzerState;
  protocol: ProtocolType | null;
  confidence: number | null;
  statusText: string | null;
  evidence: string[];
  parameters: RealProtocolParameters;
  channels: DigitalChannelSample[];
  decodedRows: RealDecodedRow[];
  health: RealSignalHealth;
  lcdMessage: string | null;
}

export interface SystemHardwareStatus {
  esp32_1_status: 'CONNECTED' | 'DISCONNECTED' | 'UNKNOWN';
  esp32_2_connected: boolean;
  lcd_status: string;
  laptop_status: 'RUNNING';
  serialBaud: number;
}
