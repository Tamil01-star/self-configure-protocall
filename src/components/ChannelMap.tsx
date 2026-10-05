import React from 'react';
import { GitCommit, Edit3 } from 'lucide-react';
import type { ChannelMapping } from '../types/analyzer';

interface ChannelMapProps {
  mappings: ChannelMapping[];
  onOverrideMapping?: (channelId: string, newRole: string) => void;
}

export const ChannelMap: React.FC<ChannelMapProps> = ({
  mappings
}) => {
  return (
    <div className="instrument-card p-4 bg-white border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <GitCommit className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-mono font-bold text-slate-900 uppercase">
            AUTOMATIC CHANNEL IDENTIFICATION
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1 font-semibold">
          <Edit3 className="w-3 h-3 text-sky-600" /> Manual Override Allowed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
        {mappings.map((m) => (
          <div
            key={m.channelId}
            className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between hover:border-slate-300 transition-all"
          >
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded bg-white border border-sky-300 text-sky-700 font-bold flex items-center justify-center text-xs shadow-sm">
                {m.channelId}
              </span>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Role Assignment</span>
                <span className="text-xs font-bold text-slate-900">{m.assignedRole}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-semibold">Confidence</span>
              <span className="text-xs font-bold text-emerald-600">{m.confidence}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
