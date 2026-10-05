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
    <div className="instrument-card p-4 font-mono text-xs space-y-3 bg-white border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-sky-600" />
          <span className="font-bold text-slate-900 uppercase">
            HARDWARE CAPTURE ENGINE TELEMETRY
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          hardwareStatus.connected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          ● {hardwareStatus.connected ? 'CONNECTED' : 'DISCONNECTED'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block font-bold">ACTIVE SOURCE</span>
          <span className="font-bold text-sky-700 text-sm flex items-center gap-1.5">
            <Usb className="w-4 h-4" /> {hardwareStatus.deviceName}
          </span>
          <span className="text-[10px] text-slate-500 block font-medium">Type: {hardwareStatus.connectionType}</span>
        </div>

        <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block font-bold">DMA SAMPLER</span>
          <span className="font-bold text-emerald-600 text-sm">
            {hardwareStatus.samplingRate}
          </span>
          <span className="text-[10px] text-slate-500 block font-medium">Channels: {hardwareStatus.channelsAvailable} logic pins</span>
        </div>

        <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block font-bold">RING BUFFER</span>
          <span className="font-bold text-slate-900 text-sm">
            {hardwareStatus.bufferKb} KB RAM
          </span>
          <span className="text-[10px] text-slate-500 block font-medium">Zero packet loss</span>
        </div>
      </div>

      {/* Integration actions */}
      <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
        <div>
          <span className="font-bold text-slate-900 block">PHYSICAL HARDWARE INTEGRATION (ESP32 / RP2040)</span>
          <p className="text-[10px] text-slate-500 font-medium">
            Connect ESP32 pin 4 (CH1), pin 5 (CH2), pin 6 (CH3), pin 7 (CH4) to target circuit under test.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onConnectSerial}
            className="px-3 py-1.5 bg-sky-600 text-white font-bold rounded text-xs hover:bg-sky-700 flex items-center gap-1.5 shadow-sm"
          >
            <Usb className="w-3.5 h-3.5" /> WebSerial USB
          </button>
          <button
            onClick={onConnectWebSocket}
            className="px-3 py-1.5 bg-purple-600 text-white font-bold rounded text-xs hover:bg-purple-700 flex items-center gap-1.5 shadow-sm"
          >
            <Wifi className="w-3.5 h-3.5" /> WiFi WebSocket
          </button>
        </div>
      </div>
    </div>
  );
};
