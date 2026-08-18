import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { appStore } from '../../services/store';
import { Meal } from '../../types';
import { QrCode, RefreshCw, ShieldCheck, Clock, Monitor, Copy, CheckCircle2 } from 'lucide-react';

interface QRGeneratorPageProps {
  selectedMealId?: string;
}

export const QRGeneratorPage: React.FC<QRGeneratorPageProps> = ({ selectedMealId }) => {
  const todayMeals = appStore.getTodayMeals();
  const [activeMealId, setActiveMealId] = useState<string>(
    selectedMealId || todayMeals.find(m => m.status === 'open')?.id || todayMeals[1]?.id || todayMeals[0]?.id || ''
  );

  const [sessionToken, setSessionToken] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);

  const activeMeal = appStore.getMealById(activeMealId);

  useEffect(() => {
    if (activeMealId) {
      const existing = appStore.getSessionForMeal(activeMealId);
      if (existing) {
        setSessionToken(existing.token);
      } else {
        const newToken = appStore.generateQRSession(activeMealId);
        setSessionToken(newToken);
      }
    }
  }, [activeMealId]);

  const handleRegenerate = () => {
    if (!activeMealId) return;
    const newToken = appStore.generateQRSession(activeMealId);
    setSessionToken(newToken);
    setToast('Generated new dynamic session token! Previous QR invalidated.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(sessionToken);
    setToast('Session token copied to clipboard!');
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
            <QrCode className="w-5 h-5 text-amber-400" />
            <span>Turnstile QR Session Display</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Display this high-resolution QR on the mess entry kiosk monitor. Tied to date, meal session, and dynamic cryptographic token.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={activeMealId}
            onChange={(e) => setActiveMealId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-amber-200 focus:outline-none font-semibold"
          >
            {todayMeals.map(m => (
              <option key={m.id} value={m.id}>
                [{m.meal_type.toUpperCase()}] {m.name} ({m.open_time} - {m.close_time})
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeMeal ? (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Main QR Display Screen (Simulates Kiosk Screen) */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col items-center text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE TURNSTILE ACTIVE</span>
            </div>

            <div className="pt-4">
              <div className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                {activeMeal.meal_type} SERVICE SESSION
              </div>
              <h2 className="font-serif font-bold text-2xl text-slate-100 mt-1">{activeMeal.name}</h2>
              <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeMeal.open_time} – {activeMeal.close_time}</span>
              </div>
            </div>

            {/* QR Box */}
            <div className="p-6 rounded-3xl bg-white shadow-2xl border-4 border-amber-500/30 flex flex-col items-center">
              <QRCodeSVG
                value={JSON.stringify({
                  meal_id: activeMeal.id,
                  token: sessionToken,
                  mess_id: activeMeal.mess_id,
                  date: activeMeal.date
                })}
                size={220}
                level="H"
                includeMargin={true}
              />
              <div className="mt-3 font-mono font-bold text-slate-900 text-sm tracking-wider">
                {sessionToken}
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm">
              Scan using the <span className="text-emerald-400 font-semibold">Student App</span> to validate meal entry and prevent duplicate check-ins.
            </p>

            <div className="w-full pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Token Expires: End of Service</span>
              <button
                onClick={handleCopyToken}
                className="flex items-center gap-1 hover:text-amber-300 text-amber-400"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Token</span>
              </button>
            </div>
          </div>

          {/* Controls & Security Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Session Control Room</span>
              </h3>

              <div className="text-xs text-slate-400 space-y-2">
                <div>
                  <span className="text-slate-300 font-semibold block">Session ID:</span>
                  <span className="font-mono text-amber-300">{sessionToken}</span>
                </div>
                <div>
                  <span className="text-slate-300 font-semibold block">Meal Items:</span>
                  <span className="text-slate-400">{activeMeal.items.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-300 font-semibold block">Turnstile State:</span>
                  <span className="text-emerald-400 font-mono font-bold uppercase">{activeMeal.status}</span>
                </div>
              </div>

              <button
                onClick={handleRegenerate}
                className="w-full py-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Regenerate Dynamic QR Token</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-500 bg-slate-900 rounded-2xl">
          No active meal selected. Please pick a meal session above.
        </div>
      )}
    </div>
  );
};
