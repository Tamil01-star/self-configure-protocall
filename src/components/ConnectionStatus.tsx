import React from 'react';
import { Usb, Cpu, Wifi } from 'lucide-react';
import type { HardwareStatus } from '../types/analyzer';

interface ConnectionStatusProps {
  hardwareStatus: HardwareStatus;
  onConnectSerial: () => void;
  onConnectWebSocket: () => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  hardwareStatus,
  onConnectSerial,
  onConnectWebSocket,
}) => {
  return (
    <div className="instrument-card p-4 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-instrument-border pb-2">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-instrument-cyan" />
          <span className="font-bold text-instrument-textBright uppercase">
            HARDWARE CAPTURE ENGINE TELEMETRY
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          hardwareStatus.connected ? 'bg-instrument-greenDim text-instrument-green' : 'bg-instrument-redDim text-instrument-red'
        }`}>
          ● {hardwareStatus.connected ? 'CONNECTED' : 'DISCONNECTED'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-instrument-bg rounded border border-instrument-border space-y-1">
          <span className="text-[10px] text-instrument-textMuted uppercase block">ACTIVE SOURCE</span>
          <span className="font-bold text-instrument-cyan text-sm flex items-center gap-1.5">
            <Usb className="w-4 h-4" /> {hardwareStatus.deviceName}
          </span>
          <span className="text-[10px] text-instrument-textMuted block">Type: {hardwareStatus.connectionType}</span>
        </div>

        <div className="p-3 bg-instrument-bg rounded border border-instrument-border space-y-1">
          <span className="text-[10px] text-instrument-textMuted uppercase block">DMA SAMPLER</span>
          <span className="font-bold text-instrument-green text-sm">
            {hardwareStatus.samplingRate}
          </span>
          <span className="text-[10px] text-instrument-textMuted block">Channels: {hardwareStatus.channelsAvailable} logic pins</span>
        </div>

        <div className="p-3 bg-instrument-bg rounded border border-instrument-border space-y-1">
          <span className="text-[10px] text-instrument-textMuted uppercase block">RING BUFFER</span>
          <span className="font-bold text-instrument-textBright text-sm">
            {hardwareStatus.bufferKb} KB RAM
          </span>
          <span className="text-[10px] text-instrument-textMuted block">Zero packet loss</span>
        </div>
      </div>

      {/* Integration actions */}
      <div className="p-3 bg-instrument-panel rounded border border-instrument-border flex items-center justify-between">
        <div>
          <span className="font-bold text-instrument-textBright block">PHYSICAL HARDWARE INTEGRATION (ESP32 / RP2040)</span>
          <p className="text-[10px] text-instrument-textMuted">
            Connect ESP32 pin 4 (CH1), pin 5 (CH2), pin 6 (CH3), pin 7 (CH4) to target circuit under test.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onConnectSerial}
            className="px-3 py-1.5 bg-instrument-cyan text-black font-bold rounded text-xs hover:bg-cyan-300 flex items-center gap-1.5"
          >
            <Usb className="w-3.5 h-3.5" /> WebSerial USB
          </button>
          <button
            onClick={onConnectWebSocket}
            className="px-3 py-1.5 bg-instrument-purple text-black font-bold rounded text-xs hover:bg-purple-300 flex items-center gap-1.5"
          >
            <Wifi className="w-3.5 h-3.5" /> WiFi WebSocket
          </button>
        </div>
      </div>
    </div>
  );
};
