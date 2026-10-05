import React from 'react';
import { Clock, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import type { TimelineEvent } from '../types/analyzer';

interface EventTimelineProps {
  events: TimelineEvent[];
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ events }) => {
  return (
    <div className="instrument-card p-4 bg-white border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-mono font-bold text-slate-900 uppercase">
            CHRONOLOGICAL SIGNAL EVENT TIMELINE
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 font-semibold">
          PRECISION DEBUG LOG
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs max-h-[220px] overflow-y-auto pr-1">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="flex items-start space-x-3 p-2 bg-slate-50 rounded border border-slate-200 hover:border-slate-300 transition-all"
          >
            <span className="text-sky-700 font-bold text-[11px] shrink-0">
              [{evt.formattedTime}]
            </span>
            <div className="flex-1 flex items-center justify-between">
              <span className="text-slate-900 font-medium">{evt.message}</span>
              {evt.type === 'success' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />}
              {evt.type === 'info' && <Activity className="w-3.5 h-3.5 text-sky-600 shrink-0 ml-2" />}
              {evt.type === 'warning' && <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-2" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
