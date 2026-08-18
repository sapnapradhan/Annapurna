import React, { useState, useEffect } from 'react';
import { appStore } from '../../services/store';
import { Meal, Checkin } from '../../types';
import { Users, Activity, Clock, Shield, CheckCircle2, UserCheck, TrendingUp } from 'lucide-react';

interface LiveAttendancePageProps {
  selectedMealId?: string;
}

export const LiveAttendancePage: React.FC<LiveAttendancePageProps> = ({ selectedMealId }) => {
  const todayMeals = appStore.getTodayMeals();
  const [activeMealId, setActiveMealId] = useState<string>(
    selectedMealId || todayMeals.find(m => m.status === 'open')?.id || todayMeals[1]?.id || todayMeals[0]?.id || ''
  );
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [meal, setMeal] = useState<Meal | undefined>(appStore.getMealById(activeMealId));

  useEffect(() => {
    const update = () => {
      setMeal(appStore.getMealById(activeMealId));
      setCheckins(appStore.getMealCheckins(activeMealId));
    };
    update();
    return appStore.subscribe(update);
  }, [activeMealId]);

  const expected = meal?.expected_qty || 500;
  const count = checkins.length;
  const pct = Math.round((count / expected) * 100);
  const remaining = Math.max(expected - count, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>Live Turnstile Attendance Stream</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time turnstile telemetry. Monitors student check-in velocity, expected headcount, and rolling turnstile feed.
          </p>
        </div>

        <select
          value={activeMealId}
          onChange={(e) => setActiveMealId(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-amber-200 font-semibold focus:outline-none"
        >
          {todayMeals.map(m => (
            <option key={m.id} value={m.id}>
              {m.meal_type.toUpperCase()}: {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium mb-1">Expected Headcount</div>
          <div className="text-2xl font-bold font-mono text-slate-100">{expected}</div>
          <div className="text-[10px] text-slate-500 mt-1">Authority Estimated</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30">
          <div className="text-xs text-emerald-400 font-medium mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Total Checked In</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300">{count}</div>
          <div className="text-[10px] text-emerald-400/80 mt-1">Turnstile Validated</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-amber-400 font-medium mb-1">Participation Rate</div>
          <div className="text-2xl font-bold font-mono text-amber-300">{pct}%</div>
          <div className="text-[10px] text-amber-400/80 mt-1">Realtime Ratio</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium mb-1">Remaining Expected</div>
          <div className="text-2xl font-bold font-mono text-slate-300">{remaining}</div>
          <div className="text-[10px] text-slate-500 mt-1">Unchecked Headcount</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-300 font-semibold">Turnstile Capacity Fill</span>
          <span className="text-emerald-400 font-bold">{count} of {expected} ({pct}%)</span>
        </div>
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-emerald-500 rounded-full transition-all duration-700 shadow-lg shadow-emerald-500/20"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>

      {/* Rolling Recent Check-ins Feed */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Rolling Live Check-in Stream</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Showing recent student scans</span>
        </div>

        {checkins.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No check-ins recorded yet for this meal session.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-2">
            {checkins.map((chk) => (
              <div 
                key={chk.id} 
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs animate-in fade-in"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center">
                    {chk.student_name ? chk.student_name.charAt(0) : 'S'}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{chk.student_name || 'Verified Student'}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{chk.hostel || 'Nilgiri Hostel'}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-amber-300 font-semibold">
                    {new Date(chk.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">Turnstile Validated</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
