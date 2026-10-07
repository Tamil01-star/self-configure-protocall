import React from 'react';
import { ArrowLeft, Activity } from 'lucide-react';
import { WaveformViewer } from './WaveformViewer';
import { DecodedDataTable } from './DecodedDataTable';
import { ParameterPanel } from './ParameterPanel';
import type { 
  DigitalChannelSample, 
  ProtocolType, 
  RealProtocolParameters, 
  RealDecodedRow 
} from '../types/analyzer';

interface ChannelDetailProps {
  channelId: string;
  channels: DigitalChannelSample[];
  protocol: ProtocolType | null;
  parameters: RealProtocolParameters;
  decodedRows: RealDecodedRow[];
  isConnected: boolean;
  onBack: () => void;
  onExportCsv: () => void;
  onExportJson: () => void;
  onCopyHex: () => void;
}

export const ChannelDetail: React.FC<ChannelDetailProps> = ({
  channelId,
  channels,
  protocol,
  parameters,
  decodedRows,
  isConnected,
  onBack,
  onExportCsv,
  onExportJson,
  onCopyHex,
}) => {
  return (
    <div className="flex flex-col h-full space-y-4 p-4 font-sans animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header & Back Button */}
      <div className="flex items-center justify-between bg-instrument-panel p-3 border border-instrument-border rounded-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 bg-instrument-bg text-instrument-textBright border border-instrument-border rounded hover:bg-instrument-border transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-instrument-textBright uppercase tracking-wide flex items-center gap-2">
              <Activity className="w-5 h-5 text-instrument-blue" />
              {channelId} Detailed Analysis
            </h2>
            <span className="text-xs text-instrument-green font-mono font-bold uppercase">
              {protocol ? `${protocol} PROTOCOL DETECTED & STREAMING` : 'LIVE SIGNAL STREAMING'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        
        {/* Left Column: Waveform & Parameters */}
        <div className="lg:col-span-2 flex flex-col space-y-4 h-full">
          {/* Waveform */}
          <div className="h-[350px] flex-shrink-0">
            <WaveformViewer
              channels={channels}
              isConnected={isConnected}
              protocol={protocol}
            />
          </div>

          {/* Parameters */}
          <div className="flex-shrink-0">
            <ParameterPanel
              parameters={parameters}
              protocol={protocol}
            />
          </div>
        </div>

        {/* Right Column: Decoded Messages Output */}
        <div className="h-full flex flex-col min-h-[400px]">
          <DecodedDataTable
            rows={decodedRows}
            protocol={protocol}
            onExportCsv={onExportCsv}
            onExportJson={onExportJson}
            onCopyHex={onCopyHex}
          />
        </div>

      </div>
    </div>
  );
};
