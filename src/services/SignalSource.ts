import type { 
  DemoPreset, 
  ProtocolDetectionPayload
} from '../types/analyzer';
import { getPresetData } from './mockData';

export interface SignalFramePayload {
  timestamp: number;
  channels: Record<string, number>;
}

export interface SignalSourceListener {
  onFrame?: (frame: SignalFramePayload) => void;
  onDetection?: (payload: ProtocolDetectionPayload) => void;
  onStatusChange?: (status: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Base abstract class for hardware signal sources (ESP32, Pico, Serial, WebSocket, Demo)
 */
export abstract class SignalSource {
  protected listeners: Set<SignalSourceListener> = new Set();
  public isConnected: boolean = false;

  public subscribe(listener: SignalSourceListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public abstract connect(): Promise<boolean>;
  public abstract disconnect(): Promise<void>;
  public abstract startCapture(): void;
  public abstract stopCapture(): void;
  public abstract autoDetect(): Promise<ProtocolDetectionPayload>;

  protected notifyFrame(frame: SignalFramePayload) {
    this.listeners.forEach(l => l.onFrame?.(frame));
  }

  protected notifyDetection(payload: ProtocolDetectionPayload) {
    this.listeners.forEach(l => l.onDetection?.(payload));
  }

  protected notifyStatus(status: string) {
    this.listeners.forEach(l => l.onStatusChange?.(status));
  }
}

/**
 * Demo / Simulation Signal Source used in Hackathon Demo Mode
 */
export class DemoSignalSource extends SignalSource {
  private currentPreset: DemoPreset = 'UART_DEMO';
  private timerId: number | null = null;

  constructor(preset: DemoPreset = 'UART_DEMO') {
    super();
    this.currentPreset = preset;
    this.isConnected = true;
  }

  public setPreset(preset: DemoPreset) {
    this.currentPreset = preset;
  }

  public async connect(): Promise<boolean> {
    this.isConnected = true;
    this.notifyStatus('CONNECTED (DEMO MODE)');
    return true;
  }

  public async disconnect(): Promise<void> {
    this.stopCapture();
    this.isConnected = false;
    this.notifyStatus('DISCONNECTED');
  }

  public startCapture(): void {
    this.notifyStatus('CAPTURING');
    if (this.timerId) clearInterval(this.timerId);
    
    let time = 0;
    this.timerId = window.setInterval(() => {
      time += 0.05;
      const sampleFrame: SignalFramePayload = {
        timestamp: time,
        channels: {
          CH1: Math.random() > 0.5 ? 1 : 0,
          CH2: Math.random() > 0.3 ? 1 : 0,
          CH3: Math.random() > 0.7 ? 1 : 0,
          CH4: Math.random() > 0.9 ? 1 : 0,
        }
      };
      this.notifyFrame(sampleFrame);
    }, 100);
  }

  public stopCapture(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.notifyStatus('PAUSED');
  }

  public async autoDetect(): Promise<ProtocolDetectionPayload> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const payload = getPresetData(this.currentPreset);
        this.notifyDetection(payload);
        resolve(payload);
      }, 1800);
    });
  }
}

/**
 * WebSerial API Hardware Source (For physical ESP32 connected via USB Serial)
 */
export class SerialSignalSource extends SignalSource {
  private port: any = null;
  private reader: any = null;

  public async connect(): Promise<boolean> {
    if (!('serial' in navigator)) {
      throw new Error('WebSerial API is not supported in this browser. Use Chrome/Edge.');
    }
    try {
      this.port = await (navigator as any).serial.requestPort();
      await this.port.open({ baudRate: 921600 });
      this.isConnected = true;
      this.notifyStatus('ESP32 USB SERIAL CONNECTED');
      return true;
    } catch (err: any) {
      this.isConnected = false;
      this.listeners.forEach(l => l.onError?.(err));
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.reader) {
      await this.reader.cancel();
    }
    if (this.port) {
      await this.port.close();
    }
    this.isConnected = false;
    this.notifyStatus('SERIAL DISCONNECTED');
  }

  public startCapture(): void {
    if (!this.port) return;
    this.readSerialStream();
    this.notifyStatus('CAPTURING REAL HARDWARE');
  }

  public stopCapture(): void {
    if (this.reader) {
      this.reader.cancel();
    }
    this.notifyStatus('PAUSED');
  }

  public async autoDetect(): Promise<ProtocolDetectionPayload> {
    if (this.port && this.port.writable) {
      const writer = this.port.writable.getWriter();
      const encoder = new TextEncoder();
      await writer.write(encoder.encode('AUTODETECT\n'));
      writer.releaseLock();
    }
    return getPresetData('UART_DEMO');
  }

  private async readSerialStream() {
    const textDecoder = new TextDecoderStream();
    this.port.readable.pipeTo(textDecoder.writable);
    this.reader = textDecoder.readable.getReader();

    try {
      while (true) {
        const { value, done } = await this.reader.read();
        if (done) break;
        if (value) {
          try {
            const parsed = JSON.parse(value);
            if (parsed.timestamp && parsed.channels) {
              this.notifyFrame(parsed);
            }
          } catch {
            // raw telemetry
          }
        }
      }
    } catch (err: any) {
      console.error('Serial read error:', err);
    } finally {
      this.reader.releaseLock();
    }
  }
}

/**
 * WebSocket Hardware Source
 */
export class WebSocketSignalSource extends SignalSource {
  private ws: WebSocket | null = null;
  private url: string;

  constructor(url: string = 'ws://192.168.4.1/ws') {
    super();
    this.url = url;
  }

  public async connect(): Promise<boolean> {
    return new Promise((resolve) => {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => {
        this.isConnected = true;
        this.notifyStatus('ESP32 WEBSOCKET CONNECTED');
        resolve(true);
      };
      this.ws.onerror = () => {
        this.isConnected = false;
        resolve(false);
      };
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'frame') {
            this.notifyFrame(data.payload);
          } else if (data.type === 'detection') {
            this.notifyDetection(data.payload);
          }
        } catch {
          // ignore
        }
      };
    });
  }

  public async disconnect(): Promise<void> {
    if (this.ws) {
      this.ws.close();
    }
    this.isConnected = false;
    this.notifyStatus('DISCONNECTED');
  }

  public startCapture(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ command: 'START' }));
    }
  }

  public stopCapture(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ command: 'STOP' }));
    }
  }

  public async autoDetect(): Promise<ProtocolDetectionPayload> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ command: 'AUTO_DETECT' }));
    }
    return getPresetData('UART_DEMO');
  }
}
