import React, { useRef, useEffect } from 'react';
import { Activity, Radio } from 'lucide-react';
import type { DigitalChannelSample, ProtocolType } from '../types/analyzer';

interface WaveformViewerProps {
  channels: DigitalChannelSample[];
  isConnected: boolean;
  protocol: ProtocolType | null;
}

export const WaveformViewer: React.FC<WaveformViewerProps> = ({
  channels,
  isConnected,
  protocol,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const defaultChannelLabels = ['CH1', 'CH2', 'CH3', 'CH4'];

  // Determine dynamic channel labels based on real detection
  const getChannelLabel = (idx: number, ch?: DigitalChannelSample): string => {
    if (ch?.assignedLabel && ch.assignedLabel !== `CH${idx+1}`) {
      return ch.assignedLabel;
    }
    if (protocol === 'UART' && idx === 0) return 'CH1 → UART DATA';
    if (protocol === 'I2C') {
      if (idx === 0) return 'CH1 → SDA';
      if (idx === 1) return 'CH2 → SCL';
    }
    if (protocol === 'SPI') {
      if (idx === 0) return 'CH1 → SCLK';
      if (idx === 1) return 'CH2 → MOSI';
      if (idx === 2) return 'CH3 → MISO';
      if (idx === 3) return 'CH4 → CS';
    }
    return defaultChannelLabels[idx] || `CH${idx+1}`;
  };

  const hasData = isConnected && channels.length > 0 && channels.some(c => c.data && c.data.length > 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.parentElement?.clientWidth || 800;
    const height = canvas.parentElement?.clientHeight || 260;
    canvas.width = width;
    canvas.height = height;

    // Light instrument canvas background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Fine grid (light slate lines)
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // If disconnected or no capture data exists: Do NOT draw fake waveforms!
    if (!hasData) {
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      if (!isConnected) {
        ctx.fillText('NO SERIAL CONNECTION — CONNECT ESP32 #2 ANALYZER', width / 2, height / 2 - 10);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText('Plug ESP32 #2 USB cable and click [CONNECT SERIAL]', width / 2, height / 2 + 12);
      } else {
        ctx.fillText('WAITING FOR CAPTURE DATA FROM ESP32 #2...', width / 2, height / 2);
      }
      return;
    }

    // Draw real digital channels (light theme crisp colors)
    const channelColors = ['#0284c7', '#16a34a', '#d97706', '#7c3aed'];
    const laneHeight = (height - 30) / 4;

    for (let idx = 0; idx < 4; idx++) {
      const ch = channels[idx];
      const laneTop = 15 + idx * laneHeight;
      const signalHighY = laneTop + 6;
      const signalLowY = laneTop + laneHeight - 10;
      const label = getChannelLabel(idx, ch);

      // Baseline reference
      ctx.strokeStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(80, signalLowY);
      ctx.lineTo(width, signalLowY);
      ctx.stroke();

      // Channel label
      ctx.fillStyle = channelColors[idx];
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(label, 10, laneTop + laneHeight / 2);

      // Draw real binary data stream if present
      if (ch && ch.data && ch.data.length > 0) {
        ctx.strokeStyle = channelColors[idx];
        ctx.lineWidth = 2;
        ctx.beginPath();

        const bitWidthPx = Math.max(10, (width - 100) / ch.data.length);
        let currentX = 80;
        let lastState = ch.data[0];

        ctx.moveTo(currentX, lastState === 1 ? signalHighY : signalLowY);

        for (let i = 0; i < ch.data.length; i++) {
          const state = ch.data[i];
          const nextX = currentX + bitWidthPx;

          if (state !== lastState) {
            ctx.lineTo(currentX, state === 1 ? signalHighY : signalLowY);
          }
          ctx.lineTo(nextX, state === 1 ? signalHighY : signalLowY);

          lastState = state;
          currentX = nextX;
          if (currentX > width) break;
        }
        ctx.stroke();
      }
    }
  }, [channels, isConnected, protocol, hasData]);

  return (
    <div className="instrument-card flex flex-col h-full select-none overflow-hidden">
      <div className="instrument-card-header px-3 py-1.5 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center space-x-2">
          <Activity className="w-3.5 h-3.5 text-instrument-blue" />
          <span className="font-bold text-instrument-textBright uppercase">
            DIGITAL SIGNAL CAPTURE (HIGH / LOW LOGIC)
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[10px] text-instrument-textMuted font-semibold">
          <Radio className={`w-3 h-3 ${hasData ? 'text-instrument-green animate-pulse' : 'text-instrument-textMuted'}`} />
          <span>{hasData ? 'LIVE REAL DATA' : 'NO ACTIVE STREAM'}</span>
        </div>
      </div>

      <div className="relative flex-1 bg-white min-h-[220px] w-full">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
};
