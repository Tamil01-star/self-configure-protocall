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
    <header className="h-14 bg-instrument-panel border-b border-instrument-border px-4 flex items-center justify-between select-none z-30 relative">
      {/* Left: Branding & Custom Signal Icon */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={onToggleIntro}>
        <div className="w-8 h-8 rounded bg-instrument-borderHighlight flex items-center justify-center border border-instrument-cyan/40 text-instrument-cyan shadow-cyan-glow">
          <Activity className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm tracking-wider text-instrument-textBright font-mono">AUTOSCOPE</span>
            <span className="px-1.5 py-0.5 text-[9px] font-mono bg-instrument-cyanDim text-instrument-cyan rounded border border-instrument-cyan/30">
              HW-04 PROTOTYPE
            </span>
          </div>
          <p className="text-[10px] text-instrument-textMuted font-mono">
            Self-Configuring Protocol Logic Analyzer
          </p>
        </div>
      </div>

      {/* Center: Live Status & Simulation Selector */}
      <div className="hidden md:flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-1 bg-instrument-bg rounded border border-instrument-border">
          <Radio className={`w-3.5 h-3.5 ${captureState === 'CAPTURING' ? 'text-instrument-cyan animate-pulse' : 'text-instrument-textMuted'}`} />
          <span className="text-xs font-mono tracking-wide text-instrument-textBright uppercase">
            {captureState === 'CAPTURING' ? 'LIVE SIGNAL RUNNING' : captureState === 'ANALYZING' ? 'ANALYZING SIGNAL...' : 'SIGNAL IDLE'}
          </span>
        </div>

        {/* Demo preset Quick Pill Selector */}
        <div className="flex items-center space-x-1 bg-instrument-bg p-1 rounded border border-instrument-border text-[11px] font-mono">
          <span className="text-instrument-textMuted px-2 flex items-center gap-1">
            <Layers className="w-3 h-3 text-instrument-cyan" /> DEMO:
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
                    ? 'bg-instrument-cyan text-black font-semibold shadow-cyan-glow' 
                    : 'text-instrument-textSubtle hover:text-white hover:bg-instrument-border'
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
        <div className="hidden lg:flex items-center space-x-3 bg-instrument-bg px-3 py-1 rounded border border-instrument-border text-[11px] font-mono">
          <div className="flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${hardwareStatus.connected ? 'bg-instrument-green animate-led' : 'bg-instrument-red'}`} />
            <span className="text-instrument-textBright font-semibold flex items-center gap-1">
              <Cpu className="w-3 h-3 text-instrument-cyan" /> {hardwareStatus.deviceName}
            </span>
          </div>
          <span className="text-instrument-border">|</span>
          <span className="text-instrument-textMuted">Sampling: <strong className="text-instrument-cyan">{hardwareStatus.samplingRate}</strong></span>
          <span className="text-instrument-border">|</span>
          <span className="text-instrument-textMuted">CH: <strong className="text-white">{hardwareStatus.channelsAvailable}</strong></span>
        </div>

        {/* Main Action Buttons */}
        <div className="flex items-center space-x-2">
          {captureState === 'CAPTURING' ? (
            <button
              onClick={onStopCapture}
              className="px-3 py-1.5 bg-instrument-redDim text-instrument-red border border-instrument-red/40 hover:bg-instrument-red hover:text-white rounded text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>STOP</span>
            </button>
          ) : (
            <button
              onClick={onStartCapture}
              className="px-3.5 py-1.5 bg-instrument-cyan text-black hover:bg-cyan-300 font-mono font-bold text-xs rounded shadow-cyan-glow flex items-center space-x-1.5 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>START CAPTURE</span>
            </button>
          )}

          <button
            onClick={onAutoDetect}
            className="px-3 py-1.5 bg-instrument-purpleDim text-instrument-purple border border-instrument-purple/40 hover:bg-instrument-purple hover:text-white rounded text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AUTO DETECT</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-1.5 text-instrument-textMuted hover:text-instrument-cyan hover:bg-instrument-bg rounded border border-transparent hover:border-instrument-border transition-all"
            title="Analyzer Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleIntro}
            className="p-1.5 text-instrument-textMuted hover:text-instrument-cyan hover:bg-instrument-bg rounded border border-transparent hover:border-instrument-border transition-all"
            title="Product Intro & Flow"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
