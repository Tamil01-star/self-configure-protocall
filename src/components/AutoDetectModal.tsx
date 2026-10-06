import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

interface AutoDetectModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const AutoDetectModal: React.FC<AutoDetectModalProps> = ({ isOpen, onComplete }) => {
  const steps = [
    'TRIGGERING ESP32 #2 LOGIC ANALYZER',
    'CAPTURING DIGITAL INPUT PIN BURST (GPIO 4-7)',
    'MEASURING EDGE TRANSITION TIMING',
    'TESTING MULTI-HYPOTHESIS PROTOCOL PATTERNS',
    'COMPARING EVIDENCE SIGNATURES',
    'EXTRACTING BAUDRATE & CLOCK PARAMETERS',
    'CONFIGURING HARDWARE DECODER',
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return prev;
        }
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="instrument-card p-5 max-w-md w-full border border-instrument-purple bg-instrument-panel relative text-xs space-y-3">
        <div className="flex items-center space-x-2.5 border-b border-instrument-border pb-2">
          <Sparkles className="w-4 h-4 text-instrument-purple animate-spin" />
          <div>
            <h3 className="text-xs font-bold text-instrument-textBright uppercase">
              HARDWARE AUTO-DETECTION PIPELINE
            </h3>
            <p className="text-[10px] text-instrument-purple font-semibold">
              ESP32 #2 Signal Fingerprint Pipeline
            </p>
          </div>
        </div>

        {/* Progress Step List */}
        <div className="space-y-1.5">
          {steps.map((step, idx) => {
            const isFinished = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={step}
                className={`p-1.5 rounded-sm border text-[11px] flex items-center justify-between transition-colors font-semibold ${
                  isCurrent
                    ? 'bg-instrument-bg text-instrument-purple border-instrument-purple font-bold'
                    : isFinished
                    ? 'bg-instrument-bg text-instrument-green border-instrument-border'
                    : 'bg-instrument-bg text-instrument-textMuted border-transparent opacity-40'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-[9px] opacity-75">0{idx + 1}.</span>
                  <span>{step}</span>
                </span>
                {isFinished && <CheckCircle2 className="w-3.5 h-3.5 text-instrument-green shrink-0" />}
                {isCurrent && <Loader2 className="w-3.5 h-3.5 animate-spin text-instrument-purple shrink-0" />}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-instrument-bg h-1.5 rounded-sm overflow-hidden border border-instrument-border">
          <div
            className="bg-instrument-purple h-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
