import React from 'react';
import { Home, Utensils, QrCode, CalendarCheck, User, LogOut } from 'lucide-react';
import { appStore } from '../../services/store';
import { ThemeToggle } from '../common/ThemeToggle';
import { AudioPlayer } from '../common/AudioPlayer';
import { VoiceAssistWidget } from '../common/VoiceAssistWidget';
import { DynamicParticles } from '../common/DynamicParticles';

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
    <div className="min-h-screen bg-student-image text-[#2C221E] dark:text-slate-100 font-sans pb-24 transition-colors duration-300 selection:bg-emerald-500 selection:text-white relative">
      {/* Ambient Floating Particles */}
      <DynamicParticles />

      {/* Editorial Translucent Background Scrim Overlay over Student Hostel Mess Background Image */}
      <div className="fixed inset-0 bg-[#FDFBF7]/85 dark:bg-[#090807]/90 backdrop-blur-[2px] pointer-events-none z-0" />

      <div className="relative z-10">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 bg-white/10 dark:bg-black/30 backdrop-blur-md border-b border-white/20 dark:border-white/10 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C86D44] text-white flex items-center justify-center font-cursive font-bold text-base shadow-sm">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="font-cursive font-bold text-sm text-[#2C221E] dark:text-slate-100 leading-tight">Annapurna Student</div>
              <div className="text-[10px] text-slate-600 dark:text-slate-300 font-mono">{user.hostel} • {user.block}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AudioPlayer />
            <VoiceAssistWidget label="Listen" textToRead={`Welcome back ${user.name}. Your next meal pass is ready. hostel ${user.hostel}.`} />
            <ThemeToggle />
            <button
              onClick={() => appStore.loginAs('authority')}
              className="px-2.5 py-1 rounded-full bg-white/10 dark:bg-black/30 hover:bg-white/20 text-[#2C221E] dark:text-slate-200 text-[10px] font-semibold border border-white/20 transition-colors backdrop-blur-md"
            >
              Authority View
            </button>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/30 transition-colors"
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
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/10 dark:bg-black/40 backdrop-blur-xl border-t border-white/20 dark:border-white/10 px-2 py-2 max-w-lg mx-auto shadow-2xl">
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
                      ? 'text-emerald-600 dark:text-emerald-400 font-bold' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'}
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
