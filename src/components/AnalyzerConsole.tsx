import React, { useState } from 'react';
import { Terminal, Trash2, Send } from 'lucide-react';

interface AnalyzerConsoleProps {
  logs: string[];
  onClearLogs: () => void;
  onSendCommand: (cmd: string) => void;
  isConnected: boolean;
}

export const AnalyzerConsole: React.FC<AnalyzerConsoleProps> = ({
  logs,
  onClearLogs,
  onSendCommand,
  isConnected,
}) => {
  const [commandInput, setCommandInput] = useState<string>('');

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim() || !isConnected) return;
    onSendCommand(commandInput.trim());
    setCommandInput('');
  };

  return (
    <div className="instrument-card p-3 font-mono text-xs flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-instrument-border pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-instrument-green" />
          <span className="font-bold text-instrument-textBright uppercase">
            HARDWARE SERIAL LOG & COMMAND CONSOLE
          </span>
        </div>
        <button
          onClick={onClearLogs}
          className="text-instrument-textMuted hover:text-instrument-red transition-colors p-1"
          title="Clear Serial Console"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Log Output Stream */}
      <div className="flex-1 bg-instrument-bg p-2.5 rounded-sm border border-instrument-border overflow-y-auto space-y-1 text-[11px] max-h-[220px] min-h-[120px]">
        {logs.length === 0 ? (
          <div className="text-instrument-textMuted italic">[No serial messages recorded]</div>
        ) : (
          logs.map((line, idx) => (
            <div key={idx} className="leading-relaxed font-mono">
              {line.includes('RX') ? (
                <span className="text-instrument-green">{line}</span>
              ) : line.includes('TX') ? (
                <span className="text-instrument-blue font-bold">{line}</span>
              ) : line.includes('SERIAL') ? (
                <span className="text-instrument-amber font-semibold">{line}</span>
              ) : (
                <span className="text-instrument-textSubtle">{line}</span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendCommand} className="mt-2 flex items-center space-x-2">
        <span className="text-instrument-blue font-bold">&gt;</span>
        <input
          type="text"
          placeholder={isConnected ? "Type Serial command (e.g. AUTODETECT, START, STOP)..." : "Serial disconnected..."}
          disabled={!isConnected}
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          className="flex-1 bg-instrument-bg px-2.5 py-1 rounded-sm border border-instrument-border text-instrument-textBright focus:border-instrument-blue focus:outline-none text-xs font-mono disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!isConnected || !commandInput.trim()}
          className={`px-3 py-1 font-bold rounded-sm text-xs flex items-center gap-1 transition-colors ${
            isConnected && commandInput.trim()
              ? 'bg-instrument-blue text-white hover:bg-sky-600'
              : 'bg-instrument-bg text-instrument-textMuted border border-instrument-border cursor-not-allowed opacity-50'
          }`}
        >
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
};
