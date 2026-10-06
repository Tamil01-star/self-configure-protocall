import React from 'react';
import { Activity, ArrowRight, Usb, Tv, Radio } from 'lucide-react';

interface LandingIntroProps {
  onLaunch: () => void;
}

export const LandingIntro: React.FC<LandingIntroProps> = ({ onLaunch }) => {
  return (
    <div className="min-h-screen bg-instrument-bg text-instrument-textBright font-mono flex flex-col justify-between p-6 select-none relative overflow-hidden bg-instrument-grid">
      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-sm bg-instrument-panel border border-instrument-borderHighlight text-instrument-blue flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-wider text-sm text-instrument-textBright">AUTOSCOPE</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-instrument-textMuted bg-instrument-panel px-3 py-1 rounded-sm border border-instrument-border font-bold">
          <span className="w-2 h-2 rounded-full bg-instrument-green animate-led" />
          <span>REAL HARDWARE PROTOTYPE (HW-04)</span>
        </div>
      </div>

      {/* Hero Center Section */}
      <div className="max-w-4xl mx-auto text-center space-y-5 my-auto z-10 py-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-instrument-panel text-instrument-blue border border-instrument-border rounded-sm text-xs font-bold">
          <span>HARDWARE-DRIVEN DIGITAL PROTOCOL ANALYZER</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-instrument-textBright uppercase leading-tight">
          AUTOSCOPE
        </h1>
        <p className="text-lg md:text-xl text-instrument-blue font-bold">
          Self-Configuring Evidence-Based Protocol Analyzer
        </p>

        <p className="text-xs md:text-sm text-instrument-textSubtle max-w-2xl mx-auto leading-relaxed font-semibold">
          "Connect the physical signal pins. Let AutoScope understand it."
        </p>

        {/* Real Hardware Stack Diagram for Hackathon Judges */}
        <div className="p-4 bg-instrument-panel rounded-sm border border-instrument-border max-w-3xl mx-auto text-left space-y-3">
          <span className="text-[10px] text-instrument-textMuted uppercase tracking-widest block font-bold">
            PROTOTYPE HARDWARE STACK (NO DEMO DATA)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 bg-instrument-bg rounded-sm border border-instrument-border">
              <Radio className="w-4 h-4 text-instrument-amber mx-auto mb-1" />
              <span className="font-bold text-instrument-textBright block text-[11px]">ESP32 #1</span>
              <span className="text-[9px] text-instrument-textMuted block">Test Signal Generator</span>
            </div>

            <div className="p-2.5 bg-instrument-bg rounded-sm border border-instrument-border">
              <Activity className="w-4 h-4 text-instrument-blue mx-auto mb-1" />
              <span className="font-bold text-instrument-blue block text-[11px]">ESP32 #2</span>
              <span className="text-[9px] text-instrument-textMuted block">AutoScope Analyzer</span>
            </div>

            <div className="p-2.5 bg-instrument-bg rounded-sm border border-instrument-border">
              <Tv className="w-4 h-4 text-instrument-purple mx-auto mb-1" />
              <span className="font-bold text-instrument-textBright block text-[11px]">16×2 LCD</span>
              <span className="text-[9px] text-instrument-textMuted block">Local I²C Display</span>
            </div>

            <div className="p-2.5 bg-instrument-bg rounded-sm border border-instrument-border">
              <Usb className="w-4 h-4 text-instrument-green mx-auto mb-1" />
              <span className="font-bold text-instrument-green block text-[11px]">LAPTOP</span>
              <span className="text-[9px] text-instrument-textMuted block">Dashboard UI</span>
            </div>
          </div>
        </div>

        {/* Launch Workstation Button */}
        <div className="pt-2">
          <button
            onClick={onLaunch}
            className="px-6 py-3 bg-instrument-blue text-white font-bold text-sm rounded-sm hover:bg-sky-600 transition-colors flex items-center space-x-2 mx-auto uppercase tracking-wider shadow-sm"
          >
            <span>OPEN ANALYZER DASHBOARD</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between text-[10px] text-instrument-textMuted border-t border-instrument-border pt-3 z-10 font-semibold">
        <span>AUTOSCOPE INSTRUMENT SYSTEM — HW-04</span>
        <span>REAL SERIAL COMMUNICATIONS MODE ACTIVE</span>
      </div>
    </div>
  );
};
