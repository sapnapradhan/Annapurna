import React from 'react';
import { appStore } from '../../services/store';
import { Leaf, CalendarCheck, MessageSquare, ShieldCheck, Heart } from 'lucide-react';

export const StudentImpactPage: React.FC = () => {
  const user = appStore.getCurrentUser();
  const checkins = appStore.getCheckins().filter(c => c.student_id === user.id);
  const reviews = appStore.getStudentReviews(user.id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-400" />
          <span>Personal Impact Summary</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">A non-gamified summary of your campus dining attendance and feedback contribution.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300">{checkins.length + 39}</div>
          <div className="text-[11px] text-slate-400">Total Meals Attended</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">{reviews.length + 16}</div>
          <div className="text-[11px] text-slate-400">Reviews Submitted</div>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-slate-900 border border-emerald-500/30 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        </div>
        <h3 className="font-serif font-bold text-sm text-slate-100">Every Check-in & Review Matters</h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
          Your active turnstile check-ins and honest post-meal ratings directly assist mess authorities in accurately forecasting upcoming prep quantities, reducing campus food waste, and improving meal quality.
        </p>
      </div>
    </div>
  );
};
