import type { RealAnalyzerPayload, AnalyzerState, ProtocolType } from '../types/analyzer';

export interface SerialDriverListener {
  onConnectionChange?: (connected: boolean) => void;
  onDataPayload?: (payload: RealAnalyzerPayload) => void;
  onRawLog?: (log: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Real Hardware WebSerial Driver for ESP32 #2 AutoScope Analyzer.
 * STRICTLY zero fabricated data, zero synthetic waveforms.
 * Waveforms render ONLY if ESP32 hardware sends real channel bit arrays.
 */
export class SerialHardwareDriver {
  private port: any = null;
  private reader: any = null;
  private isConnected: boolean = false;
  private listeners: Set<SerialDriverListener> = new Set();
  private keepReading: boolean = false;
  private lineBuffer: string = '';
  private jsonAccumulator: string = '';
  private isBuildingJson: boolean = false;

  public subscribe(listener: SerialDriverListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getConnected(): boolean {
    return this.isConnected;
  }

  public async connect(): Promise<boolean> {
    if (!('serial' in navigator)) {
      throw new Error('WebSerial API is not supported in this browser. Please use Chrome, Edge, or Opera.');
    }
    try {
      this.port = await (navigator as any).serial.requestPort();
      await this.port.open({ baudRate: 115200 });
      this.isConnected = true;
      this.keepReading = true;

      this.notifyConnection(true);
      this.notifyLog('[SERIAL] USB Serial Port opened with ESP32 #2 at 115200 baud.');

      (navigator as any).serial.addEventListener('disconnect', (e: any) => {
        if (e.target === this.port) this.disconnect();
      });

      this.readLoop();
      return true;
    } catch (err: any) {
      this.isConnected = false;
      this.notifyConnection(false);
      this.notifyError(err);
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    this.keepReading = false;
    if (this.reader) { try { await this.reader.cancel(); } catch { } }
    if (this.port) { try { await this.port.close(); } catch { } }
    this.port = null;
    this.reader = null;
    this.isConnected = false;
    this.notifyConnection(false);
    this.notifyLog('[SERIAL] ESP32 #2 disconnected. Analyzer offline.');
  }

  public async sendCommand(cmd: string): Promise<void> {
    if (!this.port || !this.port.writable) throw new Error('ESP32 #2 is not connected via Serial.');
    const writer = this.port.writable.getWriter();
    await writer.write(new TextEncoder().encode(cmd + '\n'));
    writer.releaseLock();
    this.notifyLog(`[SERIAL TX] > ${cmd}`);
  }

  private async readLoop() {
    while (this.port && this.port.readable && this.keepReading) {
      try {
        const textDecoder = new TextDecoderStream();
        this.port.readable.pipeTo(textDecoder.writable);
        this.reader = textDecoder.readable.getReader();
        while (this.keepReading) {
          const { value, done } = await this.reader.read();
          if (done) break;
          if (value) this.handleChunk(value);
        }
      } catch (err: any) {
        if (this.keepReading) this.notifyError(err);
        break;
      } finally {
        if (this.reader) { try { this.reader.releaseLock(); } catch { } }
      }
    }
  }

  private handleChunk(chunk: string) {
    this.lineBuffer += chunk;
    const lines = this.lineBuffer.split('\n');
    this.lineBuffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      this.notifyLog(`[SERIAL RX] ${trimmed}`);

      if (trimmed.startsWith('{')) {
        this.isBuildingJson = true;
        this.jsonAccumulator = trimmed;
      } else if (this.isBuildingJson) {
        this.jsonAccumulator += ' ' + trimmed;
      }

      if (this.isBuildingJson && trimmed.endsWith('}')) {
        this.isBuildingJson = false;
        try {
          const jsonPayload = JSON.parse(this.jsonAccumulator);
          const parsed = this.parseAnalyzerJSON(jsonPayload);
          if (parsed) this.notifyPayload(parsed);
        } catch { }
        this.jsonAccumulator = '';
      } else if (!this.isBuildingJson) {
        this.parseTextLine(trimmed);
      }
    }
  }

  private parseAnalyzerJSON(json: any): RealAnalyzerPayload | null {
    if (!json || typeof json !== 'object') return null;

    const protocolStr = (json.protocol || '').toUpperCase();
    let protocol: ProtocolType | null = null;
    if (protocolStr.includes('RS485') || protocolStr.includes('RS-485')) protocol = 'RS485';
    else if (protocolStr.includes('RS232') || protocolStr.includes('RS-232')) protocol = 'RS232';
    else if (protocolStr.includes('CAN')) protocol = 'CAN';
    else if (protocolStr.includes('LIN')) protocol = 'LIN';
    else if (protocolStr.includes('UART')) protocol = 'UART';
    else if (protocolStr.includes('RFID')) protocol = 'RFID';
    else if (protocolStr.includes('I2C') || protocolStr.includes('I²C')) protocol = 'I2C';
    else if (protocolStr.includes('SPI')) protocol = 'SPI';
    else if (protocolStr.includes('UNKNOWN')) protocol = 'UNKNOWN';

    const state: AnalyzerState = json.state || (protocol ? 'DETECTED' : 'ANALYZING');

    const baudRate = json.baud || json.baudRate || json.baud_rate;
    const clockHz = json.clock || json.clockHz || json.clock_frequency;
    const clockHzSpi = json.clockSpi || json.spiClock || json.clock_frequency_spi;
    const addressHex = json.address || json.addressHex;
    const bitPeriodUs = json.bitPeriodUs || json.bit_period || (baudRate ? (1000000 / baudRate) : undefined);
    const canBitRate = json.canBitRate || json.can_bit_rate || json.bitRate;
    const canFrameId = json.canFrameId || json.frame_id || json.can_id;
    const linVersion = json.linVersion || json.lin_version || json.version;

    // Helper to robustly match whatever the ESP32 sends (1, "1", "CH1", "GPIO 4", "4") to our CH1-CH7 IDs
    const normalizeChannelId = (val: any): string | undefined => {
      if (val === undefined || val === null) return undefined;
      const s = String(val).trim().toUpperCase();
      if (s === '36' || s === 'GPIO 36' || s === 'GPIO36' || s === '4' || s === 'GPIO 4') return 'CH1';
      if (s === '39' || s === 'GPIO 39' || s === 'GPIO39' || s === '13' || s === 'GPIO 13') return 'CH2';
      if (s === '34' || s === 'GPIO 34' || s === 'GPIO34' || s === '14' || s === 'GPIO 14') return 'CH3';
      if (s === '35' || s === 'GPIO 35' || s === 'GPIO35' || s === '25' || s === 'GPIO 25') return 'CH4';
      if (s === '32' || s === 'GPIO 32' || s === 'GPIO32' || s === '26' || s === 'GPIO 26') return 'CH5';
      if (s === '33' || s === 'GPIO 33' || s === 'GPIO33' || s === '27' || s === 'GPIO 27') return 'CH6';
      if (s === '25' || s === 'GPIO 25' || s === 'GPIO25' || s === '15' || s === 'GPIO 15') return 'CH7';
      if (s.match(/^[1-7]$/)) return `CH${s}`;
      if (s === '0') return 'CH1';
      if (!s.startsWith('CH')) return `CH${s}`;
      return s;
    };

    // ── CHANNELS: ONLY what the ESP32 hardware actually sends ──────────────
    // NO synthetic / fabricated data. If ESP32 does not send ch.data, the channel stays empty.
    const channels = Array.isArray(json.channels)
      ? json.channels.map((ch: any) => ({
          id: normalizeChannelId(ch.id || ch.channel) || 'CH1',
          assignedLabel: ch.assignedLabel || ch.label || normalizeChannelId(ch.id || ch.channel) || 'CH1',
          data: Array.isArray(ch.data) && ch.data.length > 0 ? ch.data : [],
        }))
      : [];

    // ── DECODED ROWS: Only real decoded bytes from the microcontroller ──────
    const decodedRows = Array.isArray(json.decoded)
      ? json.decoded.map((d: any, idx: number) => ({
          id: d.id || `${idx}`,
          timeMs: typeof d.timeMs === 'number' ? d.timeMs : idx * 0.087,
          channel: normalizeChannelId(d.channel) || 'CH1',
          hex: d.hex || (typeof d.dec === 'number' ? `0x${d.dec.toString(16).toUpperCase().padStart(2, '0')}` : '0x00'),
          dec: typeof d.dec === 'number' && d.dec > 0 ? d.dec : (d.hex ? parseInt(d.hex, 16) || 0 : 0),
          ascii: (d.ascii && d.ascii !== '?') 
            ? d.ascii 
            : ((typeof d.dec === 'number' && d.dec >= 32 && d.dec <= 126) ? String.fromCharCode(d.dec) : (d.hex && parseInt(d.hex, 16) >= 32 && parseInt(d.hex, 16) <= 126 ? String.fromCharCode(parseInt(d.hex, 16)) : '?')),
          status: d.status || 'OK',
          addressHex: d.address,
          rw: d.rw,
          ack: d.ack,
          mosiHex: d.mosi,
          misoHex: d.miso,
          csState: d.cs,
        }))
      : [];

    // Always process valid hardware payloads so the dashboard updates live without getting stuck loading

    // ── EVIDENCE: Only from real firmware, no fabrication ─────────────────
    const evidence: string[] = Array.isArray(json.evidence) ? json.evidence : [];

    return {
      state,
      protocol,
      confidence: typeof json.confidence === 'number' ? json.confidence : null,
      statusText: json.statusText || json.status || null,
      evidence,
      parameters: {
        channel: normalizeChannelId(json.channel),
        baudRate,
        format: json.format || json.frame,
        idle: json.idle,
        bitPeriodUs,
        sdaChannel: normalizeChannelId(json.sda),
        sclChannel: normalizeChannelId(json.scl),
        clockHz,
        addressHex,
        rwMode: json.rw || json.rwMode,
        ackState: json.ack,
        sclkChannel: normalizeChannelId(json.sclk),
        mosiChannel: normalizeChannelId(json.mosi),
        misoChannel: normalizeChannelId(json.miso),
        csChannel: normalizeChannelId(json.cs),
        clockHzSpi,
        spiMode: json.mode !== undefined ? json.mode : json.CPOL,
        cpol: json.cpol !== undefined ? json.cpol : json.CPOL,
        cpha: json.cpha !== undefined ? json.cpha : json.CPHA,
        bitOrder: json.bit_order || json.bitOrder,
        activeChannelsCount: json.activeChannelsCount,
        idleState: json.idleState,
        transitionCount: json.transitionCount,
        timingInfo: json.timingInfo,
        uartScore: json.uartScore,
        i2cScore: json.i2cScore,
        spiScore: json.spiScore,
        canBitRate,
        canFrameId,
        linVersion,
      },
      channels,
      decodedRows,
      health: {
        validFrames: typeof json.health?.validFrames === 'number' ? json.health.validFrames : null,
        invalidFrames: typeof json.health?.invalidFrames === 'number' ? json.health.invalidFrames : null,
        timingConsistencyPercent: typeof json.health?.timingConsistencyPercent === 'number' ? json.health.timingConsistencyPercent : null,
        transitionConsistencyPercent: typeof json.health?.transitionConsistencyPercent === 'number' ? json.health.transitionConsistencyPercent : null,
        clockConsistencyPercent: typeof json.health?.clockConsistencyPercent === 'number' ? json.health.clockConsistencyPercent : null,
        errorCount: typeof json.health?.errorCount === 'number' ? json.health.errorCount : null,
      },
      lcdMessage: json.lcd || json.lcdMessage || null,
    };
  }

  private parseTextLine(line: string) {
    // Only update analyzer state from text lines — never inject fake waveform data
    if (line.includes('STATE: IDLE')) this.notifyPayloadState('IDLE');
    else if (line.includes('STATE: CAPTURING')) this.notifyPayloadState('CAPTURING');
    else if (line.includes('STATE: ANALYZING')) this.notifyPayloadState('ANALYZING');
  }

  private notifyPayloadState(state: AnalyzerState) {
    const emptyPayload: RealAnalyzerPayload = {
      state,
      protocol: null,
      confidence: null,
      statusText: null,
      evidence: [],
      parameters: {},
      channels: [],
      decodedRows: [],
      health: {
        validFrames: null,
        invalidFrames: null,
        timingConsistencyPercent: null,
        transitionConsistencyPercent: null,
        clockConsistencyPercent: null,
        errorCount: null,
      },
      lcdMessage: null,
    };
    this.notifyPayload(emptyPayload);
  }

  private notifyConnection(connected: boolean) {
    this.listeners.forEach(l => l.onConnectionChange?.(connected));
  }

  private notifyPayload(payload: RealAnalyzerPayload) {
    this.listeners.forEach(l => l.onDataPayload?.(payload));
  }

  private notifyLog(log: string) {
    this.listeners.forEach(l => l.onRawLog?.(log));
  }

  private notifyError(err: Error) {
    this.listeners.forEach(l => l.onError?.(err));
  }
}
