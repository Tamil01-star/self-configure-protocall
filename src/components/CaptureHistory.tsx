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
    <div className="instrument-card p-4 space-y-4 font-mono text-xs bg-white border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-sky-600" />
          <span className="font-bold text-slate-900 uppercase">
            CAPTURED SIGNAL LOG ARCHIVE
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-semibold">
          {captures.length} ARCHIVED RUNS
        </span>
      </div>

      <div className="space-y-2">
        {captures.map((cap) => (
          <div
            key={cap.id}
            className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between hover:border-slate-300 transition-all"
          >
            <div className="flex items-center space-x-3">
              <Bookmark className="w-4 h-4 text-sky-600" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900">{cap.name}</span>
                  <span className="px-1.5 py-0.2 bg-white rounded text-[10px] text-sky-700 font-bold border border-sky-200">
                    {cap.protocol}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">{cap.baudOrFreq}</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                  Captured at: {cap.timestamp} | {cap.dataCount} packets decoded
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                cap.healthStatus === 'HEALTHY' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
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
                className="px-2.5 py-1 bg-sky-600 text-white font-bold rounded text-xs hover:bg-sky-700 flex items-center gap-1 shadow-sm"
              >
                <Play className="w-3 h-3 fill-current" /> REOPEN
              </button>

              <button
                onClick={() => onDeleteCapture(cap.id)}
                className="p-1 text-slate-400 hover:text-red-600 transition-all"
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
