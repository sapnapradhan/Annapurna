import React, { useState, useEffect } from 'react';
import { appStore } from '../../services/store';
import { Checkin } from '../../types';
import { Utensils, Star, CheckCircle2, Clock } from 'lucide-react';

export const StudentMyMealsPage: React.FC = () => {
  const user = appStore.getCurrentUser();
  const [checkins, setCheckins] = useState<Checkin[]>([]);

  useEffect(() => {
    const update = () => setCheckins(appStore.getCheckins().filter(c => c.student_id === user.id));
    update();
    return appStore.subscribe(update);
  }, [user.id]);

  const reviews = appStore.getStudentReviews(user.id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
          <Utensils className="w-5 h-5 text-emerald-400" />
          <span>My Meal History</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Personal history of attended campus meals and submitted evaluations.</p>
      </div>

      <div className="space-y-3">
        {checkins.map((chk) => {
          const meal = appStore.getMealById(chk.meal_id);
          const review = reviews.find(r => r.meal_id === chk.meal_id);

          return (
            <div key={chk.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-bold uppercase">{meal?.meal_type || 'MEAL'}</span>
                <span className="text-slate-400 font-mono">{new Date(chk.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div>
                <h3 className="font-bold text-slate-100 text-sm">{meal?.name || 'Campus Meal'}</h3>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{meal?.items.join(', ')}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Turnstile Entry Verified</span>
                {review ? (
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold font-mono border border-amber-500/30 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>Rated {review.stars}/5</span>
                  </span>
                ) : (
                  <span className="text-slate-500 text-[11px]">Unrated</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
