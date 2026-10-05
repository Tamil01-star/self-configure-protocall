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
        <span className="px-2.5 py-1 rounded bg-instrument-greenDim text-instrument-green border border-instrument-green/40 text-xs font-mono font-bold flex items-center gap-1.5 glow-green">
          <span className="w-2 h-2 rounded-full bg-instrument-green animate-led" />
          HEALTHY
        </span>
      );
    }
    if (health.status === 'WARNING') {
      return (
        <span className="px-2.5 py-1 rounded bg-instrument-amberDim text-instrument-amber border border-instrument-amber/40 text-xs font-mono font-bold flex items-center gap-1.5 glow-amber">
          <span className="w-2 h-2 rounded-full bg-instrument-amber animate-led" />
          WARNING
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded bg-instrument-redDim text-instrument-red border border-instrument-red/40 text-xs font-mono font-bold flex items-center gap-1.5 glow-red">
        <span className="w-2 h-2 rounded-full bg-instrument-red animate-led" />
        FAULT DETECTED
      </span>
    );
  };

  return (
    <div className="instrument-card p-4 relative overflow-hidden bg-dot-grid">
      {/* Top Header Label */}
      <div className="flex items-center justify-between border-b border-instrument-border pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-instrument-cyan" />
          <span className="text-[11px] font-mono text-instrument-textMuted uppercase tracking-wider">
            AUTOMATIC SIGNAL ANALYSIS READOUT
          </span>
        </div>
        {getStatusBadge()}
      </div>

      {/* Main Readout Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Protocol Name */}
        <div className="md:col-span-2 flex items-center space-x-4">
          <div className="w-14 h-14 rounded bg-instrument-bg border border-instrument-cyan/30 flex items-center justify-center text-instrument-cyan font-mono font-bold text-xl shadow-cyan-glow">
            {protocol === 'I2C' ? 'I²C' : protocol}
          </div>
          <div>
            <span className="text-[10px] font-mono text-instrument-textMuted uppercase tracking-widest block">
              DETECTED PROTOCOL
            </span>
            <div className="text-2xl font-bold font-mono text-instrument-textBright flex items-center space-x-2">
              <span>{protocol === 'I2C' ? 'I²C Bus' : protocol === 'UART' ? 'UART TTL' : protocol}</span>
              {isAnalyzing && (
                <span className="text-xs text-instrument-cyan animate-pulse">
                  (Analyzing...)
                </span>
              )}
            </div>
            <span className="text-[11px] font-mono text-instrument-green flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Automatically decoded & locked
            </span>
          </div>
        </div>

        {/* Confidence Percentage Readout */}
        <div className="bg-instrument-bg p-3 rounded border border-instrument-border font-mono">
          <span className="text-[10px] text-instrument-textMuted uppercase tracking-wider block">
            CONFIDENCE RATING
          </span>
          <div className="flex items-baseline space-x-1 mt-0.5">
            <span className="text-3xl font-extrabold text-instrument-cyan">
              {confidence.toFixed(1)}
            </span>
            <span className="text-lg text-instrument-cyan">%</span>
          </div>
          <div className="w-full bg-instrument-border h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className="bg-instrument-cyan h-full transition-all duration-500 shadow-cyan-glow"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        {/* Logic Voltage Readout */}
        <div className="bg-instrument-bg p-3 rounded border border-instrument-border font-mono">
          <span className="text-[10px] text-instrument-textMuted uppercase tracking-wider block">
            LOGIC LEVEL
          </span>
          <div className="flex items-baseline space-x-1 mt-0.5">
            <span className="text-3xl font-extrabold text-instrument-textBright">
              {logicLevelV.toFixed(1)}
            </span>
            <span className="text-lg text-instrument-textMuted">V</span>
          </div>
          <span className="text-[10px] text-instrument-textMuted block mt-1 flex items-center gap-1">
            <Zap className="w-3 h-3 text-instrument-amber" /> Peak-to-peak amplitude
          </span>
        </div>
      </div>
    </div>
  );
};
