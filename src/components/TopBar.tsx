import React from 'react';
import { 
  Activity, 
  Usb, 
  Play, 
  Square, 
  Sparkles, 
  RotateCcw, 
  Cpu, 
  Tv, 
  Radio 
} from 'lucide-react';
import type { SystemHardwareStatus, AnalyzerState } from '../types/analyzer';

interface TopBarProps {
  hardwareStatus: SystemHardwareStatus;
  analyzerState: AnalyzerState;
  onConnectSerial: () => void;
  onDisconnectSerial: () => void;
  onStartCapture: () => void;
  onStopCapture: () => void;
  onAutoDetect: () => void;
  onClear: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  hardwareStatus,
  analyzerState,
  onConnectSerial,
  onDisconnectSerial,
  onStartCapture,
  onStopCapture,
  onAutoDetect,
  onClear,
}) => {
  const isConnected = hardwareStatus.esp32_2_connected;

  return (
    <header className="bg-instrument-panel border-b border-instrument-border px-4 py-2 flex flex-wrap items-center justify-between gap-3 font-mono text-xs select-none">
      {/* Left Title & Branding */}
      <div className="flex items-center space-x-3">
        <div className="w-7 h-7 rounded-sm bg-instrument-bg flex items-center justify-center border border-instrument-borderHighlight text-instrument-blue">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm text-instrument-textBright tracking-wider">AUTOSCOPE</span>
            <span className="px-1.5 py-0.2 text-[9px] bg-instrument-bg text-instrument-textSubtle rounded-sm border border-instrument-border font-mono">
              HW-04 ANALYZER
            </span>
          </div>
          <span className="text-[10px] text-instrument-textMuted block">
            Self-Configuring Digital Protocol Analyzer
          </span>
        </div>
      </div>

      {/* Center Hardware Telemetry Badges */}
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        {/* ESP32 #2 Analyzer Connection Badge */}
        <div className="px-2.5 py-1 bg-instrument-bg rounded-sm border border-instrument-border flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-instrument-green animate-led' : 'bg-instrument-red'}`} />
          <span className="text-instrument-textMuted">Analyzer:</span>
          <span className={`font-bold ${isConnected ? 'text-instrument-green' : 'text-instrument-red'}`}>
            ESP32 #2 — {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        </div>

        {/* ESP32 #1 Signal Generator Status Badge */}
        <div className="px-2.5 py-1 bg-instrument-bg rounded-sm border border-instrument-border flex items-center space-x-2">
          <Radio className="w-3.5 h-3.5 text-instrument-blue" />
          <span className="text-instrument-textMuted">Source:</span>
          <span className="font-bold text-instrument-textSubtle">
            ESP32 #1 — {hardwareStatus.esp32_1_status}
          </span>
        </div>

        {/* LCD Status Badge */}
        <div className="px-2.5 py-1 bg-instrument-bg rounded-sm border border-instrument-border flex items-center space-x-2">
          <Tv className="w-3.5 h-3.5 text-instrument-textMuted" />
          <span className="text-instrument-textMuted">LCD:</span>
          <span className="font-bold text-instrument-textSubtle">
            {hardwareStatus.lcd_status}
          </span>
        </div>

        {/* Capture State Badge */}
        <div className="px-2.5 py-1 bg-instrument-bg rounded-sm border border-instrument-border flex items-center space-x-2">
          <Cpu className="w-3.5 h-3.5 text-instrument-amber" />
          <span className="text-instrument-textMuted">Capture:</span>
          <span className={`font-bold ${
            analyzerState === 'CAPTURING' || analyzerState === 'ANALYZING' ? 'text-instrument-blue animate-pulse' :
            analyzerState === 'DETECTED' ? 'text-instrument-green' : 'text-instrument-textSubtle'
          }`}>
            {analyzerState}
          </span>
        </div>
      </div>

      {/* Right Hardware Control Buttons */}
      <div className="flex items-center space-x-2">
        {isConnected ? (
          <button
            onClick={onDisconnectSerial}
            className="px-2.5 py-1 bg-instrument-bg text-instrument-red border border-instrument-red/40 hover:bg-instrument-red hover:text-white rounded-sm font-bold flex items-center gap-1 transition-colors"
            title="Disconnect Serial Port"
          >
            <Usb className="w-3.5 h-3.5" /> DISCONNECT
          </button>
        ) : (
          <button
            onClick={onConnectSerial}
            className="px-3 py-1 bg-instrument-blue text-white hover:bg-sky-600 rounded-sm font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Connect ESP32 #2 via WebSerial"
          >
            <Usb className="w-3.5 h-3.5" /> CONNECT SERIAL
          </button>
        )}

        <button
          onClick={onStartCapture}
          disabled={!isConnected}
          className={`px-2.5 py-1 rounded-sm font-bold flex items-center gap-1 transition-colors ${
            isConnected
              ? 'bg-instrument-green text-white hover:bg-emerald-700'
              : 'bg-instrument-bg text-instrument-textMuted border border-instrument-border cursor-not-allowed opacity-50'
          }`}
        >
          <Play className="w-3 h-3 fill-current" /> START
        </button>

        <button
          onClick={onStopCapture}
          disabled={!isConnected}
          className={`px-2.5 py-1 rounded-sm font-bold flex items-center gap-1 transition-colors ${
            isConnected
              ? 'bg-instrument-bg text-instrument-red border border-instrument-border hover:bg-instrument-red hover:text-white'
              : 'bg-instrument-bg text-instrument-textMuted border border-instrument-border cursor-not-allowed opacity-50'
          }`}
        >
          <Square className="w-3 h-3 fill-current" /> STOP
        </button>

        <button
          onClick={onAutoDetect}
          disabled={!isConnected}
          className={`px-2.5 py-1 rounded-sm font-bold flex items-center gap-1 transition-colors ${
            isConnected
              ? 'bg-instrument-purple text-white hover:bg-purple-600'
              : 'bg-instrument-bg text-instrument-textMuted border border-instrument-border cursor-not-allowed opacity-50'
          }`}
        >
          <Sparkles className="w-3 h-3" /> AUTO DETECT
        </button>

        <button
          onClick={onClear}
          className="p-1 text-instrument-textMuted hover:text-instrument-textBright hover:bg-instrument-bg rounded-sm border border-transparent hover:border-instrument-border transition-colors"
          title="Clear Logs & Reset View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
