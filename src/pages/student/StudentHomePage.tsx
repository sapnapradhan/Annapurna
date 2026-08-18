import React, { useState, useEffect } from 'react';
import { appStore } from '../../services/store';
import { Meal } from '../../types';
import { QrCode, CheckCircle2, Clock, Calendar, Star, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';

interface StudentHomePageProps {
  onNavigate: (tab: string, mealId?: string) => void;
}

export const StudentHomePage: React.FC<StudentHomePageProps> = ({ onNavigate }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const user = appStore.getCurrentUser();
  const [todayCheckins, setTodayCheckins] = useState<string[]>([]);

  useEffect(() => {
    const update = () => {
      const today = appStore.getTodayMeals();
      setMeals(today);
      const chks = appStore.getCheckins().filter(c => c.student_id === user.id);
      setTodayCheckins(chks.map(c => c.meal_id));
    };
    update();
    return appStore.subscribe(update);
  }, [user.id]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const activeMeal = meals.find(m => m.status === 'open') || meals[1] || meals[0];
  const isCheckedIn = activeMeal ? todayCheckins.includes(activeMeal.id) : false;

  return (
    <div className="space-y-5">
      {/* Greeting Header */}
      <div>
        <div className="text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase">
          {getGreeting()},
        </div>
        <h1 className="text-2xl font-bold font-serif text-slate-100">{user.name}</h1>
        <p className="text-xs text-slate-400 mt-0.5">Nilgiri Mess • Dining Pass Active</p>
      </div>

      {/* Highlighted Next Upcoming Meal Card */}
      {activeMeal && (
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
              {activeMeal.status === 'open' ? 'NOW SERVING' : 'UPCOMING SESSION'}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{activeMeal.open_time} – {activeMeal.close_time}</span>
            </div>
          </div>

          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase font-semibold">{activeMeal.meal_type}</div>
            <h2 className="text-lg font-bold text-slate-100">{activeMeal.name}</h2>
            <p className="text-xs text-slate-300 line-clamp-2 mt-1">{activeMeal.description}</p>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {activeMeal.items.map((item, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md text-[11px] bg-slate-950/80 text-slate-300 border border-slate-800">
                {item}
              </span>
            ))}
          </div>

          <div className="pt-2">
            {isCheckedIn ? (
              <div className="w-full py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Checked In For This Meal</span>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('checkin', activeMeal.id)}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan QR To Check In</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* "Your Month" Summary Strip */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200">Your Month Summary</span>
          <button 
            onClick={() => onNavigate('attendance')} 
            className="text-emerald-400 font-mono text-[11px] flex items-center gap-0.5"
          >
            <span>Details</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-base font-bold font-mono text-emerald-400">92%</div>
            <div className="text-[10px] text-slate-400">Attendance</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-base font-bold font-mono text-amber-300">42</div>
            <div className="text-[10px] text-slate-400">Meals Attended</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-base font-bold font-mono text-slate-200">18</div>
            <div className="text-[10px] text-slate-400">Reviews</div>
          </div>
        </div>
      </div>

      {/* Compact List of Today's 4 Meals */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs text-slate-400 uppercase font-mono tracking-wider">Today's Schedule</h3>

        <div className="space-y-2.5">
          {meals.map((meal) => {
            const checked = todayCheckins.includes(meal.id);
            return (
              <div 
                key={meal.id} 
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase ${checked ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                    {meal.meal_type.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-200">{meal.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{meal.open_time} – {meal.close_time}</div>
                  </div>
                </div>

                {checked ? (
                  <span className="px-2 py-1 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Checked In</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onNavigate('checkin', meal.id)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    Scan QR
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
