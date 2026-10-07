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
  const protocols: {
    id: ProtocolType | 'RS232_RS485' | 'CAN_LIN';
    matchIds: ProtocolType[];
    name: string;
    details: (p: RealProtocolParameters, active: boolean) => string;
    score: (p: RealProtocolParameters, active: boolean, conf: number | null) => number | null;
    channelInfo: string;
    iconColor: string;
  }[] = [
    {
      id: 'UART',
      matchIds: ['UART'],
      name: 'UART / TTL',
      details: (p, active) =>
        active && p.baudRate
          ? `${p.baudRate} baud | ${p.format || '8N1'}`
          : active ? 'Searching baud rate...' : 'NOT DETECTED',
      score: (p, active, conf) => active ? (p.uartScore ?? conf) : null,
      channelInfo: '1 Channel (Data)',
      iconColor: 'text-sky-600',
    },
    {
      id: 'I2C',
      matchIds: ['I2C'],
      name: 'I²C BUS',
      details: (p, active) =>
        active && p.clockHz
          ? `${(p.clockHz / 1000).toFixed(0)} kHz | Addr: ${p.addressHex || '—'}`
          : active ? 'Searching clock & address...' : 'NOT DETECTED',
      score: (p, active, conf) => active ? (p.i2cScore ?? conf) : null,
      channelInfo: 'SDA / SCL (2 lines)',
      iconColor: 'text-emerald-600',
    },
    {
      id: 'SPI',
      matchIds: ['SPI'],
      name: 'SPI BUS',
      details: (p, active) =>
        active && p.clockHzSpi
          ? `${(p.clockHzSpi / 1_000_000).toFixed(2)} MHz | Mode ${p.spiMode ?? 0}`
          : active ? 'Searching clock & mode...' : 'NOT DETECTED',
      score: (p, active, conf) => active ? (p.spiScore ?? conf) : null,
      channelInfo: 'SCLK / MOSI / MISO / CS',
      iconColor: 'text-purple-600',
    },
    {
      id: 'RS232_RS485',
      matchIds: ['RS232', 'RS485'],
      name: 'RS-232 / RS-485',
      details: (p, active) =>
        active && p.baudRate
          ? `${p.baudRate} baud | Differential`
          : active ? 'Baud rate detected...' : 'NOT DETECTED',
      score: (_p, active, conf) => active ? conf : null,
      channelInfo: 'Diff Pair (A/B)',
      iconColor: 'text-amber-600',
    },
    {
      id: 'CAN_LIN',
      matchIds: ['CAN', 'LIN'],
      name: 'CAN / LIN BUS',
      details: (p, active) =>
        active && (p.canBitRate || p.linVersion)
          ? p.canBitRate ? `${p.canBitRate} bit/s | ID: ${p.canFrameId || '—'}` : `LIN ${p.linVersion || ''}`
          : active ? 'Detecting frame...' : 'NOT DETECTED',
      score: (_p, active, conf) => active ? conf : null,
      channelInfo: 'CAN-H / CAN-L',
      iconColor: 'text-indigo-600',
    },
    {
      id: 'UNKNOWN',
      matchIds: ['UNKNOWN'],
      name: 'CUSTOM / UNKNOWN',
      details: (p, active) =>
        active
          ? p.timingInfo || `${p.transitionCount ?? '?'} transitions detected`
          : 'NOT DETECTED',
      score: (_p, active, conf) => active ? conf : null,
      channelInfo: 'All channels',
      iconColor: 'text-slate-600',
    },
  ];

  return (
    <div className="instrument-card p-3 font-sans text-xs select-none">
      <div className="flex flex-wrap items-center justify-between border-b border-instrument-border pb-2 mb-2.5 gap-2">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-instrument-blue" />
          <span className="font-bold text-instrument-textBright uppercase tracking-wider text-xs">
            ALL PROTOCOLS — LIVE ANALYSIS MATRIX
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="text-instrument-textMuted font-medium">Active Protocol:</span>
          <span className="font-bold text-instrument-blue px-2 py-0.5 bg-instrument-panelHeader rounded border border-instrument-border">
            {detectedProtocol
              ? (detectedProtocol === 'I2C' ? 'I²C Bus'
                : detectedProtocol === 'RS232' ? 'RS-232'
                : detectedProtocol === 'RS485' ? 'RS-485'
                : detectedProtocol === 'CAN' ? 'CAN Bus'
                : detectedProtocol === 'LIN' ? 'LIN Bus'
                : detectedProtocol)
              : isConnected ? 'SEARCHING...' : 'NOT CONNECTED'}
          </span>
          {confidence !== null && (
            <span className="font-bold text-instrument-green px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
              {confidence.toFixed(1)}% CONFIDENCE
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {protocols.map((p) => {
          const active = isConnected && detectedProtocol !== null && p.matchIds.includes(detectedProtocol as ProtocolType);
          const scoreVal = p.score(parameters, active, confidence);
          const detailText = p.details(parameters, active);

          return (
            <div
              key={p.id}
              className={`p-2.5 rounded-sm border transition-all ${
                active
                  ? 'bg-white border-instrument-blue shadow-sm ring-1 ring-instrument-blue/30'
                  : 'bg-instrument-bg border-instrument-border opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-extrabold text-[11px] tracking-wide ${active ? 'text-instrument-blue' : 'text-instrument-textBright'}`}>
                  {p.name}
                </span>
                {active ? (
                  <span className="w-2 h-2 rounded-full bg-instrument-green animate-led" title="Detected & Decoding" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                )}
              </div>

              <div className="text-[10px] font-mono truncate mb-1" title={detailText}
                style={{ color: active ? '#374151' : '#94a3b8' }}>
                {detailText}
              </div>

              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-instrument-border/50">
                <span className="text-instrument-textSubtle font-medium truncate">{p.channelInfo}</span>
                <span className={`font-mono font-bold ml-1 shrink-0 ${scoreVal !== null ? 'text-instrument-green' : 'text-instrument-textMuted'}`}>
                  {scoreVal !== null ? `${scoreVal.toFixed(0)}%` : 'STANDBY'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
