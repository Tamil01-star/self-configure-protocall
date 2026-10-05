import React from 'react';
import { Clock, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import type { TimelineEvent } from '../types/analyzer';

interface EventTimelineProps {
  events: TimelineEvent[];
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ events }) => {
  return (
    <div className="instrument-card p-4">
      <div className="flex items-center justify-between border-b border-instrument-border pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-instrument-cyan" />
          <span className="text-xs font-mono font-bold text-instrument-textBright uppercase">
            CHRONOLOGICAL SIGNAL EVENT TIMELINE
          </span>
        </div>
        <span className="text-[10px] font-mono text-instrument-textMuted">
          PRECISION DEBUG LOG
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs max-h-[220px] overflow-y-auto pr-1">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="flex items-start space-x-3 p-2 bg-instrument-bg rounded border border-instrument-border hover:border-instrument-borderHighlight transition-all"
          >
            <span className="text-instrument-cyan font-bold text-[11px] shrink-0">
              [{evt.formattedTime}]
            </span>
            <div className="flex-1 flex items-center justify-between">
              <span className="text-instrument-textBright">{evt.message}</span>
              {evt.type === 'success' && <CheckCircle className="w-3.5 h-3.5 text-instrument-green shrink-0 ml-2" />}
              {evt.type === 'info' && <Activity className="w-3.5 h-3.5 text-instrument-cyan shrink-0 ml-2" />}
              {evt.type === 'warning' && <AlertCircle className="w-3.5 h-3.5 text-instrument-amber shrink-0 ml-2" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
