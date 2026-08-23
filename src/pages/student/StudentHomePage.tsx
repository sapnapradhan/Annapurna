import React, { useState, useEffect } from 'react';
import { appStore } from '../../services/store';
import { 
  QrCode, Utensils, Calendar, Clock, Star, ShieldCheck, Heart, 
  MapPin, CheckCircle2, Building, ChevronRight, Award, AlertCircle 
} from 'lucide-react';

interface StudentHomePageProps {
  onNavigate: (tab: string, mealId?: string) => void;
}

export const StudentHomePage: React.FC<StudentHomePageProps> = ({ onNavigate }) => {
  const user = appStore.getCurrentUser();
  const meals = appStore.getMeals();
  const todayDinner = meals.find(m => m.id === 'meal-today-dinner') || meals[0];

  const [selectedHostel, setSelectedHostel] = useState<string>(
    user.hostel || 'LH1'
  );

  const [liveAttendance, setLiveAttendance] = useState(
    appStore.getLiveAttendance(todayDinner?.id)
  );

  useEffect(() => {
    const update = () => {
      setLiveAttendance(appStore.getLiveAttendance(todayDinner?.id));
    };
    return appStore.subscribe(update);
  }, [todayDinner?.id]);

  const hostels = ['LH1', 'LH2', 'LH3', 'LH4', 'LH5'];

  return (
    <div className="space-y-6 text-[#2C221E] dark:text-slate-100 font-sans">
      {/* University Campus Student Dining Pass Card */}
      <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C86D44]/20 text-[#C86D44] dark:text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Building className="w-3 h-3" />
              <span>BHUBANESWAR CENTRAL UNIVERSITY</span>
            </div>
            <h1 className="font-cursive font-bold text-2xl sm:text-3xl text-[#2C221E] dark:text-amber-100">
              Welcome back, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-mono">
              Roll No: BCU-2026-8819 • {selectedHostel}
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#C86D44] text-white flex items-center justify-center font-cursive font-bold text-2xl shadow-lg border border-amber-300/30">
            {user.name.charAt(0)}
          </div>
        </div>

        {/* Hostel Block Selector */}
        <div className="pt-2 border-t border-white/20 dark:border-white/10">
          <label className="text-[10px] font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
            Hostel Dining Hall Assignment:
          </label>
          <select
            value={selectedHostel}
            onChange={(e) => setSelectedHostel(e.target.value)}
            className="w-full bg-white/10 dark:bg-black/40 border border-white/20 text-xs font-semibold rounded-xl p-2.5 text-[#C86D44] dark:text-amber-300 focus:outline-none backdrop-blur-md"
          >
            {hostels.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Foodish & Helping Action Buttons Grid */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('checkin', todayDinner?.id)}
          className="p-4 rounded-2xl bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <span>🍱 Turnstile Check-in</span>
        </button>

        <button
          onClick={() => onNavigate('meals')}
          className="p-4 rounded-2xl bg-white/10 dark:bg-black/30 border border-white/20 text-[#2C221E] dark:text-slate-100 hover:border-[#C86D44] font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 backdrop-blur-md"
        >
          <div className="w-10 h-10 rounded-full bg-[#C86D44]/20 flex items-center justify-center text-[#C86D44] dark:text-amber-400">
            <Utensils className="w-5 h-5" />
          </div>
          <span>🍲 Today's Mess Menu</span>
        </button>
      </div>

      {/* Today's Active Hostel Meal Card */}
      {todayDinner && (
        <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C86D44] dark:text-amber-400" />
              <span className="text-xs font-mono font-bold text-[#C86D44] dark:text-amber-300 uppercase">
                UPCOMING DINNER SERVICE
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              OPEN NOW
            </span>
          </div>

          <div>
            <h3 className="font-cursive font-bold text-2xl text-[#2C221E] dark:text-white">
              {todayDinner.title}
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
              {todayDinner.items.join(' • ')}
            </p>
          </div>

          {/* Real-time Dynamic Attendance Bar */}
          <div className="p-3 rounded-2xl bg-white/10 dark:bg-black/40 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600 dark:text-slate-400">Hostel Turnstile Check-ins:</span>
              <span className="font-bold text-[#C86D44] dark:text-amber-300">
                {liveAttendance.checkinCount} / {liveAttendance.totalRegistered} Registered ({liveAttendance.percentage}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-[#C86D44] transition-all duration-500"
                style={{ width: `${liveAttendance.percentage}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => onNavigate('checkin', todayDinner.id)}
              className="flex-1 py-3 rounded-2xl bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span>SCAN QR TO EAT</span>
            </button>
          </div>
        </div>
      )}

      {/* University Campus Impact */}
      <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C86D44] dark:text-amber-400">
          <Heart className="w-4 h-4 text-rose-500 fill-current" />
          <span>CAMPUS HUNGER RELIEF IMPACT</span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          Your hostel dining hall check-ins help compute exact prep quantities. Zero food is wasted; unavoidable surplus feeds Bhubaneswar shelter homes.
        </p>
      </div>
    </div>
  );
};
