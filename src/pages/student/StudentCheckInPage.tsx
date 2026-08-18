import React, { useState, useEffect } from 'react';
import { appStore } from '../../services/store';
import { Meal } from '../../types';
import { QrCode, CheckCircle2, AlertTriangle, Shield, Camera, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudentReviewModal } from './StudentReviewModal';

interface StudentCheckInPageProps {
  selectedMealId?: string;
  onNavigate: (tab: string) => void;
}

export const StudentCheckInPage: React.FC<StudentCheckInPageProps> = ({ selectedMealId, onNavigate }) => {
  const todayMeals = appStore.getTodayMeals();
  const [activeMealId, setActiveMealId] = useState<string>(
    selectedMealId || todayMeals.find(m => m.status === 'open')?.id || todayMeals[0]?.id || ''
  );

  const [tokenInput, setTokenInput] = useState('');
  const [statusState, setStatusState] = useState<'idle' | 'success' | 'duplicate' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const user = appStore.getCurrentUser();
  const meal = appStore.getMealById(activeMealId);
  const alreadyCheckedIn = meal ? appStore.hasStudentCheckedIn(meal.id, user.id) : false;

  useEffect(() => {
    if (alreadyCheckedIn) {
      setStatusState('duplicate');
    } else {
      setStatusState('idle');
    }
  }, [activeMealId, alreadyCheckedIn]);

  const handleSimulateScan = () => {
    if (!meal) return;

    if (alreadyCheckedIn) {
      setStatusState('duplicate');
      return;
    }

    const session = appStore.getSessionForMeal(meal.id);
    const tokenToUse = tokenInput.trim() || (session ? session.token : `ANNAPURNA-${meal.id.toUpperCase()}-9901`);

    const res = appStore.checkInStudent(meal.id, tokenToUse);
    if (res.success) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      setStatusState('success');
    } else {
      setStatusState('error');
      setErrorMessage(res.message || 'Check-in failed');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
          <QrCode className="w-5 h-5 text-emerald-400" />
          <span>Turnstile QR Check-in</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Scan the active turnstile display QR code to record your dining pass entry.</p>
      </div>

      {/* Select Meal Session */}
      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Target Meal Session</label>
        <select
          value={activeMealId}
          onChange={(e) => setActiveMealId(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-emerald-300 font-semibold focus:outline-none"
        >
          {todayMeals.map(m => (
            <option key={m.id} value={m.id}>
              [{m.meal_type.toUpperCase()}] {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Duplicate Check-in Protection State */}
      {statusState === 'duplicate' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/40 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="font-serif font-bold text-base text-amber-300">Already Checked In!</h3>
          <p className="text-xs text-slate-300">
            Your dining pass entry for <strong className="text-white">{meal?.name}</strong> has already been recorded today. Duplicate scans are blocked by campus turnstile security policies.
          </p>
          <button
            onClick={() => setReviewModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase transition-colors cursor-pointer"
          >
            Leave Post-Meal Feedback
          </button>
        </div>
      )}

      {/* Success State */}
      {statusState === 'success' && (
        <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-4 animate-in fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/20">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-pulse" />
          </div>

          <div>
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase">TURNSTILE ENTRY AUTHORIZED</div>
            <h3 className="font-serif font-bold text-xl text-slate-100 mt-1">{meal?.name}</h3>
            <div className="text-xs text-slate-300 font-mono mt-1">
              Hostel: {user.hostel} • Time: {new Date().toLocaleTimeString()}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/30 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-emerald-300">Verified Dining Token Recorded</div>
            <div className="text-[11px] text-slate-400">Enjoy your meal! Please remember to return your tray to the rack.</div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => setReviewModalOpen(true)}
              className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Rate Meal Now
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="py-3 rounded-xl bg-slate-800 text-slate-200 font-semibold text-xs transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      )}

      {/* Idle Scanner State */}
      {statusState === 'idle' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-5">
          {/* Simulated Scanner Viewfinder */}
          <div className="relative w-56 h-56 mx-auto rounded-3xl bg-slate-950 border-2 border-emerald-500/40 flex flex-col items-center justify-center overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-emerald-500/10 animate-pulse" />
            <div className="w-48 h-48 border border-dashed border-emerald-400/60 rounded-2xl flex flex-col items-center justify-center space-y-2">
              <Camera className="w-10 h-10 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-emerald-300">ALIGN QR CODE</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSimulateScan}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Simulate QR Scan Check-in</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-500 uppercase">or enter session token</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. ANNAPURNA-LUNCH-8842"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-mono text-slate-200 focus:outline-none"
              />
              <button
                onClick={handleSimulateScan}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Validate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal Trigger */}
      {reviewModalOpen && meal && (
        <StudentReviewModal
          mealId={meal.id}
          mealName={meal.name}
          onClose={() => setReviewModalOpen(false)}
        />
      )}
    </div>
  );
};
