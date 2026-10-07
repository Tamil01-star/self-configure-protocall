import React from 'react';
import { Sliders, Cpu } from 'lucide-react';
import type { RealProtocolParameters, ProtocolType } from '../types/analyzer';

interface ParameterPanelProps {
  parameters: RealProtocolParameters;
  protocol: ProtocolType | null;
}

export const ParameterPanel: React.FC<ParameterPanelProps> = ({
  parameters,
  protocol,
}) => {
  const getDisplayItems = () => {
    if (protocol === 'UART') {
      return [
        { label: 'PROTOCOL', value: 'UART TTL' },
        { label: 'CHANNEL', value: parameters.channel || '—' },
        { label: 'BAUD RATE', value: parameters.baudRate ? `${parameters.baudRate} baud` : '—' },
        { label: 'FRAME FORMAT', value: parameters.format || '—' },
        { label: 'IDLE LEVEL', value: parameters.idle || '—' },
        { label: 'BIT PERIOD', value: parameters.bitPeriodUs ? `${parameters.bitPeriodUs.toFixed(2)} μs` : '—' },
      ];
    }
    if (protocol === 'I2C') {
      return [
        { label: 'PROTOCOL', value: 'I²C Bus' },
        { label: 'SDA', value: parameters.sdaChannel || '—' },
        { label: 'SCL', value: parameters.sclChannel || '—' },
        { label: 'CLOCK', value: parameters.clockHz ? `${parameters.clockHz / 1000} kHz` : '—' },
        { label: 'ADDRESS', value: parameters.addressHex || '—' },
        { label: 'READ/WRITE', value: parameters.rwMode || '—' },
        { label: 'ACK/NACK', value: parameters.ackState !== undefined ? (parameters.ackState ? 'ACK' : 'NACK') : '—' },
      ];
    }
    if (protocol === 'SPI') {
      return [
        { label: 'PROTOCOL', value: 'SPI Bus' },
        { label: 'SCLK', value: parameters.sclkChannel || '—' },
        { label: 'MOSI', value: parameters.mosiChannel || '—' },
        { label: 'MISO', value: parameters.misoChannel || '—' },
        { label: 'CS', value: parameters.csChannel || '—' },
        { label: 'CLOCK', value: parameters.clockHzSpi ? `${parameters.clockHzSpi / 1_000_000} MHz` : '—' },
        { label: 'MODE', value: parameters.spiMode !== undefined ? `Mode ${parameters.spiMode}` : '—' },
        { label: 'CPOL', value: parameters.cpol !== undefined ? `${parameters.cpol}` : '—' },
        { label: 'CPHA', value: parameters.cpha !== undefined ? `${parameters.cpha}` : '—' },
        { label: 'BIT ORDER', value: parameters.bitOrder || '—' },
      ];
    }
    if (protocol === 'RS232' || protocol === 'RS485') {
      return [
        { label: 'PROTOCOL', value: protocol === 'RS232' ? 'RS-232' : 'RS-485' },
        { label: 'BAUD RATE', value: parameters.baudRate ? `${parameters.baudRate} baud` : '—' },
        { label: 'FRAME FORMAT', value: parameters.format || '—' },
        { label: 'BIT PERIOD', value: parameters.bitPeriodUs ? `${parameters.bitPeriodUs.toFixed(2)} μs` : '—' },
        { label: 'CHANNEL', value: parameters.channel || '—' },
        { label: 'IDLE LEVEL', value: parameters.idle || '—' },
      ];
    }
    if (protocol === 'CAN') {
      return [
        { label: 'PROTOCOL', value: 'CAN Bus' },
        { label: 'BIT RATE', value: parameters.canBitRate ? `${parameters.canBitRate} bit/s` : '—' },
        { label: 'FRAME ID', value: parameters.canFrameId || '—' },
        { label: 'CAN-H CH', value: parameters.channel || '—' },
        { label: 'TRANSITIONS', value: parameters.transitionCount !== undefined ? `${parameters.transitionCount}` : '—' },
        { label: 'TIMING INFO', value: parameters.timingInfo || '—' },
      ];
    }
    if (protocol === 'LIN') {
      return [
        { label: 'PROTOCOL', value: 'LIN Bus' },
        { label: 'LIN VERSION', value: parameters.linVersion || '—' },
        { label: 'BAUD RATE', value: parameters.baudRate ? `${parameters.baudRate} baud` : '—' },
        { label: 'CHANNEL', value: parameters.channel || '—' },
        { label: 'TRANSITIONS', value: parameters.transitionCount !== undefined ? `${parameters.transitionCount}` : '—' },
        { label: 'TIMING INFO', value: parameters.timingInfo || '—' },
      ];
    }
    if (protocol === 'UNKNOWN') {
      return [
        { label: 'PROTOCOL', value: 'UNKNOWN / CUSTOM' },
        { label: 'ACTIVE CHANNELS', value: parameters.activeChannelsCount ? `${parameters.activeChannelsCount}` : '—' },
        { label: 'IDLE STATE', value: parameters.idleState || '—' },
        { label: 'TRANSITIONS', value: parameters.transitionCount !== undefined ? `${parameters.transitionCount}` : '—' },
        { label: 'TIMING INFO', value: parameters.timingInfo || '—' },
      ];
    }

    // No protocol detected yet
    return [
      { label: 'PROTOCOL', value: '—' },
      { label: 'CHANNEL', value: '—' },
      { label: 'CLOCK / BAUD', value: '—' },
      { label: 'FORMAT', value: '—' },
      { label: 'IDLE LEVEL', value: '—' },
      { label: 'STATUS', value: 'WAITING FOR DATA' },
    ];
  };

  const items = getDisplayItems();

  return (
    <div className="instrument-card p-3 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-instrument-border pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <Sliders className="w-3.5 h-3.5 text-instrument-blue" />
          <span className="font-bold text-instrument-textBright uppercase">
            AUTOMATIC PARAMETER DETECTION
          </span>
        </div>
        <span className="text-[10px] text-instrument-textMuted flex items-center gap-1 font-semibold">
          <Cpu className="w-3 h-3 text-instrument-blue" /> ESP32 #2 PARSER
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-2 bg-instrument-bg rounded-sm border border-instrument-border"
          >
            <span className="text-[9px] text-instrument-textMuted uppercase tracking-wider block font-semibold mb-0.5">
              {item.label}
            </span>
            <span className={`text-xs font-bold block truncate ${item.value === '—' ? 'text-instrument-textMuted' : 'text-instrument-textBright'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
