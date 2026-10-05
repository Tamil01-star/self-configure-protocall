import React from 'react';
import { Layers, AlertCircle } from 'lucide-react';
import type { DemoPreset } from '../types/analyzer';

interface DemoModePanelProps {
  currentPreset: DemoPreset;
  onSelectPreset: (preset: DemoPreset) => void;
}

export const DemoModePanel: React.FC<DemoModePanelProps> = ({
  currentPreset,
  onSelectPreset,
}) => {
  const presets: { id: DemoPreset; label: string; desc: string }[] = [
    { id: 'UART_DEMO', label: 'UART TTL DEMO', desc: '115200 baud, 8N1, 3.3V "HELLO AUTOSCOPE"' },
    { id: 'I2C_DEMO', label: 'I²C BUS DEMO', desc: '100 kHz, Address 0x27, WRITE, ACK' },
    { id: 'SPI_DEMO', label: 'SPI BUS DEMO', desc: '1 MHz clock, Mode 0 (CPOL 0, CPHA 0), 4 CH' },
    { id: 'UNKNOWN_DEMO', label: 'UNKNOWN PROTOCOL DEMO', desc: 'Reverse engineering 2.4MHz custom pulse' },
    { id: 'FAULT_DEMO', label: 'FAULT DIAGNOSIS DEMO', desc: '18% frame errors & timing jitter anomaly' },
  ];

  return (
    <div className="instrument-card p-3 bg-instrument-bg border-instrument-cyan/40 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-instrument-border pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-instrument-cyan" />
          <span className="font-bold text-instrument-textBright uppercase">
            HACKATHON DEMO SIMULATION SUITE
          </span>
        </div>
        <div className="px-2 py-0.5 bg-instrument-amberDim text-instrument-amber border border-instrument-amber/40 text-[10px] font-bold rounded flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> DEMO / SIMULATION MODE
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {presets.map((p) => {
          const isActive = currentPreset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelectPreset(p.id)}
              className={`p-2 rounded border text-left transition-all ${
                isActive
                  ? 'bg-instrument-cyanDim border-instrument-cyan text-instrument-cyan font-bold shadow-cyan-glow'
                  : 'bg-instrument-panel border-instrument-border text-instrument-textMuted hover:text-white hover:border-instrument-borderHighlight'
              }`}
            >
              <span className="text-[11px] block truncate">{p.label}</span>
              <span className="text-[9px] opacity-75 block truncate mt-0.5">{p.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
