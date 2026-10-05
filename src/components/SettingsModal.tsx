import React, { useState } from 'react';
import { Settings, X, Cpu, Usb, Wifi, Save } from 'lucide-react';
import type { HardwareStatus } from '../types/analyzer';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hardwareStatus: HardwareStatus;
  onUpdateHardwareStatus: (status: Partial<HardwareStatus>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  hardwareStatus,
  onUpdateHardwareStatus,
}) => {
  const [deviceName, setDeviceName] = useState(hardwareStatus.deviceName);
  const [samplingRate, setSamplingRate] = useState(hardwareStatus.samplingRate);
  const [connType, setConnType] = useState(hardwareStatus.connectionType);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateHardwareStatus({
      deviceName,
      samplingRate,
      connectionType: connType,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="instrument-card p-6 max-w-lg w-full border border-sky-300 bg-white rounded-lg shadow-xl relative">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center space-x-2 text-sky-700">
            <Settings className="w-5 h-5" />
            <span className="font-bold text-sm uppercase text-slate-900">
              AUTOSCOPE INSTRUMENT CONFIGURATION
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="text-slate-500 uppercase block mb-1 font-bold">Hardware Interface</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setConnType('SIMULATION')}
                className={`p-2 rounded border flex items-center justify-center gap-1.5 font-bold ${
                  connType === 'SIMULATION' ? 'bg-sky-50 text-sky-700 border-sky-400 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" /> Simulation
              </button>
              <button
                onClick={() => setConnType('USB')}
                className={`p-2 rounded border flex items-center justify-center gap-1.5 font-bold ${
                  connType === 'USB' ? 'bg-sky-50 text-sky-700 border-sky-400 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <Usb className="w-3.5 h-3.5" /> WebSerial USB
              </button>
              <button
                onClick={() => setConnType('WEBSOCKET')}
                className={`p-2 rounded border flex items-center justify-center gap-1.5 font-bold ${
                  connType === 'WEBSOCKET' ? 'bg-sky-50 text-sky-700 border-sky-400 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <Wifi className="w-3.5 h-3.5" /> WebSocket
              </button>
            </div>
          </div>

          <div>
            <label className="text-slate-500 uppercase block mb-1 font-bold">Device Name</label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full bg-slate-50 p-2 rounded border border-slate-200 text-slate-900 font-bold focus:border-sky-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-500 uppercase block mb-1 font-bold">Sampling Frequency</label>
            <select
              value={samplingRate}
              onChange={(e) => setSamplingRate(e.target.value)}
              className="w-full bg-slate-50 p-2 rounded border border-slate-200 text-slate-900 font-bold focus:border-sky-600 focus:outline-none"
            >
              <option value="1 MS/s">1 MS/s (Mega-samples / second)</option>
              <option value="2 MS/s">2 MS/s (Standard ESP32 DMA)</option>
              <option value="5 MS/s">5 MS/s (Overclocked Logic Sampler)</option>
              <option value="10 MS/s">10 MS/s (RP2040 PIO Analyzer)</option>
            </select>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-slate-200 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-600 hover:text-slate-900 font-bold rounded border border-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-sky-600 text-white font-bold rounded shadow-md hover:bg-sky-700 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
