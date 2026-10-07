import React from 'react';
import { Cpu } from 'lucide-react';
import type { DigitalChannelSample, ProtocolType, RealProtocolParameters } from '../types/analyzer';

interface ChannelParameterBreakdownProps {
  channels: DigitalChannelSample[];
  protocol: ProtocolType | null;
  parameters: RealProtocolParameters;
  isConnected: boolean;
}

/** Returns true only if the channel has real hardware bit transitions */
function hasRealSignal(ch: DigitalChannelSample | undefined): boolean {
  if (!ch || !Array.isArray(ch.data) || ch.data.length === 0) return false;
  const first = ch.data[0];
  return ch.data.some(v => v !== first);
}

export const ChannelParameterBreakdown: React.FC<ChannelParameterBreakdownProps> = ({
  channels,
  protocol,
  parameters,
  isConnected,
}) => {
  // Physical ESP32 #2 hardware pin map (7 input channels)
  const channelHardwareMap = [
    { id: 'CH1', gpio: 'GPIO 4',  defaultRole: 'CH1 — General Input' },
    { id: 'CH2', gpio: 'GPIO 13', defaultRole: 'CH2 — General Input' },
    { id: 'CH3', gpio: 'GPIO 14', defaultRole: 'CH3 — General Input' },
    { id: 'CH4', gpio: 'GPIO 25', defaultRole: 'CH4 — General Input' },
    { id: 'CH5', gpio: 'GPIO 26', defaultRole: 'CH5 — General Input' },
    { id: 'CH6', gpio: 'GPIO 27', defaultRole: 'CH6 — General Input' },
    { id: 'CH7', gpio: 'GPIO 15', defaultRole: 'CH7 — General Input' },
  ];

  const getChannelMetrics = (idx: number) => {
    const hw = channelHardwareMap[idx];
    const chSample = channels[idx];
    const realSignal = isConnected && hasRealSignal(chSample);

    // ── Role (Protocol-assigned label from hardware only) ─────────────────
    let role = hw.defaultRole;
    if (chSample?.assignedLabel && chSample.assignedLabel !== hw.id) {
      role = chSample.assignedLabel; // real label from ESP32 JSON
    } else if (protocol === 'UART' && idx === 0) {
      role = 'CH1 — UART DATA (TX / RX)';
    } else if (protocol === 'I2C') {
      if (idx === 0) role = 'CH1 — I²C SDA (Serial Data)';
      if (idx === 1) role = 'CH2 — I²C SCL (Serial Clock)';
    } else if (protocol === 'SPI') {
      if (idx === 0) role = 'CH1 — SPI SCLK (Clock)';
      if (idx === 1) role = 'CH2 — SPI MOSI';
      if (idx === 2) role = 'CH3 — SPI MISO';
      if (idx === 3) role = 'CH4 — SPI CS';
    } else if (protocol === 'RS485' || protocol === 'RS232') {
      if (idx === 0) role = 'CH1 — RS-485/232 DATA A';
      if (idx === 1) role = 'CH2 — RS-485/232 DATA B';
    } else if (protocol === 'CAN') {
      if (idx === 0) role = 'CH1 — CAN-H';
      if (idx === 1) role = 'CH2 — CAN-L';
    } else if (protocol === 'LIN') {
      if (idx === 0) role = 'CH1 — LIN BUS';
    }

    // ── Signal Data from real hardware bits only ──────────────────────────
    const data = chSample?.data ?? [];
    const totalBits = data.length;
    const highBits = data.filter(b => b === 1).length;

    // a. Logic Voltage State — derived from real bits
    let logicState = 'N/A';
    if (realSignal && totalBits > 0) {
      const lastBit = data[data.length - 1];
      logicState = lastBit === 1 ? 'HIGH (3.3V)' : 'LOW (0.0V)';
    } else if (isConnected) {
      logicState = 'IDLE (No Signal)';
    }

    // b. Frequency — only from real hardware parameters
    let frequency = 'N/A';
    if (realSignal) {
      if (protocol === 'UART' && idx === 0 && parameters.baudRate) {
        frequency = `${(parameters.baudRate / 1000).toFixed(2)} kHz`;
      } else if (protocol === 'I2C' && idx <= 1 && parameters.clockHz) {
        frequency = `${(parameters.clockHz / 1000).toFixed(2)} kHz`;
      } else if (protocol === 'SPI' && idx <= 3 && parameters.clockHzSpi) {
        frequency = `${(parameters.clockHzSpi / 1_000_000).toFixed(3)} MHz`;
      } else if ((protocol === 'RS232' || protocol === 'RS485') && parameters.baudRate) {
        frequency = `${(parameters.baudRate / 1000).toFixed(2)} kHz`;
      } else if (protocol === 'CAN' && parameters.canBitRate) {
        frequency = `${(parameters.canBitRate / 1000).toFixed(0)} kbps`;
      }
    }

    // c. Bit Period — only from real hardware parameters
    let bitPeriod = 'N/A';
    if (realSignal && parameters.bitPeriodUs) {
      bitPeriod = `${parameters.bitPeriodUs.toFixed(2)} μs`;
    } else if (realSignal && protocol === 'I2C' && parameters.clockHz) {
      bitPeriod = `${(1_000_000 / parameters.clockHz).toFixed(2)} μs`;
    } else if (realSignal && protocol === 'UART' && parameters.baudRate) {
      bitPeriod = `${(1_000_000 / parameters.baudRate).toFixed(2)} μs`;
    }

    // d. Duty Cycle — computed from real bit data
    let dutyCycle = 'N/A';
    if (realSignal && totalBits > 0) {
      dutyCycle = `${((highBits / totalBits) * 100).toFixed(1)}%`;
    }

    // e. Transition / Edge count from real bit data
    let edgeDensity = 'N/A';
    if (realSignal && totalBits > 1) {
      let transitions = 0;
      for (let i = 1; i < data.length; i++) {
        if (data[i] !== data[i - 1]) transitions++;
      }
      edgeDensity = `${transitions} edges / ${totalBits} bits`;
    }

    // f. Stability — N/A unless ESP32 sends it in health block
    const stability = 'N/A';

    return {
      id: hw.id,
      gpio: hw.gpio,
      role,
      frequency,
      bitPeriod,
      logicState,
      dutyCycle,
      edgeDensity,
      stability,
      active: realSignal,
    };
  };

  return (
    <div className="instrument-card p-3 font-sans text-xs select-none">
      <div className="flex flex-wrap items-center justify-between border-b border-instrument-border pb-2 mb-3 gap-2">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-instrument-blue" />
          <span className="font-bold text-instrument-textBright uppercase tracking-wider text-xs">
            SIGNAL ENGINEER CHANNEL-WISE PARAMETER BREAKDOWN (CH1 – CH7)
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="px-2 py-0.5 bg-instrument-bg text-instrument-textSubtle rounded border border-instrument-border font-mono">
            ESP32 #2 HARDWARE MAP
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2.5">
        {channelHardwareMap.map((hw, idx) => {
          const metrics = getChannelMetrics(idx);

          return (
            <div
              key={hw.id}
              className={`p-2.5 rounded-sm border flex flex-col justify-between transition-all ${
                metrics.active
                  ? 'bg-white border-instrument-blue shadow-sm'
                  : 'bg-instrument-bg border-instrument-border opacity-75'
              }`}
            >
              {/* Channel Header */}
              <div className="flex items-center justify-between border-b border-instrument-border/60 pb-1.5 mb-2">
                <div className="flex items-center space-x-1.5">
                  <span className="px-1.5 py-0.5 bg-instrument-blue text-white rounded font-mono font-bold text-[10px]">
                    {metrics.id}
                  </span>
                  <span className="font-mono font-bold text-[11px] text-instrument-textBright">
                    {metrics.gpio}
                  </span>
                </div>
                <span className={`w-2 h-2 rounded-full ${metrics.active ? 'bg-instrument-green animate-led' : 'bg-slate-300'}`} />
              </div>

              {/* Role Label */}
              <div className="text-[10px] font-bold text-instrument-blue mb-2 truncate" title={metrics.role}>
                {metrics.role}
              </div>

              {/* Parameters — real values only, N/A when not available */}
              <div className="space-y-1 text-[10px] font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-instrument-textMuted">a. State:</span>
                  <span className={`font-bold ${metrics.active ? 'text-instrument-green' : 'text-instrument-textMuted'}`}>
                    {metrics.logicState}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-instrument-textMuted">b. Freq:</span>
                  <span className={`font-bold ${metrics.frequency !== 'N/A' ? 'text-instrument-textBright' : 'text-instrument-textMuted'}`}>
                    {metrics.frequency}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-instrument-textMuted">c. Period:</span>
                  <span className={`font-bold ${metrics.bitPeriod !== 'N/A' ? 'text-instrument-blue' : 'text-instrument-textMuted'}`}>
                    {metrics.bitPeriod}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-instrument-textMuted">d. Duty:</span>
                  <span className={`font-bold ${metrics.dutyCycle !== 'N/A' ? 'text-instrument-textSubtle' : 'text-instrument-textMuted'}`}>
                    {metrics.dutyCycle}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-instrument-textMuted">e. Edges:</span>
                  <span className={`font-bold truncate max-w-[80px] ${metrics.edgeDensity !== 'N/A' ? 'text-instrument-purple' : 'text-instrument-textMuted'}`}
                    title={metrics.edgeDensity}>
                    {metrics.edgeDensity}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-instrument-textMuted">f. Jitter:</span>
                  <span className="font-bold text-instrument-textMuted">
                    {metrics.stability}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
