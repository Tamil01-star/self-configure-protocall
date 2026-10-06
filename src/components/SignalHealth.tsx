import React from 'react';
import { HeartPulse } from 'lucide-react';
import type { RealSignalHealth } from '../types/analyzer';

interface SignalHealthProps {
  health: RealSignalHealth;
  isConnected: boolean;
}

export const SignalHealth: React.FC<SignalHealthProps> = ({ health, isConnected }) => {
  const formatValue = (val: number | null, suffix: string = ''): string => {
    if (!isConnected || val === null || val === undefined) return 'N/A';
    return `${val}${suffix}`;
  };

  return (
    <div className="instrument-card p-3 font-mono text-xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between border-b border-instrument-border pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <HeartPulse className="w-3.5 h-3.5 text-instrument-green" />
          <span className="font-bold text-instrument-textBright uppercase">
            SIGNAL HEALTH & INTEGRITY
          </span>
        </div>
        <span className="text-[10px] text-instrument-textMuted font-semibold">
          ANALYZER METRICS
        </span>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <div className="p-2 bg-instrument-bg rounded-sm border border-instrument-border">
          <span className="text-[9px] text-instrument-textMuted uppercase block font-semibold">Valid Frames</span>
          <span className="text-xs font-bold text-instrument-green block">
            {formatValue(health.validFrames)}
          </span>
        </div>

        <div className="p-2 bg-instrument-bg rounded-sm border border-instrument-border">
          <span className="text-[9px] text-instrument-textMuted uppercase block font-semibold">Invalid Frames</span>
          <span className={`text-xs font-bold block ${health.invalidFrames && health.invalidFrames > 0 ? 'text-instrument-red' : 'text-instrument-textBright'}`}>
            {formatValue(health.invalidFrames)}
          </span>
        </div>

        <div className="p-2 bg-instrument-bg rounded-sm border border-instrument-border">
          <span className="text-[9px] text-instrument-textMuted uppercase block font-semibold">Timing Consistency</span>
          <span className="text-xs font-bold text-instrument-blue block">
            {formatValue(health.timingConsistencyPercent, '%')}
          </span>
        </div>

        <div className="p-2 bg-instrument-bg rounded-sm border border-instrument-border">
          <span className="text-[9px] text-instrument-textMuted uppercase block font-semibold">Transition Consistency</span>
          <span className="text-xs font-bold text-instrument-blue block">
            {formatValue(health.transitionConsistencyPercent, '%')}
          </span>
        </div>

        <div className="p-2 bg-instrument-bg rounded-sm border border-instrument-border">
          <span className="text-[9px] text-instrument-textMuted uppercase block font-semibold">Clock Consistency</span>
          <span className="text-xs font-bold text-instrument-blue block">
            {formatValue(health.clockConsistencyPercent, '%')}
          </span>
        </div>

        <div className="p-2 bg-instrument-bg rounded-sm border border-instrument-border">
          <span className="text-[9px] text-instrument-textMuted uppercase block font-semibold">Errors Detected</span>
          <span className={`text-xs font-bold block ${health.errorCount && health.errorCount > 0 ? 'text-instrument-red' : 'text-instrument-green'}`}>
            {formatValue(health.errorCount)}
          </span>
        </div>
      </div>

      <div className="mt-2 pt-1 border-t border-instrument-border text-[10px] text-instrument-textMuted flex justify-between font-semibold">
        <span>Hardware Provider: <strong className="text-instrument-textBright">ESP32 #2 Analyzer</strong></span>
        <span>Status: <strong className={isConnected ? 'text-instrument-green' : 'text-instrument-red'}>{isConnected ? 'LIVE MONITORING' : 'N/A'}</strong></span>
      </div>
    </div>
  );
};
