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
    <div className="instrument-card p-4 bg-white border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-mono font-bold text-slate-900 uppercase">
            ELECTRICAL LEVEL ANALYSIS
          </span>
        </div>
        <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
          ANALOG FRONTEND
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-2.5 bg-slate-50 rounded border border-slate-200 font-mono">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5 font-semibold">
            VOLTAGE LOW (VOL)
          </span>
          <span className="text-base font-bold text-sky-700">
            {electrical.vLow.toFixed(2)} V
          </span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded border border-slate-200 font-mono">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5 font-semibold">
            VOLTAGE HIGH (VOH)
          </span>
          <span className="text-base font-bold text-emerald-600">
            {electrical.vHigh.toFixed(2)} V
          </span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded border border-slate-200 font-mono">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5 font-semibold">
            AMPLITUDE (Vp-p)
          </span>
          <span className="text-base font-bold text-slate-900">
            {electrical.vAmplitude.toFixed(2)} V
          </span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded border border-slate-200 font-mono">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5 font-semibold">
            DETECTED LOGIC
          </span>
          <span className="text-sm font-bold text-sky-700 truncate block">
            {electrical.detectedStandard}
          </span>
        </div>
      </div>

      {/* Voltage Standard Meter Visualization */}
      <div className="bg-slate-50 p-3 rounded border border-slate-200 font-mono">
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2 font-semibold">
          <span>STANDARD VOLTAGE TARGET MATCHER</span>
          <span className="text-sky-700 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Auto-Calibrated
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {electrical.availableStandards.map((std, idx) => (
            <div
              key={idx}
              className={`p-2 rounded border text-center transition-all ${
                std.active
                  ? 'bg-sky-50 text-sky-700 border-sky-400 font-bold shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200'
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
