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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="instrument-card p-6 max-w-md w-full border border-purple-300 shadow-xl bg-white relative rounded-lg">
        <div className="flex items-center space-x-3 border-b border-slate-200 pb-3 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600 animate-spin" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase">
              SELF-CONFIGURING PROTOCOL ENGINE
            </h3>
            <p className="text-[10px] text-purple-700 font-semibold">
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
                className={`p-2 rounded border text-xs flex items-center justify-between transition-all font-semibold ${
                  isCurrent
                    ? 'bg-purple-50 text-purple-800 border-purple-300 font-bold shadow-sm'
                    : isFinished
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-50 text-slate-400 border-transparent opacity-50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-[10px] opacity-75">0{idx + 1}.</span>
                  <span>{step}</span>
                </span>
                {isFinished && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                {isCurrent && <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />}
              </div>
            );
          })}
        </div>

        {/* Overall Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded overflow-hidden border border-slate-200">
          <div
            className="bg-purple-600 h-full transition-all duration-300 shadow-sm"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
