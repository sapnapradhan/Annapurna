import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, QrCode, Users, Star, BarChart2, Truck, TrendingUp, 
  LogOut, Shield, ChevronRight, Menu, X, Utensils, AlertTriangle, Activity
} from 'lucide-react';
import { appStore } from '../../services/store';
import { UserRole } from '../../types';

interface AuthorityLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AuthorityLayout: React.FC<AuthorityLayoutProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const user = appStore.getCurrentUser();
  const messes = appStore.getMesses();
  const [selectedMessId, setSelectedMessId] = useState(messes[0]?.id || '');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'today', label: "Today's Meals", icon: Calendar },
    { id: 'menu', label: 'Menu Management', icon: Utensils },
    { id: 'timing', label: 'Meal Timing & Overrides', icon: Clock },
    { id: 'qr', label: 'Generate QR Session', icon: QrCode },
    { id: 'live', label: 'Live Attendance', icon: Users, badge: 'Realtime' },
    { id: 'feedback', label: 'Meal Feedback Dashboard', icon: Star },
    { id: 'consumption', label: 'Post-Meal Consumption', icon: BarChart2 },
    { id: 'surplus', label: 'Surplus & Rescue', icon: Truck, badge: 'Active' },
    { id: 'forecasting', label: 'Demand Forecasting', icon: TrendingUp },
    { id: 'settings', label: 'Profile / Settings', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Brand */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                A
              </div>
              <div>
                <div className="font-serif font-bold text-sm text-slate-100 tracking-wider">ANNAPURNA</div>
                <div className="text-[10px] font-mono text-amber-400">AUTHORITY CONTROL</div>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Mess Selector */}
          <div className="p-3 bg-slate-950/60 border-b border-slate-800">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Active Dining Facility
            </label>
            <select
              value={selectedMessId}
              onChange={(e) => setSelectedMessId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-xs rounded-md p-2 text-amber-200 focus:outline-none focus:border-amber-500"
            >
              {messes.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer
                    ${isActive 
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info & Switch Roles */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 text-xs font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-slate-200 truncate">{user.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{user.block}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => appStore.loginAs('student')}
              className="flex-1 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-medium text-slate-300 border border-slate-700 transition-colors text-center"
            >
              Student View
            </button>
            <button
              onClick={onLogout}
              className="p-1.5 rounded bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-800/40 transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Operational Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 p-1">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-semibold text-slate-300">
                MESS OPS ENGINE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="hidden sm:flex items-center gap-2 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              <span className="text-amber-300 font-bold">{currentTime.toLocaleTimeString()}</span>
            </div>
            <div className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>SYSTEM ONLINE</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
