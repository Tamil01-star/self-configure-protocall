import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import type { UnknownProtocolData } from '../types/analyzer';

interface UnknownProtocolPanelProps {
  data: UnknownProtocolData;
}

export const UnknownProtocolPanel: React.FC<UnknownProtocolPanelProps> = ({ data }) => {
  const [subTab, setSubTab] = useState<'RAW_WAVEFORM' | 'TIMING_ANALYSIS' | 'HEX_STREAM' | 'PATTERN'>('RAW_WAVEFORM');

  return (
    <div className="instrument-card p-4 space-y-4 bg-white border border-slate-200">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-purple-200 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200 font-mono font-bold text-lg shadow-sm">
            ?
          </div>
          <div>
            <h3 className="text-sm font-mono font-bold text-slate-900 uppercase flex items-center gap-2">
              UNKNOWN / CUSTOM PROTOCOL REVERSE ENGINEERING
            </h3>
            <p className="text-[11px] font-mono text-purple-700 font-semibold">
              Signal Intelligence & Pattern Mining Engine Active
            </p>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Match Confidence</span>
          <span className="text-lg font-bold text-amber-600">{data.confidence.toFixed(1)}%</span>
        </div>
      </div>

      {/* Info Callout Box */}
      <div className="p-3 bg-purple-50/70 rounded border border-purple-200 text-xs font-mono flex items-start space-x-3">
        <HelpCircle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
        <div className="text-slate-800 space-y-1">
          <p className="font-bold text-purple-800">
            "No known protocol confidently identified. AutoScope is providing signal intelligence for reverse engineering."
          </p>
          <p className="text-[11px] text-slate-600 font-medium">
            AutoScope automatically detected repeating frame boundaries at 2.400 MHz and is capturing raw symbol bursts for protocol specification extraction.
          </p>
        </div>
      </div>

      {/* Parameter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono">
        <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
          <span className="text-[9px] text-slate-400 uppercase block font-semibold">Protocol Status</span>
          <span className="text-xs font-bold text-amber-600">UNCLASSIFIED</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
          <span className="text-[9px] text-slate-400 uppercase block font-semibold">Logic Voltage</span>
          <span className="text-xs font-bold text-slate-900">{data.logicVoltage.toFixed(1)} V</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
          <span className="text-[9px] text-slate-400 uppercase block font-semibold">Active Channels</span>
          <span className="text-xs font-bold text-sky-700">{data.channelCount} Channels</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
          <span className="text-[9px] text-slate-400 uppercase block font-semibold">Dominant Freq</span>
          <span className="text-xs font-bold text-purple-700">{data.dominantFreqMhz.toFixed(2)} MHz</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
          <span className="text-[9px] text-slate-400 uppercase block font-semibold">Frame Length</span>
          <span className="text-xs font-bold text-emerald-600">{data.estimatedFrameBits} Bits</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-mono">
        {(['RAW_WAVEFORM', 'TIMING_ANALYSIS', 'HEX_STREAM', 'PATTERN'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`px-3 py-1 rounded transition-all font-semibold ${
              subTab === tab
                ? 'bg-purple-600 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Sub Tab Panel Content */}
      <div className="p-3 bg-slate-50 rounded border border-slate-200 font-mono text-xs min-h-[120px]">
        {subTab === 'RAW_WAVEFORM' && (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">HIGH-RESOLUTION RAW PULSE BURST</span>
            <div className="font-mono text-sky-700 bg-white p-2.5 rounded border border-slate-200 break-all font-bold">
              ┌──┐ │ ┌──┐ ┌────┐ │ ┌──┐ ┌──┐ │ ┌──┐ ┌────┐ (Continuous 2.4MHz Sampling)
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Sampling at 2.400 MHz. Pulse duty cycle: 33.3% HIGH / 66.6% LOW.</p>
          </div>
        )}

        {subTab === 'TIMING_ANALYSIS' && (
          <div className="space-y-2 text-slate-900 font-medium">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">EDGE TIMING SPECTRUM</span>
            <p>• Min Pulse Width: <strong className="text-sky-700 font-bold">416.6 ns</strong></p>
            <p>• Max Pulse Width: <strong className="text-sky-700 font-bold">1.250 μs</strong></p>
            <p>• Clock Jitter Variance: <strong className="text-emerald-600 font-bold">±2.1%</strong></p>
          </div>
        )}

        {subTab === 'HEX_STREAM' && (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">RAW HEXADECIMAL PACKET DUMP</span>
            <div className="flex flex-wrap gap-2 text-purple-700 font-mono font-bold text-sm">
              {data.rawBytes.map((hex, i) => (
                <span key={i} className="px-2 py-1 bg-white rounded border border-slate-200 shadow-sm">
                  0x{hex}
                </span>
              ))}
            </div>
          </div>
        )}

        {subTab === 'PATTERN' && (
          <div className="space-y-2 text-slate-900 font-medium">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">PATTERN RECOGNITION ENGINE</span>
            <p className="text-emerald-600 font-bold">✓ Repeating 16-bit sync preamble detected every 14.2 μs.</p>
            <p className="text-slate-600">Estimated preamble mask: <code className="text-sky-700 font-bold">1010 0101 1100 0011</code></p>
          </div>
        )}
      </div>
    </div>
  );
};
