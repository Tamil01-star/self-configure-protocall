import React from 'react';
import { HelpCircle, AlertCircle } from 'lucide-react';
import type { RealProtocolParameters } from '../types/analyzer';

interface UnknownProtocolPanelProps {
  parameters: RealProtocolParameters;
  confidence: number | null;
  isConnected: boolean;
}

export const UnknownProtocolPanel: React.FC<UnknownProtocolPanelProps> = ({
  parameters,
  confidence,
  isConnected,
}) => {
  const hasEvidence = parameters.transitionCount !== undefined || parameters.idleState || parameters.activeChannelsCount;

  return (
    <div className="instrument-card p-4 space-y-3 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-instrument-border pb-2">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-instrument-purple" />
          <span className="font-bold text-instrument-textBright uppercase">
            UNKNOWN / CUSTOM PROTOCOL ANALYSIS
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-instrument-textMuted uppercase font-bold">Confidence: </span>
          <span className="font-bold text-instrument-amber">
            {confidence !== null ? `${confidence.toFixed(1)}%` : '—'}
          </span>
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-3 bg-instrument-bg rounded-sm border border-instrument-border flex items-start space-x-2.5">
        <AlertCircle className="w-4 h-4 text-instrument-purple shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-instrument-purple block">
            "No known protocol confidently identified. AutoScope is providing signal telemetry for custom protocol reverse engineering."
          </span>
          <span className="text-[10px] text-instrument-textMuted block font-semibold">
            ESP32 #2 logic analyzer captured unclassified pulse transitions.
          </span>
        </div>
      </div>

      {/* Actual Information Available */}
      {hasEvidence && isConnected ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          <div className="p-2 bg-instrument-bg rounded-sm border border-instrument-border">
            <span className="text-[9px] text-instrument-textMuted uppercase block font-semibold">Active Channels</span>
            <span className="font-bold text-instrument-textBright block">
              {parameters.activeChannelsCount !== undefined ? `${parameters.activeChannelsCount}` : '—'}
            </span>
          </div>

          <div className="p-2 bg-instrument-bg rounded-sm border border-instrument-border">
            <span className="text-[9px] text-instrument-textMuted uppercase block font-semibold">Idle State</span>
            <span className="font-bold text-instrument-textBright block">
              {parameters.idleState || '—'}
            </span>
          </div>

          <div className="p-2 bg-instrument-bg rounded-sm border border-instrument-border">
            <span className="text-[9px] text-instrument-textMuted uppercase block font-semibold">Transitions</span>
            <span className="font-bold text-instrument-blue block">
              {parameters.transitionCount !== undefined ? `${parameters.transitionCount}` : '—'}
            </span>
          </div>

          <div className="p-2 bg-instrument-bg rounded-sm border border-instrument-border">
            <span className="text-[9px] text-instrument-textMuted uppercase block font-semibold">Timing Info</span>
            <span className="font-bold text-instrument-textBright block truncate">
              {parameters.timingInfo || '—'}
            </span>
          </div>

          <div className="p-2 bg-instrument-bg rounded-sm border border-instrument-border">
            <span className="text-[9px] text-instrument-textMuted uppercase block font-semibold">UART Score</span>
            <span className="font-bold text-instrument-textSubtle block">
              {parameters.uartScore !== undefined ? `${parameters.uartScore}%` : '—'}
            </span>
          </div>

          <div className="p-2 bg-instrument-bg rounded-sm border border-instrument-border">
            <span className="text-[9px] text-instrument-textMuted uppercase block font-semibold">I²C Score</span>
            <span className="font-bold text-instrument-textSubtle block">
              {parameters.i2cScore !== undefined ? `${parameters.i2cScore}%` : '—'}
            </span>
          </div>

          <div className="p-2 bg-instrument-bg rounded-sm border border-instrument-border">
            <span className="text-[9px] text-instrument-textMuted uppercase block font-semibold">SPI Score</span>
            <span className="font-bold text-instrument-textSubtle block">
              {parameters.spiScore !== undefined ? `${parameters.spiScore}%` : '—'}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-instrument-bg rounded-sm border border-instrument-border text-center text-instrument-textMuted font-bold text-xs">
          INSUFFICIENT EVIDENCE
        </div>
      )}
    </div>
  );
};
