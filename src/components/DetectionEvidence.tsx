import React from 'react';
import { CheckCircle2, XCircle, Sparkles, HelpCircle } from 'lucide-react';
import type { DetectionEvidenceItem, ProtocolType } from '../types/analyzer';

interface DetectionEvidenceProps {
  evidence: DetectionEvidenceItem[];
  protocol: ProtocolType;
  confidence: number;
}

export const DetectionEvidence: React.FC<DetectionEvidenceProps> = ({
  evidence,
  protocol,
  confidence,
}) => {
  return (
    <div className="instrument-card p-4 flex flex-col justify-between bg-white border border-slate-200">
      <div>
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-mono font-bold text-slate-900 uppercase">
              EXPLAINABLE DETECTION EVIDENCE
            </span>
          </div>
          <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-semibold">
            FINGERPRINT PROOF
          </span>
        </div>

        <h4 className="text-xs font-mono text-slate-800 font-bold mb-3 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
          WHY WAS <strong className="text-sky-700 uppercase">{protocol === 'I2C' ? 'I²C' : protocol}</strong> DETECTED?
        </h4>

        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {evidence.map((item, idx) => (
            <div
              key={item.id}
              className="p-2 bg-slate-50 rounded border border-slate-200 flex items-start space-x-2.5 font-mono text-xs transition-all animate-fadeIn"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {item.verified ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              )}
              <span className={item.verified ? 'text-slate-900 font-medium' : 'text-slate-400 line-through'}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between bg-slate-50 p-2.5 rounded border border-slate-200 font-mono">
        <span className="text-xs text-slate-500 font-medium">Fingerprint Confidence:</span>
        <div className="flex items-center space-x-1.5">
          <span className="text-base font-extrabold text-sky-700">
            {confidence.toFixed(1)}%
          </span>
          <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-bold">
            CONFIRMED
          </span>
        </div>
      </div>
    </div>
  );
};
