import React from 'react';
import { Clock, Activity } from 'lucide-react';

interface EventTimelineProps {
  logs: string[];
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ logs }) => {
  return (
    <div className="instrument-card p-3 font-mono text-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between border-b border-instrument-border pb-2 mb-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-instrument-blue" />
            <span className="font-bold text-instrument-textBright uppercase">
              CHRONOLOGICAL SESSION EVENT TIMELINE
            </span>
          </div>
          <span className="text-[10px] text-instrument-textMuted font-semibold">
            HARDWARE EVENT LOG
          </span>
        </div>

        <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
          {logs.length === 0 ? (
            <div className="text-instrument-textMuted italic text-[11px] p-2">
              No session events logged yet. Connect ESP32 #2 to begin.
            </div>
          ) : (
            logs.map((log, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2 p-1.5 bg-instrument-bg rounded-sm border border-instrument-border text-[11px]"
              >
                <Activity className="w-3 h-3 text-instrument-blue shrink-0 mt-0.5" />
                <span className="text-instrument-textBright font-medium break-all">{log}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-2 pt-1 border-t border-instrument-border text-[10px] text-instrument-textMuted flex justify-between font-semibold">
        <span>Logged Events: <strong className="text-instrument-textBright">{logs.length}</strong></span>
        <span>Host: <strong className="text-instrument-blue">WebSerial Port</strong></span>
      </div>
    </div>
  );
};
