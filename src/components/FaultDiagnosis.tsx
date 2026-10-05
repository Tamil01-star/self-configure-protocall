import React from 'react';
import { AlertTriangle, Wrench, ShieldAlert, CheckCircle } from 'lucide-react';
import type { FaultDiagnosisData } from '../types/analyzer';

interface FaultDiagnosisProps {
  fault: FaultDiagnosisData;
}

export const FaultDiagnosis: React.FC<FaultDiagnosisProps> = ({ fault }) => {
  if (!fault.hasFault) {
    return (
      <div className="instrument-card p-4 bg-emerald-50/50 border border-emerald-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-emerald-100 text-emerald-700">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-emerald-800 uppercase">
              NO HARDWARE OR TIMING FAULTS DETECTED
            </h4>
            <p className="text-[11px] font-mono text-emerald-700 mt-0.5 font-medium">
              Signal parameters are optimal. Decoder operation is nominal.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="instrument-card p-4 bg-amber-50/60 border border-amber-300 shadow-sm">
      <div className="flex items-center justify-between border-b border-amber-200 pb-2 mb-3">
        <div className="flex items-center space-x-2 text-amber-700">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-mono font-extrabold uppercase tracking-wider">
            AUTOMATIC FAULT DIAGNOSIS ENGINE
          </span>
        </div>
        <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-mono font-bold rounded shadow-sm">
          {fault.errorPercentage}% ERROR RATE
        </span>
      </div>

      <div className="space-y-3 font-mono">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            {fault.title}
          </h3>
        </div>

        {/* Possible Causes List */}
        <div className="p-3 bg-white rounded border border-amber-200">
          <span className="text-[10px] text-amber-800 uppercase tracking-wider block mb-1.5 font-bold">
            POSSIBLE ROOT CAUSES:
          </span>
          <ul className="space-y-1 text-xs text-slate-800 font-medium">
            {fault.possibleCauses.map((cause, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Action */}
        <div className="p-3 bg-amber-100/70 rounded border border-amber-300 text-xs">
          <span className="text-[10px] text-amber-900 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Wrench className="w-3.5 h-3.5" /> RECOMMENDED ACTION:
          </span>
          <p className="text-slate-900 font-bold">
            {fault.recommendedAction}
          </p>
        </div>
      </div>
    </div>
  );
};
