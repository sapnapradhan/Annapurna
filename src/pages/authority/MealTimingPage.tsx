import React, { useState, useEffect } from 'react';
import { appStore } from '../../services/store';
import { Meal } from '../../types';
import { Clock, Calendar, AlertTriangle, Save, CheckCircle2 } from 'lucide-react';

export const MealTimingPage: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const all = appStore.getMeals();
      setMeals(all.filter(m => m.date === selectedDate));
    };
    update();
    return appStore.subscribe(update);
  }, [selectedDate]);

  const handleUpdateTiming = (mealId: string, openTime: string, closeTime: string) => {
    appStore.updateMeal(mealId, { open_time: openTime, close_time: closeTime });
    setToast(`Updated operational timings for meal session.`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Meal Timing & Holiday Overrides</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Override opening and closing turnstile windows per meal for specific dates (e.g., examination hours or campus holiday extensions).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-amber-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Timing Overrides Table / Cards */}
      <div className="space-y-4">
        {meals.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800">
            No meals scheduled for date {selectedDate}. Use Menu Management to create meals first.
          </div>
        ) : (
          meals.map((meal) => (
            <div key={meal.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase mr-3">
                    {meal.meal_type}
                  </span>
                  <span className="font-bold text-slate-100 text-sm">{meal.name}</span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Status: {meal.status.toUpperCase()}
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Service Open Time</label>
                  <input
                    type="time"
                    defaultValue={meal.open_time}
                    onBlur={(e) => handleUpdateTiming(meal.id, e.target.value, meal.close_time)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Service Close Time</label>
                  <input
                    type="time"
                    defaultValue={meal.close_time}
                    onBlur={(e) => handleUpdateTiming(meal.id, meal.open_time, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-end">
                  <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-amber-300/90 text-[11px] flex items-center gap-2 w-full">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Applies to {selectedDate} session only.</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
