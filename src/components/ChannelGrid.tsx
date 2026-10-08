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
    { id: 'CH1', gpio: 'GPIO 36' },
    { id: 'CH2', gpio: 'GPIO 39' },
    { id: 'CH3', gpio: 'GPIO 34' },
    { id: 'CH4', gpio: 'GPIO 35' },
    { id: 'CH5', gpio: 'GPIO 32' },
    { id: 'CH6', gpio: 'GPIO 33' },
    { id: 'CH7', gpio: 'GPIO 25' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {channelHardwareMap.map((hw) => {
        const chSample = channels.find(c => c.id === hw.id);
        
        // Check if the protocol explicitly assigned this channel via parameters
        let isParamAssigned = false;
        if (protocol === 'UART' || protocol === 'RFID' || protocol === 'RS232' || protocol === 'RS485' || protocol === 'CAN' || protocol === 'LIN') {
          isParamAssigned = (parameters.channel === hw.id) || (hw.id === 'CH1');
        } else if (protocol === 'I2C') {
          isParamAssigned = parameters.sdaChannel === hw.id || parameters.sclChannel === hw.id;
        } else if (protocol === 'SPI') {
          isParamAssigned = parameters.sclkChannel === hw.id || parameters.mosiChannel === hw.id || parameters.misoChannel === hw.id || parameters.csChannel === hw.id;
        }

        // A channel has active signal/protocol if it has transitions, or is assigned by protocol parameters
        const hasTransitions = hasRealSignal(chSample);
        const hasSignal = isConnected && (hasTransitions || isParamAssigned);
        
        // The user should be able to click into ANY channel as long as the ESP is connected
        const isClickable = isConnected;

        let role = chSample?.assignedLabel;
        if (!role && isParamAssigned && protocol) {
          if (protocol === 'RFID') role = 'RFID UID DATA';
          else if (['UART', 'RS232', 'RS485'].includes(protocol)) role = `${protocol} DATA`;
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

        return (
          <div
            key={hw.id}
            onClick={() => {
              if (isClickable) onChannelClick(hw.id);
            }}
            className={`instrument-card p-4 flex flex-col justify-between transition-all ${
              isClickable
                ? hasSignal 
                    ? 'cursor-pointer hover:border-instrument-blue hover:shadow-md bg-white border-instrument-blue border-2 ring-1 ring-instrument-blue/30'
                    : 'cursor-pointer hover:border-instrument-blue/50 bg-instrument-bg border-instrument-border'
                : 'cursor-not-allowed bg-instrument-bg border-instrument-border opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-3 border-b border-instrument-border/60 pb-2">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded font-mono font-bold text-sm ${hasSignal ? 'bg-instrument-blue text-white' : 'bg-instrument-panelHeader text-instrument-textBright border border-instrument-border'}`}>
                  {hw.id}
                </span>
                <span className="font-mono font-bold text-xs text-instrument-textBright">
                  {hw.gpio}
                </span>
              </div>
              <span className={`w-3 h-3 rounded-full ${hasSignal ? 'bg-instrument-green animate-led' : 'bg-slate-300'}`} title={hasSignal ? "Signal Detected" : "No Signal"} />
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-instrument-textMuted">Role:</span>
                <span className={`font-bold truncate max-w-[120px] ${hasSignal ? 'text-instrument-blue' : 'text-instrument-textMuted'}`} title={role}>
                  {role}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-instrument-textMuted">Status:</span>
                <span className={`font-bold ${hasSignal ? 'text-instrument-green' : 'text-instrument-textMuted'}`}>
                  {hasSignal ? (protocol || 'ACTIVE') : 'IDLE'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-instrument-border flex justify-end">
              <button
                disabled={!isClickable}
                className={`flex items-center space-x-1 text-[11px] font-bold px-3 py-1.5 rounded transition-colors ${
                  isClickable 
                    ? hasSignal
                        ? 'bg-instrument-blue text-white hover:bg-sky-600'
                        : 'bg-instrument-panelHeader text-instrument-textBright border border-instrument-border hover:bg-instrument-border'
                    : 'bg-instrument-panelHeader text-instrument-textMuted cursor-not-allowed'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{hasSignal ? 'VIEW OUTPUT' : 'MONITOR'}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
