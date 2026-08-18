import React, { useState, useEffect } from 'react';
import { appStore } from '../../services/store';
import { Meal } from '../../types';
import { Clock, QrCode, CheckCircle2, Utensils, Info } from 'lucide-react';

interface StudentMealsPageProps {
  onNavigate: (tab: string, mealId?: string) => void;
}

export const StudentMealsPage: React.FC<StudentMealsPageProps> = ({ onNavigate }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const user = appStore.getCurrentUser();
  const [todayCheckins, setTodayCheckins] = useState<string[]>([]);
  const [activeModalMeal, setActiveModalMeal] = useState<Meal | null>(null);

  useEffect(() => {
    const update = () => {
      setMeals(appStore.getTodayMeals());
      setTodayCheckins(appStore.getCheckins().filter(c => c.student_id === user.id).map(c => c.meal_id));
    };
    update();
    return appStore.subscribe(update);
  }, [user.id]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
          <Utensils className="w-5 h-5 text-emerald-400" />
          <span>Today's Mess Menu</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Explore detailed meal items and timings for today's four service sessions.</p>
      </div>

      <div className="space-y-4">
        {meals.map((meal) => {
          const checked = todayCheckins.includes(meal.id);

          return (
            <div key={meal.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  {meal.meal_type}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{meal.open_time} – {meal.close_time}</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-100">{meal.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{meal.description}</p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {meal.items.map((item, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-slate-950 text-slate-300 border border-slate-800">
                    {item}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => setActiveModalMeal(meal)}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                {checked ? (
                  <div className="py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Checked In</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onNavigate('checkin', meal.id)}
                    className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Check In</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      {activeModalMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase">{activeModalMeal.meal_type}</span>
              <button onClick={() => setActiveModalMeal(null)} className="text-slate-400 font-mono text-xs">CLOSE</button>
            </div>

            <h3 className="font-bold text-lg text-slate-100">{activeModalMeal.name}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{activeModalMeal.description}</p>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400">Full Items Menu:</div>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {activeModalMeal.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setActiveModalMeal(null)}
              className="w-full py-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
