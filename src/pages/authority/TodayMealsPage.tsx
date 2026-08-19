import React, { useState, useEffect } from 'react';
import { appStore } from '../../services/store';
import { Meal } from '../../types';
import { Calendar, Clock, QrCode, Users, Edit, CheckCircle2, Play, AlertCircle, Plus } from 'lucide-react';

interface TodayMealsPageProps {
  onNavigate: (tab: string, mealId?: string) => void;
}

export const TodayMealsPage: React.FC<TodayMealsPageProps> = ({ onNavigate }) => {
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const update = () => setMeals(appStore.getTodayMeals());
    update();
    return appStore.subscribe(update);
  }, []);

  const getStatusBadge = (status: Meal['status']) => {
    switch (status) {
      case 'open':
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />OPEN SESSION</span>;
      case 'published':
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-blue-500/20 text-blue-300 border border-blue-500/40">PUBLISHED</span>;
      case 'closed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-slate-800 text-slate-400 border border-slate-700">CLOSED</span>;
      case 'draft':
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40">DRAFT</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-rose-500/20 text-rose-300 border border-rose-500/40">CANCELLED</span>;
    }
  };

  const handleStatusToggle = (meal: Meal, newStatus: Meal['status']) => {
    appStore.updateMeal(meal.id, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>Today's Meal Operations</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status overview of today's four dining sessions. Manage timings, generate QR turnstiles, and track attendance live.
          </p>
        </div>
        <button
          onClick={() => onNavigate('menu')}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add / Import Meal</span>
        </button>
      </div>

      {/* Meals Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {meals.map((meal) => {
          const checkins = (typeof appStore.getMealCheckins === 'function' ? appStore.getMealCheckins(meal.id) : appStore.getCheckins()) || [];
          const checkedInCount = checkins.length;
          const expected = meal.expected_qty || 400;
          const pct = Math.round((checkedInCount / expected) * 100);

          return (
            <div 
              key={meal.id} 
              className={`p-5 rounded-2xl border transition-all ${
                meal.status === 'open' 
                  ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/20' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header: Type & Status */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase">
                  {meal.meal_type}
                </span>
                {getStatusBadge(meal.status)}
              </div>

              {/* Meal Name & Description */}
              <h3 className="font-bold text-base text-slate-100 mb-1">{meal.name}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-4">{meal.description}</p>

              {/* Items Pill Cloud */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {meal.items.slice(0, 4).map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700">
                    {item}
                  </span>
                ))}
                {meal.items.length > 4 && (
                  <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-400">
                    +{meal.items.length - 4} more
                  </span>
                )}
              </div>

              {/* Timing & Attendance Quick Bar */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 mb-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Timing: {meal.open_time} – {meal.close_time}</span>
                  </div>
                  <div className="font-mono text-slate-400">
                    Expected: {meal.expected_qty}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Turnstile Attendance</span>
                    <span className="font-mono text-amber-300 font-bold">{checkedInCount} / {meal.expected_qty} ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onNavigate('qr', meal.id)}
                  className="px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Open QR</span>
                </button>

                <button
                  onClick={() => onNavigate('live', meal.id)}
                  className="px-3 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Live Feed</span>
                </button>

                {meal.status === 'open' ? (
                  <button
                    onClick={() => handleStatusToggle(meal, 'closed')}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Close</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusToggle(meal, 'open')}
                    className="px-3 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Launch</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
