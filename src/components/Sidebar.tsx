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
    { id: 'analyzer', label: 'Live Analyzer', icon: <Activity className="w-4 h-4 text-sky-600" /> },
    { id: 'waveform', label: 'Waveform', icon: <Waves className="w-4 h-4" /> },
    { id: 'detection', label: 'Protocol Detection', icon: <Search className="w-4 h-4" /> },
    { id: 'decoded', label: 'Decoded Data', icon: <Table className="w-4 h-4" /> },
    { id: 'health', label: 'Signal Health', icon: <HeartPulse className="w-4 h-4 text-emerald-600" /> },
    { id: 'fault', label: 'Fault Diagnosis', icon: <AlertTriangle className="w-4 h-4 text-amber-600" /> },
    { id: 'unknown', label: 'Unknown Protocol', icon: <HelpCircle className="w-4 h-4 text-purple-600" /> },
    { id: 'history', label: 'Capture History', icon: <History className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col justify-between select-none shrink-0 h-[calc(100vh-3.5rem)]">
      {/* Navigation Links */}
      <div className="py-3 px-2 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
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
                  ? 'bg-sky-50 text-sky-700 border border-sky-200 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.2 text-[9px] bg-slate-100 rounded text-slate-500 font-semibold border border-slate-200">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Device Telemetry Box */}
      <div className="p-3 m-2 bg-slate-50 rounded border border-slate-200 font-mono text-xs">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between mb-1.5 font-semibold">
          <span>DEVICE STATUS</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-led" />
        </div>
        
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-[11px] mb-1">
          <Usb className="w-3.5 h-3.5 text-sky-600" />
          <span>{hardwareStatus.deviceName}</span>
        </div>

        <div className="text-[10px] text-slate-500 space-y-0.5">
          <div className="flex justify-between">
            <span>Connection:</span>
            <span className="text-emerald-600 font-semibold">{hardwareStatus.connectionType}</span>
          </div>
          <div className="flex justify-between">
            <span>Sampling:</span>
            <span className="text-slate-900 font-semibold">{hardwareStatus.samplingRate}</span>
          </div>
          <div className="flex justify-between">
            <span>Buffer:</span>
            <span className="text-slate-900 font-semibold">{hardwareStatus.bufferKb} KB</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
