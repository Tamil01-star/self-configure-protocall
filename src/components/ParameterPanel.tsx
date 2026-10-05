import React from 'react';
import { Sliders, Cpu } from 'lucide-react';
import type { ProtocolParameters, ProtocolType } from '../types/analyzer';

interface ParameterPanelProps {
  parameters: ProtocolParameters;
  protocol: ProtocolType;
}

export const ParameterPanel: React.FC<ParameterPanelProps> = ({
  parameters,
  protocol,
}) => {
  const renderParameters = () => {
    if (protocol === 'I2C') {
      return [
        { label: 'BUS SPEED', value: `${parameters.busSpeedKhz || 100} kHz` },
        { label: 'SLAVE ADDRESS', value: parameters.addressHex || '0x27' },
        { label: 'R/W MODE', value: parameters.rwMode || 'WRITE' },
        { label: 'ACK STATE', value: parameters.ackState || 'ACK' },
        { label: 'LOGIC LEVEL', value: `${parameters.logicLevelV.toFixed(1)} V` },
        { label: 'FRAME LENGTH', value: `${parameters.estimatedFrameLenBits || 9} bits` },
      ];
    }
    if (protocol === 'SPI') {
      return [
        { label: 'CLOCK FREQ', value: `${parameters.clockMhz || 1.0} MHz` },
        { label: 'CPOL', value: `${parameters.cpol ?? 0}` },
        { label: 'CPHA', value: `${parameters.cpha ?? 0}` },
        { label: 'BIT ORDER', value: parameters.bitOrder || 'MSB FIRST' },
        { label: 'DATA WIDTH', value: `${parameters.dataWidth || 8} bit` },
        { label: 'LOGIC LEVEL', value: `${parameters.logicLevelV.toFixed(1)} V` },
      ];
    }
    if (protocol === 'UNKNOWN') {
      return [
        { label: 'DOMINANT FREQ', value: `${parameters.dominantFreqMhz || 2.4} MHz` },
        { label: 'FRAME LENGTH', value: `${parameters.estimatedFrameLenBits || 16} bits` },
        { label: 'LOGIC LEVEL', value: `${parameters.logicLevelV.toFixed(1)} V` },
        { label: 'REPEATING PATTERN', value: 'DETECTED' },
        { label: 'SIGNAL TYPE', value: 'UNCLASSIFIED' },
      ];
    }
    // UART Default
    return [
      { label: 'BAUD RATE', value: `${parameters.baudRate || 115200} baud` },
      { label: 'DATA BITS', value: `${parameters.dataBits || 8}` },
      { label: 'PARITY', value: parameters.parity || 'NONE' },
      { label: 'STOP BITS', value: `${parameters.stopBits || 1}` },
      { label: 'LOGIC LEVEL', value: `${parameters.logicLevelV.toFixed(1)} V` },
      { label: 'BIT TIME', value: `${parameters.bitTimeUs || 8.68} μs` },
    ];
  };

  const paramsList = renderParameters();

  return (
    <div className="instrument-card p-4">
      <div className="flex items-center justify-between border-b border-instrument-border pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-instrument-cyan" />
          <span className="text-xs font-mono font-bold text-instrument-textBright uppercase">
            AUTO-CONFIGURED PARAMETERS
          </span>
        </div>
        <span className="text-[10px] font-mono text-instrument-textMuted flex items-center gap-1">
          <Cpu className="w-3 h-3 text-instrument-cyan" /> {protocol} DECODER ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {paramsList.map((p, idx) => (
          <div
            key={idx}
            className="p-2.5 bg-instrument-bg rounded border border-instrument-border font-mono hover:border-instrument-borderHighlight transition-all"
          >
            <span className="text-[10px] text-instrument-textMuted uppercase tracking-wider block mb-1">
              {p.label}
            </span>
            <span className="text-sm font-bold text-instrument-textBright block">
              {p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
