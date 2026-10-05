import React from 'react';
import { 
  Activity, 
  Play, 
  Square, 
  Sparkles, 
  Cpu, 
  Radio, 
  Settings,
  Layers,
  HelpCircle
} from 'lucide-react';
import type { CaptureState, DemoPreset, HardwareStatus } from '../types/analyzer';

interface TopBarProps {
  captureState: CaptureState;
  onStartCapture: () => void;
  onStopCapture: () => void;
  onAutoDetect: () => void;
  onSelectPreset: (preset: DemoPreset) => void;
  currentPreset: DemoPreset;
  hardwareStatus: HardwareStatus;
  onOpenSettings: () => void;
  onToggleIntro: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  captureState,
  onStartCapture,
  onStopCapture,
  onAutoDetect,
  onSelectPreset,
  currentPreset,
  hardwareStatus,
  onOpenSettings,
  onToggleIntro
}) => {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between select-none z-30 relative shadow-sm">
      {/* Left: Branding & Custom Signal Icon */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={onToggleIntro}>
        <div className="w-8 h-8 rounded bg-sky-50 flex items-center justify-center border border-sky-300 text-sky-600 shadow-sm">
          <Activity className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm tracking-wider text-slate-900 font-mono">AUTOSCOPE</span>
            <span className="px-1.5 py-0.5 text-[9px] font-mono bg-sky-100 text-sky-700 rounded border border-sky-200 font-semibold">
              HW-04 PROTOTYPE
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            Self-Configuring Protocol Logic Analyzer
          </p>
        </div>
      </div>

      {/* Center: Live Status & Simulation Selector */}
      <div className="hidden md:flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-1 bg-slate-50 rounded border border-slate-200">
          <Radio className={`w-3.5 h-3.5 ${captureState === 'CAPTURING' ? 'text-sky-600 animate-pulse' : 'text-slate-400'}`} />
          <span className="text-xs font-mono tracking-wide text-slate-800 uppercase font-semibold">
            {captureState === 'CAPTURING' ? 'LIVE SIGNAL RUNNING' : captureState === 'ANALYZING' ? 'ANALYZING SIGNAL...' : 'SIGNAL IDLE'}
          </span>
        </div>

        {/* Demo preset Quick Pill Selector */}
        <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded border border-slate-200 text-[11px] font-mono">
          <span className="text-slate-500 px-2 flex items-center gap-1 font-semibold">
            <Layers className="w-3 h-3 text-sky-600" /> DEMO:
          </span>
          {(['UART_DEMO', 'I2C_DEMO', 'SPI_DEMO', 'UNKNOWN_DEMO', 'FAULT_DEMO'] as DemoPreset[]).map((p) => {
            const label = p.replace('_DEMO', '');
            const isActive = currentPreset === p;
            return (
              <button
                key={p}
                onClick={() => onSelectPreset(p)}
                className={`px-2 py-0.5 rounded transition-all ${
                  isActive 
                    ? 'bg-sky-600 text-white font-bold shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Hardware Telemetry & Action Buttons */}
      <div className="flex items-center space-x-3">
        {/* Hardware Status Pill */}
        <div className="hidden lg:flex items-center space-x-3 bg-slate-50 px-3 py-1 rounded border border-slate-200 text-[11px] font-mono">
          <div className="flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${hardwareStatus.connected ? 'bg-emerald-500 animate-led' : 'bg-red-500'}`} />
            <span className="text-slate-900 font-semibold flex items-center gap-1">
              <Cpu className="w-3 h-3 text-sky-600" /> {hardwareStatus.deviceName}
            </span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">Sampling: <strong className="text-sky-700">{hardwareStatus.samplingRate}</strong></span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">CH: <strong className="text-slate-900">{hardwareStatus.channelsAvailable}</strong></span>
        </div>

        {/* Main Action Buttons */}
        <div className="flex items-center space-x-2">
          {captureState === 'CAPTURING' ? (
            <button
              onClick={onStopCapture}
              className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white rounded text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>STOP</span>
            </button>
          ) : (
            <button
              onClick={onStartCapture}
              className="px-3.5 py-1.5 bg-sky-600 text-white hover:bg-sky-700 font-mono font-bold text-xs rounded shadow-sm flex items-center space-x-1.5 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>START CAPTURE</span>
            </button>
          )}

          <button
            onClick={onAutoDetect}
            className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-600 hover:text-white rounded text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AUTO DETECT</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded border border-transparent hover:border-slate-200 transition-all"
            title="Analyzer Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleIntro}
            className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded border border-transparent hover:border-slate-200 transition-all"
            title="Product Intro & Flow"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
