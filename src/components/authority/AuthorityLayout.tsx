import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Utensils, Clock, QrCode, Users, MessageSquareQuote, 
  Trash2, Truck, TrendingUp, Settings, LogOut, Bell, X
} from 'lucide-react';
import { appStore } from '../../services/store';
import { ThemeToggle } from '../common/ThemeToggle';
import { AudioPlayer } from '../common/AudioPlayer';
import { VoiceAssistWidget } from '../common/VoiceAssistWidget';

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
  const user = appStore.getCurrentUser();
  const [notifications, setNotifications] = useState(appStore.getAdminNotifications());
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  useEffect(() => {
    const update = () => setNotifications([...appStore.getAdminNotifications()]);
    return appStore.subscribe(update);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'today', label: 'Today\'s Service', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu Management', icon: Utensils },
    { id: 'timing', label: 'Meal Timings', icon: Clock },
    { id: 'qr', label: 'QR Session Generator', icon: QrCode },
    { id: 'live', label: 'Live Attendance', icon: Users },
    { id: 'feedback', label: 'Feedback Dashboard', icon: MessageSquareQuote },
    { id: 'consumption', label: 'Post-Meal Consumption', icon: Trash2 },
    { id: 'surplus', label: 'Surplus Redistribution', icon: Truck },
    { id: 'forecasting', label: 'Demand Forecasting', icon: TrendingUp },
    { id: 'settings', label: 'Authority Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-provided-image text-[#2C221E] dark:text-slate-100 font-sans flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white/10 dark:bg-black/40 border-r border-white/20 dark:border-white/10 hidden md:flex flex-col justify-between p-4 backdrop-blur-xl shrink-0">
        <div className="space-y-6">
          {/* Logo Header */}
          <div className="flex items-center gap-3 px-2 pt-2">
            <img 
              src="/logo.png" 
              alt="ANNAPURNA Logo" 
              className="h-10 w-auto object-contain shrink-0" 
            />
            <div>
              <div className="font-cursive font-bold text-xl text-[#2C221E] dark:text-amber-100">Annapurna</div>
              <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400">Authority Ops Portal</div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer
                    ${isActive 
                      ? 'bg-[#C86D44] text-white shadow-lg' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/5'}
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Authenticated Admin Profile Card */}
        <div className="p-3 rounded-2xl bg-white/10 dark:bg-black/30 border border-white/10 space-y-2 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs">
            <div className="font-bold truncate text-[#2C221E] dark:text-white">{user.name}</div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C86D44]/20 text-[#C86D44] dark:text-amber-300 font-bold uppercase">
              Admin
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            Authenticated Ops Admin Session
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/10 dark:bg-black/30 backdrop-blur-md border-b border-white/20 dark:border-white/10 px-6 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="font-cursive font-bold text-xl text-[#2C221E] dark:text-white">
              Campus Food Operations
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDrawer(!showNotifDrawer)}
                className="p-2 rounded-full bg-white/10 dark:bg-black/30 border border-white/20 text-slate-700 dark:text-slate-200 hover:text-[#C86D44] transition-colors relative cursor-pointer"
                title="Authority Real-time Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer Popover */}
              {showNotifDrawer && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-[#1A1715]/95 text-white border border-amber-500/30 shadow-2xl p-5 space-y-4 backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="font-cursive font-bold text-lg text-amber-100">Authority Notifications</div>
                    <button onClick={() => setShowNotifDrawer(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[#C86D44] dark:text-amber-400 font-mono font-bold text-[10px]">
                          <span>{n.title}</span>
                          <span>{n.timestamp}</span>
                        </div>
                        <p className="text-slate-200 font-medium leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <AudioPlayer />
            <VoiceAssistWidget label="Ops Voice" textToRead="Annapurna Authority Operations Portal. Central Dining Operations." />
            <ThemeToggle />
            <button
              onClick={onLogout}
              className="p-2 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/30 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
