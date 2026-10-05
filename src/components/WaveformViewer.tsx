import React, { useRef, useEffect, useState } from 'react';
import { 
  Play, 
  Pause, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sliders, 
  Crosshair, 
  Activity,
  Eye,
  EyeOff
} from 'lucide-react';
import type { ChannelSignal, CaptureState, ProtocolType } from '../types/analyzer';

interface WaveformViewerProps {
  channels: ChannelSignal[];
  captureState: CaptureState;
  onTogglePause: () => void;
  protocol: ProtocolType;
}

export const WaveformViewer: React.FC<WaveformViewerProps> = ({
  channels,
  captureState,
  onTogglePause,
  protocol
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [offsetTime] = useState<number>(0);
  const [activeChannels, setActiveChannels] = useState<Record<string, boolean>>({
    CH1: true,
    CH2: true,
    CH3: true,
    CH4: true,
  });
  const [showTrigger, setShowTrigger] = useState<boolean>(true);

  // Canvas Rendering Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let timeShift = 0;

    const render = () => {
      // Auto resize canvas resolution to container width
      const width = canvas.parentElement?.clientWidth || 800;
      const height = canvas.parentElement?.clientHeight || 320;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      // Background
      ctx.fillStyle = '#080b11';
      ctx.fillRect(0, 0, width, height);

      // Fine Oscilloscope Grid (Horizontal & Vertical)
      const gridSpacing = 40 * zoomLevel;
      ctx.strokeStyle = '#131e2e';
      ctx.lineWidth = 1;

      // Vertical grid lines with microsecond time labels
      ctx.fillStyle = '#475569';
      ctx.font = '10px monospace';
      
      const timeStepUs = (20 / zoomLevel);
      let tickIdx = 0;

      for (let x = (offsetTime % gridSpacing); x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        const timeValUs = Math.round(tickIdx * timeStepUs);
        ctx.fillText(`${timeValUs} μs`, x + 4, height - 8);
        tickIdx++;
      }

      // Horizontal grid lines
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Active Channels Waveform Drawing
      const enabledChannels = channels.filter(ch => activeChannels[ch.id] !== false && ch.enabled);
      const channelCount = enabledChannels.length || 1;
      const laneHeight = (height - 40) / channelCount;

      if (captureState === 'CAPTURING') {
        timeShift += 2.5;
      }

      enabledChannels.forEach((channel, idx) => {
        const laneTop = 20 + idx * laneHeight;
        const laneBottom = laneTop + laneHeight - 15;
        const signalHighY = laneTop + 12;
        const signalLowY = laneBottom;

        // Baseline reference line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.moveTo(0, signalLowY);
        ctx.lineTo(width, signalLowY);
        ctx.stroke();

        // Channel Label & Voltage scale tag
        ctx.fillStyle = channel.color;
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`${channel.id} (${channel.name}) - ${channel.highVoltage.toFixed(1)}V`, 10, laneTop + 6);

        // Generate synthetic digital square wave pulse data
        ctx.strokeStyle = channel.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = channel.color;
        ctx.shadowBlur = 4;
        ctx.beginPath();

        const bits = channel.digitalData.length > 0 
          ? channel.digitalData 
          : [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0];
        
        const bitWidthPx = (50 * zoomLevel);
        let lastState = bits[0];
        let currentX = 70;

        ctx.moveTo(currentX, lastState === 1 ? signalHighY : signalLowY);

        for (let i = 0; i < 40; i++) {
          const bitIndex = Math.floor((i + (timeShift / bitWidthPx)) % bits.length);
          const state = bits[bitIndex];
          const nextX = currentX + bitWidthPx;

          if (state !== lastState) {
            // Vertical edge transition (square wave edge)
            ctx.lineTo(currentX, state === 1 ? signalHighY : signalLowY);
          }
          // Horizontal level line
          ctx.lineTo(nextX, state === 1 ? signalHighY : signalLowY);

          lastState = state;
          currentX = nextX;
          if (currentX > width) break;
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // reset shadow
      });

      // Trigger Line Indicator
      if (showTrigger) {
        const triggerX = 140;
        ctx.strokeStyle = '#ef4444';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(triggerX, 0);
        ctx.lineTo(triggerX, height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Trigger Marker Arrow
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('T 0.0μs', triggerX + 4, 14);
      }

      if (captureState === 'CAPTURING') {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [channels, captureState, zoomLevel, offsetTime, activeChannels, showTrigger]);

  const toggleChannel = (id: string) => {
    setActiveChannels(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="instrument-card flex flex-col h-full select-none overflow-hidden">
      {/* Waveform Viewer Header Bar */}
      <div className="instrument-card-header px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <Activity className="w-4 h-4 text-instrument-cyan" />
            <span className="text-xs font-mono font-bold text-instrument-textBright uppercase">
              OSCILLOSCOPE WAVEFORM VIEW
            </span>
          </div>
          <span className="px-2 py-0.5 bg-instrument-bg text-[10px] font-mono text-instrument-cyan rounded border border-instrument-border">
            {protocol === 'I2C' ? '2 CHANNELS (SCL / SDA)' : protocol === 'SPI' ? '4 CHANNELS (SPI BUS)' : 'CH1 TX (UART TTL)'}
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center space-x-2">
          {/* Zoom Buttons */}
          <div className="flex items-center bg-instrument-bg rounded border border-instrument-border p-0.5 text-xs font-mono">
            <button 
              onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.25))}
              className="p-1 text-instrument-textMuted hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-instrument-cyan font-bold">{zoomLevel.toFixed(2)}x</span>
            <button 
              onClick={() => setZoomLevel(z => Math.min(4, z + 0.25))}
              className="p-1 text-instrument-textMuted hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => { setZoomLevel(1); }}
            className="px-2 py-1 bg-instrument-bg text-instrument-textSubtle hover:text-white rounded border border-instrument-border text-[11px] font-mono flex items-center gap-1"
          >
            <Maximize2 className="w-3 h-3" /> AUTO SCALE
          </button>

          <button
            onClick={onTogglePause}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold flex items-center gap-1.5 border transition-all ${
              captureState === 'CAPTURING'
                ? 'bg-instrument-amberDim text-instrument-amber border-instrument-amber/40 hover:bg-instrument-amber hover:text-black'
                : 'bg-instrument-cyan text-black border-instrument-cyan hover:bg-cyan-300'
            }`}
          >
            {captureState === 'CAPTURING' ? (
              <>
                <Pause className="w-3 h-3 fill-current" /> PAUSE
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" /> RESUME
              </>
            )}
          </button>

          <button
            onClick={() => setShowTrigger(t => !t)}
            className={`px-2 py-1 rounded text-[11px] font-mono border flex items-center gap-1 ${
              showTrigger ? 'bg-instrument-redDim text-instrument-red border-instrument-red/40' : 'bg-instrument-bg text-instrument-textMuted border-instrument-border'
            }`}
          >
            <Crosshair className="w-3 h-3" /> TRIGGER
          </button>
        </div>
      </div>

      {/* Main Waveform Canvas Box */}
      <div className="relative flex-1 bg-instrument-bg min-h-[260px] w-full overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

        {/* Scanline subtle overlay */}
        <div className="absolute inset-0 scanline-overlay pointer-events-none" />
      </div>

      {/* Bottom Channel Toggles Strip */}
      <div className="bg-instrument-panel px-4 py-2 border-t border-instrument-border flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="text-instrument-textMuted flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-instrument-cyan" /> CHANNELS:
          </span>
          {channels.map((ch) => {
            const isVisible = activeChannels[ch.id] !== false && ch.enabled;
            return (
              <button
                key={ch.id}
                onClick={() => toggleChannel(ch.id)}
                className={`px-2.5 py-1 rounded border flex items-center space-x-1.5 transition-all ${
                  isVisible
                    ? 'bg-instrument-bg text-white border-instrument-borderHighlight shadow-sm'
                    : 'bg-instrument-bg/40 text-instrument-textMuted border-transparent opacity-50'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
                <span className="font-bold">{ch.id}</span>
                <span className="text-[10px] text-instrument-textMuted">({ch.name})</span>
                {isVisible ? <Eye className="w-3 h-3 text-instrument-cyan" /> : <EyeOff className="w-3 h-3" />}
              </button>
            );
          })}
        </div>

        {/* Timestamp & Time division readouts */}
        <div className="text-[11px] font-mono text-instrument-textMuted flex items-center space-x-3">
          <span>Time/Div: <strong className="text-instrument-cyan">{(20 / zoomLevel).toFixed(0)} μs</strong></span>
          <span>Sampling: <strong className="text-instrument-textBright">2 MS/s</strong></span>
          <span>Buffer: <strong className="text-instrument-textBright">64 KB</strong></span>
        </div>
      </div>
    </div>
  );
};
