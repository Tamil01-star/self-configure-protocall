import React, { useState } from 'react';
import { Terminal, Trash2, Send } from 'lucide-react';

interface AnalyzerConsoleProps {
  logs: string[];
  onClearLogs: () => void;
}

export const AnalyzerConsole: React.FC<AnalyzerConsoleProps> = ({ logs, onClearLogs }) => {
  const [commandInput, setCommandInput] = useState<string>('');
  const [customLogs, setCustomLogs] = useState<string[]>([]);

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    const cmd = commandInput.trim();
    setCustomLogs(prev => [...prev, `> ${cmd}`, `[AUTOSCOPE EXEC] Processing command: ${cmd}... OK`]);
    setCommandInput('');
  };

  const allLogs = [...logs, ...customLogs];

  return (
    <div className="instrument-card p-4 font-mono text-xs flex flex-col h-full bg-white border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-900 uppercase">
            AUTOSCOPE INSTRUMENT COMMAND CONSOLE
          </span>
        </div>
        <button
          onClick={() => { onClearLogs(); setCustomLogs([]); }}
          className="text-slate-400 hover:text-red-600 transition-all p-1"
          title="Clear Console Output"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 bg-slate-900 p-3 rounded border border-slate-800 overflow-y-auto space-y-1 text-[11px] max-h-[220px]">
        <div className="text-sky-400 font-bold">[AUTOSCOPE KERNEL v2.4 initialized]</div>
        {allLogs.map((line, idx) => (
          <div key={idx} className="text-slate-100 leading-relaxed font-mono">
            {line.startsWith('>') ? (
              <span className="text-sky-300 font-bold">{line}</span>
            ) : line.includes('PASS') || line.includes('complete') || line.includes('OK') ? (
              <span className="text-emerald-400 font-semibold">{line}</span>
            ) : line.includes('WARN') || line.includes('FAULT') ? (
              <span className="text-amber-400 font-semibold">{line}</span>
            ) : (
              <span className="text-slate-300">{line}</span>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSendCommand} className="mt-3 flex items-center space-x-2">
        <span className="text-sky-600 font-bold">&gt;</span>
        <input
          type="text"
          placeholder="Type command (e.g. set baud 115200, trigger edge ch1)..."
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          className="flex-1 bg-slate-50 px-3 py-1.5 rounded border border-slate-200 text-slate-900 focus:border-sky-600 focus:outline-none text-xs font-medium"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-sky-600 text-white font-bold rounded text-xs hover:bg-sky-700 transition-all shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
