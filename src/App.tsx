import { useState, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { ProtocolStatus } from './components/ProtocolStatus';
import { WaveformViewer } from './components/WaveformViewer';
import { ProtocolConfidence } from './components/ProtocolConfidence';
import { ParameterPanel } from './components/ParameterPanel';
import { DecodedDataTable } from './components/DecodedDataTable';
import { DetectionEvidence } from './components/DetectionEvidence';
import { SignalHealth } from './components/SignalHealth';
import { ChannelMap } from './components/ChannelMap';
import { EventTimeline } from './components/EventTimeline';
import { AnalyzerConsole } from './components/AnalyzerConsole';
import { CaptureControls } from './components/CaptureControls';
import { UnknownProtocolPanel } from './components/UnknownProtocolPanel';
import { FaultDiagnosis } from './components/FaultDiagnosis';
import { ConnectionStatus } from './components/ConnectionStatus';
import { DemoModePanel } from './components/DemoModePanel';
import { LandingIntro } from './components/LandingIntro';
import { CaptureHistory } from './components/CaptureHistory';
import { SettingsModal } from './components/SettingsModal';
import { AutoDetectModal } from './components/AutoDetectModal';
import { ElectricalLevelPanel } from './components/ElectricalLevelPanel';

import type { 
  NavigationTab, 
  DemoPreset, 
  CaptureState, 
  HardwareStatus, 
  ProtocolType, 
  TimelineEvent, 
  SavedCapture 
} from './types/analyzer';
import { SerialSignalSource, WebSocketSignalSource } from './services/SignalSource';
import { getPresetData } from './services/mockData';

export function App() {
  const [showLanding, setShowLanding] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [currentPreset, setCurrentPreset] = useState<DemoPreset>('UART_DEMO');
  const [captureState, setCaptureState] = useState<CaptureState>('CAPTURING');
  const [isAutoDetecting, setIsAutoDetecting] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Payload data state
  const [payload, setPayload] = useState(() => getPresetData('UART_DEMO'));
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolType>('UART');

  // Console and timeline logs
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[AUTOSCOPE ENGINE] System initialization complete.',
    '[DMA SAMPLER] Sampling rate set to 2 MS/s (4 channels).',
    '[ANALYZER] Signal edge transition detected on CH1.',
    '[AUTODETECT] Candidate UART TTL identified at 115200 baud.',
    '[DECODER] Framed 15 bytes ASCII payload: "HELLO AUTOSCOPE"'
  ]);

  const [events, setEvents] = useState<TimelineEvent[]>([
    { id: '1', timestampMs: 0.000, formattedTime: '00:00.000', message: 'Signal edge detected on CH1', type: 'info' },
    { id: '2', timestampMs: 0.032, formattedTime: '00:00.032', message: 'UART candidate pattern identified', type: 'info' },
    { id: '3', timestampMs: 0.044, formattedTime: '00:00.044', message: '115200 baud candidate confirmed', type: 'success' },
    { id: '4', timestampMs: 0.051, formattedTime: '00:00.051', message: 'Decoder auto-configured (8N1)', type: 'success' },
    { id: '5', timestampMs: 0.060, formattedTime: '00:00.060', message: 'Data stream successfully decoded', type: 'success' }
  ]);

  // Hardware status
  const [hardwareStatus, setHardwareStatus] = useState<HardwareStatus>({
    connected: true,
    deviceName: 'ESP32 Capture Engine',
    connectionType: 'SIMULATION',
    samplingRate: '2 MS/s',
    channelsAvailable: 4,
    bufferKb: 64,
  });

  // Saved captures list
  const [savedCaptures, setSavedCaptures] = useState<SavedCapture[]>([
    { id: 'cap1', name: 'Capture #001', timestamp: '10:42:18', protocol: 'UART', baudOrFreq: '115200 baud', healthStatus: 'HEALTHY', healthScore: 94, dataCount: 15, notes: 'UART TTL serial log' },
    { id: 'cap2', name: 'Capture #002', timestamp: '10:44:21', protocol: 'I2C', baudOrFreq: '100 kHz', healthStatus: 'HEALTHY', healthScore: 98, dataCount: 7, notes: 'I2C sensor read' },
    { id: 'cap3', name: 'Capture #003', timestamp: '10:48:10', protocol: 'SPI', baudOrFreq: '1 MHz', healthStatus: 'HEALTHY', healthScore: 97, dataCount: 4, notes: 'SPI display stream' },
    { id: 'cap4', name: 'Capture #004', timestamp: '10:52:05', protocol: 'UART', baudOrFreq: '115200 baud', healthStatus: 'WARNING', healthScore: 62, dataCount: 4, notes: 'Framing error fault' },
  ]);

  // Switch presets reactively
  const handleSelectPreset = useCallback((preset: DemoPreset) => {
    setCurrentPreset(preset);
    const newPayload = getPresetData(preset);
    setPayload(newPayload);
    setSelectedProtocol(newPayload.protocol);

    const protoName = newPayload.protocol === 'I2C' ? 'I²C' : newPayload.protocol;
    setConsoleLogs(prev => [
      ...prev,
      `[DEMO PRESET] Switched to ${preset}`,
      `[AUTOSCOPE] Protocol locked to ${protoName} with ${newPayload.confidence.toFixed(1)}% confidence.`
    ]);

    setEvents(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        timestampMs: 0.100,
        formattedTime: new Date().toISOString().substring(14, 21),
        message: `Preset changed to ${pName(newPayload.protocol)}`,
        type: 'info'
      }
    ]);
  }, []);

  function pName(p: ProtocolType) {
    return p === 'I2C' ? 'I²C Bus' : p;
  }

  // Handle Auto Detect Sequence
  const handleAutoDetect = () => {
    setIsAutoDetecting(true);
    setConsoleLogs(prev => [...prev, '[AUTODETECT] Triggered self-configuring signal analysis pipeline...']);
  };

  const handleAutoDetectComplete = () => {
    setIsAutoDetecting(false);
    const newPayload = getPresetData(currentPreset);
    setPayload(newPayload);
    setSelectedProtocol(newPayload.protocol);

    setConsoleLogs(prev => [
      ...prev,
      `[AUTODETECT COMPLETE] ${newPayload.protocol} detected at ${newPayload.confidence.toFixed(1)}% confidence.`,
      `[DECODER CONFIG] Applied parameters automatically.`
    ]);
  };

  // Hardware Connection Triggers
  const handleConnectSerial = async () => {
    try {
      const serialSource = new SerialSignalSource();
      const connected = await serialSource.connect();
      if (connected) {
        setHardwareStatus(prev => ({ ...prev, connected: true, connectionType: 'USB', deviceName: 'ESP32 (USB Serial)' }));
        setConsoleLogs(prev => [...prev, '[HARDWARE] ESP32 WebSerial port connected successfully.']);
      }
    } catch (err: any) {
      alert(`Serial connection failed: ${err.message}`);
    }
  };

  const handleConnectWebSocket = async () => {
    const wsSource = new WebSocketSignalSource();
    const connected = await wsSource.connect();
    if (connected) {
      setHardwareStatus(prev => ({ ...prev, connected: true, connectionType: 'WEBSOCKET', deviceName: 'ESP32 (WiFi WS)' }));
      setConsoleLogs(prev => [...prev, '[HARDWARE] ESP32 WebSocket connected at ws://192.168.4.1/ws']);
    } else {
      alert('WebSocket connection failed. Ensure ESP32 AP is active at 192.168.4.1.');
    }
  };

  // Export handlers
  const handleExportCsv = () => {
    const headers = ['TimeMs', 'Channel', 'Hex', 'Dec', 'ASCII', 'Binary', 'Status'];
    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...payload.decodedRows.map(r => `${r.timeMs},${r.channel},${r.hex},${r.dec},"${r.ascii}",${r.binary},${r.status}`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `autoscope_${payload.protocol.toLowerCase()}_decoded.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(payload.decodedRows, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `autoscope_${payload.protocol.toLowerCase()}_decoded.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyHex = () => {
    const hexList = payload.decodedRows.map(r => r.hex).join(' ');
    navigator.clipboard.writeText(hexList);
  };

  if (showLanding) {
    return <LandingIntro onLaunch={() => setShowLanding(false)} />;
  }

  return (
    <div className="min-h-screen bg-instrument-bg text-instrument-textBright font-sans flex flex-col overflow-hidden">
      {/* Top Bar Header */}
      <TopBar
        captureState={captureState}
        onStartCapture={() => setCaptureState('CAPTURING')}
        onStopCapture={() => setCaptureState('IDLE')}
        onAutoDetect={handleAutoDetect}
        onSelectPreset={handleSelectPreset}
        currentPreset={currentPreset}
        hardwareStatus={hardwareStatus}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleIntro={() => setShowLanding(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Menu */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          hardwareStatus={hardwareStatus}
        />

        {/* Main Workstation Workspace */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-[1920px] mx-auto w-full">
          {/* Top Presets Bar (hackathon interactive test controls) */}
          <DemoModePanel
            currentPreset={currentPreset}
            onSelectPreset={handleSelectPreset}
          />

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Large Readout Banner */}
              <ProtocolStatus
                protocol={payload.protocol}
                confidence={payload.confidence}
                logicLevelV={payload.parameters.logicLevelV}
                health={payload.health[0]}
                isAnalyzing={captureState === 'ANALYZING'}
              />

              {/* Main Oscilloscope Waveform & Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 h-[340px]">
                  <WaveformViewer
                    channels={payload.channels}
                    captureState={captureState}
                    onTogglePause={() => setCaptureState(s => s === 'CAPTURING' ? 'PAUSED' : 'CAPTURING')}
                    protocol={payload.protocol}
                  />
                </div>

                {/* Explainable Evidence */}
                <div className="h-[340px]">
                  <DetectionEvidence
                    evidence={payload.evidence}
                    protocol={payload.protocol}
                    confidence={payload.confidence}
                  />
                </div>
              </div>

              {/* Parameters & Confidence Spectrum */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <ParameterPanel
                    parameters={payload.parameters}
                    protocol={payload.protocol}
                  />
                </div>

                <div>
                  <ProtocolConfidence
                    items={payload.confidences}
                    selectedProtocol={selectedProtocol}
                    onSelectProtocol={(p) => {
                      setSelectedProtocol(p);
                      const map: Record<ProtocolType, DemoPreset> = {
                        'UART': 'UART_DEMO',
                        'I2C': 'I2C_DEMO',
                        'SPI': 'SPI_DEMO',
                        'UNKNOWN': 'UNKNOWN_DEMO',
                        'RS485': 'UNKNOWN_DEMO',
                        'RS232': 'UART_DEMO',
                        'CAN': 'UNKNOWN_DEMO',
                        'LIN': 'UART_DEMO'
                      };
                      if (map[p]) handleSelectPreset(map[p]);
                    }}
                  />
                </div>
              </div>

              {/* Electrical Level & Signal Health */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ElectricalLevelPanel electrical={payload.electrical} />
                <SignalHealth health={payload.health[0]} />
              </div>

              {/* Fault Warning (if fault active) */}
              {payload.fault.hasFault && (
                <FaultDiagnosis fault={payload.fault} />
              )}

              {/* Decoded Data Table */}
              <DecodedDataTable
                rows={payload.decodedRows}
                protocol={payload.protocol}
                onExportCsv={handleExportCsv}
                onExportJson={handleExportJson}
                onCopyHex={handleCopyHex}
              />
            </div>
          )}

          {/* TAB 2: LIVE ANALYZER WORKSTATION */}
          {activeTab === 'analyzer' && (
            <div className="space-y-4">
              <CaptureControls
                captureState={captureState}
                onStart={() => setCaptureState('CAPTURING')}
                onStop={() => setCaptureState('IDLE')}
                onPause={() => setCaptureState('PAUSED')}
                onAutoDetect={handleAutoDetect}
              />

              <div className="h-[360px]">
                <WaveformViewer
                  channels={payload.channels}
                  captureState={captureState}
                  onTogglePause={() => setCaptureState(s => s === 'CAPTURING' ? 'PAUSED' : 'CAPTURING')}
                  protocol={payload.protocol}
                />
              </div>

              <DecodedDataTable
                rows={payload.decodedRows}
                protocol={payload.protocol}
                onExportCsv={handleExportCsv}
                onExportJson={handleExportJson}
                onCopyHex={handleCopyHex}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnalyzerConsole logs={consoleLogs} onClearLogs={() => setConsoleLogs([])} />
                <EventTimeline events={events} />
              </div>
            </div>
          )}

          {/* TAB 3: WAVEFORM */}
          {activeTab === 'waveform' && (
            <div className="space-y-4">
              <div className="h-[500px]">
                <WaveformViewer
                  channels={payload.channels}
                  captureState={captureState}
                  onTogglePause={() => setCaptureState(s => s === 'CAPTURING' ? 'PAUSED' : 'CAPTURING')}
                  protocol={payload.protocol}
                />
              </div>

              <ChannelMap mappings={payload.mappings} />
            </div>
          )}

          {/* TAB 4: PROTOCOL DETECTION */}
          {activeTab === 'detection' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ProtocolConfidence
                  items={payload.confidences}
                  selectedProtocol={selectedProtocol}
                  onSelectProtocol={(p) => setSelectedProtocol(p)}
                />
                <DetectionEvidence
                  evidence={payload.evidence}
                  protocol={payload.protocol}
                  confidence={payload.confidence}
                />
              </div>

              <ParameterPanel
                parameters={payload.parameters}
                protocol={payload.protocol}
              />
            </div>
          )}

          {/* TAB 5: DECODED DATA */}
          {activeTab === 'decoded' && (
            <div className="space-y-4">
              <DecodedDataTable
                rows={payload.decodedRows}
                protocol={payload.protocol}
                onExportCsv={handleExportCsv}
                onExportJson={handleExportJson}
                onCopyHex={handleCopyHex}
              />
            </div>
          )}

          {/* TAB 6: SIGNAL HEALTH */}
          {activeTab === 'health' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SignalHealth health={payload.health[0]} />
                <ElectricalLevelPanel electrical={payload.electrical} />
              </div>
            </div>
          )}

          {/* TAB 7: FAULT DIAGNOSIS */}
          {activeTab === 'fault' && (
            <div className="space-y-4">
              <FaultDiagnosis fault={payload.fault} />
              <SignalHealth health={payload.health[0]} />
            </div>
          )}

          {/* TAB 8: UNKNOWN PROTOCOL */}
          {activeTab === 'unknown' && (
            <div className="space-y-4">
              <UnknownProtocolPanel data={payload.unknown} />
              <div className="h-[300px]">
                <WaveformViewer
                  channels={payload.channels}
                  captureState={captureState}
                  onTogglePause={() => setCaptureState(s => s === 'CAPTURING' ? 'PAUSED' : 'CAPTURING')}
                  protocol="UNKNOWN"
                />
              </div>
            </div>
          )}

          {/* TAB 9: CAPTURE HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <CaptureHistory
                captures={savedCaptures}
                onLoadCapture={(preset) => {
                  handleSelectPreset(preset);
                  setActiveTab('overview');
                }}
                onDeleteCapture={(id) => {
                  setSavedCaptures(prev => prev.filter(c => c.id !== id));
                }}
              />
            </div>
          )}

          {/* TAB 10: SETTINGS / HARDWARE */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <ConnectionStatus
                hardwareStatus={hardwareStatus}
                onConnectSerial={handleConnectSerial}
                onConnectWebSocket={handleConnectWebSocket}
              />
            </div>
          )}
        </main>
      </div>

      {/* Modals & Animations */}
      <AutoDetectModal
        isOpen={isAutoDetecting}
        onComplete={handleAutoDetectComplete}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        hardwareStatus={hardwareStatus}
        onUpdateHardwareStatus={(updated) => setHardwareStatus(prev => ({ ...prev, ...updated }))}
      />
    </div>
  );
}

export default App;
