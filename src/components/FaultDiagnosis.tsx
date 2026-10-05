import React from 'react';
import { AlertTriangle, Wrench, ShieldAlert, CheckCircle } from 'lucide-react';
import type { FaultDiagnosisData } from '../types/analyzer';

interface FaultDiagnosisProps {
  fault: FaultDiagnosisData;
}

export const FaultDiagnosis: React.FC<FaultDiagnosisProps> = ({ fault }) => {
  if (!fault.hasFault) {
    return (
      <div className="instrument-card p-4 bg-instrument-bg border-instrument-green/30">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-instrument-greenDim text-instrument-green">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-instrument-green uppercase">
              NO HARDWARE OR TIMING FAULTS DETECTED
            </h4>
            <p className="text-[11px] font-mono text-instrument-textMuted mt-0.5">
              Signal parameters are optimal. Decoder operation is nominal.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="instrument-card p-4 bg-instrument-bg border-instrument-amber/60 shadow-amber-glow">
      <div className="flex items-center justify-between border-b border-instrument-amber/30 pb-2 mb-3">
        <div className="flex items-center space-x-2 text-instrument-amber">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-mono font-extrabold uppercase tracking-wider">
            AUTOMATIC FAULT DIAGNOSIS ENGINE
          </span>
        </div>
        <span className="px-2 py-0.5 bg-instrument-amber text-black text-[10px] font-mono font-bold rounded">
          {fault.errorPercentage}% ERROR RATE
        </span>
      </div>

      <div className="space-y-3 font-mono">
        <div>
          <h3 className="text-sm font-bold text-instrument-textBright uppercase flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-instrument-red" />
            {fault.title}
          </h3>
        </div>

        {/* Possible Causes List */}
        <div className="p-3 bg-instrument-panel rounded border border-instrument-border">
          <span className="text-[10px] text-instrument-textMuted uppercase tracking-wider block mb-1.5 font-bold">
            POSSIBLE ROOT CAUSES:
          </span>
          <ul className="space-y-1 text-xs text-instrument-textBright">
            {fault.possibleCauses.map((cause, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-instrument-amber font-bold">•</span>
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Action */}
        <div className="p-3 bg-instrument-amberDim/50 rounded border border-instrument-amber/40 text-xs">
          <span className="text-[10px] text-instrument-amber font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Wrench className="w-3.5 h-3.5" /> RECOMMENDED ACTION:
          </span>
          <p className="text-instrument-textBright font-semibold">
            {fault.recommendedAction}
          </p>
        </div>
      </div>
    </div>
  );
};
