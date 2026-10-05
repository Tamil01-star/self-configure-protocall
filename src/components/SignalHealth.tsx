import React from 'react';
import { HeartPulse } from 'lucide-react';
import type { SignalHealthData } from '../types/analyzer';

interface SignalHealthProps {
  health: SignalHealthData;
}

export const SignalHealth: React.FC<SignalHealthProps> = ({ health }) => {
  const getStatusColor = () => {
    if (health.status === 'HEALTHY') return '#059669'; // emerald
    if (health.status === 'WARNING') return '#d97706'; // amber
    return '#dc2626'; // red
  };

  const statusColor = getStatusColor();

  return (
    <div className="instrument-card p-4 flex flex-col justify-between bg-white border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <HeartPulse className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-mono font-bold text-slate-900 uppercase">
            COMMUNICATION SIGNAL HEALTH
          </span>
        </div>
        <span 
          className="text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold"
          style={{ backgroundColor: `${statusColor}15`, color: statusColor, borderColor: `${statusColor}40` }}
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
            stroke="#e2e8f0"
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
          <span className="text-3xl font-extrabold text-slate-900">{health.healthScore}</span>
          <span className="text-[10px] text-slate-500 uppercase font-semibold">SCORE / 100</span>
        </div>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 font-mono text-xs mt-1">
        <div className="p-2 bg-slate-50 rounded border border-slate-200">
          <span className="text-[9px] text-slate-400 uppercase block font-semibold">Frame Errors</span>
          <span className={`font-bold ${health.frameErrors > 0 ? 'text-red-600' : 'text-slate-900'}`}>
            {health.frameErrors}
          </span>
        </div>

        <div className="p-2 bg-slate-50 rounded border border-slate-200">
          <span className="text-[9px] text-slate-400 uppercase block font-semibold">Parity Errors</span>
          <span className={`font-bold ${health.parityErrors > 0 ? 'text-red-600' : 'text-slate-900'}`}>
            {health.parityErrors}
          </span>
        </div>

        <div className="p-2 bg-slate-50 rounded border border-slate-200">
          <span className="text-[9px] text-slate-400 uppercase block font-semibold">Timing Jitter</span>
          <span className={`font-bold ${health.timingJitterPercent > 5 ? 'text-amber-600' : 'text-sky-700'}`}>
            {health.timingJitterPercent.toFixed(1)}%
          </span>
        </div>

        <div className="p-2 bg-slate-50 rounded border border-slate-200">
          <span className="text-[9px] text-slate-400 uppercase block font-semibold">Noise Events</span>
          <span className={`font-bold ${health.noiseEvents > 5 ? 'text-amber-600' : 'text-slate-900'}`}>
            {health.noiseEvents}
          </span>
        </div>

        <div className="p-2 bg-slate-50 rounded border border-slate-200">
          <span className="text-[9px] text-slate-400 uppercase block font-semibold">Invalid Frames</span>
          <span className={`font-bold ${health.invalidFrames > 0 ? 'text-red-600' : 'text-slate-900'}`}>
            {health.invalidFrames}
          </span>
        </div>

        <div className="p-2 bg-slate-50 rounded border border-slate-200">
          <span className="text-[9px] text-slate-400 uppercase block font-semibold">Overall Status</span>
          <span className="font-bold uppercase text-[10px]" style={{ color: statusColor }}>
            ● {health.status}
          </span>
        </div>
      </div>
    </div>
  );
};
