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
    <div className="instrument-card p-4 flex flex-col justify-between bg-white border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-mono font-bold text-slate-900 uppercase">
            PROTOCOL CONFIDENCE SPECTRUM
          </span>
        </div>
        <span className="text-[10px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-semibold">
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
                  ? 'bg-sky-50/70 border-sky-400 shadow-sm'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center space-x-2">
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />}
                  <span className={`font-bold ${isSelected ? 'text-sky-800' : 'text-slate-900'}`}>
                    {item.displayName}
                  </span>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className={`font-bold text-sm ${isSelected ? 'text-sky-700' : 'text-slate-600'}`}>
                    {item.confidence.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-500">%</span>
                </div>
              </div>

              {/* Instrument-Style Segmented Bar Indicator */}
              <div className="w-full bg-slate-200 h-2 rounded overflow-hidden flex space-x-0.5 p-0.5 border border-slate-300">
                {Array.from({ length: 20 }).map((_, idx) => {
                  const threshold = (idx + 1) * 5;
                  const isActive = item.confidence >= threshold;
                  return (
                    <div
                      key={idx}
                      className={`flex-1 h-full rounded-sm transition-all duration-300 ${
                        isActive
                          ? isSelected
                            ? 'bg-sky-600'
                            : 'bg-slate-400'
                          : 'bg-white'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex items-center justify-between font-medium">
        <span>Selected candidate: <strong className="text-sky-700">{selectedProtocol}</strong></span>
        <span>Algorithm: <strong className="text-slate-900">Edge Fingerprint v4.2</strong></span>
      </div>
    </div>
  );
};
