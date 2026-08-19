import React, { useState } from 'react';
import { appStore } from '../../services/store';
import { 
  QrCode, Clock, Copy, Printer, CheckCircle2, ShieldCheck, RefreshCw, AlertCircle, Sparkles, Building 
} from 'lucide-react';

interface QRGeneratorPageProps {
  selectedMealId?: string;
}

export const QRGeneratorPage: React.FC<QRGeneratorPageProps> = ({ 
  selectedMealId = 'meal-today-dinner' 
}) => {
  const meals = appStore.getMeals();
  const [mealId, setMealId] = useState(selectedMealId);
  const [expiryMins, setExpiryMins] = useState(30);
  const [isGenerated, setIsGenerated] = useState(true);
  const [copied, setCopied] = useState(false);

  const selectedMeal = meals.find(m => m.id === mealId) || meals[0];

  const passToken = `ANNAPURNA-GATE-PASS-${selectedMeal.id}-${Date.now().toString().slice(-6)}`;
  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    passToken
  )}`;

  const handleGenerate = () => {
    setIsGenerated(false);
    setTimeout(() => {
      setIsGenerated(true);
    }, 400);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(passToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintPoster = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-[#2C221E] dark:text-slate-100 font-sans">
      <div className="border-b border-[#EBE4D8] dark:border-[#2C2724] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C86D44]/20 text-[#C86D44] dark:text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
            <QrCode className="w-3.5 h-3.5" />
            <span>AUTHORITY QR SESSION GENERATOR</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#2C221E] dark:text-white mt-1">
            Mess Turnstile QR Session Generator
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
            Bhubaneswar Central University • Turnstile Gate Control
          </p>
        </div>

        <button
          onClick={handleGenerate}
          className="px-5 py-2.5 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>RE-GENERATE QR SESSION</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column: Controls & Configuration */}
        <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-6">
          <h2 className="font-serif font-bold text-xl text-[#2C221E] dark:text-white">
            1. Configure Dining Session
          </h2>

          <div className="space-y-4">
            {/* Select Meal Session */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Select Meal Service:
              </label>
              <select
                value={mealId}
                onChange={(e) => setMealId(e.target.value)}
                className="w-full bg-white/10 dark:bg-black/40 border border-white/20 text-xs font-semibold rounded-2xl p-3 text-[#C86D44] dark:text-amber-300 focus:outline-none backdrop-blur-md"
              >
                {meals.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.meal_type.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Expiration Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Session Expiration Duration:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 60, 120].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setExpiryMins(mins)}
                    className={`py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      expiryMins === mins
                        ? 'bg-[#C86D44] text-white shadow-md'
                        : 'bg-white/10 dark:bg-black/30 text-slate-700 dark:text-slate-300 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons Cluster */}
            <div className="pt-4 space-y-3">
              <button
                onClick={handleGenerate}
                className="w-full py-3.5 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>🍱 GENERATE DYNAMIC SESSION QR</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyToken}
                  className="py-3 rounded-full bg-white/10 dark:bg-black/30 border border-white/20 text-slate-800 dark:text-slate-200 hover:border-[#C86D44] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-md"
                >
                  <Copy className="w-3.5 h-3.5 text-[#C86D44]" />
                  <span>{copied ? 'COPIED!' : 'COPY TOKEN'}</span>
                </button>

                <button
                  onClick={handlePrintPoster}
                  className="py-3 rounded-full bg-white/10 dark:bg-black/30 border border-white/20 text-slate-800 dark:text-slate-200 hover:border-[#C86D44] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-md"
                >
                  <Printer className="w-3.5 h-3.5 text-[#C86D44]" />
                  <span>PRINT POSTER</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Generated QR Display */}
        <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl backdrop-blur-xl text-center space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <h2 className="font-serif font-bold text-xl text-[#2C221E] dark:text-white">
              2. Live Turnstile Poster Preview
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
              Display at Hostel Mess Gate Entrance for Student QR Check-in
            </p>
          </div>

          <div className="relative w-60 h-60 mx-auto p-4 rounded-3xl bg-white border-4 border-[#C86D44]/40 shadow-2xl flex items-center justify-center">
            {isGenerated ? (
              <img
                src={qrDataUrl}
                alt="Active Turnstile Session QR Code"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-500 text-xs font-mono">
                <RefreshCw className="w-8 h-8 animate-spin text-[#C86D44] mb-2" />
                <span>GENERATING TOKEN...</span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white/10 dark:bg-black/40 border border-white/10 space-y-1">
            <div className="text-xs font-mono font-bold text-[#C86D44] dark:text-amber-300">
              ACTIVE TOKEN: {passToken}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Valid for next {expiryMins} minutes at Gate A1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
