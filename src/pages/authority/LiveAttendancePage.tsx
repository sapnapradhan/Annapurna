import React, { useState, useEffect } from 'react';
import { appStore } from '../../services/store';
import { Users, Clock, QrCode, CheckCircle2, ShieldCheck, Activity, RefreshCw } from 'lucide-react';

interface LiveAttendancePageProps {
  selectedMealId?: string;
}

export const LiveAttendancePage: React.FC<LiveAttendancePageProps> = ({ 
  selectedMealId = 'meal-today-dinner' 
}) => {
  const meals = appStore.getMeals();
  const meal = meals.find(m => m.id === selectedMealId) || meals[0];

  const [liveAttendance, setLiveAttendance] = useState(
    appStore.getLiveAttendance(meal?.id)
  );
  const [checkins, setCheckins] = useState(appStore.getCheckins());

  useEffect(() => {
    const update = () => {
      setLiveAttendance(appStore.getLiveAttendance(meal?.id));
      setCheckins(appStore.getCheckins());
    };
    return appStore.subscribe(update);
  }, [meal?.id]);

  return (
    <div className="space-y-6 text-[#2C221E] dark:text-slate-100 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBE4D8] dark:border-[#2C2724] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C86D44]/20 text-[#C86D44] dark:text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
            <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>REAL-TIME STREAM</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#2C221E] dark:text-white mt-1">
            Live Mess Turnstile Attendance
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
            {meal?.title} • Live Turnstile Feed
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>TURNSTILE GATES ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Real-time Dynamic Metrics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-lg">
          <div className="text-xs font-mono text-slate-600 dark:text-slate-400 uppercase">Verified Check-ins</div>
          <div className="text-3xl font-bold font-mono text-[#C86D44] dark:text-amber-300 mt-1">
            {liveAttendance.checkinCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Updated in real-time</div>
        </div>

        <div className="p-5 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-lg">
          <div className="text-xs font-mono text-slate-600 dark:text-slate-400 uppercase">Total Registered Students</div>
          <div className="text-3xl font-bold font-mono text-[#2C221E] dark:text-white mt-1">
            {liveAttendance.totalRegistered}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Active hostel dining passes</div>
        </div>

        <div className="p-5 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-lg">
          <div className="text-xs font-mono text-slate-600 dark:text-slate-400 uppercase">Live Turnstile Attendance Rate</div>
          <div className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {liveAttendance.percentage}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Dynamic percentage calculation</div>
        </div>
      </div>

      {/* Live Check-in Activity Stream */}
      <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-[#2C221E] dark:text-white">
            Recent Turnstile Scan Logs
          </h2>
          <span className="text-xs font-mono text-slate-500">
            {checkins.length} Total Scans
          </span>
        </div>

        {checkins.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono">
            No check-ins logged yet. Students scanning their QR pass will appear here in real-time.
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {checkins.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-2xl bg-white/10 dark:bg-black/40 border border-white/10 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#2C221E] dark:text-white">{c.studentName}</div>
                    <div className="text-[10px] font-mono text-slate-500">{c.hostel}</div>
                  </div>
                </div>

                <div className="text-right font-mono text-[11px]">
                  <div className="text-[#C86D44] dark:text-amber-400 font-bold">
                    {new Date(c.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-[10px] text-slate-500">{c.verifiedBy}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
