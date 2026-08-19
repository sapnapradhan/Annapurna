import React, { useState, useEffect } from 'react';
import { appStore } from '../../services/store';
import { 
  Calculator, AlertTriangle, CheckCircle2, Truck, Users, Activity, Bell, Send, ArrowRight
} from 'lucide-react';

export const PostMealConsumptionPage: React.FC = () => {
  const meals = appStore.getMeals();
  const activeMeal = meals.find(m => m.id === 'meal-2') || meals[0];

  const [preparedQty, setPreparedQtyInput] = useState(400);
  const [surplusCalc, setSurplusCalc] = useState(
    appStore.getSurplusCalculation(activeMeal.id)
  );

  useEffect(() => {
    const update = () => {
      setSurplusCalc(appStore.getSurplusCalculation(activeMeal.id));
    };
    return appStore.subscribe(update);
  }, [activeMeal.id]);

  const handleUpdatePrepared = (val: number) => {
    setPreparedQtyInput(val);
    appStore.setPreparedQuantity(activeMeal.id, val);
  };

  return (
    <div className="space-y-6 text-[#2C221E] dark:text-slate-100 font-sans">
      <div className="border-b border-[#EBE4D8] dark:border-[#2C2724] pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C86D44]/20 text-[#C86D44] dark:text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
          <Calculator className="w-3 h-3 text-[#C86D44]" />
          <span>AUTOMATIC SURPLUS ENGINE</span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#2C221E] dark:text-white mt-1">
          Post-Meal Consumption & Automatic Surplus Calculation
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
          {activeMeal.title} • Live Turnstile Computation
        </p>
      </div>

      {/* Manual Authority Input vs Automatic Dynamic Attendance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1: Authority Prepared Qty Input */}
        <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-3">
          <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase">
            1. Manually Set Prepared Qty (Authority)
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={preparedQty}
              onChange={(e) => handleUpdatePrepared(parseInt(e.target.value) || 0)}
              className="w-full bg-white/10 dark:bg-black/50 border border-white/20 rounded-2xl p-3 font-mono font-bold text-2xl text-[#C86D44] dark:text-amber-300 focus:outline-none"
            />
            <span className="text-xs font-mono font-bold text-slate-500">Meals</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Total meal portions prepared by mess kitchen staff.
          </p>
        </div>

        {/* Step 2: Real-time Attended Students Count */}
        <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-3">
          <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase">
            2. Real-Time Attended Students (Live Scans)
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {surplusCalc.attendedCount} Students
          </div>
          <p className="text-[10px] text-slate-500">
            Logged dynamically as students sign in & scan QR passes.
          </p>
        </div>

        {/* Step 3: Automatic Surplus Calculation Result */}
        <div className="p-6 rounded-3xl bg-[#C86D44]/15 border border-[#C86D44]/40 shadow-xl backdrop-blur-xl space-y-3">
          <div className="text-xs font-mono font-bold text-[#C86D44] dark:text-amber-300 uppercase flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>3. Automatic Surplus Result</span>
          </div>
          <div className="text-4xl font-bold font-mono text-[#C86D44] dark:text-amber-300">
            {surplusCalc.surplusQty} Meals
          </div>
          <div className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
            {surplusCalc.rescueStatus}
          </div>
        </div>
      </div>

      {/* Formula & Notification Alert Card */}
      <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C86D44] dark:text-amber-400 uppercase">
          <Bell className="w-4 h-4 text-amber-500 animate-bounce" />
          <span>INSTANT ADMIN SURPLUS NOTIFICATION STREAM</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
          <div className="text-xs font-mono font-bold text-amber-400">
            AUTOMATIC CALCULATION FORMULA:
          </div>
          <div className="text-xs font-mono text-slate-200">
            Surplus Meals ({surplusCalc.surplusQty}) = Prepared Quantity ({surplusCalc.preparedQty}) - Real-Time Attended ({surplusCalc.attendedCount})
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-700 dark:text-slate-300">
            Dispatch verified surplus food trays directly to Bhubaneswar NGO partner rescue network.
          </div>
          <button
            onClick={() => alert(`Dispatch initiated for ${surplusCalc.surplusQty} surplus meals to Bhubaneswar Food Rescue NGOs!`)}
            className="px-6 py-3 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2 shrink-0"
          >
            <Truck className="w-4 h-4" />
            <span>DISPATCH TO NGO RESCUE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
