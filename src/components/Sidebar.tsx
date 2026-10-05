import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Waves, 
  Search, 
  Table, 
  HeartPulse, 
  AlertTriangle, 
  HelpCircle, 
  History, 
  Settings,
  Usb
} from 'lucide-react';
import type { NavigationTab, HardwareStatus } from '../types/analyzer';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  hardwareStatus: HardwareStatus;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  hardwareStatus
}) => {
  const menuItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'analyzer', label: 'Live Analyzer', icon: <Activity className="w-4 h-4 text-instrument-cyan" /> },
    { id: 'waveform', label: 'Waveform', icon: <Waves className="w-4 h-4" /> },
    { id: 'detection', label: 'Protocol Detection', icon: <Search className="w-4 h-4" /> },
    { id: 'decoded', label: 'Decoded Data', icon: <Table className="w-4 h-4" /> },
    { id: 'health', label: 'Signal Health', icon: <HeartPulse className="w-4 h-4 text-instrument-green" /> },
    { id: 'fault', label: 'Fault Diagnosis', icon: <AlertTriangle className="w-4 h-4 text-instrument-amber" /> },
    { id: 'unknown', label: 'Unknown Protocol', icon: <HelpCircle className="w-4 h-4 text-instrument-purple" /> },
    { id: 'history', label: 'Capture History', icon: <History className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-56 bg-instrument-panel border-r border-instrument-border flex flex-col justify-between select-none shrink-0 h-[calc(100vh-3.5rem)]">
      {/* Navigation Links */}
      <div className="py-3 px-2 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-mono text-instrument-textMuted uppercase tracking-wider">
          INSTRUMENT MENU
        </div>

        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-all ${
                isActive
                  ? 'bg-instrument-cyanDim text-instrument-cyan border border-instrument-cyan/40 font-semibold shadow-cyan-glow'
                  : 'text-instrument-textSubtle hover:text-white hover:bg-instrument-bg border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.2 text-[9px] bg-instrument-border rounded text-instrument-textMuted">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Device Telemetry Box */}
      <div className="p-3 m-2 bg-instrument-bg rounded border border-instrument-border font-mono text-xs">
        <div className="text-[10px] text-instrument-textMuted uppercase tracking-wider flex items-center justify-between mb-1.5">
          <span>DEVICE STATUS</span>
          <span className="w-2 h-2 rounded-full bg-instrument-green animate-led" />
        </div>
        
        <div className="flex items-center space-x-2 text-instrument-textBright font-semibold text-[11px] mb-1">
          <Usb className="w-3.5 h-3.5 text-instrument-cyan" />
          <span>{hardwareStatus.deviceName}</span>
        </div>

        <div className="text-[10px] text-instrument-textMuted space-y-0.5">
          <div className="flex justify-between">
            <span>Connection:</span>
            <span className="text-instrument-green">{hardwareStatus.connectionType}</span>
          </div>
          <div className="flex justify-between">
            <span>Sampling:</span>
            <span className="text-instrument-textBright">{hardwareStatus.samplingRate}</span>
          </div>
          <div className="flex justify-between">
            <span>Buffer:</span>
            <span className="text-instrument-textBright">{hardwareStatus.bufferKb} KB</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
