import React from 'react';
import { BarChart3, CheckCircle2 } from 'lucide-react';
import type { ProtocolConfidenceItem, ProtocolType } from '../types/analyzer';

interface ProtocolConfidenceProps {
  items: ProtocolConfidenceItem[];
  selectedProtocol: ProtocolType;
  onSelectProtocol: (protocol: ProtocolType) => void;
}

export const ProtocolConfidence: React.FC<ProtocolConfidenceProps> = ({
  items,
  selectedProtocol,
  onSelectProtocol,
}) => {
  return (
    <div className="instrument-card p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-instrument-border pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-instrument-cyan" />
          <span className="text-xs font-mono font-bold text-instrument-textBright uppercase">
            PROTOCOL CONFIDENCE SPECTRUM
          </span>
        </div>
        <span className="text-[10px] font-mono text-instrument-cyan bg-instrument-cyanDim px-2 py-0.5 rounded border border-instrument-cyan/30">
          AUTODETECT ENGINE
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const isSelected = item.protocol === selectedProtocol;
          return (
            <div
              key={item.protocol}
              onClick={() => onSelectProtocol(item.protocol)}
              className={`p-2.5 rounded border cursor-pointer transition-all font-mono ${
                isSelected
                  ? 'bg-instrument-bg border-instrument-cyan shadow-cyan-glow'
                  : 'bg-instrument-bg/40 border-instrument-border hover:border-instrument-borderHighlight'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center space-x-2">
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-instrument-cyan" />}
                  <span className={`font-bold ${isSelected ? 'text-instrument-cyan' : 'text-instrument-textBright'}`}>
                    {item.displayName}
                  </span>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className={`font-bold text-sm ${isSelected ? 'text-instrument-cyan' : 'text-instrument-textMuted'}`}>
                    {item.confidence.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-instrument-textMuted">%</span>
                </div>
              </div>

              {/* Instrument-Style Segmented Bar Indicator */}
              <div className="w-full bg-instrument-panel h-2 rounded overflow-hidden flex space-x-0.5 p-0.5 border border-instrument-border">
                {Array.from({ length: 20 }).map((_, idx) => {
                  const threshold = (idx + 1) * 5;
                  const isActive = item.confidence >= threshold;
                  return (
                    <div
                      key={idx}
                      className={`flex-1 h-full rounded-sm transition-all duration-300 ${
                        isActive
                          ? isSelected
                            ? 'bg-instrument-cyan shadow-cyan-glow'
                            : 'bg-instrument-textSubtle'
                          : 'bg-instrument-bg'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-2 border-t border-instrument-border text-[11px] font-mono text-instrument-textMuted flex items-center justify-between">
        <span>Selected candidate: <strong className="text-instrument-cyan">{selectedProtocol}</strong></span>
        <span>Algorithm: <strong className="text-white">Edge Fingerprint v4.2</strong></span>
      </div>
    </div>
  );
};
