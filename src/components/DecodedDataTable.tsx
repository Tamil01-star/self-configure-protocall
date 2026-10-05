import React, { useState } from 'react';
import { 
  Table, 
  Search, 
  Copy, 
  Check, 
  Pause, 
  Play, 
  FileSpreadsheet, 
  FileCode 
} from 'lucide-react';
import type { DecodedRow, ProtocolType } from '../types/analyzer';

interface DecodedDataTableProps {
  rows: DecodedRow[];
  protocol: ProtocolType;
  onExportCsv: () => void;
  onExportJson: () => void;
  onCopyHex: () => void;
}

export const DecodedDataTable: React.FC<DecodedDataTableProps> = ({
  rows,
  protocol,
  onExportCsv,
  onExportJson,
  onCopyHex,
}) => {
  const [activeTab, setActiveTab] = useState<'HEX' | 'ASCII' | 'DECIMAL' | 'BINARY'>('HEX');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const filteredRows = rows.filter((row) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      row.hex.toLowerCase().includes(query) ||
      row.ascii.toLowerCase().includes(query) ||
      row.binary.includes(query) ||
      row.channel.toLowerCase().includes(query) ||
      (row.addressHex && row.addressHex.toLowerCase().includes(query))
    );
  });

  const handleCopy = () => {
    onCopyHex();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'OK' || status === 'ACK') {
      return <span className="px-1.5 py-0.5 rounded text-[10px] bg-instrument-greenDim text-instrument-green border border-instrument-green/30">✓ {status}</span>;
    }
    if (status === 'START') {
      return <span className="px-1.5 py-0.5 rounded text-[10px] bg-instrument-cyanDim text-instrument-cyan border border-instrument-cyan/30">⚡ START</span>;
    }
    if (status === 'STOP') {
      return <span className="px-1.5 py-0.5 rounded text-[10px] bg-instrument-purpleDim text-instrument-purple border border-instrument-purple/30">⏹ STOP</span>;
    }
    return <span className="px-1.5 py-0.5 rounded text-[10px] bg-instrument-redDim text-instrument-red border border-instrument-red/30">⚠ {status}</span>;
  };

  return (
    <div className="instrument-card flex flex-col h-full select-none overflow-hidden">
      {/* Table Header & Controls */}
      <div className="instrument-card-header px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left Title & Mode Tabs */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <Table className="w-4 h-4 text-instrument-cyan" />
            <span className="text-xs font-mono font-bold text-instrument-textBright uppercase">
              DECODED PROTOCOL STREAM
            </span>
          </div>

          <div className="flex items-center bg-instrument-bg p-0.5 rounded border border-instrument-border text-[11px] font-mono">
            {(['HEX', 'ASCII', 'DECIMAL', 'BINARY'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2 py-0.5 rounded transition-all ${
                  activeTab === tab
                    ? 'bg-instrument-cyan text-black font-bold shadow-cyan-glow'
                    : 'text-instrument-textMuted hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Right Actions: Search & Export */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-instrument-textMuted" />
            <input
              type="text"
              placeholder="Filter HEX / ASCII..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-instrument-bg text-instrument-textBright border border-instrument-border rounded text-xs font-mono focus:border-instrument-cyan focus:outline-none w-36 md:w-48"
            />
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-2 py-1 rounded text-xs font-mono border flex items-center gap-1 ${
              isPaused ? 'bg-instrument-amberDim text-instrument-amber border-instrument-amber/40' : 'bg-instrument-bg text-instrument-textMuted border-instrument-border'
            }`}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            <span>{isPaused ? 'RESUME' : 'FREEZE'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-2 py-1 bg-instrument-bg text-instrument-textSubtle hover:text-white rounded border border-instrument-border text-xs font-mono flex items-center gap-1"
            title="Copy Raw Hex to Clipboard"
          >
            {copied ? <Check className="w-3 h-3 text-instrument-green" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'COPIED' : 'HEX'}</span>
          </button>

          <button
            onClick={onExportCsv}
            className="px-2 py-1 bg-instrument-bg text-instrument-textSubtle hover:text-white rounded border border-instrument-border text-xs font-mono flex items-center gap-1"
            title="Export CSV"
          >
            <FileSpreadsheet className="w-3 h-3 text-instrument-green" />
            <span>CSV</span>
          </button>

          <button
            onClick={onExportJson}
            className="px-2 py-1 bg-instrument-bg text-instrument-textSubtle hover:text-white rounded border border-instrument-border text-xs font-mono flex items-center gap-1"
            title="Export JSON"
          >
            <FileCode className="w-3 h-3 text-instrument-cyan" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="flex-1 overflow-auto bg-instrument-bg max-h-[380px]">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead className="sticky top-0 bg-instrument-panel border-b border-instrument-border text-[11px] text-instrument-textMuted uppercase z-10">
            {protocol === 'I2C' ? (
              <tr>
                <th className="py-2 px-3">TIME (ms)</th>
                <th className="py-2 px-3">SLAVE ADDR</th>
                <th className="py-2 px-3">R/W</th>
                <th className="py-2 px-3">DATA (HEX)</th>
                <th className="py-2 px-3">ASCII</th>
                <th className="py-2 px-3">ACK STATE</th>
              </tr>
            ) : protocol === 'SPI' ? (
              <tr>
                <th className="py-2 px-3">TIME (ms)</th>
                <th className="py-2 px-3">MOSI (HEX)</th>
                <th className="py-2 px-3">MISO (HEX)</th>
                <th className="py-2 px-3">CS STATE</th>
                <th className="py-2 px-3">STATUS</th>
              </tr>
            ) : (
              <tr>
                <th className="py-2 px-3">TIME (ms)</th>
                <th className="py-2 px-3">CHANNEL</th>
                <th className="py-2 px-3">HEX</th>
                <th className="py-2 px-3">DEC</th>
                <th className="py-2 px-3">ASCII</th>
                <th className="py-2 px-3">BINARY</th>
                <th className="py-2 px-3">STATUS</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-instrument-border/40">
            {filteredRows.map((row) => (
              <tr key={row.id} className="hover:bg-instrument-panel/50 transition-colors">
                {protocol === 'I2C' ? (
                  <>
                    <td className="py-1.5 px-3 text-instrument-textMuted">{row.timeMs.toFixed(3)}</td>
                    <td className="py-1.5 px-3 font-bold text-instrument-cyan">{row.addressHex || '0x27'}</td>
                    <td className="py-1.5 px-3 text-instrument-amber">{row.rw || 'W'}</td>
                    <td className="py-1.5 px-3 font-bold text-white">{row.hex}</td>
                    <td className="py-1.5 px-3 text-instrument-green">{row.ascii}</td>
                    <td className="py-1.5 px-3">{getStatusBadge(row.status)}</td>
                  </>
                ) : protocol === 'SPI' ? (
                  <>
                    <td className="py-1.5 px-3 text-instrument-textMuted">{row.timeMs.toFixed(3)}</td>
                    <td className="py-1.5 px-3 font-bold text-instrument-cyan">{row.mosiHex || row.hex}</td>
                    <td className="py-1.5 px-3 font-bold text-instrument-green">{row.misoHex || '0xFF'}</td>
                    <td className="py-1.5 px-3 text-instrument-purple">{row.csState || 'LOW'}</td>
                    <td className="py-1.5 px-3">{getStatusBadge(row.status)}</td>
                  </>
                ) : (
                  <>
                    <td className="py-1.5 px-3 text-instrument-textMuted">{row.timeMs.toFixed(3)}</td>
                    <td className="py-1.5 px-3 text-instrument-cyan">{row.channel}</td>
                    <td className="py-1.5 px-3 font-bold text-white">{row.hex}</td>
                    <td className="py-1.5 px-3 text-instrument-textMuted">{row.dec}</td>
                    <td className="py-1.5 px-3 font-bold text-instrument-green">{row.ascii}</td>
                    <td className="py-1.5 px-3 text-instrument-textMuted text-[10px]">{row.binary}</td>
                    <td className="py-1.5 px-3">{getStatusBadge(row.status)}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="bg-instrument-panel px-4 py-1.5 border-t border-instrument-border text-[11px] font-mono text-instrument-textMuted flex justify-between">
        <span>Decoded Packets: <strong className="text-instrument-textBright">{filteredRows.length}</strong></span>
        <span>Format: <strong className="text-instrument-cyan">{activeTab} Stream</strong></span>
      </div>
    </div>
  );
};
