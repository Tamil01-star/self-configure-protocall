import React, { useState } from 'react';
import { Settings, X, Save } from 'lucide-react';
import type { SystemHardwareStatus } from '../types/analyzer';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hardwareStatus: SystemHardwareStatus;
  onUpdateBaud: (baud: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  hardwareStatus,
  onUpdateBaud,
}) => {
  const [baud, setBaud] = useState<number>(hardwareStatus.serialBaud || 115200);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateBaud(baud);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="instrument-card p-5 max-w-md w-full border border-instrument-borderHighlight bg-instrument-panel relative text-xs space-y-4">
        <div className="flex items-center justify-between border-b border-instrument-border pb-2">
          <div className="flex items-center space-x-2 text-instrument-blue">
            <Settings className="w-4 h-4" />
            <span className="font-bold text-sm uppercase text-instrument-textBright">
              SERIAL INTERFACE SETTINGS
            </span>
          </div>
          <button onClick={onClose} className="text-instrument-textMuted hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-instrument-textMuted uppercase block mb-1 font-bold">Serial Baud Rate</label>
            <select
              value={baud}
              onChange={(e) => setBaud(Number(e.target.value))}
              className="w-full bg-instrument-bg p-2 rounded-sm border border-instrument-border text-instrument-textBright focus:border-instrument-blue focus:outline-none font-mono"
            >
              <option value={9600}>9600 baud</option>
              <option value={57600}>57600 baud</option>
              <option value={115200}>115200 baud (Standard ESP32 Default)</option>
              <option value={230400}>230400 baud</option>
              <option value={921600}>921600 baud (High-Speed Logic Stream)</option>
            </select>
          </div>

          <div className="p-3 bg-instrument-bg rounded-sm border border-instrument-border space-y-1">
            <span className="font-bold text-instrument-textBright block">PHYSICAL PINOUT ASSIGNMENTS</span>
            <p className="text-[11px] text-instrument-textMuted">
              ESP32 #2 Analyzer Input Pins:
            </p>
            <ul className="text-[11px] text-instrument-textSubtle space-y-0.5 list-disc pl-4 font-mono">
              <li>GPIO 4 $\rightarrow$ CH1 (UART TX / I²C SDA / SPI SCLK)</li>
              <li>GPIO 5 $\rightarrow$ CH2 (I²C SCL / SPI MOSI)</li>
              <li>GPIO 6 $\rightarrow$ CH3 (SPI MISO)</li>
              <li>GPIO 7 $\rightarrow$ CH4 (SPI CS)</li>
            </ul>
          </div>
        </div>

        <div className="pt-2 border-t border-instrument-border flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-instrument-bg text-instrument-textMuted hover:text-white rounded-sm border border-instrument-border"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1 bg-instrument-blue text-white font-bold rounded-sm hover:bg-sky-600 flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" /> Save
          </button>
        </div>
      </div>
    </div>
  );
};
