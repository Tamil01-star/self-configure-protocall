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
      return <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">✓ {status}</span>;
    }
    if (status === 'START') {
      return <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-50 text-sky-700 border border-sky-200 font-bold">⚡ START</span>;
    }
    if (status === 'STOP') {
      return <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-50 text-purple-700 border border-purple-200 font-bold">⏹ STOP</span>;
    }
    return <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-50 text-red-700 border border-red-200 font-bold">⚠ {status}</span>;
  };

  return (
    <div className="instrument-card flex flex-col h-full select-none overflow-hidden bg-white border border-slate-200 shadow-sm">
      {/* Table Header & Controls */}
      <div className="instrument-card-header px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 bg-slate-50 border-b border-slate-200">
        {/* Left Title & Mode Tabs */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <Table className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-mono font-bold text-slate-900 uppercase">
              DECODED PROTOCOL STREAM
            </span>
          </div>

          <div className="flex items-center bg-white p-0.5 rounded border border-slate-200 text-[11px] font-mono shadow-sm">
            {(['HEX', 'ASCII', 'DECIMAL', 'BINARY'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2 py-0.5 rounded transition-all ${
                  activeTab === tab
                    ? 'bg-sky-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
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
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter HEX / ASCII..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-white text-slate-900 border border-slate-200 rounded text-xs font-mono focus:border-sky-600 focus:outline-none w-36 md:w-48 shadow-sm"
            />
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-2 py-1 rounded text-xs font-mono border flex items-center gap-1 font-semibold ${
              isPaused ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            <span>{isPaused ? 'RESUME' : 'FREEZE'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-2 py-1 bg-white text-slate-700 hover:text-slate-900 rounded border border-slate-200 text-xs font-mono flex items-center gap-1 font-semibold shadow-sm"
            title="Copy Raw Hex to Clipboard"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'COPIED' : 'HEX'}</span>
          </button>

          <button
            onClick={onExportCsv}
            className="px-2 py-1 bg-white text-slate-700 hover:text-slate-900 rounded border border-slate-200 text-xs font-mono flex items-center gap-1 font-semibold shadow-sm"
            title="Export CSV"
          >
            <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
            <span>CSV</span>
          </button>

          <button
            onClick={onExportJson}
            className="px-2 py-1 bg-white text-slate-700 hover:text-slate-900 rounded border border-slate-200 text-xs font-mono flex items-center gap-1 font-semibold shadow-sm"
            title="Export JSON"
          >
            <FileCode className="w-3 h-3 text-sky-600" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="flex-1 overflow-auto bg-white max-h-[380px]">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-[11px] text-slate-500 uppercase z-10 font-bold">
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
          <tbody className="divide-y divide-slate-200">
            {filteredRows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                {protocol === 'I2C' ? (
                  <>
                    <td className="py-1.5 px-3 text-slate-500 font-medium">{row.timeMs.toFixed(3)}</td>
                    <td className="py-1.5 px-3 font-bold text-sky-700">{row.addressHex || '0x27'}</td>
                    <td className="py-1.5 px-3 font-bold text-amber-600">{row.rw || 'W'}</td>
                    <td className="py-1.5 px-3 font-bold text-slate-900">{row.hex}</td>
                    <td className="py-1.5 px-3 font-bold text-emerald-600">{row.ascii}</td>
                    <td className="py-1.5 px-3">{getStatusBadge(row.status)}</td>
                  </>
                ) : protocol === 'SPI' ? (
                  <>
                    <td className="py-1.5 px-3 text-slate-500 font-medium">{row.timeMs.toFixed(3)}</td>
                    <td className="py-1.5 px-3 font-bold text-sky-700">{row.mosiHex || row.hex}</td>
                    <td className="py-1.5 px-3 font-bold text-emerald-600">{row.misoHex || '0xFF'}</td>
                    <td className="py-1.5 px-3 font-bold text-purple-700">{row.csState || 'LOW'}</td>
                    <td className="py-1.5 px-3">{getStatusBadge(row.status)}</td>
                  </>
                ) : (
                  <>
                    <td className="py-1.5 px-3 text-slate-500 font-medium">{row.timeMs.toFixed(3)}</td>
                    <td className="py-1.5 px-3 font-bold text-sky-700">{row.channel}</td>
                    <td className="py-1.5 px-3 font-bold text-slate-900">{row.hex}</td>
                    <td className="py-1.5 px-3 text-slate-500">{row.dec}</td>
                    <td className="py-1.5 px-3 font-bold text-emerald-600">{row.ascii}</td>
                    <td className="py-1.5 px-3 text-slate-500 text-[10px]">{row.binary}</td>
                    <td className="py-1.5 px-3">{getStatusBadge(row.status)}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-50 px-4 py-1.5 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex justify-between font-semibold">
        <span>Decoded Packets: <strong className="text-slate-900">{filteredRows.length}</strong></span>
        <span>Format: <strong className="text-sky-700">{activeTab} Stream</strong></span>
      </div>
    </div>
  );
};
