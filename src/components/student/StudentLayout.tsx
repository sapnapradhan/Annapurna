import React from 'react';
import { Home, Utensils, QrCode, CalendarCheck, User, LogOut } from 'lucide-react';
import { appStore } from '../../services/store';
import { ThemeToggle } from '../common/ThemeToggle';
import { AudioPlayer } from '../common/AudioPlayer';

interface StudentLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
  children
}) => {
  const user = appStore.getCurrentUser();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'meals', label: 'Meals', icon: Utensils },
    { id: 'checkin', label: 'Check-in', icon: QrCode, highlight: true },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-provided-image text-[#2C221E] dark:text-slate-100 font-sans pb-24 transition-colors duration-300 selection:bg-emerald-500 selection:text-white">
      {/* Editorial Background Overlay */}
      <div className="fixed inset-0 bg-[#FDFBF7]/90 dark:bg-[#12100F]/95 backdrop-blur-[2px] pointer-events-none z-0" />

      <div className="relative z-10">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 bg-[#F5EFE6]/90 dark:bg-[#1A1715]/90 backdrop-blur-md border-b border-[#EBE4D8] dark:border-[#2C2724] px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C86D44] text-white flex items-center justify-center font-serif font-bold text-xs shadow-sm">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-xs text-[#2C221E] dark:text-slate-100 leading-tight">ANNAPURNA</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{user.hostel} • {user.block}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AudioPlayer />
            <ThemeToggle />
            <button
              onClick={() => appStore.loginAs('authority')}
              className="px-2.5 py-1 rounded-full bg-[#EBE4D8] dark:bg-[#24201D] hover:bg-[#DCD1C0] dark:hover:bg-[#2E2824] text-[#2C221E] dark:text-slate-300 text-[10px] font-semibold border border-[#EBE4D8] dark:border-[#38322E] transition-colors"
            >
              Authority View
            </button>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-lg mx-auto px-4 py-5 space-y-6">
          {children}
        </main>

        {/* 5-Item Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#F5EFE6]/95 dark:bg-[#1A1715]/95 backdrop-blur-xl border-t border-[#EBE4D8] dark:border-[#2C2724] px-2 py-2 max-w-lg mx-auto shadow-lg">
          <div className="grid grid-cols-5 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer relative
                    ${isActive 
                      ? 'text-emerald-700 dark:text-emerald-400 font-bold' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}
                  `}
                >
                  {item.highlight ? (
                    <div className={`p-2.5 rounded-2xl -mt-5 shadow-lg transition-transform ${isActive ? 'bg-emerald-600 text-white scale-110' : 'bg-emerald-700 text-white'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  ) : (
                    <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`} />
                  )}
                  <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};
