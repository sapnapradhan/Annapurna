import React, { useState, useEffect } from 'react';
import { appStore } from '../../services/store';
import { Checkin } from '../../types';
import { CalendarCheck, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

export const StudentAttendancePage: React.FC = () => {
  const user = appStore.getCurrentUser();
  const [checkins, setCheckins] = useState<Checkin[]>([]);

  useEffect(() => {
    const update = () => setCheckins(appStore.getCheckins().filter(c => c.student_id === user.id));
    update();
    return appStore.subscribe(update);
  }, [user.id]);

  const ratios = [
    { type: 'Breakfast', pct: 90, attended: 18, total: 20 },
    { type: 'Lunch', pct: 95, attended: 19, total: 20 },
    { type: 'Snacks', pct: 85, attended: 17, total: 20 },
    { type: 'Dinner', pct: 92, attended: 18, total: 20 },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-emerald-400" />
          <span>My Dining Attendance</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Monthly participation breakdown across breakfast, lunch, snacks, and dinner.</p>
      </div>

      {/* Monthly Overall Metric */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 text-center space-y-2">
        <div className="text-xs font-mono font-bold text-emerald-400 uppercase">MONTHLY PARTICIPATION RATE</div>
        <div className="text-4xl font-bold font-mono text-emerald-300">91.8%</div>
        <div className="text-xs text-slate-400">72 of 78 scheduled campus meals attended</div>
      </div>

      {/* Per Meal Type Breakdown */}
      <div className="grid grid-cols-2 gap-3">
        {ratios.map((r, idx) => (
          <div key={idx} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-200">{r.type}</span>
              <span className="font-mono text-emerald-400 font-bold">{r.pct}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${r.pct}%` }} />
            </div>
            <div className="text-[10px] text-slate-400 font-mono">{r.attended}/{r.total} sessions</div>
          </div>
        ))}
      </div>

      {/* History Log Table */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="font-bold text-xs text-slate-300 uppercase font-mono tracking-wider">Attendance Log History</h3>

        <div className="space-y-2">
          {checkins.map((chk) => {
            const meal = appStore.getMealById(chk.meal_id);
            return (
              <div key={chk.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-200">{meal?.name || 'Campus Meal'}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Nilgiri Mess</div>
                  </div>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <div className="text-emerald-300 font-semibold">{new Date(chk.checked_in_at).toLocaleDateString()}</div>
                  <div className="text-slate-500">{new Date(chk.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
