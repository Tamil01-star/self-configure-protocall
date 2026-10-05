import React from 'react';
import { Zap, Activity } from 'lucide-react';
import type { ElectricalLevelData } from '../types/analyzer';

interface ElectricalLevelPanelProps {
  electrical: ElectricalLevelData;
}

export const ElectricalLevelPanel: React.FC<ElectricalLevelPanelProps> = ({
  electrical
}) => {
  return (
    <div className="instrument-card p-4">
      <div className="flex items-center justify-between border-b border-instrument-border pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-instrument-amber" />
          <span className="text-xs font-mono font-bold text-instrument-textBright uppercase">
            ELECTRICAL LEVEL ANALYSIS
          </span>
        </div>
        <span className="text-[10px] font-mono text-instrument-amber bg-instrument-amberDim px-2 py-0.5 rounded border border-instrument-amber/30">
          ANALOG FRONTEND
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-2.5 bg-instrument-bg rounded border border-instrument-border font-mono">
          <span className="text-[10px] text-instrument-textMuted uppercase tracking-wider block mb-0.5">
            VOLTAGE LOW (VOL)
          </span>
          <span className="text-base font-bold text-instrument-cyan">
            {electrical.vLow.toFixed(2)} V
          </span>
        </div>

        <div className="p-2.5 bg-instrument-bg rounded border border-instrument-border font-mono">
          <span className="text-[10px] text-instrument-textMuted uppercase tracking-wider block mb-0.5">
            VOLTAGE HIGH (VOH)
          </span>
          <span className="text-base font-bold text-instrument-green">
            {electrical.vHigh.toFixed(2)} V
          </span>
        </div>

        <div className="p-2.5 bg-instrument-bg rounded border border-instrument-border font-mono">
          <span className="text-[10px] text-instrument-textMuted uppercase tracking-wider block mb-0.5">
            AMPLITUDE (Vp-p)
          </span>
          <span className="text-base font-bold text-instrument-textBright">
            {electrical.vAmplitude.toFixed(2)} V
          </span>
        </div>

        <div className="p-2.5 bg-instrument-bg rounded border border-instrument-border font-mono">
          <span className="text-[10px] text-instrument-textMuted uppercase tracking-wider block mb-0.5">
            DETECTED LOGIC
          </span>
          <span className="text-sm font-bold text-instrument-cyan truncate block">
            {electrical.detectedStandard}
          </span>
        </div>
      </div>

      {/* Voltage Standard Meter Visualization */}
      <div className="bg-instrument-bg p-3 rounded border border-instrument-border font-mono">
        <div className="flex items-center justify-between text-[10px] text-instrument-textMuted mb-2">
          <span>STANDARD VOLTAGE TARGET MATCHER</span>
          <span className="text-instrument-cyan flex items-center gap-1">
            <Activity className="w-3 h-3" /> Auto-Calibrated
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {electrical.availableStandards.map((std, idx) => (
            <div
              key={idx}
              className={`p-2 rounded border text-center transition-all ${
                std.active
                  ? 'bg-instrument-cyanDim text-instrument-cyan border-instrument-cyan font-bold shadow-cyan-glow'
                  : 'bg-instrument-panel text-instrument-textMuted border-instrument-border'
              }`}
            >
              <span className="text-[11px] block">{std.name}</span>
              <span className="text-[9px] opacity-75">{std.voltage}V Target</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
