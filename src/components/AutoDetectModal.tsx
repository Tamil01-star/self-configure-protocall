import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

interface AutoDetectModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const AutoDetectModal: React.FC<AutoDetectModalProps> = ({ isOpen, onComplete }) => {
  const steps = [
    'CAPTURING SIGNAL',
    'ANALYZING VOLTAGE LEVELS',
    'EXTRACTING TIMING FEATURES',
    'IDENTIFYING SIGNAL STRUCTURE',
    'COMPARING PROTOCOL FINGERPRINTS',
    'ESTIMATING PARAMETERS',
    'CONFIGURING DECODER',
    'DECODING DATA',
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
          setTimeout(onComplete, 400);
          return prev;
        }
      });
    }, 220);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="instrument-card p-6 max-w-md w-full border-instrument-purple shadow-purple-glow bg-instrument-panel relative">
        <div className="flex items-center space-x-3 border-b border-instrument-border pb-3 mb-4">
          <Sparkles className="w-5 h-5 text-instrument-purple animate-spin" />
          <div>
            <h3 className="text-sm font-bold text-instrument-textBright uppercase">
              SELF-CONFIGURING PROTOCOL ENGINE
            </h3>
            <p className="text-[10px] text-instrument-purple">
              Running Signal Intelligence Pipeline v4.2
            </p>
          </div>
        </div>

        {/* Progress Step List */}
        <div className="space-y-2 mb-4">
          {steps.map((step, idx) => {
            const isFinished = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={step}
                className={`p-2 rounded border text-xs flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'bg-instrument-purpleDim text-instrument-purple border-instrument-purple font-bold shadow-sm'
                    : isFinished
                    ? 'bg-instrument-green/10 text-instrument-green border-instrument-border'
                    : 'bg-instrument-bg/40 text-instrument-textMuted border-transparent opacity-40'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-[10px] opacity-75">0{idx + 1}.</span>
                  <span>{step}</span>
                </span>
                {isFinished && <CheckCircle2 className="w-3.5 h-3.5 text-instrument-green" />}
                {isCurrent && <Loader2 className="w-3.5 h-3.5 animate-spin text-instrument-purple" />}
              </div>
            );
          })}
        </div>

        {/* Overall Progress Bar */}
        <div className="w-full bg-instrument-bg h-2 rounded overflow-hidden border border-instrument-border">
          <div
            className="bg-instrument-purple h-full transition-all duration-300 shadow-purple-glow"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
