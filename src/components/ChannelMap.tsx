import React from 'react';
import { GitCommit, Edit3 } from 'lucide-react';
import type { DigitalChannelSample, ProtocolType } from '../types/analyzer';

interface ChannelMapProps {
  channels: DigitalChannelSample[];
  protocol: ProtocolType | null;
}

export const ChannelMap: React.FC<ChannelMapProps> = ({ channels, protocol }) => {
  const getRole = (idx: number, ch?: DigitalChannelSample) => {
    if (ch?.assignedLabel && ch.assignedLabel !== `CH${idx+1}`) {
      return ch.assignedLabel;
    }
    if (protocol === 'UART' && idx === 0) return 'UART DATA (Transmit/Receive)';
    if (protocol === 'I2C') {
      if (idx === 0) return 'SDA (Serial Data)';
      if (idx === 1) return 'SCL (Serial Clock)';
    }
    if (protocol === 'SPI') {
      if (idx === 0) return 'SCLK (Serial Clock)';
      if (idx === 1) return 'MOSI (Master Out Slave In)';
      if (idx === 2) return 'MISO (Master In Slave Out)';
      if (idx === 3) return 'CS (Chip Select)';
    }
    return 'UNASSIGNED / IDLE';
  };

  return (
    <div className="instrument-card p-3 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-instrument-border pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <GitCommit className="w-3.5 h-3.5 text-instrument-blue" />
          <span className="font-bold text-instrument-textBright uppercase">
            HARDWARE CHANNEL MAP (ESP32 #2 INPUT PINS)
          </span>
        </div>
        <span className="text-[10px] text-instrument-textMuted flex items-center gap-1 font-semibold">
          <Edit3 className="w-3 h-3 text-instrument-blue" /> Auto-Mapped by ESP32 #2
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((idx) => {
          const ch = channels[idx];
          const pinNames = ['GPIO 4', 'GPIO 5', 'GPIO 6', 'GPIO 7'];
          const role = getRole(idx, ch);
          const active = ch && ch.data && ch.data.length > 0;

          return (
            <div
              key={idx}
              className="p-2 bg-instrument-bg rounded-sm border border-instrument-border flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-sm bg-instrument-panel border border-instrument-borderHighlight text-instrument-blue font-bold flex items-center justify-center text-[11px]">
                  CH{idx + 1}
                </span>
                <div>
                  <span className="text-[10px] text-instrument-textMuted uppercase block font-semibold">
                    {pinNames[idx]}
                  </span>
                  <span className="text-xs font-bold text-instrument-textBright truncate block max-w-[130px]">
                    {role}
                  </span>
                </div>
              </div>

              <span className={`w-2 h-2 rounded-full ${active ? 'bg-instrument-green animate-led' : 'bg-instrument-border'}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
