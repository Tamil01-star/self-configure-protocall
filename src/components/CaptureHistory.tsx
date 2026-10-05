import React from 'react';
import { History, Play, Trash2, Bookmark } from 'lucide-react';
import type { SavedCapture, DemoPreset } from '../types/analyzer';

interface CaptureHistoryProps {
  captures: SavedCapture[];
  onLoadCapture: (preset: DemoPreset) => void;
  onDeleteCapture: (id: string) => void;
}

export const CaptureHistory: React.FC<CaptureHistoryProps> = ({
  captures,
  onLoadCapture,
  onDeleteCapture,
}) => {
  return (
    <div className="instrument-card p-4 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-instrument-border pb-2">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-instrument-cyan" />
          <span className="font-bold text-instrument-textBright uppercase">
            CAPTURED SIGNAL LOG ARCHIVE
          </span>
        </div>
        <span className="text-[10px] text-instrument-textMuted">
          {captures.length} ARCHIVED RUNS
        </span>
      </div>

      <div className="space-y-2">
        {captures.map((cap) => (
          <div
            key={cap.id}
            className="p-3 bg-instrument-bg rounded border border-instrument-border flex items-center justify-between hover:border-instrument-borderHighlight transition-all"
          >
            <div className="flex items-center space-x-3">
              <Bookmark className="w-4 h-4 text-instrument-cyan" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-instrument-textBright">{cap.name}</span>
                  <span className="px-1.5 py-0.2 bg-instrument-panel rounded text-[10px] text-instrument-cyan border border-instrument-cyan/30">
                    {cap.protocol}
                  </span>
                  <span className="text-[10px] text-instrument-textMuted">{cap.baudOrFreq}</span>
                </div>
                <span className="text-[10px] text-instrument-textMuted block mt-0.5">
                  Captured at: {cap.timestamp} | {cap.dataCount} packets decoded
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                cap.healthStatus === 'HEALTHY' ? 'bg-instrument-greenDim text-instrument-green' : 'bg-instrument-amberDim text-instrument-amber'
              }`}>
                ● {cap.healthStatus} ({cap.healthScore}/100)
              </span>

              <button
                onClick={() => {
                  const presetMap: Record<string, DemoPreset> = {
                    'UART': 'UART_DEMO',
                    'I2C': 'I2C_DEMO',
                    'SPI': 'SPI_DEMO',
                    'UNKNOWN': 'UNKNOWN_DEMO'
                  };
                  onLoadCapture(presetMap[cap.protocol] || 'UART_DEMO');
                }}
                className="px-2.5 py-1 bg-instrument-cyan text-black font-bold rounded text-xs hover:bg-cyan-300 flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-current" /> REOPEN
              </button>

              <button
                onClick={() => onDeleteCapture(cap.id)}
                className="p-1 text-instrument-textMuted hover:text-instrument-red transition-all"
                title="Delete capture record"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
