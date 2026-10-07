import React from 'react';
import { Activity } from 'lucide-react';
import type { DigitalChannelSample, ProtocolType, RealProtocolParameters } from '../types/analyzer';

interface ChannelGridProps {
  channels: DigitalChannelSample[];
  protocol: ProtocolType | null;
  parameters: RealProtocolParameters;
  isConnected: boolean;
  onChannelClick: (channelId: string) => void;
}

function hasRealSignal(ch: DigitalChannelSample | undefined): boolean {
  if (!ch || !Array.isArray(ch.data) || ch.data.length === 0) return false;
  const first = ch.data[0];
  return ch.data.some(v => v !== first);
}

export const ChannelGrid: React.FC<ChannelGridProps> = ({
  channels,
  protocol,
  isConnected,
  onChannelClick,
}) => {
  const channelHardwareMap = [
    { id: 'CH1', gpio: 'GPIO 4' },
    { id: 'CH2', gpio: 'GPIO 13' },
    { id: 'CH3', gpio: 'GPIO 14' },
    { id: 'CH4', gpio: 'GPIO 25' },
    { id: 'CH5', gpio: 'GPIO 26' },
    { id: 'CH6', gpio: 'GPIO 27' },
    { id: 'CH7', gpio: 'GPIO 15' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {channelHardwareMap.map((hw, idx) => {
        const chSample = channels[idx];
        const active = isConnected && hasRealSignal(chSample);
        const role = chSample?.assignedLabel || hw.id;

        return (
          <div
            key={hw.id}
            onClick={() => {
              if (active) onChannelClick(hw.id);
            }}
            className={`instrument-card p-4 flex flex-col justify-between transition-all ${
              active
                ? 'cursor-pointer hover:border-instrument-blue hover:shadow-md bg-white border-instrument-blue border-2 ring-1 ring-instrument-blue/30'
                : 'cursor-not-allowed bg-instrument-bg border-instrument-border opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-3 border-b border-instrument-border/60 pb-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-instrument-blue text-white rounded font-mono font-bold text-sm">
                  {hw.id}
                </span>
                <span className="font-mono font-bold text-xs text-instrument-textBright">
                  {hw.gpio}
                </span>
              </div>
              <span className={`w-3 h-3 rounded-full ${active ? 'bg-instrument-green animate-led' : 'bg-slate-300'}`} />
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-instrument-textMuted">Role:</span>
                <span className="font-bold text-instrument-blue truncate max-w-[120px]" title={role}>
                  {role}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-instrument-textMuted">Status:</span>
                <span className={`font-bold ${active ? 'text-instrument-green' : 'text-instrument-textMuted'}`}>
                  {active ? (protocol || 'ACTIVE') : 'IDLE'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-instrument-border flex justify-end">
              <button
                disabled={!active}
                className={`flex items-center space-x-1 text-[11px] font-bold px-3 py-1.5 rounded transition-colors ${
                  active 
                    ? 'bg-instrument-blue text-white hover:bg-sky-600' 
                    : 'bg-instrument-panelHeader text-instrument-textMuted cursor-not-allowed'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{active ? 'VIEW OUTPUT' : 'NO SIGNAL'}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
