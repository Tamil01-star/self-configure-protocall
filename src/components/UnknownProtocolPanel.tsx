import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import type { UnknownProtocolData } from '../types/analyzer';

interface UnknownProtocolPanelProps {
  data: UnknownProtocolData;
}

export const UnknownProtocolPanel: React.FC<UnknownProtocolPanelProps> = ({ data }) => {
  const [subTab, setSubTab] = useState<'RAW_WAVEFORM' | 'TIMING_ANALYSIS' | 'HEX_STREAM' | 'PATTERN'>('RAW_WAVEFORM');

  return (
    <div className="instrument-card p-4 space-y-4">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-instrument-purple/40 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded bg-instrument-purpleDim text-instrument-purple flex items-center justify-center border border-instrument-purple/40 font-mono font-bold text-lg shadow-sm">
            ?
          </div>
          <div>
            <h3 className="text-sm font-mono font-bold text-instrument-textBright uppercase flex items-center gap-2">
              UNKNOWN / CUSTOM PROTOCOL REVERSE ENGINEERING
            </h3>
            <p className="text-[11px] font-mono text-instrument-purple">
              Signal Intelligence & Pattern Mining Engine Active
            </p>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className="text-[10px] text-instrument-textMuted uppercase block">Match Confidence</span>
          <span className="text-lg font-bold text-instrument-amber">{data.confidence.toFixed(1)}%</span>
        </div>
      </div>

      {/* Info Callout Box */}
      <div className="p-3 bg-instrument-purpleDim/30 rounded border border-instrument-purple/40 text-xs font-mono flex items-start space-x-3">
        <HelpCircle className="w-5 h-5 text-instrument-purple shrink-0 mt-0.5" />
        <div className="text-instrument-textBright space-y-1">
          <p className="font-semibold text-instrument-purple">
            "No known protocol confidently identified. AutoScope is providing signal intelligence for reverse engineering."
          </p>
          <p className="text-[11px] text-instrument-textMuted">
            AutoScope automatically detected repeating frame boundaries at 2.400 MHz and is capturing raw symbol bursts for protocol specification extraction.
          </p>
        </div>
      </div>

      {/* Parameter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono">
        <div className="p-2.5 bg-instrument-bg rounded border border-instrument-border">
          <span className="text-[9px] text-instrument-textMuted uppercase block">Protocol Status</span>
          <span className="text-xs font-bold text-instrument-amber">UNCLASSIFIED</span>
        </div>

        <div className="p-2.5 bg-instrument-bg rounded border border-instrument-border">
          <span className="text-[9px] text-instrument-textMuted uppercase block">Logic Voltage</span>
          <span className="text-xs font-bold text-instrument-textBright">{data.logicVoltage.toFixed(1)} V</span>
        </div>

        <div className="p-2.5 bg-instrument-bg rounded border border-instrument-border">
          <span className="text-[9px] text-instrument-textMuted uppercase block">Active Channels</span>
          <span className="text-xs font-bold text-instrument-cyan">{data.channelCount} Channels</span>
        </div>

        <div className="p-2.5 bg-instrument-bg rounded border border-instrument-border">
          <span className="text-[9px] text-instrument-textMuted uppercase block">Dominant Freq</span>
          <span className="text-xs font-bold text-instrument-purple">{data.dominantFreqMhz.toFixed(2)} MHz</span>
        </div>

        <div className="p-2.5 bg-instrument-bg rounded border border-instrument-border">
          <span className="text-[9px] text-instrument-textMuted uppercase block">Frame Length</span>
          <span className="text-xs font-bold text-instrument-green">{data.estimatedFrameBits} Bits</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center space-x-2 border-b border-instrument-border pb-2 text-xs font-mono">
        {(['RAW_WAVEFORM', 'TIMING_ANALYSIS', 'HEX_STREAM', 'PATTERN'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`px-3 py-1 rounded transition-all ${
              subTab === tab
                ? 'bg-instrument-purple text-black font-bold shadow-sm'
                : 'text-instrument-textMuted hover:text-white hover:bg-instrument-bg'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Sub Tab Panel Content */}
      <div className="p-3 bg-instrument-bg rounded border border-instrument-border font-mono text-xs min-h-[120px]">
        {subTab === 'RAW_WAVEFORM' && (
          <div className="space-y-2">
            <span className="text-[10px] text-instrument-textMuted uppercase block">HIGH-RESOLUTION RAW PULSE BURST</span>
            <div className="font-mono text-instrument-cyan bg-instrument-panel p-2.5 rounded border border-instrument-border break-all">
              ┌──┐ │ ┌──┐ ┌────┐ │ ┌──┐ ┌──┐ │ ┌──┐ ┌────┐ (Continuous 2.4MHz Sampling)
            </div>
            <p className="text-[11px] text-instrument-textMuted">Sampling at 2.400 MHz. Pulse duty cycle: 33.3% HIGH / 66.6% LOW.</p>
          </div>
        )}

        {subTab === 'TIMING_ANALYSIS' && (
          <div className="space-y-2 text-instrument-textBright">
            <span className="text-[10px] text-instrument-textMuted uppercase block">EDGE TIMING SPECTRUM</span>
            <p>• Min Pulse Width: <strong className="text-instrument-cyan">416.6 ns</strong></p>
            <p>• Max Pulse Width: <strong className="text-instrument-cyan">1.250 μs</strong></p>
            <p>• Clock Jitter Variance: <strong className="text-instrument-green">±2.1%</strong></p>
          </div>
        )}

        {subTab === 'HEX_STREAM' && (
          <div className="space-y-2">
            <span className="text-[10px] text-instrument-textMuted uppercase block">RAW HEXADECIMAL PACKET DUMP</span>
            <div className="flex flex-wrap gap-2 text-instrument-purple font-mono font-bold text-sm">
              {data.rawBytes.map((hex, i) => (
                <span key={i} className="px-2 py-1 bg-instrument-panel rounded border border-instrument-border">
                  0x{hex}
                </span>
              ))}
            </div>
          </div>
        )}

        {subTab === 'PATTERN' && (
          <div className="space-y-2 text-instrument-textBright">
            <span className="text-[10px] text-instrument-textMuted uppercase block">PATTERN RECOGNITION ENGINE</span>
            <p className="text-instrument-green font-bold">✓ Repeating 16-bit sync preamble detected every 14.2 μs.</p>
            <p className="text-instrument-textMuted">Estimated preamble mask: <code className="text-instrument-cyan">1010 0101 1100 0011</code></p>
          </div>
        )}
      </div>
    </div>
  );
};
