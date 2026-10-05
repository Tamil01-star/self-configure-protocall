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
    <div className="instrument-card p-4 font-mono text-xs flex flex-col h-full bg-instrument-bg border-instrument-border">
      <div className="flex items-center justify-between border-b border-instrument-border pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-instrument-green" />
          <span className="text-xs font-bold text-instrument-textBright uppercase">
            AUTOSCOPE INSTRUMENT COMMAND CONSOLE
          </span>
        </div>
        <button
          onClick={() => { onClearLogs(); setCustomLogs([]); }}
          className="text-instrument-textMuted hover:text-instrument-red transition-all p-1"
          title="Clear Console Output"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 bg-black/80 p-3 rounded border border-instrument-border overflow-y-auto space-y-1 text-[11px] max-h-[220px]">
        <div className="text-instrument-cyan font-bold">[AUTOSCOPE KERNEL v2.4 initialized]</div>
        {allLogs.map((line, idx) => (
          <div key={idx} className="text-instrument-textBright leading-relaxed">
            {line.startsWith('>') ? (
              <span className="text-instrument-cyan font-bold">{line}</span>
            ) : line.includes('PASS') || line.includes('complete') || line.includes('OK') ? (
              <span className="text-instrument-green">{line}</span>
            ) : line.includes('WARN') || line.includes('FAULT') ? (
              <span className="text-instrument-amber">{line}</span>
            ) : (
              <span className="text-instrument-textSubtle">{line}</span>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSendCommand} className="mt-3 flex items-center space-x-2">
        <span className="text-instrument-cyan font-bold">&gt;</span>
        <input
          type="text"
          placeholder="Type command (e.g. set baud 115200, trigger edge ch1)..."
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          className="flex-1 bg-instrument-panel px-3 py-1.5 rounded border border-instrument-border text-instrument-textBright focus:border-instrument-cyan focus:outline-none text-xs"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-instrument-cyan text-black font-bold rounded text-xs hover:bg-cyan-300 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
