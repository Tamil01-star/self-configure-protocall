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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="instrument-card p-6 max-w-lg w-full border-instrument-cyan bg-instrument-panel relative">
        <div className="flex items-center justify-between border-b border-instrument-border pb-3 mb-4">
          <div className="flex items-center space-x-2 text-instrument-cyan">
            <Settings className="w-5 h-5" />
            <span className="font-bold text-sm uppercase text-instrument-textBright">
              AUTOSCOPE INSTRUMENT CONFIGURATION
            </span>
          </div>
          <button onClick={onClose} className="text-instrument-textMuted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="text-instrument-textMuted uppercase block mb-1">Hardware Interface</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setConnType('SIMULATION')}
                className={`p-2 rounded border flex items-center justify-center gap-1.5 ${
                  connType === 'SIMULATION' ? 'bg-instrument-cyanDim text-instrument-cyan border-instrument-cyan font-bold' : 'bg-instrument-bg text-instrument-textMuted border-instrument-border'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" /> Simulation
              </button>
              <button
                onClick={() => setConnType('USB')}
                className={`p-2 rounded border flex items-center justify-center gap-1.5 ${
                  connType === 'USB' ? 'bg-instrument-cyanDim text-instrument-cyan border-instrument-cyan font-bold' : 'bg-instrument-bg text-instrument-textMuted border-instrument-border'
                }`}
              >
                <Usb className="w-3.5 h-3.5" /> WebSerial USB
              </button>
              <button
                onClick={() => setConnType('WEBSOCKET')}
                className={`p-2 rounded border flex items-center justify-center gap-1.5 ${
                  connType === 'WEBSOCKET' ? 'bg-instrument-cyanDim text-instrument-cyan border-instrument-cyan font-bold' : 'bg-instrument-bg text-instrument-textMuted border-instrument-border'
                }`}
              >
                <Wifi className="w-3.5 h-3.5" /> WebSocket
              </button>
            </div>
          </div>

          <div>
            <label className="text-instrument-textMuted uppercase block mb-1">Device Name</label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full bg-instrument-bg p-2 rounded border border-instrument-border text-instrument-textBright focus:border-instrument-cyan focus:outline-none"
            />
          </div>

          <div>
            <label className="text-instrument-textMuted uppercase block mb-1">Sampling Frequency</label>
            <select
              value={samplingRate}
              onChange={(e) => setSamplingRate(e.target.value)}
              className="w-full bg-instrument-bg p-2 rounded border border-instrument-border text-instrument-textBright focus:border-instrument-cyan focus:outline-none"
            >
              <option value="1 MS/s">1 MS/s (Mega-samples / second)</option>
              <option value="2 MS/s">2 MS/s (Standard ESP32 DMA)</option>
              <option value="5 MS/s">5 MS/s (Overclocked Logic Sampler)</option>
              <option value="10 MS/s">10 MS/s (RP2040 PIO Analyzer)</option>
            </select>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-instrument-border flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-instrument-bg text-instrument-textMuted hover:text-white rounded border border-instrument-border"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-instrument-cyan text-black font-bold rounded shadow-cyan-glow hover:bg-cyan-300 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
