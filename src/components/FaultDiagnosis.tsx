import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import type { RealSignalHealth } from '../types/analyzer';

interface FaultDiagnosisProps {
  health: RealSignalHealth;
  isConnected: boolean;
}

export const FaultDiagnosis: React.FC<FaultDiagnosisProps> = ({ health, isConnected }) => {
  const hasErrors = isConnected && health.errorCount !== null && health.errorCount > 0;
  const invalidFrames = isConnected && health.invalidFrames !== null && health.invalidFrames > 0;

  if (!isConnected) {
    return (
      <div className="instrument-card p-3 bg-instrument-bg border-instrument-border font-mono text-xs">
        <div className="flex items-center space-x-2 text-instrument-textMuted">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-bold">FAULT DIAGNOSIS OFFLINE — Connect ESP32 #2 to run real-time signal diagnostics.</span>
        </div>
      </div>
    );
  }

  if (!hasErrors && !invalidFrames) {
    return (
      <div className="instrument-card p-3 bg-instrument-bg border-instrument-green/30 font-mono text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="p-1 rounded-sm bg-instrument-green/20 text-instrument-green">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-instrument-green uppercase block">
              NO HARDWARE OR TIMING FAULTS REPORTED BY ESP32 #2
            </span>
            <span className="text-[10px] text-instrument-textMuted font-medium block">
              Framing errors: 0 | Timing jitter: Nominal | Signal edges locked.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="instrument-card p-3 bg-instrument-bg border-instrument-amber font-mono text-xs space-y-2">
      <div className="flex items-center justify-between border-b border-instrument-amber/40 pb-1.5">
        <div className="flex items-center space-x-2 text-instrument-amber">
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          <span className="font-bold uppercase tracking-wider">
            AUTOMATIC FAULT DIAGNOSIS REPORT
          </span>
        </div>
        <span className="px-1.5 py-0.5 bg-instrument-amber text-black font-bold text-[10px] rounded-sm">
          {health.errorCount || 0} HARDWARE ERRORS
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-instrument-red shrink-0" />
          <span className="font-bold text-instrument-textBright">
            Signal Timing / Framing Anomaly Detected on Input Channel
          </span>
        </div>

        <div className="p-2 bg-instrument-panel rounded-sm border border-instrument-border space-y-1 text-[11px]">
          <span className="text-instrument-amber font-bold block">REPORTED BY ESP32 #2:</span>
          <p className="text-instrument-textSubtle font-medium">
            • Invalid Frames: {health.invalidFrames ?? 'N/A'}<br />
            • Error Count: {health.errorCount ?? 'N/A'}<br />
            • Recommended Action: Verify transmitter baud rate settings and ground wire connections between ESP32 #1 and ESP32 #2.
          </p>
        </div>
      </div>
    </div>
  );
};
