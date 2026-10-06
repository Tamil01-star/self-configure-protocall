import React from 'react';
import { CheckCircle2, HelpCircle, AlertCircle } from 'lucide-react';
import type { ProtocolType } from '../types/analyzer';

interface DetectionEvidenceProps {
  evidence: string[];
  protocol: ProtocolType | null;
  confidence: number | null;
}

export const DetectionEvidence: React.FC<DetectionEvidenceProps> = ({
  evidence,
  protocol,
  confidence,
}) => {
  return (
    <div className="instrument-card p-3 font-mono text-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between border-b border-instrument-border pb-2 mb-2">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-3.5 h-3.5 text-instrument-purple" />
            <span className="font-bold text-instrument-textBright uppercase">
              WHY THIS RESULT?
            </span>
          </div>
          <span className="text-[10px] text-instrument-textMuted font-semibold">
            ANALYZER PROOF
          </span>
        </div>

        {evidence && evidence.length > 0 ? (
          <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
            {evidence.map((item, idx) => (
              <div
                key={idx}
                className="p-1.5 bg-instrument-bg rounded-sm border border-instrument-border flex items-start space-x-2 text-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-instrument-green shrink-0 mt-0.5" />
                <span className="text-instrument-textBright font-medium">{item}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-instrument-bg rounded-sm border border-instrument-border text-center space-y-1 my-4">
            <AlertCircle className="w-4 h-4 text-instrument-textMuted mx-auto" />
            <span className="text-instrument-textMuted block font-bold text-[11px]">
              NO ANALYSIS EVIDENCE AVAILABLE
            </span>
            <span className="text-[10px] text-instrument-textMuted block">
              Waiting for ESP32 #2 logic analyzer evidence telemetry...
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-instrument-border flex items-center justify-between text-[11px]">
        <span className="text-instrument-textMuted">Reported Protocol:</span>
        <span className="font-bold text-instrument-blue uppercase">
          {protocol || 'NONE'} {confidence !== null ? `(${confidence.toFixed(1)}%)` : ''}
        </span>
      </div>
    </div>
  );
};
