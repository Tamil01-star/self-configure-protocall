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
    <div className="instrument-card p-3 flex flex-wrap items-center justify-between gap-3 font-mono text-xs bg-white border border-slate-200 shadow-sm">
      {/* Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onStart}
          className={`px-3 py-1.5 rounded font-bold flex items-center gap-1.5 transition-all shadow-sm ${
            captureState === 'CAPTURING'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-600 hover:text-white'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" /> START
        </button>

        <button
          onClick={onStop}
          className="px-3 py-1.5 bg-white text-red-700 border border-red-300 hover:bg-red-600 hover:text-white rounded font-bold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Square className="w-3.5 h-3.5 fill-current" /> STOP
        </button>

        <button
          onClick={onPause}
          className={`px-3 py-1.5 rounded font-bold flex items-center gap-1.5 transition-all shadow-sm ${
            captureState === 'PAUSED'
              ? 'bg-amber-500 text-white'
              : 'bg-white text-amber-700 border border-amber-300 hover:bg-amber-500 hover:text-white'
          }`}
        >
          <Pause className="w-3.5 h-3.5" /> PAUSE
        </button>

        <button
          onClick={onAutoDetect}
          className="px-3 py-1.5 bg-purple-600 text-white font-bold rounded flex items-center gap-1.5 hover:bg-purple-700 transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" /> AUTO DETECT
        </button>
      </div>

      {/* Hardware Parameter Badges */}
      <div className="flex items-center space-x-3 text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded border border-slate-200 font-medium">
        <span>Sampling Rate: <strong className="text-sky-700 font-bold">2 MS/s</strong></span>
        <span className="text-slate-300">|</span>
        <span>Buffer: <strong className="text-slate-900 font-bold">64 KB</strong></span>
        <span className="text-slate-300">|</span>
        <span>Channels: <strong className="text-slate-900 font-bold">4</strong></span>
        <span className="text-slate-300">|</span>
        <span>Capture: <strong className="text-emerald-600 font-bold uppercase">{captureState}</strong></span>
      </div>
    </div>
  );
};
