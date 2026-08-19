import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, QrCode, Users, Star, BarChart2, Truck, TrendingUp, 
  LogOut, Shield, ChevronRight, Menu, X, Utensils, AlertTriangle, Activity
} from 'lucide-react';
import { appStore } from '../../services/store';
import { ThemeToggle } from '../common/ThemeToggle';
import { AudioPlayer } from '../common/AudioPlayer';

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
    <div className="min-h-screen bg-provided-image text-[#2C221E] dark:text-slate-100 flex font-sans antialiased">
      {/* Editorial Overlay */}
      <div className="fixed inset-0 bg-[#FDFBF7]/90 dark:bg-[#12100F]/95 backdrop-blur-[2px] pointer-events-none z-0" />

      <div className="relative z-10 flex w-full min-h-screen">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#F5EFE6] dark:bg-[#1A1715] border-r border-[#EBE4D8] dark:border-[#2C2724] flex flex-col justify-between transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div>
            {/* Brand */}
            <div className="p-4 border-b border-[#EBE4D8] dark:border-[#2C2724] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C86D44] text-white flex items-center justify-center font-bold font-serif">
                  A
                </div>
                <div>
                  <div className="font-serif font-bold text-sm text-[#2C221E] dark:text-slate-100 tracking-wider">ANNAPURNA</div>
                  <div className="text-[10px] font-mono text-[#C86D44] dark:text-amber-400 font-bold">AUTHORITY CONTROL</div>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Mess Selector */}
            <div className="p-3 bg-[#FDFBF7]/60 dark:bg-[#12100F]/60 border-b border-[#EBE4D8] dark:border-[#2C2724]">
              <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Active Dining Facility
              </label>
              <select
                value={selectedMessId}
                onChange={(e) => setSelectedMessId(e.target.value)}
                className="w-full bg-[#FDFBF7] dark:bg-[#201D1A] border border-[#EBE4D8] dark:border-[#2C2724] text-xs rounded-lg p-2 text-[#C86D44] dark:text-amber-300 font-semibold focus:outline-none"
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
                      w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer
                      ${isActive 
                        ? 'bg-[#C86D44]/15 text-[#C86D44] dark:text-amber-300 border border-[#C86D44]/30 shadow-sm' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-[#2C221E] dark:hover:text-slate-200 hover:bg-[#EBE4D8]/50 dark:hover:bg-[#24201D]'}
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#C86D44] dark:text-amber-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Info & Controls */}
          <div className="p-3 border-t border-[#EBE4D8] dark:border-[#2C2724] bg-[#FDFBF7]/40 dark:bg-[#12100F]/40 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#C86D44]/20 border border-[#C86D44]/40 flex items-center justify-center text-[#C86D44] dark:text-amber-300 text-xs font-bold font-serif">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-[#2C221E] dark:text-slate-200 truncate">{user.name}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.block}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => appStore.loginAs('student')}
                className="flex-1 py-1.5 rounded-lg bg-[#EBE4D8] dark:bg-[#24201D] hover:bg-[#DCD1C0] dark:hover:bg-[#2E2824] text-[10px] font-semibold text-[#2C221E] dark:text-slate-300 transition-colors text-center"
              >
                Student View
              </button>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-colors"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-14 bg-[#F5EFE6] dark:bg-[#1A1715] border-b border-[#EBE4D8] dark:border-[#2C2724] px-4 sm:px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 p-1">
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-mono font-bold text-[#2C221E] dark:text-slate-300">
                  MESS OPS ENGINE
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <AudioPlayer />
              <ThemeToggle />
              <div className="hidden sm:flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5 text-[#C86D44] dark:text-amber-400" />
                <span>{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                <span className="text-[#C86D44] dark:text-amber-300 font-bold">{currentTime.toLocaleTimeString()}</span>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>ONLINE</span>
              </div>
            </div>
          </header>

          {/* Sub-page Container */}
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
