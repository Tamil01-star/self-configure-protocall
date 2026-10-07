import { useState, useEffect, useRef, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { ChannelGrid } from './components/ChannelGrid';
import { ChannelDetail } from './components/ChannelDetail';
import { WaveformViewer } from './components/WaveformViewer';
import { LandingIntro } from './components/LandingIntro';
import { SettingsModal } from './components/SettingsModal';
import { AutoDetectModal } from './components/AutoDetectModal';
import { Usb, AlertCircle } from 'lucide-react';

import type { 
  SystemHardwareStatus, 
  RealAnalyzerPayload 
} from './types/analyzer';
import { SerialHardwareDriver } from './services/SignalSource';

export function App() {
  const [showLanding, setShowLanding] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAutoDetecting, setIsAutoDetecting] = useState<boolean>(false);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

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
          setSelectedChannel(null);
        } else {
          setPayload(prev => ({ ...prev, state: 'IDLE' }));
        }
      },
      onDataPayload: (newPayload) => {
        setPayload(newPayload);
        if (newPayload.lcdMessage) {
          setHardwareStatus(prev => ({ ...prev, lcd_status: `MSG: "${newPayload.lcdMessage}"` }));
        }
      },
      onRawLog: () => {
        // We removed the console view in the simple UI
      },
      onError: (err) => {
        console.error(`[SERIAL ERROR]`, err);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleConnectSerial = useCallback(async () => {
    try {
      await driverRef.current.connect();
    } catch (err: any) {
      alert(`Serial Connection Error: ${err.message}`);
    }
  }, []);

  const handleDisconnectSerial = useCallback(async () => {
    await driverRef.current.disconnect();
  }, []);

  const handleStartCapture = useCallback(async () => {
    if (!hardwareStatus.esp32_2_connected) return;
    try {
      await driverRef.current.sendCommand('START');
      // DO NOT fake state here. Wait for ESP32 to actually send telemetry.
    } catch (err: any) {
      alert(`Command Error: ${err.message}`);
    }
  }, [hardwareStatus.esp32_2_connected]);

  const handleStopCapture = useCallback(async () => {
    if (!hardwareStatus.esp32_2_connected) return;
    try {
      await driverRef.current.sendCommand('STOP');
      // DO NOT fake state here. Wait for ESP32 to actually send telemetry.
    } catch (err: any) {
      alert(`Command Error: ${err.message}`);
    }
  }, [hardwareStatus.esp32_2_connected]);

  const handleAutoDetect = useCallback(async () => {
    if (!hardwareStatus.esp32_2_connected) return;
    setIsAutoDetecting(true);
    try {
      await driverRef.current.sendCommand('AUTODETECT');
    } catch (err: any) {
      alert(`Command Error: ${err.message}`);
    }
  }, [hardwareStatus.esp32_2_connected]);

  const handleAutoDetectComplete = useCallback(() => {
    setIsAutoDetecting(false);
  }, []);

  const handleClear = useCallback(() => {
    setSelectedChannel(null);
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
        <main className="flex-1 overflow-y-auto p-4 max-w-[1920px] mx-auto w-full font-sans">
          {!hardwareStatus.esp32_2_connected && (
            <div className="instrument-card p-4 bg-instrument-bg border-instrument-red/40 flex flex-wrap items-center justify-between gap-3 shadow-sm mb-4">
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

          {/* Simple Interface Navigation: Grid vs Detail */}
          {selectedChannel ? (
            <ChannelDetail
              channelId={selectedChannel}
              channels={payload.channels}
              protocol={payload.protocol}
              parameters={payload.parameters}
              decodedRows={payload.decodedRows}
              isConnected={hardwareStatus.esp32_2_connected}
              onBack={() => setSelectedChannel(null)}
              onExportCsv={handleExportCsv}
              onExportJson={handleExportJson}
              onCopyHex={handleCopyHex}
            />
          ) : (
            <div className="flex flex-col space-y-4">
              <div className="h-[350px] w-full">
                <WaveformViewer
                  channels={payload.channels}
                  isConnected={hardwareStatus.esp32_2_connected}
                  protocol={payload.protocol}
                />
              </div>
              <ChannelGrid
                channels={payload.channels}
                protocol={payload.protocol}
                parameters={payload.parameters}
                isConnected={hardwareStatus.esp32_2_connected}
                onChannelClick={(id) => setSelectedChannel(id)}
              />
            </div>
          )}
        </main>
      </div>

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
