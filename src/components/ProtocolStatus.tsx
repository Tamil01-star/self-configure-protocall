import React from 'react';
import { ShieldCheck, Zap, Activity } from 'lucide-react';
import type { ProtocolType, SignalHealthData } from '../types/analyzer';

interface ProtocolStatusProps {
  protocol: ProtocolType;
  confidence: number;
  logicLevelV: number;
  health: SignalHealthData;
  isAnalyzing: boolean;
}

export const ProtocolStatus: React.FC<ProtocolStatusProps> = ({
  protocol,
  confidence,
  logicLevelV,
  health,
  isAnalyzing
}) => {
  const getStatusBadge = () => {
    if (health.status === 'HEALTHY') {
      return (
        <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-led" />
          HEALTHY
        </span>
      );
    }
    if (health.status === 'WARNING') {
      return (
        <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-led" />
          WARNING
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded bg-red-50 text-red-700 border border-red-200 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-led" />
        FAULT DETECTED
      </span>
    );
  };

  return (
    <div className="instrument-card p-4 relative overflow-hidden bg-dot-grid">
      {/* Top Header Label */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-sky-600" />
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
            AUTOMATIC SIGNAL ANALYSIS READOUT
          </span>
        </div>
        {getStatusBadge()}
      </div>

      {/* Main Readout Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Protocol Name */}
        <div className="md:col-span-2 flex items-center space-x-4">
          <div className="w-14 h-14 rounded bg-sky-50 border border-sky-300 flex items-center justify-center text-sky-700 font-mono font-bold text-xl shadow-sm">
            {protocol === 'I2C' ? 'I²C' : protocol}
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-semibold">
              DETECTED PROTOCOL
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900 flex items-center space-x-2">
              <span>{protocol === 'I2C' ? 'I²C Bus' : protocol === 'UART' ? 'UART TTL' : protocol}</span>
              {isAnalyzing && (
                <span className="text-xs text-sky-600 animate-pulse">
                  (Analyzing...)
                </span>
              )}
            </div>
            <span className="text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Automatically decoded & locked
            </span>
          </div>
        </div>

        {/* Confidence Percentage Readout */}
        <div className="bg-slate-50 p-3 rounded border border-slate-200 font-mono">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
            CONFIDENCE RATING
          </span>
          <div className="flex items-baseline space-x-1 mt-0.5">
            <span className="text-3xl font-extrabold text-sky-700">
              {confidence.toFixed(1)}
            </span>
            <span className="text-lg text-sky-600 font-bold">%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className="bg-sky-600 h-full transition-all duration-500 shadow-sm"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        {/* Logic Voltage Readout */}
        <div className="bg-slate-50 p-3 rounded border border-slate-200 font-mono">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
            LOGIC LEVEL
          </span>
          <div className="flex items-baseline space-x-1 mt-0.5">
            <span className="text-3xl font-extrabold text-slate-900">
              {logicLevelV.toFixed(1)}
            </span>
            <span className="text-lg text-slate-500 font-bold">V</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1 flex items-center gap-1 font-medium">
            <Zap className="w-3 h-3 text-amber-500" /> Peak-to-peak amplitude
          </span>
        </div>
      </div>
    </div>
  );
};
