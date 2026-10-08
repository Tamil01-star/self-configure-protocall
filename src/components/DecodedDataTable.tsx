import React, { useState } from 'react';
import { Table, Search, Copy, Check, FileSpreadsheet, FileCode, AlertCircle } from 'lucide-react';
import type { RealDecodedRow, ProtocolType } from '../types/analyzer';

interface DecodedDataTableProps {
  rows: RealDecodedRow[];
  protocol: ProtocolType | null;
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const filteredRows = rows.filter((row) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      row.hex.toLowerCase().includes(q) ||
      row.ascii.toLowerCase().includes(q) ||
      row.channel.toLowerCase().includes(q)
    );
  });

  const handleCopy = () => {
    onCopyHex();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fullText = rows
    .map((r) => r.ascii)
    .filter((a) => a && a !== '?' && a !== '.')
    .join('');

  return (
    <div className="instrument-card flex flex-col h-full select-none overflow-hidden font-mono text-xs">
      {/* Header Controls */}
      <div className="instrument-card-header px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Table className="w-3.5 h-3.5 text-instrument-blue" />
          <span className="font-bold text-instrument-textBright uppercase">
            REAL DECODED DATA STREAM
          </span>
          <span className="px-1.5 py-0.2 bg-instrument-bg text-[10px] text-instrument-textMuted rounded-sm border border-instrument-border font-semibold">
            {rows.length} PACKETS
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2 top-2 text-instrument-textMuted" />
            <input
              type="text"
              placeholder="Search stream..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-2 py-0.5 bg-instrument-bg text-instrument-textBright border border-instrument-border rounded-sm text-xs font-mono focus:border-instrument-blue focus:outline-none w-36"
            />
          </div>

          <button
            onClick={handleCopy}
            disabled={rows.length === 0}
            className={`px-2 py-0.5 rounded-sm border text-[11px] font-bold flex items-center gap-1 ${
              rows.length > 0 
                ? 'bg-instrument-bg text-instrument-textSubtle hover:text-instrument-textBright border-instrument-border' 
                : 'bg-instrument-bg text-instrument-textMuted border-instrument-border opacity-50 cursor-not-allowed'
            }`}
          >
            {copied ? <Check className="w-3 h-3 text-instrument-green" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </button>

          <button
            onClick={onExportCsv}
            disabled={rows.length === 0}
            className={`px-2 py-0.5 rounded-sm border text-[11px] font-bold flex items-center gap-1 ${
              rows.length > 0 
                ? 'bg-instrument-bg text-instrument-textSubtle hover:text-instrument-textBright border-instrument-border' 
                : 'bg-instrument-bg text-instrument-textMuted border-instrument-border opacity-50 cursor-not-allowed'
            }`}
          >
            <FileSpreadsheet className="w-3 h-3 text-instrument-green" /> CSV
          </button>

          <button
            onClick={onExportJson}
            disabled={rows.length === 0}
            className={`px-2 py-0.5 rounded-sm border text-[11px] font-bold flex items-center gap-1 ${
              rows.length > 0 
                ? 'bg-instrument-bg text-instrument-textSubtle hover:text-instrument-textBright border-instrument-border' 
                : 'bg-instrument-bg text-instrument-textMuted border-instrument-border opacity-50 cursor-not-allowed'
            }`}
          >
            <FileCode className="w-3 h-3 text-instrument-blue" /> JSON
          </button>
        </div>
      </div>

      {/* Prominent Assembled Decoded ASCII Message Banner */}
      {fullText && (
        <div className="bg-instrument-panel/90 border-b border-instrument-border px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold text-instrument-textMuted tracking-wider">
              DECODED ASCII OUTPUT:
            </span>
            <span className="px-2.5 py-0.5 bg-instrument-green/20 text-instrument-green border border-instrument-green/40 rounded text-sm font-mono font-bold tracking-widest shadow-sm">
              "{fullText}"
            </span>
          </div>
          <span className="text-[10px] text-instrument-textMuted font-mono">
            {rows.length} BYTES (8N1)
          </span>
        </div>
      )}

      {/* Main Table Content */}
      <div className="flex-1 overflow-auto bg-instrument-bg max-h-[300px] min-h-[160px]">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-instrument-textMuted space-y-1">
            <AlertCircle className="w-4 h-4 opacity-60" />
            <span className="font-bold text-xs">WAITING FOR DECODED DATA</span>
            <span className="text-[10px]">No real packet telemetry received from ESP32 #2 logic analyzer yet.</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-instrument-panelHeader border-b border-instrument-border text-[10px] text-instrument-textMuted uppercase font-bold z-10">
              {protocol === 'I2C' ? (
                <tr>
                  <th className="py-1.5 px-3">TIME (ms)</th>
                  <th className="py-1.5 px-3">ADDRESS</th>
                  <th className="py-1.5 px-3">R/W</th>
                  <th className="py-1.5 px-3">DATA (HEX)</th>
                  <th className="py-1.5 px-3">ASCII</th>
                  <th className="py-1.5 px-3">ACK</th>
                </tr>
              ) : protocol === 'SPI' ? (
                <tr>
                  <th className="py-1.5 px-3">TIME (ms)</th>
                  <th className="py-1.5 px-3">MOSI (HEX)</th>
                  <th className="py-1.5 px-3">MISO (HEX)</th>
                  <th className="py-1.5 px-3">CS</th>
                  <th className="py-1.5 px-3">STATUS</th>
                </tr>
              ) : (
                <tr>
                  <th className="py-1.5 px-3">TIME (ms)</th>
                  <th className="py-1.5 px-3">CHANNEL</th>
                  <th className="py-1.5 px-3">HEX</th>
                  <th className="py-1.5 px-3">DEC</th>
                  <th className="py-1.5 px-3">ASCII</th>
                  <th className="py-1.5 px-3">STATUS</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-instrument-border/40">
              {filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-instrument-panel/50 transition-colors">
                  {protocol === 'I2C' ? (
                    <>
                      <td className="py-1 px-3 text-instrument-textMuted">{row.timeMs.toFixed(3)}</td>
                      <td className="py-1 px-3 font-bold text-instrument-blue">{row.addressHex || '—'}</td>
                      <td className="py-1 px-3 text-instrument-amber">{row.rw || '—'}</td>
                      <td className="py-1 px-3 font-bold text-instrument-textBright">{row.hex}</td>
                      <td className="py-1 px-3 text-instrument-green font-bold">{row.ascii}</td>
                      <td className="py-1 px-3 text-instrument-textSubtle">{row.ack !== undefined ? (row.ack ? 'ACK' : 'NACK') : '—'}</td>
                    </>
                  ) : protocol === 'SPI' ? (
                    <>
                      <td className="py-1 px-3 text-instrument-textMuted">{row.timeMs.toFixed(3)}</td>
                      <td className="py-1 px-3 font-bold text-instrument-blue">{row.mosiHex || row.hex}</td>
                      <td className="py-1 px-3 font-bold text-instrument-green">{row.misoHex || '—'}</td>
                      <td className="py-1 px-3 text-instrument-purple">{row.csState || 'LOW'}</td>
                      <td className="py-1 px-3 text-instrument-textSubtle">{row.status}</td>
                    </>
                  ) : (
                    <>
                      <td className="py-1 px-3 text-instrument-textMuted">{row.timeMs.toFixed(3)}</td>
                      <td className="py-1 px-3 font-bold text-instrument-blue">{row.channel}</td>
                      <td className="py-1 px-3 font-bold text-instrument-textBright">{row.hex}</td>
                      <td className="py-1 px-3 text-instrument-textMuted">{row.dec}</td>
                      <td className="py-1 px-3 font-bold text-instrument-green">{row.ascii}</td>
                      <td className="py-1 px-3 text-instrument-textSubtle">{row.status}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-instrument-panel px-3 py-1 border-t border-instrument-border text-[10px] text-instrument-textMuted flex justify-between font-semibold">
        <span>Decoded Data Packets: <strong className="text-instrument-textBright">{filteredRows.length}</strong></span>
        <span>Decoder Engine: <strong className="text-instrument-blue">{protocol || 'IDLE'}</strong></span>
      </div>
    </div>
  );
};
