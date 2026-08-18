import React from 'react';
import { Home, Utensils, QrCode, CalendarCheck, User, LogOut, ArrowLeft } from 'lucide-react';
import { appStore } from '../../services/store';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 selection:bg-emerald-500 selection:text-white">
      {/* Mobile-optimized Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-xs text-emerald-400">
              {user.name.charAt(0)}
            </div>
          </div>
          <div>
            <div className="font-bold text-sm text-slate-100 leading-tight">ANNAPURNA</div>
            <div className="text-[10px] text-slate-400 font-mono">{user.hostel} • {user.block}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => appStore.loginAs('authority')}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold border border-slate-700 transition-colors"
          >
            Authority View
          </button>
          <button
            onClick={onLogout}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Student Page Container */}
      <main className="max-w-lg mx-auto px-4 py-5 space-y-6">
        {children}
      </main>

      {/* Strict 5-Item Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800 px-2 py-2 max-w-lg mx-auto">
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
                    ? 'text-emerald-400 font-bold' 
                    : 'text-slate-400 hover:text-slate-200'}
                `}
              >
                {item.highlight ? (
                  <div className={`p-2.5 rounded-2xl -mt-5 shadow-xl transition-transform ${isActive ? 'bg-emerald-500 text-slate-950 scale-110 shadow-emerald-500/30' : 'bg-emerald-600 text-slate-950'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                ) : (
                  <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                )}
                <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
