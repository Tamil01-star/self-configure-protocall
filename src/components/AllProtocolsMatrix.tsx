import React from 'react';
import { Zap } from 'lucide-react';
import type { ProtocolType, RealProtocolParameters } from '../types/analyzer';

interface AllProtocolsMatrixProps {
  detectedProtocol: ProtocolType | null;
  confidence: number | null;
  parameters: RealProtocolParameters;
  isConnected: boolean;
}

export const AllProtocolsMatrix: React.FC<AllProtocolsMatrixProps> = ({
  detectedProtocol,
  confidence,
  parameters,
  isConnected,
}) => {
  // Protocol status cards definition
  const protocols = [
    {
      id: 'UART',
      name: 'UART / TTL',
      active: detectedProtocol === 'UART',
      details: parameters.baudRate ? `${parameters.baudRate} baud (${parameters.format || '8N1'})` : 'Baud search...',
      score: parameters.uartScore ?? (detectedProtocol === 'UART' ? confidence : null),
      channelInfo: parameters.channel ? `CH: ${parameters.channel}` : '1 Channel',
      iconColor: 'text-instrument-blue',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-300',
    },
    {
      id: 'I2C',
      name: 'I²C BUS',
      active: detectedProtocol === 'I2C',
      details: parameters.clockHz ? `${(parameters.clockHz / 1000).toFixed(0)} kHz | Addr: ${parameters.addressHex || '—'}` : 'Clock & Addr search...',
      score: parameters.i2cScore ?? (detectedProtocol === 'I2C' ? confidence : null),
      channelInfo: parameters.sdaChannel && parameters.sclChannel ? `${parameters.sdaChannel}/${parameters.sclChannel}` : 'SDA / SCL',
      iconColor: 'text-instrument-green',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    },
    {
      id: 'SPI',
      name: 'SPI BUS',
      active: detectedProtocol === 'SPI',
      details: parameters.clockHzSpi ? `${(parameters.clockHzSpi / 1000000).toFixed(1)} MHz | Mode ${parameters.spiMode ?? 0}` : 'Clock & Mode search...',
      score: parameters.spiScore ?? (detectedProtocol === 'SPI' ? confidence : null),
      channelInfo: 'SCLK/MOSI/MISO/CS',
      iconColor: 'text-instrument-purple',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-300',
    },
    {
      id: 'RS232_RS485',
      name: 'RS-232 / RS-485',
      active: false,
      details: 'Differential Architecture Ready',
      score: null,
      channelInfo: 'Diff Pair',
      iconColor: 'text-instrument-amber',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-300',
    },
    {
      id: 'CAN_LIN',
      name: 'CAN / LIN BUS',
      active: false,
      details: 'Automotive Bus Architecture Ready',
      score: null,
      channelInfo: 'CAN-H / CAN-L',
      iconColor: 'text-indigo-600',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-300',
    },
    {
      id: 'UNKNOWN',
      name: 'CUSTOM / UNKNOWN',
      active: detectedProtocol === 'UNKNOWN',
      details: parameters.timingInfo || 'Transition & Timing Analyzer',
      score: detectedProtocol === 'UNKNOWN' ? confidence : null,
      channelInfo: `${parameters.activeChannelsCount || 1} Channels`,
      iconColor: 'text-slate-600',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
    },
  ];

  return (
    <div className="instrument-card p-3 font-sans text-xs select-none">
      <div className="flex flex-wrap items-center justify-between border-b border-instrument-border pb-2 mb-2.5 gap-2">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-instrument-blue" />
          <span className="font-bold text-instrument-textBright uppercase tracking-wider text-xs">
            ALL PROTOCOLS LIVE ANALYSIS MATRIX (SINGLE SCREEN WORKSTATION)
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="text-instrument-textMuted font-medium">Active Protocol:</span>
          <span className="font-bold text-instrument-blue px-2 py-0.5 bg-instrument-panelHeader rounded border border-instrument-border">
            {detectedProtocol ? (detectedProtocol === 'I2C' ? 'I²C Bus' : detectedProtocol) : 'AUTO SEARCHING...'}
          </span>
          {confidence !== null && (
            <span className="font-bold text-instrument-green px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
              {confidence.toFixed(1)}% CONFIDENCE
            </span>
          )}
        </div>
      </div>

      {/* Grid of all protocols shown together on one screen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5">
        {protocols.map((p) => (
          <div
            key={p.id}
            className={`p-2.5 rounded-sm border transition-all ${
              p.active && isConnected
                ? 'bg-white border-instrument-blue shadow-sm ring-1 ring-instrument-blue/40'
                : 'bg-instrument-bg border-instrument-border opacity-90'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`font-extrabold text-[11px] tracking-wide ${p.active && isConnected ? 'text-instrument-blue' : 'text-instrument-textBright'}`}>
                {p.name}
              </span>
              {p.active && isConnected ? (
                <span className="w-2 h-2 rounded-full bg-instrument-green animate-led" title="Detected & Decoding" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              )}
            </div>

            <div className="text-[10px] text-instrument-textMuted font-mono truncate mb-1" title={p.details}>
              {p.details}
            </div>

            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-instrument-border/50">
              <span className="text-instrument-textSubtle font-medium">{p.channelInfo}</span>
              <span className={`font-mono font-bold ${p.score !== null && p.score !== undefined ? 'text-instrument-green' : 'text-instrument-textMuted'}`}>
                {p.score !== null && p.score !== undefined ? `${p.score.toFixed(0)}%` : 'STANDBY'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
