import React from 'react';
import { HeartPulse } from 'lucide-react';
import type { SignalHealthData } from '../types/analyzer';

interface SignalHealthProps {
  health: SignalHealthData;
}

export const SignalHealth: React.FC<SignalHealthProps> = ({ health }) => {
  const getStatusColor = () => {
    if (health.status === 'HEALTHY') return '#10b981';
    if (health.status === 'WARNING') return '#f59e0b';
    return '#ef4444';
  };

  const statusColor = getStatusColor();

  return (
    <div className="instrument-card p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-instrument-border pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <HeartPulse className="w-4 h-4 text-instrument-green" />
          <span className="text-xs font-mono font-bold text-instrument-textBright uppercase">
            COMMUNICATION SIGNAL HEALTH
          </span>
        </div>
        <span 
          className="text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold"
          style={{ backgroundColor: `${statusColor}20`, color: statusColor, borderColor: `${statusColor}50` }}
        >
          {health.status}
        </span>
      </div>

      {/* Custom Circular/Arc Instrument Meter */}
      <div className="flex items-center justify-center my-2 relative">
        <svg className="w-36 h-36" viewBox="0 0 100 100">
          {/* Background Track Arc */}
          <path
            d="M 15,85 A 45,45 0 1,1 85,85"
            fill="none"
            stroke="#131e2e"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Filled Health Arc */}
          <path
            d="M 15,85 A 45,45 0 1,1 85,85"
            fill="none"
            stroke={statusColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="212"
            strokeDashoffset={212 - (212 * health.healthScore) / 100}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center font-mono">
          <span className="text-3xl font-extrabold text-white">{health.healthScore}</span>
          <span className="text-[10px] text-instrument-textMuted uppercase">SCORE / 100</span>
        </div>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 font-mono text-xs mt-1">
        <div className="p-2 bg-instrument-bg rounded border border-instrument-border">
          <span className="text-[9px] text-instrument-textMuted uppercase block">Frame Errors</span>
          <span className={`font-bold ${health.frameErrors > 0 ? 'text-instrument-red' : 'text-instrument-textBright'}`}>
            {health.frameErrors}
          </span>
        </div>

        <div className="p-2 bg-instrument-bg rounded border border-instrument-border">
          <span className="text-[9px] text-instrument-textMuted uppercase block">Parity Errors</span>
          <span className={`font-bold ${health.parityErrors > 0 ? 'text-instrument-red' : 'text-instrument-textBright'}`}>
            {health.parityErrors}
          </span>
        </div>

        <div className="p-2 bg-instrument-bg rounded border border-instrument-border">
          <span className="text-[9px] text-instrument-textMuted uppercase block">Timing Jitter</span>
          <span className={`font-bold ${health.timingJitterPercent > 5 ? 'text-instrument-amber' : 'text-instrument-cyan'}`}>
            {health.timingJitterPercent.toFixed(1)}%
          </span>
        </div>

        <div className="p-2 bg-instrument-bg rounded border border-instrument-border">
          <span className="text-[9px] text-instrument-textMuted uppercase block">Noise Events</span>
          <span className={`font-bold ${health.noiseEvents > 5 ? 'text-instrument-amber' : 'text-instrument-textBright'}`}>
            {health.noiseEvents}
          </span>
        </div>

        <div className="p-2 bg-instrument-bg rounded border border-instrument-border">
          <span className="text-[9px] text-instrument-textMuted uppercase block">Invalid Frames</span>
          <span className={`font-bold ${health.invalidFrames > 0 ? 'text-instrument-red' : 'text-instrument-textBright'}`}>
            {health.invalidFrames}
          </span>
        </div>

        <div className="p-2 bg-instrument-bg rounded border border-instrument-border">
          <span className="text-[9px] text-instrument-textMuted uppercase block">Overall Status</span>
          <span className="font-bold uppercase text-[10px]" style={{ color: statusColor }}>
            ● {health.status}
          </span>
        </div>
      </div>
    </div>
  );
};
