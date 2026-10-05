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
    <div className="instrument-card p-4">
      <div className="flex items-center justify-between border-b border-instrument-border pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <GitCommit className="w-4 h-4 text-instrument-cyan" />
          <span className="text-xs font-mono font-bold text-instrument-textBright uppercase">
            AUTOMATIC CHANNEL IDENTIFICATION
          </span>
        </div>
        <span className="text-[10px] font-mono text-instrument-textMuted flex items-center gap-1">
          <Edit3 className="w-3 h-3 text-instrument-cyan" /> Manual Override Allowed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
        {mappings.map((m) => (
          <div
            key={m.channelId}
            className="p-2.5 bg-instrument-bg rounded border border-instrument-border flex items-center justify-between hover:border-instrument-borderHighlight transition-all"
          >
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded bg-instrument-panel border border-instrument-cyan/40 text-instrument-cyan font-bold flex items-center justify-center text-xs shadow-sm">
                {m.channelId}
              </span>
              <div>
                <span className="text-[10px] text-instrument-textMuted uppercase block">Role Assignment</span>
                <span className="text-xs font-bold text-instrument-textBright">{m.assignedRole}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-instrument-textMuted block">Confidence</span>
              <span className="text-xs font-bold text-instrument-green">{m.confidence}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
