import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Search, 
  Table, 
  HeartPulse, 
  Cpu, 
  Settings,
  Usb,
  Radio,
  Tv
} from 'lucide-react';
import type { NavigationTab, SystemHardwareStatus } from '../types/analyzer';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  hardwareStatus: SystemHardwareStatus;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  hardwareStatus
}) => {
  const menuItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'SINGLE SCREEN VIEW', icon: <LayoutDashboard className="w-3.5 h-3.5 text-instrument-blue" /> },
    { id: 'capture', label: 'LIVE CAPTURE', icon: <Activity className="w-3.5 h-3.5 text-instrument-blue" /> },
    { id: 'protocol', label: 'PROTOCOL', icon: <Search className="w-3.5 h-3.5" /> },
    { id: 'decoded', label: 'DECODED DATA', icon: <Table className="w-3.5 h-3.5" /> },
    { id: 'health', label: 'SIGNAL HEALTH', icon: <HeartPulse className="w-3.5 h-3.5 text-instrument-green" /> },
    { id: 'hardware', label: 'HARDWARE', icon: <Cpu className="w-3.5 h-3.5 text-instrument-purple" /> },
    { id: 'settings', label: 'SETTINGS', icon: <Settings className="w-3.5 h-3.5" /> },
  ];

  return (
    <aside className="w-52 bg-instrument-panel border-r border-instrument-border flex flex-col justify-between select-none shrink-0 h-[calc(100vh-3.25rem)]">
      {/* Main Navigation Links */}
      <div className="py-2 px-2 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-sans text-instrument-textMuted uppercase tracking-wider font-bold">
          MENU
        </div>

        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-sm text-xs font-sans transition-colors ${
                isActive
                  ? 'bg-instrument-bg text-instrument-blue border border-instrument-borderHighlight font-bold shadow-sm'
                  : 'text-instrument-textSubtle hover:text-instrument-textBright hover:bg-instrument-bg border border-transparent'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Physical Hardware Status Telemetry */}
      <div className="p-3 m-2 bg-instrument-bg rounded-sm border border-instrument-border font-mono text-[11px] space-y-2">
        <div className="text-[10px] text-instrument-textMuted uppercase tracking-wider flex items-center justify-between font-bold border-b border-instrument-border pb-1">
          <span>HARDWARE STACK</span>
          <span className={`w-2 h-2 rounded-full ${hardwareStatus.esp32_2_connected ? 'bg-instrument-green animate-led' : 'bg-instrument-red'}`} />
        </div>
        
        {/* ESP32 #2 Status */}
        <div className="space-y-0.5">
          <div className="flex items-center space-x-1.5 text-instrument-textBright font-bold">
            <Usb className="w-3 h-3 text-instrument-blue shrink-0" />
            <span>ESP32 #2 (Analyzer)</span>
          </div>
          <div className="text-[10px] pl-4 flex justify-between">
            <span className="text-instrument-textMuted">USB Serial:</span>
            <span className={hardwareStatus.esp32_2_connected ? 'text-instrument-green font-bold' : 'text-instrument-red'}>
              {hardwareStatus.esp32_2_connected ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* ESP32 #1 Status */}
        <div className="space-y-0.5">
          <div className="flex items-center space-x-1.5 text-instrument-textBright font-bold">
            <Radio className="w-3 h-3 text-instrument-amber shrink-0" />
            <span>ESP32 #1 (Generator)</span>
          </div>
          <div className="text-[10px] pl-4 flex justify-between">
            <span className="text-instrument-textMuted">Signal DUT:</span>
            <span className="text-instrument-textSubtle font-semibold">{hardwareStatus.esp32_1_status}</span>
          </div>
        </div>

        {/* 16x2 LCD Status */}
        <div className="space-y-0.5">
          <div className="flex items-center space-x-1.5 text-instrument-textBright font-bold">
            <Tv className="w-3 h-3 text-instrument-purple shrink-0" />
            <span>16×2 I²C LCD</span>
          </div>
          <div className="text-[10px] pl-4 flex justify-between">
            <span className="text-instrument-textMuted">Local Display:</span>
            <span className="text-instrument-textSubtle font-semibold">{hardwareStatus.lcd_status}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
