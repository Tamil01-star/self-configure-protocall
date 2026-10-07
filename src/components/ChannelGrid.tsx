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
  parameters,
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
      {(() => {
        // Find which channels are actually active/assigned in the current payload
        const activeHardware = channelHardwareMap.map(hw => {
          const chSample = channels.find(c => c.id === hw.id);
          
          let isParamAssigned = false;
          if (protocol === 'UART' || protocol === 'RS232' || protocol === 'RS485' || protocol === 'CAN' || protocol === 'LIN') {
            isParamAssigned = parameters.channel === hw.id;
          } else if (protocol === 'I2C') {
            isParamAssigned = parameters.sdaChannel === hw.id || parameters.sclChannel === hw.id;
          } else if (protocol === 'SPI') {
            isParamAssigned = parameters.sclkChannel === hw.id || parameters.mosiChannel === hw.id || parameters.misoChannel === hw.id || parameters.csChannel === hw.id;
          }

          const hasTransitions = hasRealSignal(chSample);
          const isAssigned = chSample !== undefined || isParamAssigned;
          
          let role = chSample?.assignedLabel;
          if (!role && isParamAssigned && protocol) {
            if (['UART', 'RS232', 'RS485'].includes(protocol)) role = `${protocol} DATA`;
            else if (protocol === 'CAN') role = 'CAN BUS';
            else if (protocol === 'LIN') role = 'LIN BUS';
            else if (protocol === 'I2C' && parameters.sdaChannel === hw.id) role = 'I²C SDA';
            else if (protocol === 'I2C' && parameters.sclChannel === hw.id) role = 'I²C SCL';
            else if (protocol === 'SPI' && parameters.sclkChannel === hw.id) role = 'SPI SCLK';
            else if (protocol === 'SPI' && parameters.mosiChannel === hw.id) role = 'SPI MOSI';
            else if (protocol === 'SPI' && parameters.misoChannel === hw.id) role = 'SPI MISO';
            else if (protocol === 'SPI' && parameters.csChannel === hw.id) role = 'SPI CS';
          }
          role = role || hw.id;

          return {
            hw,
            isActive: hasTransitions || isAssigned,
            role,
          };
        });

        // The user only wants to see what is ACTUALLY connected!
        // If not connected to ESP32 serial yet, show the full grid so they know the pinout.
        // If connected, ONLY show the channels that are active/assigned in the payload!
        const channelsToRender = (!isConnected) 
          ? activeHardware 
          : activeHardware.filter(ch => ch.isActive);

        if (isConnected && channelsToRender.length === 0) {
          return (
            <div className="col-span-full h-64 flex flex-col items-center justify-center text-instrument-textMuted bg-instrument-bg border border-instrument-border rounded-lg border-dashed">
              <Activity className="w-12 h-12 mb-4 text-instrument-blue animate-pulse opacity-50" />
              <p className="font-mono text-sm tracking-wide">LISTENING FOR HARDWARE SIGNALS...</p>
              <p className="font-mono text-xs opacity-70 mt-2">Connect a live signal to any ESP32 logic analyzer pin.</p>
            </div>
          );
        }

        return channelsToRender.map(({ hw, isActive, role }) => (
          <div
            key={hw.id}
            onClick={() => {
              if (isConnected) onChannelClick(hw.id);
            }}
            className={`instrument-card p-4 flex flex-col justify-between transition-all ${
              isConnected
                ? isActive 
                    ? 'cursor-pointer hover:border-instrument-blue hover:shadow-md bg-white border-instrument-blue border-2 ring-1 ring-instrument-blue/30'
                    : 'cursor-pointer hover:border-instrument-blue/50 bg-instrument-bg border-instrument-border'
                : 'cursor-not-allowed bg-instrument-bg border-instrument-border opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-3 border-b border-instrument-border/60 pb-2">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded font-mono font-bold text-sm ${isActive ? 'bg-instrument-blue text-white' : 'bg-instrument-panelHeader text-instrument-textBright border border-instrument-border'}`}>
                  {hw.id}
                </span>
                <span className="font-mono font-bold text-xs text-instrument-textBright">
                  {hw.gpio}
                </span>
              </div>
              <span className={`w-3 h-3 rounded-full ${isActive ? 'bg-instrument-green animate-led' : 'bg-slate-300'}`} title={isActive ? "Signal Detected" : "No Signal"} />
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-instrument-textMuted">Role:</span>
                <span className={`font-bold truncate max-w-[120px] ${isActive ? 'text-instrument-blue' : 'text-instrument-textMuted'}`} title={role}>
                  {role}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-instrument-textMuted">Status:</span>
                <span className={`font-bold ${isActive ? 'text-instrument-green' : 'text-instrument-textMuted'}`}>
                  {isActive ? (protocol || 'ACTIVE') : 'IDLE'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-instrument-border flex justify-end">
              <button
                disabled={!isConnected}
                className={`flex items-center space-x-1 text-[11px] font-bold px-3 py-1.5 rounded transition-colors ${
                  isConnected 
                    ? isActive
                        ? 'bg-instrument-blue text-white hover:bg-sky-600'
                        : 'bg-instrument-panelHeader text-instrument-textBright border border-instrument-border hover:bg-instrument-border'
                    : 'bg-instrument-panelHeader text-instrument-textMuted cursor-not-allowed'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{isActive ? 'VIEW OUTPUT' : 'MONITOR'}</span>
              </button>
            </div>
          </div>
        ));
      })()}
    </div>
  );
};
