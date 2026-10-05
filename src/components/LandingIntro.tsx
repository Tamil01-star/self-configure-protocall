import React from 'react';
import { Activity, Sparkles, ArrowRight, ShieldCheck, Cpu, Sliders, AlertTriangle } from 'lucide-react';

interface LandingIntroProps {
  onLaunch: () => void;
}

export const LandingIntro: React.FC<LandingIntroProps> = ({ onLaunch }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-mono flex flex-col justify-between p-6 select-none relative overflow-hidden bg-oscilloscope-grid">
      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded bg-white border border-sky-300 text-sky-600 flex items-center justify-center shadow-sm">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-bold tracking-wider text-base text-slate-900">AUTOSCOPE</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-600 bg-white px-3 py-1 rounded border border-slate-200 shadow-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-led" />
          <span>HARDWARE ANALYZER PROTOTYPE HW-04</span>
        </div>
      </div>

      {/* Hero Center Section */}
      <div className="max-w-4xl mx-auto text-center space-y-6 my-auto z-10 py-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-sky-100 text-sky-800 border border-sky-300 rounded-full text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SELF-CONFIGURING HARDWARE SIGNAL INTELLIGENCE</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 uppercase leading-tight">
          AUTOSCOPE
        </h1>
        <p className="text-xl md:text-2xl text-sky-700 font-bold">
          Self-Configuring Protocol Logic Analyzer
        </p>

        <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-semibold">
          "Connect the signal. Let AutoScope understand it."
        </p>

        {/* 10-Second Visual Innovation Flow (For Hackathon Judges) */}
        <div className="p-4 bg-white/90 rounded-lg border border-slate-300 max-w-3xl mx-auto shadow-md">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-3 font-bold">
            10-SECOND AUTOMATION WORKFLOW
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center text-center text-xs">
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="text-amber-700 font-bold block text-[11px]">1. UNKNOWN SIGNAL</span>
              <span className="text-[9px] text-slate-500 font-medium">Raw Pin Capture</span>
            </div>
            <ArrowRight className="w-4 h-4 text-sky-600 mx-auto hidden sm:block" />
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="text-purple-700 font-bold block text-[11px]">2. AUTO ANALYSIS</span>
              <span className="text-[9px] text-slate-500 font-medium">Edge Fingerprint</span>
            </div>
            <ArrowRight className="w-4 h-4 text-sky-600 mx-auto hidden sm:block" />
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="text-sky-700 font-bold block text-[11px]">3. UART / I²C / SPI</span>
              <span className="text-[9px] text-slate-500 font-medium">Protocol Lock</span>
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-2">
          <button
            onClick={onLaunch}
            className="px-8 py-4 bg-sky-600 text-white font-extrabold text-base rounded shadow-md hover:bg-sky-700 transition-all flex items-center space-x-3 mx-auto uppercase tracking-wider"
          >
            <span>LAUNCH ANALYZER WORKSTATION</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 text-xs pt-4">
          <span className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-700 font-bold shadow-sm flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> AUTO DETECTION
          </span>
          <span className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-700 font-bold shadow-sm flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-sky-600" /> AUTO CONFIGURATION
          </span>
          <span className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-700 font-bold shadow-sm flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-600" /> AUTO DECODING
          </span>
          <span className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-700 font-bold shadow-sm flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> FAULT DIAGNOSIS
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between text-[11px] text-slate-500 border-t border-slate-200 pt-4 z-10 font-semibold">
        <span>ANTIGRAVITY ENGINEERING INSTRUMENT LABS</span>
        <span>ELECTRONIC TEST & MEASUREMENT CLASS</span>
      </div>
    </div>
  );
};
