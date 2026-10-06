import React from 'react';
import { Cpu, Usb, Tv, Radio, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { SystemHardwareStatus } from '../types/analyzer';

interface HardwareStackPanelProps {
  hardwareStatus: SystemHardwareStatus;
  lcdMessage: string | null;
  onConnectSerial: () => void;
  onDisconnectSerial: () => void;
}

export const HardwareStackPanel: React.FC<HardwareStackPanelProps> = ({
  hardwareStatus,
  lcdMessage,
  onConnectSerial,
  onDisconnectSerial,
}) => {
  return (
    <div className="instrument-card p-4 font-mono text-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-instrument-border pb-2">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-instrument-purple" />
          <span className="font-bold text-instrument-textBright uppercase">
            SYSTEM HARDWARE STACK & TELEMETRY
          </span>
        </div>
        <span className="text-[10px] text-instrument-textMuted font-semibold">
          ACTUAL HARDWARE ONLY
        </span>
      </div>

      {/* 4 Hardware Components Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* ESP32 #1 */}
        <div className="p-3 bg-instrument-bg rounded-sm border border-instrument-border space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-instrument-textMuted uppercase font-bold">ESP32 #1</span>
            <Radio className="w-3.5 h-3.5 text-instrument-amber" />
          </div>
          <span className="font-bold text-instrument-textBright block">TEST SIGNAL GENERATOR</span>
          <span className="text-[10px] text-instrument-textMuted block">Role: DUT / Signal Source</span>
          <div className="pt-1">
            <span className="px-1.5 py-0.5 rounded-sm bg-instrument-bg text-[10px] font-bold text-instrument-textSubtle border border-instrument-border">
              ● {hardwareStatus.esp32_1_status}
            </span>
          </div>
        </div>

        {/* ESP32 #2 */}
        <div className="p-3 bg-instrument-bg rounded-sm border border-instrument-border space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-instrument-textMuted uppercase font-bold">ESP32 #2</span>
            <Usb className="w-3.5 h-3.5 text-instrument-blue" />
          </div>
          <span className="font-bold text-instrument-textBright block">AUTOSCOPE ANALYZER</span>
          <span className="text-[10px] text-instrument-textMuted block">Role: Capture + Detection</span>
          <div className="pt-1">
            {hardwareStatus.esp32_2_connected ? (
              <span className="px-1.5 py-0.5 rounded-sm bg-instrument-green/20 text-instrument-green border border-instrument-green/40 text-[10px] font-bold">
                ● CONNECTED (115200)
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded-sm bg-instrument-red/20 text-instrument-red border border-instrument-red/40 text-[10px] font-bold">
                ● DISCONNECTED
              </span>
            )}
          </div>
        </div>

        {/* 16x2 LCD */}
        <div className="p-3 bg-instrument-bg rounded-sm border border-instrument-border space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-instrument-textMuted uppercase font-bold">16×2 LCD</span>
            <Tv className="w-3.5 h-3.5 text-instrument-purple" />
          </div>
          <span className="font-bold text-instrument-textBright block">LOCAL DISPLAY</span>
          <span className="text-[10px] text-instrument-textMuted block truncate">
            {lcdMessage ? `Msg: "${lcdMessage}"` : 'I²C Local Screen'}
          </span>
          <div className="pt-1">
            <span className="px-1.5 py-0.5 rounded-sm bg-instrument-bg text-[10px] font-bold text-instrument-textSubtle border border-instrument-border">
              {hardwareStatus.lcd_status}
            </span>
          </div>
        </div>

        {/* Laptop Dashboard */}
        <div className="p-3 bg-instrument-bg rounded-sm border border-instrument-border space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-instrument-textMuted uppercase font-bold">LAPTOP</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-instrument-green" />
          </div>
          <span className="font-bold text-instrument-textBright block">DASHBOARD UI</span>
          <span className="text-[10px] text-instrument-textMuted block">WebSerial Host</span>
          <div className="pt-1">
            <span className="px-1.5 py-0.5 rounded-sm bg-instrument-green/20 text-instrument-green border border-instrument-green/40 text-[10px] font-bold">
              ● {hardwareStatus.laptop_status}
            </span>
          </div>
        </div>
      </div>

      {/* Technical Connection Diagram */}
      <div className="p-3 bg-instrument-bg rounded-sm border border-instrument-border">
        <span className="text-[10px] text-instrument-textMuted uppercase tracking-wider block font-bold mb-2">
          ACTUAL PROTOTYPE CONNECTION DIAGRAM
        </span>

        <div className="flex flex-wrap items-center justify-between gap-2 text-center text-xs">
          <div className="p-2 bg-instrument-panel rounded-sm border border-instrument-border flex-1 min-w-[120px]">
            <span className="font-bold text-instrument-amber block text-[11px]">ESP32 #1</span>
            <span className="text-[9px] text-instrument-textMuted block">Test Signal Generator</span>
          </div>

          <div className="flex items-center text-instrument-blue px-1 font-bold text-[10px]">
            <span>UART / I²C / SPI</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>

          <div className="p-2 bg-instrument-panel rounded-sm border border-instrument-border flex-1 min-w-[120px]">
            <span className="font-bold text-instrument-blue block text-[11px]">ESP32 #2</span>
            <span className="text-[9px] text-instrument-textMuted block">AutoScope Analyzer</span>
          </div>

          <div className="flex items-center text-instrument-green px-1 font-bold text-[10px]">
            <span>USB Serial</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>

          <div className="p-2 bg-instrument-panel rounded-sm border border-instrument-border flex-1 min-w-[120px]">
            <span className="font-bold text-instrument-green block text-[11px]">LAPTOP</span>
            <span className="text-[9px] text-instrument-textMuted block">Dashboard Workstation</span>
          </div>
        </div>

        <div className="mt-2 text-[10px] text-instrument-textMuted pt-2 border-t border-instrument-border flex items-center justify-between">
          <span>ESP32 #2 I²C Bus $\rightarrow$ 16×2 Local LCD Display</span>
          {hardwareStatus.esp32_2_connected ? (
            <button
              onClick={onDisconnectSerial}
              className="text-instrument-red hover:underline font-bold"
            >
              Disconnect Serial
            </button>
          ) : (
            <button
              onClick={onConnectSerial}
              className="text-instrument-blue hover:underline font-bold"
            >
              Connect WebSerial USB
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
