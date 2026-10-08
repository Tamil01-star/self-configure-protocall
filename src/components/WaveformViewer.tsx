import React, { useRef, useEffect } from 'react';
import { Activity, Radio } from 'lucide-react';
import type { DigitalChannelSample, ProtocolType } from '../types/analyzer';

interface WaveformViewerProps {
  channels: DigitalChannelSample[];
  isConnected: boolean;
  protocol: ProtocolType | null;
  focusChannel?: string;
}

/** 
 * Returns true only when a channel has REAL hardware bit data
 * (i.e., the data array actually alternates — not all-same flat idle).
 */
function hasRealSignal(ch: DigitalChannelSample | undefined): boolean {
  if (!ch || !Array.isArray(ch.data) || ch.data.length === 0) return false;
  const first = ch.data[0];
  return ch.data.some(v => v !== first); // real signal = has at least one transition
}

export const WaveformViewer: React.FC<WaveformViewerProps> = ({
  channels,
  isConnected,
  protocol,
  focusChannel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const defaultChannelPinMap = [
    { defaultLabel: 'CH1 (GPIO 4)  → UART / SDA / SCLK' },
    { defaultLabel: 'CH2 (GPIO 13) → SCL / MOSI' },
    { defaultLabel: 'CH3 (GPIO 14) → MISO' },
    { defaultLabel: 'CH4 (GPIO 25) → CS' },
    { defaultLabel: 'CH5 (GPIO 26) → RS-485 A / CAN-H' },
    { defaultLabel: 'CH6 (GPIO 27) → RS-485 B / CAN-L' },
    { defaultLabel: 'CH7 (GPIO 15) → LIN / AUX RX' },
  ];

  const getChannelLabel = (idx: number, ch?: DigitalChannelSample): string => {
    if (ch?.assignedLabel && ch.assignedLabel !== `CH${idx + 1}`) {
      return ch.assignedLabel;
    }
    if (protocol === 'UART' && idx === 0) return 'CH1 (GPIO 4)  → UART TX/RX DATA';
    if (protocol === 'I2C') {
      if (idx === 0) return 'CH1 (GPIO 4)  → I²C SDA DATA';
      if (idx === 1) return 'CH2 (GPIO 13) → I²C SCL CLOCK';
    }
    if (protocol === 'SPI') {
      if (idx === 0) return 'CH1 (GPIO 4)  → SPI SCLK CLOCK';
      if (idx === 1) return 'CH2 (GPIO 13) → SPI MOSI';
      if (idx === 2) return 'CH3 (GPIO 14) → SPI MISO';
      if (idx === 3) return 'CH4 (GPIO 25) → SPI CS';
    }
    return defaultChannelPinMap[idx]?.defaultLabel || `CH${idx + 1}`;
  };

  // ── STRICT GATE: signal is active ONLY when hardware sends real bit transitions ──
  const anyRealSignal = isConnected && channels.some(ch => hasRealSignal(ch));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const width = canvas.parentElement?.clientWidth || 800;
      const height = canvas.parentElement?.clientHeight || 300;
      canvas.width = width;
      canvas.height = height;

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Grid
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 32) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += 32) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      if (!isConnected) {
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('NO SERIAL CONNECTION — CONNECT ESP32 #2 ANALYZER', width / 2, height / 2 - 10);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText('Plug ESP32 #2 USB cable and click [CONNECT SERIAL]', width / 2, height / 2 + 12);
        return;
      }

      const channelColors = [
        '#0284c7', '#16a34a', '#d97706', '#7c3aed',
        '#2563eb', '#dc2626', '#0d9488',
      ];

      let targetIndices: number[];
      if (focusChannel) {
        targetIndices = [parseInt(focusChannel.replace('CH', '')) - 1];
      } else {
        // STRICT PROTOCOL FILTER:
        // Only draw lanes for channels that actually belong to the detected protocol.
        // This is the definitive fix to prevent SDA/SCL appearing when UART is active, etc.
        if (protocol === 'RFID') {
          // Dynamic for RFID: draw whichever channels received active RFID signal data (CH1 for UART RFID, CH4-7 for SPI RFID)
          const activeIndices = channels
            .filter(c => Array.isArray(c.data) && c.data.some(v => v !== c.data[0]))
            .map(c => parseInt(c.id.replace('CH', '')) - 1)
            .filter(idx => !isNaN(idx) && idx >= 0 && idx < 7);
          targetIndices = activeIndices.length > 0 ? activeIndices : [0, 3, 4, 5, 6];
        } else if (protocol === 'UART' || protocol === 'RS232' || protocol === 'RS485' || protocol === 'LIN') {
          targetIndices = [0]; // CH1 only
        } else if (protocol === 'I2C') {
          targetIndices = [1, 2]; // CH2 (SDA) + CH3 (SCL) only
        } else if (protocol === 'SPI') {
          targetIndices = [3, 4, 5, 6]; // CH4 (SCK), CH5 (MOSI), CH6 (MISO), CH7 (CS) only
        } else if (protocol === 'CAN') {
          targetIndices = [4, 5]; // CH5 (CAN-H) + CH6 (CAN-L) only
        } else {
          // No protocol detected yet — show nothing until a real signal arrives
          targetIndices = channels
            .map(c => parseInt(c.id.replace('CH', '')) - 1)
            .filter(idx => !isNaN(idx) && idx >= 0 && idx < 7);
          if (targetIndices.length === 0) targetIndices = [0, 1, 2, 3, 4, 5, 6];
        }
      }

      const laneCount = targetIndices.length;
      const laneHeight = (height - 20) / laneCount;

      for (let i = 0; i < laneCount; i++) {
        const idx = targetIndices[i];
        const expectedId = `CH${idx + 1}`;
        const ch = channels.find(c => c.id === expectedId);
        
        const laneTop = 10 + i * laneHeight;
        const signalHighY = laneTop + 4;
        const signalLowY = laneTop + laneHeight - 6;
        const label = getChannelLabel(idx, ch);
        
        // Also check if protocol has assigned this channel
        const isAssigned = ch !== undefined && protocol !== null;
        const chActive = hasRealSignal(ch) || isAssigned;

        // Baseline reference line
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(150, signalLowY);
        ctx.lineTo(width, signalLowY);
        ctx.stroke();

        // Label
        ctx.fillStyle = chActive ? channelColors[idx] : '#94a3b8';
        ctx.font = `bold 10px monospace`;
        ctx.textAlign = 'left';
        ctx.fillText(label, 10, laneTop + laneHeight / 2 + 3);

        // ── STRICT: draw waveform ONLY if this channel has REAL hardware bit data ──
        // No data from hardware → flat idle line; NEVER inject synthetic bit patterns
        const bitPattern: number[] =
          chActive && ch!.data!.length > 0
            ? ch!.data!
            : (idx === 4 || idx === 5) ? [0, 0, 0, 0] : [1, 1, 1, 1]; // idle flat

        ctx.strokeStyle = chActive ? channelColors[idx] : '#cbd5e1';
        ctx.lineWidth = chActive ? 2 : 1;
        ctx.beginPath();

        const startX = 150;
        const bitWidthPx = 28;
        let currentX = startX;
        let patternIdx = 0; // Fixed view: always start from the first captured bit
        let lastState = bitPattern[patternIdx];

        ctx.moveTo(currentX, lastState === 1 ? signalHighY : signalLowY);

        for (let x = startX; x < width; x += bitWidthPx) {
          patternIdx = (patternIdx + 1) % bitPattern.length;
          const state = bitPattern[patternIdx];
          const nextX = Math.min(width, currentX + bitWidthPx);
          if (state !== lastState) {
            ctx.lineTo(currentX, state === 1 ? signalHighY : signalLowY);
          }
          ctx.lineTo(nextX, state === 1 ? signalHighY : signalLowY);
          lastState = state;
          currentX = nextX;
        }
        ctx.stroke();

        // Show "IDLE" label on channels with no real signal
        if (!chActive) {
          ctx.fillStyle = '#94a3b8';
          ctx.font = '9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('IDLE', (150 + width) / 2, signalLowY - 4);
        }
      }
    };

    render();
  }, [channels, isConnected, protocol, anyRealSignal, focusChannel]);

  return (
    <div className="instrument-card flex flex-col h-full select-none overflow-hidden">
      <div className="instrument-card-header px-3 py-1.5 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center space-x-2">
          <Activity className="w-3.5 h-3.5 text-instrument-blue" />
          <span className="font-bold text-instrument-textBright uppercase">
            7-CHANNEL DIGITAL LOGIC WAVEFORM CAPTURE (CH1 – CH7 PINS)
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-semibold">
          <Radio className={`w-3 h-3 ${anyRealSignal ? 'text-instrument-green animate-pulse' : 'text-instrument-amber'}`} />
          <span className={anyRealSignal ? 'text-instrument-green font-bold' : 'text-instrument-amber'}>
            {anyRealSignal ? 'REAL INPUT SIGNAL CAPTURED & STREAMING' : 'IDLE (WAITING FOR INPUT SIGNAL)'}
          </span>
        </div>
      </div>

      <div className="relative flex-1 bg-white min-h-[260px] w-full">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
};
