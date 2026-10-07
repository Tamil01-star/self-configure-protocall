import { useState, useEffect, useRef, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { AllProtocolsMatrix } from './components/AllProtocolsMatrix';
import { ProtocolStatus } from './components/ProtocolStatus';
import { WaveformViewer } from './components/WaveformViewer';
import { ParameterPanel } from './components/ParameterPanel';
import { DetectionEvidence } from './components/DetectionEvidence';
import { DecodedDataTable } from './components/DecodedDataTable';
import { SignalHealth } from './components/SignalHealth';
import { FaultDiagnosis } from './components/FaultDiagnosis';
import { ChannelMap } from './components/ChannelMap';
import { HardwareStackPanel } from './components/HardwareStackPanel';
import { ChannelParameterBreakdown } from './components/ChannelParameterBreakdown';
import { UnknownProtocolPanel } from './components/UnknownProtocolPanel';
import { EventTimeline } from './components/EventTimeline';
import { AnalyzerConsole } from './components/AnalyzerConsole';
import { LandingIntro } from './components/LandingIntro';
import { SettingsModal } from './components/SettingsModal';
import { AutoDetectModal } from './components/AutoDetectModal';
import { Usb, AlertCircle, Play, Square, Sparkles } from 'lucide-react';

import type { 
  NavigationTab, 
  SystemHardwareStatus, 
  RealAnalyzerPayload 
} from './types/analyzer';
import { SerialHardwareDriver } from './services/SignalSource';

export function App() {
  const [showLanding, setShowLanding] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAutoDetecting, setIsAutoDetecting] = useState<boolean>(false);

  // Real Hardware Serial Driver instance
  const driverRef = useRef<SerialHardwareDriver>(new SerialHardwareDriver());

  // Hardware Status State
  const [hardwareStatus, setHardwareStatus] = useState<SystemHardwareStatus>({
    esp32_1_status: 'UNKNOWN',
    esp32_2_connected: false,
    lcd_status: 'NOT VERIFIED',
    laptop_status: 'RUNNING',
    serialBaud: 115200,
  });

  // Current Real Payload State from ESP32 #2
  const [payload, setPayload] = useState<RealAnalyzerPayload>({
    state: 'DISCONNECTED',
    protocol: null,
    confidence: null,
    statusText: null,
    evidence: [],
    parameters: {},
    channels: [],
    decodedRows: [],
    health: {
      validFrames: null,
      invalidFrames: null,
      timingConsistencyPercent: null,
      transitionConsistencyPercent: null,
      clockConsistencyPercent: null,
      errorCount: null,
    },
    lcdMessage: null,
  });

  // Logs stream
  const [serialLogs, setSerialLogs] = useState<string[]>([]);
  const [sessionEvents, setSessionEvents] = useState<string[]>([]);

  // Serial Driver Event Subscriptions
  useEffect(() => {
    const driver = driverRef.current;

    const unsubscribe = driver.subscribe({
      onConnectionChange: (connected) => {
        setHardwareStatus(prev => ({
          ...prev,
          esp32_2_connected: connected,
          lcd_status: connected ? 'VERIFIED' : 'NOT VERIFIED',
        }));

        if (!connected) {
          // Immediately stop displaying live measurements when disconnected!
          setPayload({
            state: 'DISCONNECTED',
            protocol: null,
            confidence: null,
            statusText: null,
            evidence: [],
            parameters: {},
            channels: [],
            decodedRows: [],
            health: {
              validFrames: null,
              invalidFrames: null,
              timingConsistencyPercent: null,
              transitionConsistencyPercent: null,
              clockConsistencyPercent: null,
              errorCount: null,
            },
            lcdMessage: null,
          });
          setSessionEvents(prev => [...prev, '[SYSTEM] Serial Connection Lost — Hardware Offline.']);
        } else {
          setPayload(prev => ({ ...prev, state: 'IDLE' }));
          setSessionEvents(prev => [...prev, '[SYSTEM] ESP32 #2 AutoScope Analyzer Connected.']);
        }
      },
      onDataPayload: (newPayload) => {
        setPayload(newPayload);
        if (newPayload.lcdMessage) {
          setHardwareStatus(prev => ({ ...prev, lcd_status: `MSG: "${newPayload.lcdMessage}"` }));
        }
      },
      onRawLog: (log) => {
        setSerialLogs(prev => [...prev, log]);
      },
      onError: (err) => {
        setSerialLogs(prev => [...prev, `[ERROR] ${err.message}`]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Connect Serial Port via WebSerial
  const handleConnectSerial = useCallback(async () => {
    try {
      await driverRef.current.connect();
    } catch (err: any) {
      alert(`Serial Connection Error: ${err.message}`);
    }
  }, []);

  // Disconnect Serial Port
  const handleDisconnectSerial = useCallback(async () => {
    await driverRef.current.disconnect();
  }, []);

  // Serial Command Triggers
  const handleStartCapture = useCallback(async () => {
    if (!hardwareStatus.esp32_2_connected) return;
    try {
      await driverRef.current.sendCommand('START');
      setPayload(prev => ({ ...prev, state: 'CAPTURING' }));
      setSessionEvents(prev => [...prev, '[COMMAND] Sent START capture signal to ESP32 #2.']);
    } catch (err: any) {
      alert(`Command Error: ${err.message}`);
    }
  }, [hardwareStatus.esp32_2_connected]);

  const handleStopCapture = useCallback(async () => {
    if (!hardwareStatus.esp32_2_connected) return;
    try {
      await driverRef.current.sendCommand('STOP');
      setPayload(prev => ({ ...prev, state: 'IDLE' }));
      setSessionEvents(prev => [...prev, '[COMMAND] Sent STOP capture signal to ESP32 #2.']);
    } catch (err: any) {
      alert(`Command Error: ${err.message}`);
    }
  }, [hardwareStatus.esp32_2_connected]);

  const handleAutoDetect = useCallback(async () => {
    if (!hardwareStatus.esp32_2_connected) return;
    setIsAutoDetecting(true);
    try {
      await driverRef.current.sendCommand('AUTODETECT');
      setSessionEvents(prev => [...prev, '[COMMAND] Triggered AUTODETECT pipeline on ESP32 #2.']);
    } catch (err: any) {
      alert(`Command Error: ${err.message}`);
    }
  }, [hardwareStatus.esp32_2_connected]);

  const handleAutoDetectComplete = useCallback(() => {
    setIsAutoDetecting(false);
  }, []);

  const handleSendConsoleCommand = useCallback(async (cmd: string) => {
    try {
      await driverRef.current.sendCommand(cmd);
    } catch (err: any) {
      alert(`Command Error: ${err.message}`);
    }
  }, []);

  const handleClear = useCallback(() => {
    setSerialLogs([]);
    setSessionEvents([]);
  }, []);

  // CSV / JSON Exporters for real decoded rows
  const handleExportCsv = () => {
    if (payload.decodedRows.length === 0) return;
    const headers = ['TimeMs', 'Channel', 'Hex', 'Dec', 'ASCII', 'Status'];
    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...payload.decodedRows.map(r => `${r.timeMs},${r.channel},${r.hex},${r.dec},"${r.ascii}",${r.status}`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `autoscope_real_decoded_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJson = () => {
    if (payload.decodedRows.length === 0) return;
    const jsonStr = JSON.stringify(payload.decodedRows, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `autoscope_real_decoded_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyHex = () => {
    if (payload.decodedRows.length === 0) return;
    const hexList = payload.decodedRows.map(r => r.hex).join(' ');
    navigator.clipboard.writeText(hexList);
  };

  if (showLanding) {
    return <LandingIntro onLaunch={() => setShowLanding(false)} />;
  }

  return (
    <div className="min-h-screen bg-instrument-bg text-instrument-textBright font-sans flex flex-col overflow-hidden">
      {/* Top Header */}
      <TopBar
        hardwareStatus={hardwareStatus}
        analyzerState={payload.state}
        onConnectSerial={handleConnectSerial}
        onDisconnectSerial={handleDisconnectSerial}
        onStartCapture={handleStartCapture}
        onStopCapture={handleStopCapture}
        onAutoDetect={handleAutoDetect}
        onClear={handleClear}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          hardwareStatus={hardwareStatus}
        />

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-[1920px] mx-auto w-full font-sans">
          {/* OFFLINE DISCONNECTED BANNER (State 1 requirement) */}
          {!hardwareStatus.esp32_2_connected && (
            <div className="instrument-card p-4 bg-instrument-bg border-instrument-red/40 flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded bg-instrument-red/20 text-instrument-red border border-instrument-red/30">
                  <AlertCircle className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-instrument-textBright uppercase">
                    AUTOSCOPE — ANALYZER OFFLINE
                  </h2>
                  <p className="text-xs text-instrument-textMuted mt-0.5">
                    Connect physical ESP32 #2 logic analyzer to USB port to begin real-time protocol capture.
                  </p>
                </div>
              </div>

              <button
                onClick={handleConnectSerial}
                className="px-4 py-2 bg-instrument-blue text-white font-bold text-xs rounded-sm shadow-sm hover:bg-sky-600 flex items-center gap-2"
              >
                <Usb className="w-4 h-4" /> CONNECT ESP32 #2 SERIAL
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW DASHBOARD (SINGLE SCREEN WORKSTATION) */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* 1. All Protocols Matrix View */}
              <AllProtocolsMatrix
                detectedProtocol={payload.protocol}
                confidence={payload.confidence}
                parameters={payload.parameters}
                isConnected={hardwareStatus.esp32_2_connected}
              />

              {/* 2. Protocol Identification Readout */}
              <ProtocolStatus
                protocol={payload.protocol}
                confidence={payload.confidence}
                statusText={payload.statusText}
                analyzerState={payload.state}
                isConnected={hardwareStatus.esp32_2_connected}
              />

              {/* 1. Digital Signal Capture & Why This Result? */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 h-[300px]">
                  <WaveformViewer
                    channels={payload.channels}
                    isConnected={hardwareStatus.esp32_2_connected}
                    protocol={payload.protocol}
                  />
                </div>

                <div className="h-[300px]">
                  <DetectionEvidence
                    evidence={payload.evidence}
                    protocol={payload.protocol}
                    confidence={payload.confidence}
                  />
                </div>
              </div>

              {/* 3. Automatic Parameters */}
              <ParameterPanel
                parameters={payload.parameters}
                protocol={payload.protocol}
              />

              {/* 4. Signal Engineer Channel-Wise Breakdown (CH1 - CH7) */}
              <ChannelParameterBreakdown
                channels={payload.channels}
                protocol={payload.protocol}
                parameters={payload.parameters}
                isConnected={hardwareStatus.esp32_2_connected}
              />

              {/* 5. Decoded Data Table */}
              <DecodedDataTable
                rows={payload.decodedRows}
                protocol={payload.protocol}
                onExportCsv={handleExportCsv}
                onExportJson={handleExportJson}
                onCopyHex={handleCopyHex}
              />

              {/* 6. Signal Health & Fault Diagnosis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SignalHealth
                  health={payload.health}
                  isConnected={hardwareStatus.esp32_2_connected}
                />
                <FaultDiagnosis
                  health={payload.health}
                  isConnected={hardwareStatus.esp32_2_connected}
                />
              </div>
            </div>
          )}

          {/* TAB 2: LIVE CAPTURE */}
          {activeTab === 'capture' && (
            <div className="space-y-4">
              <div className="instrument-card p-3 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center space-x-2">
                  <Usb className="w-4 h-4 text-instrument-blue" />
                  <span className="font-bold text-instrument-textBright">ESP32 #2 SERIAL CAPTURE CONTROLLER</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleStartCapture}
                    disabled={!hardwareStatus.esp32_2_connected}
                    className="px-3 py-1 bg-instrument-green text-black font-bold rounded-sm text-xs hover:bg-emerald-400 disabled:opacity-50 flex items-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> START
                  </button>
                  <button
                    onClick={handleStopCapture}
                    disabled={!hardwareStatus.esp32_2_connected}
                    className="px-3 py-1 bg-instrument-bg text-instrument-red border border-instrument-border font-bold rounded-sm text-xs hover:bg-instrument-red hover:text-white disabled:opacity-50 flex items-center gap-1"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" /> STOP
                  </button>
                  <button
                    onClick={handleAutoDetect}
                    disabled={!hardwareStatus.esp32_2_connected}
                    className="px-3 py-1 bg-instrument-purple text-white font-bold rounded-sm text-xs hover:bg-purple-600 disabled:opacity-50 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> AUTO DETECT
                  </button>
                </div>
              </div>

              <div className="h-[360px]">
                <WaveformViewer
                  channels={payload.channels}
                  isConnected={hardwareStatus.esp32_2_connected}
                  protocol={payload.protocol}
                />
              </div>

              <ChannelMap
                channels={payload.channels}
                protocol={payload.protocol}
              />
            </div>
          )}

          {/* TAB 3: PROTOCOL */}
          {activeTab === 'protocol' && (
            <div className="space-y-4">
              <ProtocolStatus
                protocol={payload.protocol}
                confidence={payload.confidence}
                statusText={payload.statusText}
                analyzerState={payload.state}
                isConnected={hardwareStatus.esp32_2_connected}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <DetectionEvidence
                  evidence={payload.evidence}
                  protocol={payload.protocol}
                  confidence={payload.confidence}
                />
                <ParameterPanel
                  parameters={payload.parameters}
                  protocol={payload.protocol}
                />
              </div>

              {payload.protocol === 'UNKNOWN' && (
                <UnknownProtocolPanel
                  parameters={payload.parameters}
                  confidence={payload.confidence}
                  isConnected={hardwareStatus.esp32_2_connected}
                />
              )}
            </div>
          )}

          {/* TAB 4: DECODED DATA */}
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

          {/* TAB 5: SIGNAL HEALTH */}
          {activeTab === 'health' && (
            <div className="space-y-4">
              <SignalHealth
                health={payload.health}
                isConnected={hardwareStatus.esp32_2_connected}
              />
              <FaultDiagnosis
                health={payload.health}
                isConnected={hardwareStatus.esp32_2_connected}
              />
            </div>
          )}

          {/* TAB 6: HARDWARE STACK */}
          {activeTab === 'hardware' && (
            <div className="space-y-4">
              <HardwareStackPanel
                hardwareStatus={hardwareStatus}
                lcdMessage={payload.lcdMessage}
                onConnectSerial={handleConnectSerial}
                onDisconnectSerial={handleDisconnectSerial}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnalyzerConsole
                  logs={serialLogs}
                  onClearLogs={() => setSerialLogs([])}
                  onSendCommand={handleSendConsoleCommand}
                  isConnected={hardwareStatus.esp32_2_connected}
                />
                <EventTimeline logs={sessionEvents} />
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="instrument-card p-4 space-y-3">
                <h3 className="font-bold text-sm text-instrument-textBright uppercase">SERIAL INTERFACE CONFIGURATION</h3>
                <p className="text-xs text-instrument-textMuted">
                  Configure WebSerial baud rate for communication with ESP32 #2. Default rate is 115200 baud.
                </p>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-3 py-1.5 bg-instrument-blue text-white font-bold text-xs rounded-sm hover:bg-sky-600"
                >
                  OPEN HARDWARE SETTINGS
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Pipeline & Settings Modals */}
      <AutoDetectModal
        isOpen={isAutoDetecting}
        onComplete={handleAutoDetectComplete}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        hardwareStatus={hardwareStatus}
        onUpdateBaud={(baud) => setHardwareStatus(prev => ({ ...prev, serialBaud: baud }))}
      />
    </div>
  );
}

export default App;
