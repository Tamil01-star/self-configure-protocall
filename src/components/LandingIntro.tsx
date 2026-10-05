import React from 'react';
import { Activity, Sparkles, ArrowRight, ShieldCheck, Cpu, Sliders, AlertTriangle } from 'lucide-react';

interface LandingIntroProps {
  onLaunch: () => void;
}

export const LandingIntro: React.FC<LandingIntroProps> = ({ onLaunch }) => {
  return (
    <div className="min-h-screen bg-instrument-bg text-instrument-textBright font-mono flex flex-col justify-between p-6 select-none relative overflow-hidden bg-oscilloscope-grid">
      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded bg-instrument-panel border border-instrument-cyan text-instrument-cyan flex items-center justify-center shadow-cyan-glow">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-bold tracking-wider text-base text-white">AUTOSCOPE</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-instrument-textMuted bg-instrument-panel px-3 py-1 rounded border border-instrument-border">
          <span className="w-2 h-2 rounded-full bg-instrument-green animate-led" />
          <span>HARDWARE ANALYZER PROTOTYPE HW-04</span>
        </div>
      </div>

      {/* Hero Center Section */}
      <div className="max-w-4xl mx-auto text-center space-y-6 my-auto z-10 py-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-instrument-cyanDim text-instrument-cyan border border-instrument-cyan/30 rounded-full text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SELF-CONFIGURING HARDWARE SIGNAL INTELLIGENCE</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white uppercase leading-tight">
          AUTOSCOPE
        </h1>
        <p className="text-xl md:text-2xl text-instrument-cyan font-semibold">
          Self-Configuring Protocol Logic Analyzer
        </p>

        <p className="text-sm md:text-base text-instrument-textSubtle max-w-2xl mx-auto leading-relaxed">
          "Connect the signal. Let AutoScope understand it."
        </p>

        {/* 10-Second Visual Innovation Flow (For Hackathon Judges) */}
        <div className="p-4 bg-instrument-panel/90 rounded-lg border border-instrument-borderHighlight max-w-3xl mx-auto shadow-instrument">
          <span className="text-[10px] text-instrument-textMuted uppercase tracking-widest block mb-3 font-bold">
            10-SECOND AUTOMATION WORKFLOW
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center text-center text-xs">
            <div className="p-2 bg-instrument-bg rounded border border-instrument-border">
              <span className="text-instrument-amber font-bold block text-[11px]">1. UNKNOWN SIGNAL</span>
              <span className="text-[9px] text-instrument-textMuted">Raw Pin Capture</span>
            </div>
            <ArrowRight className="w-4 h-4 text-instrument-cyan mx-auto hidden sm:block" />
            <div className="p-2 bg-instrument-bg rounded border border-instrument-border">
              <span className="text-instrument-purple font-bold block text-[11px]">2. AUTO ANALYSIS</span>
              <span className="text-[9px] text-instrument-textMuted">Edge Fingerprint</span>
            </div>
            <ArrowRight className="w-4 h-4 text-instrument-cyan mx-auto hidden sm:block" />
            <div className="p-2 bg-instrument-bg rounded border border-instrument-border">
              <span className="text-instrument-cyan font-bold block text-[11px]">3. UART / I²C / SPI</span>
              <span className="text-[9px] text-instrument-textMuted">Protocol Lock</span>
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-2">
          <button
            onClick={onLaunch}
            className="px-8 py-4 bg-instrument-cyan text-black font-extrabold text-base rounded shadow-cyan-glow hover:bg-cyan-300 transition-all flex items-center space-x-3 mx-auto uppercase tracking-wider"
          >
            <span>LAUNCH ANALYZER WORKSTATION</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 text-xs pt-4">
          <span className="px-3 py-1 bg-instrument-bg border border-instrument-border rounded text-instrument-textSubtle flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-instrument-green" /> AUTO DETECTION
          </span>
          <span className="px-3 py-1 bg-instrument-bg border border-instrument-border rounded text-instrument-textSubtle flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-instrument-cyan" /> AUTO CONFIGURATION
          </span>
          <span className="px-3 py-1 bg-instrument-bg border border-instrument-border rounded text-instrument-textSubtle flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-instrument-purple" /> AUTO DECODING
          </span>
          <span className="px-3 py-1 bg-instrument-bg border border-instrument-border rounded text-instrument-textSubtle flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-instrument-amber" /> FAULT DIAGNOSIS
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between text-[11px] text-instrument-textMuted border-t border-instrument-border pt-4 z-10">
        <span>ANTIGRAVITY ENGINEERING INSTRUMENT LABS</span>
        <span>ELECTRONIC TEST & MEASUREMENT CLASS</span>
      </div>
    </div>
  );
};
