import type { RealAnalyzerPayload, AnalyzerState } from '../types/analyzer';

export interface SerialDriverListener {
  onConnectionChange?: (connected: boolean) => void;
  onDataPayload?: (payload: RealAnalyzerPayload) => void;
  onRawLog?: (log: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Real Hardware WebSerial Driver for ESP32 #2 AutoScope Analyzer.
 * Zero demo data, zero mock data, pure real serial communication.
 */
export class SerialHardwareDriver {
  private port: any = null;
  private reader: any = null;
  private isConnected: boolean = false;
  private listeners: Set<SerialDriverListener> = new Set();
  private keepReading: boolean = false;
  private lineBuffer: string = '';

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
      
      // Listen for hardware disconnects
      (navigator as any).serial.addEventListener('disconnect', (e: any) => {
        if (e.target === this.port) {
          this.disconnect();
        }
      });

      // Start serial read stream loop
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
    if (this.reader) {
      try {
        await this.reader.cancel();
      } catch {
        // ignore
      }
    }
    if (this.port) {
      try {
        await this.port.close();
      } catch {
        // ignore
      }
    }
    this.port = null;
    this.reader = null;
    this.isConnected = false;
    this.notifyConnection(false);
    this.notifyLog('[SERIAL] ESP32 #2 disconnected. Analyzer offline.');
  }

  public async sendCommand(cmd: string): Promise<void> {
    if (!this.port || !this.port.writable) {
      throw new Error('ESP32 #2 is not connected via Serial.');
    }
    const writer = this.port.writable.getWriter();
    const encoder = new TextEncoder();
    await writer.write(encoder.encode(cmd + '\n'));
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
          if (value) {
            this.handleChunk(value);
          }
        }
      } catch (err: any) {
        if (this.keepReading) {
          this.notifyError(err);
        }
        break;
      } finally {
        if (this.reader) {
          try {
            this.reader.releaseLock();
          } catch {
            // ignore
          }
        }
      }
    }
  }

  private handleChunk(chunk: string) {
    this.lineBuffer += chunk;
    const lines = this.lineBuffer.split('\n');
    this.lineBuffer = lines.pop() || ''; // Keep partial line in buffer

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      this.notifyLog(`[SERIAL RX] ${trimmed}`);

      // Try parsing JSON payload from ESP32 #2
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        try {
          const jsonPayload = JSON.parse(trimmed);
          const parsedPayload = this.parseAnalyzerJSON(jsonPayload);
          if (parsedPayload) {
            this.notifyPayload(parsedPayload);
          }
        } catch {
          // invalid JSON string
        }
      } else {
        // Text status line parsing
        this.parseTextLine(trimmed);
      }
    }
  }

  private parseAnalyzerJSON(json: any): RealAnalyzerPayload | null {
    if (!json || typeof json !== 'object') return null;

    const state: AnalyzerState = json.state || (json.protocol ? 'DETECTED' : 'ANALYZING');
    
    return {
      state,
      protocol: json.protocol || null,
      confidence: typeof json.confidence === 'number' ? json.confidence : null,
      statusText: json.statusText || json.status || null,
      evidence: Array.isArray(json.evidence) ? json.evidence : [],
      parameters: {
        channel: json.channel,
        baudRate: json.baud || json.baudRate,
        format: json.format,
        idle: json.idle,
        bitPeriodUs: json.bitPeriodUs || json.bit_period,
        sdaChannel: json.sda,
        sclChannel: json.scl,
        clockHz: json.clock || json.clockHz,
        addressHex: json.address,
        rwMode: json.rw,
        ackState: json.ack,
        sclkChannel: json.sclk,
        mosiChannel: json.mosi,
        misoChannel: json.miso,
        csChannel: json.cs,
        clockHzSpi: json.clockSpi || json.spiClock,
        spiMode: json.mode,
        cpol: json.cpol,
        cpha: json.cpha,
        bitOrder: json.bit_order || json.bitOrder,
        activeChannelsCount: json.activeChannelsCount,
        idleState: json.idleState,
        transitionCount: json.transitionCount,
        timingInfo: json.timingInfo,
        uartScore: json.uartScore,
        i2cScore: json.i2cScore,
        spiScore: json.spiScore,
      },
      channels: Array.isArray(json.channels) 
        ? json.channels.map((ch: any) => ({
            id: ch.id || 'CH1',
            assignedLabel: ch.assignedLabel || ch.label || ch.id || 'CH1',
            data: Array.isArray(ch.data) ? ch.data : []
          }))
        : [],
      decodedRows: Array.isArray(json.decoded)
        ? json.decoded.map((d: any, idx: number) => ({
            id: d.id || `${idx}`,
            timeMs: typeof d.timeMs === 'number' ? d.timeMs : idx * 0.087,
            channel: d.channel || 'CH1',
            hex: d.hex || '0x00',
            dec: typeof d.dec === 'number' ? d.dec : 0,
            ascii: d.ascii || '?',
            status: d.status || 'OK',
            addressHex: d.address,
            rw: d.rw,
            ack: d.ack,
            mosiHex: d.mosi,
            misoHex: d.miso,
            csState: d.cs
          }))
        : [],
      health: {
        validFrames: typeof json.health?.validFrames === 'number' ? json.health.validFrames : null,
        invalidFrames: typeof json.health?.invalidFrames === 'number' ? json.health.invalidFrames : null,
        timingConsistencyPercent: typeof json.health?.timingConsistencyPercent === 'number' ? json.health.timingConsistencyPercent : null,
        transitionConsistencyPercent: typeof json.health?.transitionConsistencyPercent === 'number' ? json.health.transitionConsistencyPercent : null,
        clockConsistencyPercent: typeof json.health?.clockConsistencyPercent === 'number' ? json.health.clockConsistencyPercent : null,
        errorCount: typeof json.health?.errorCount === 'number' ? json.health.errorCount : null,
      },
      lcdMessage: json.lcd || json.lcdMessage || null
    };
  }

  private parseTextLine(line: string) {
    // Basic status text regex matcher for simpler microcontrollers
    if (line.includes('STATE: IDLE')) {
      this.notifyPayloadState('IDLE');
    } else if (line.includes('STATE: CAPTURING')) {
      this.notifyPayloadState('CAPTURING');
    } else if (line.includes('STATE: ANALYZING')) {
      this.notifyPayloadState('ANALYZING');
    }
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
      lcdMessage: null
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
