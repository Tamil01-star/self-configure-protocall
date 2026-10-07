import React from 'react';
import { Activity, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { ProtocolType, AnalyzerState } from '../types/analyzer';

interface ProtocolStatusProps {
  protocol: ProtocolType | null;
  confidence: number | null;
  statusText: string | null;
  analyzerState: AnalyzerState;
  isConnected: boolean;
}

export const ProtocolStatus: React.FC<ProtocolStatusProps> = ({
  protocol,
  confidence,
  statusText,
  analyzerState,
  isConnected,
}) => {
  return (
    <div className="instrument-card p-3 font-mono">
      <div className="flex items-center justify-between border-b border-instrument-border pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-instrument-blue" />
          <span className="text-[11px] font-bold text-instrument-textBright uppercase tracking-wider">
            REAL-TIME PROTOCOL IDENTIFICATION READOUT
          </span>
        </div>
        <div>
          {isConnected ? (
            <span className="px-2 py-0.5 rounded-sm bg-instrument-green/20 text-instrument-green border border-instrument-green/40 text-[10px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-instrument-green animate-led" />
              ESP32 #2 LIVE STREAM
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-sm bg-instrument-red/20 text-instrument-red border border-instrument-red/40 text-[10px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-instrument-red" />
              SERIAL OFFLINE
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        {/* Protocol Name Readout */}
        <div className="p-3 bg-instrument-bg rounded-sm border border-instrument-border">
          <span className="text-[10px] text-instrument-textMuted uppercase tracking-wider block font-semibold mb-1">
            DETECTED PROTOCOL
          </span>
          <div className="text-xl font-extrabold text-instrument-textBright flex items-center space-x-2">
            {protocol ? (
              <span className="text-instrument-blue">
                {protocol === 'I2C' ? 'I²C Bus'
                  : protocol === 'RS232' ? 'RS-232'
                  : protocol === 'RS485' ? 'RS-485'
                  : protocol === 'CAN' ? 'CAN Bus'
                  : protocol === 'LIN' ? 'LIN Bus'
                  : protocol}
              </span>
            ) : (
              <span className="text-instrument-textMuted">— NOT DETECTED —</span>
            )}
          </div>
        </div>

        {/* Confidence Percentage */}
        <div className="p-3 bg-instrument-bg rounded-sm border border-instrument-border">
          <span className="text-[10px] text-instrument-textMuted uppercase tracking-wider block font-semibold mb-1">
            CONFIDENCE
          </span>
          <div className="flex items-baseline space-x-1">
            <span className={`text-2xl font-extrabold ${confidence !== null ? 'text-instrument-green' : 'text-instrument-textMuted'}`}>
              {confidence !== null ? confidence.toFixed(1) : '—'}
            </span>
            {confidence !== null && <span className="text-sm text-instrument-green font-bold">%</span>}
          </div>
        </div>

        {/* Validation Status */}
        <div className="p-3 bg-instrument-bg rounded-sm border border-instrument-border">
          <span className="text-[10px] text-instrument-textMuted uppercase tracking-wider block font-semibold mb-1">
            ANALYSIS STATUS
          </span>
          <div className="text-sm font-bold flex items-center space-x-1.5">
            {isConnected ? (
              statusText ? (
                <span className="text-instrument-green flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {statusText}
                </span>
              ) : (
                <span className="text-instrument-amber uppercase">{analyzerState}</span>
              )
            ) : (
              <span className="text-instrument-red flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> DISCONNECTED
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
