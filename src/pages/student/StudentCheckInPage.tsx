import React, { useState, useEffect } from 'react';
import { appStore } from '../../services/store';
import { 
  QrCode, CheckCircle2, AlertCircle, Camera, ShieldCheck, Clock, Building, ArrowLeft 
} from 'lucide-react';

interface StudentCheckInPageProps {
  selectedMealId?: string;
  onNavigate: (tab: string) => void;
}

export const StudentCheckInPage: React.FC<StudentCheckInPageProps> = ({ 
  selectedMealId = 'meal-today-dinner',
  onNavigate
}) => {
  const user = appStore.getCurrentUser();
  const meals = appStore.getMeals();
  const meal = meals.find(m => m.id === selectedMealId) || meals[0];

  const [checkinSuccess, setCheckinSuccess] = useState(false);
  const [liveAttendance, setLiveAttendance] = useState(
    appStore.getLiveAttendance(meal?.id)
  );

  useEffect(() => {
    const update = () => setLiveAttendance(appStore.getLiveAttendance(meal?.id));
    return appStore.subscribe(update);
  }, [meal?.id]);

  const handleScan = () => {
    appStore.recordCheckin(meal.id, 'mess-1');
    setCheckinSuccess(true);
  };

  return (
    <div className="space-y-6 text-[#2C221E] dark:text-slate-100 font-sans">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('home')}
          className="p-2 rounded-full bg-white/10 dark:bg-black/30 border border-white/20 hover:border-[#C86D44] text-slate-700 dark:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-cursive font-bold text-2xl text-[#2C221E] dark:text-amber-100">
            Hostel Mess QR Turnstile Scanner
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
            {user.hostel || 'Hostel 1 - Mahanadi Hall'} • Turnstile Gate A1
          </p>
        </div>
      </div>

      {/* QR Checkin Container */}
      <div className="p-8 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl text-center space-y-6">
        {checkinSuccess ? (
          <div className="space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500/40 shadow-xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="font-cursive font-bold text-3xl text-emerald-600 dark:text-emerald-400">
                Turnstile Scan Verified!
              </h2>
              <p className="text-xs font-mono text-slate-700 dark:text-slate-300">
                Pass Verified for {user.name} • {meal.title}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-slate-700 dark:text-slate-200">
              Enjoy your meal! Your turnstile scan has been recorded in real time on the campus operations dashboard.
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-3 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-colors cursor-pointer"
            >
              Return to Student Home
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-48 h-48 rounded-3xl bg-white p-4 mx-auto border-4 border-[#C86D44]/40 shadow-2xl flex items-center justify-center">
              {/* Generated QR Pass Canvas */}
              <div className="w-full h-full bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white space-y-2 p-2">
                <QrCode className="w-20 h-20 text-amber-400" />
                <span className="text-[9px] font-mono tracking-widest uppercase text-amber-300">
                  BCU-{user.id.slice(-6)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C86D44]/20 border border-[#C86D44]/30 text-[#C86D44] dark:text-amber-300 text-xs font-mono font-bold uppercase">
                <Clock className="w-3.5 h-3.5" />
                <span>{meal.title} Pass</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                Hold your phone near the hostel mess turnstile scanner or click below to simulate real-time scan.
              </p>
            </div>

            {/* Dynamic Attendance Counter */}
            <div className="p-3 rounded-2xl bg-white/10 dark:bg-black/40 border border-white/10 text-xs font-mono text-center">
              Live Hostel Check-ins: <span className="font-bold text-[#C86D44] dark:text-amber-300">{liveAttendance.checkinCount} / {liveAttendance.totalRegistered}</span> ({liveAttendance.percentage}%)
            </div>

            <button
              onClick={handleScan}
              className="w-full py-4 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>🍱 SCAN TURNSTILE QR NOW</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
