import React from 'react';
import { Play, Square, Pause, Sparkles } from 'lucide-react';
import type { CaptureState } from '../types/analyzer';

interface CaptureControlsProps {
  captureState: CaptureState;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onAutoDetect: () => void;
}

export const CaptureControls: React.FC<CaptureControlsProps> = ({
  captureState,
  onStart,
  onStop,
  onPause,
  onAutoDetect,
}) => {
  return (
    <div className="instrument-card p-3 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
      {/* Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onStart}
          className={`px-3 py-1.5 rounded font-bold flex items-center gap-1.5 transition-all ${
            captureState === 'CAPTURING'
              ? 'bg-instrument-green text-black shadow-green-glow'
              : 'bg-instrument-bg text-instrument-green border border-instrument-green/40 hover:bg-instrument-green hover:text-black'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" /> START
        </button>

        <button
          onClick={onStop}
          className="px-3 py-1.5 bg-instrument-bg text-instrument-red border border-instrument-red/40 hover:bg-instrument-red hover:text-white rounded font-bold flex items-center gap-1.5 transition-all"
        >
          <Square className="w-3.5 h-3.5 fill-current" /> STOP
        </button>

        <button
          onClick={onPause}
          className={`px-3 py-1.5 rounded font-bold flex items-center gap-1.5 transition-all ${
            captureState === 'PAUSED'
              ? 'bg-instrument-amber text-black'
              : 'bg-instrument-bg text-instrument-amber border border-instrument-amber/40 hover:bg-instrument-amber hover:text-black'
          }`}
        >
          <Pause className="w-3.5 h-3.5" /> PAUSE
        </button>

        <button
          onClick={onAutoDetect}
          className="px-3 py-1.5 bg-instrument-purple text-black font-bold rounded flex items-center gap-1.5 shadow-purple-glow hover:bg-purple-300 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" /> AUTO DETECT
        </button>
      </div>

      {/* Hardware Parameter Badges */}
      <div className="flex items-center space-x-3 text-[11px] text-instrument-textMuted bg-instrument-bg px-3 py-1.5 rounded border border-instrument-border">
        <span>Sampling Rate: <strong className="text-instrument-cyan">2 MS/s</strong></span>
        <span className="text-instrument-border">|</span>
        <span>Buffer: <strong className="text-instrument-textBright">64 KB</strong></span>
        <span className="text-instrument-border">|</span>
        <span>Channels: <strong className="text-instrument-textBright">4</strong></span>
        <span className="text-instrument-border">|</span>
        <span>Capture: <strong className="text-instrument-green uppercase">{captureState}</strong></span>
      </div>
    </div>
  );
};
