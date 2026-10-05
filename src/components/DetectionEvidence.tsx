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
    <div className="instrument-card p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-instrument-border pb-2 mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-instrument-purple" />
            <span className="text-xs font-mono font-bold text-instrument-textBright uppercase">
              EXPLAINABLE DETECTION EVIDENCE
            </span>
          </div>
          <span className="text-[10px] font-mono text-instrument-purple bg-instrument-purpleDim px-2 py-0.5 rounded border border-instrument-purple/30">
            FINGERPRINT PROOF
          </span>
        </div>

        <h4 className="text-xs font-mono text-instrument-textBright font-semibold mb-3 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-instrument-cyan" />
          WHY WAS <strong className="text-instrument-cyan uppercase">{protocol === 'I2C' ? 'I²C' : protocol}</strong> DETECTED?
        </h4>

        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {evidence.map((item, idx) => (
            <div
              key={item.id}
              className="p-2 bg-instrument-bg rounded border border-instrument-border flex items-start space-x-2.5 font-mono text-xs transition-all animate-fadeIn"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {item.verified ? (
                <CheckCircle2 className="w-4 h-4 text-instrument-green shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-instrument-red shrink-0 mt-0.5" />
              )}
              <span className={item.verified ? 'text-instrument-textBright' : 'text-instrument-textMuted line-through'}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-instrument-border flex items-center justify-between bg-instrument-bg p-2.5 rounded border border-instrument-border font-mono">
        <span className="text-xs text-instrument-textMuted">Fingerprint Confidence:</span>
        <div className="flex items-center space-x-1.5">
          <span className="text-base font-extrabold text-instrument-cyan">
            {confidence.toFixed(1)}%
          </span>
          <span className="text-[10px] bg-instrument-cyanDim text-instrument-cyan px-1.5 py-0.5 rounded">
            CONFIRMED
          </span>
        </div>
      </div>
    </div>
  );
};
