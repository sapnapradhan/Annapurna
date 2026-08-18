import React, { useState } from 'react';
import { appStore } from '../../services/store';
import { BarChart2, Save, TrendingDown, DollarSign, Leaf, CheckCircle2, ShieldAlert } from 'lucide-react';

export const PostMealConsumptionPage: React.FC = () => {
  const todayMeals = appStore.getTodayMeals();
  const [selectedMealId, setSelectedMealId] = useState(todayMeals[0]?.id || '');

  // Form Inputs
  const [prepared, setPrepared] = useState(480);
  const [served, setServed] = useState(432);
  const [remaining, setRemaining] = useState(48);
  const [wasted, setWasted] = useState(12);
  const [redistributed, setRedistributed] = useState(36);
  const [toast, setToast] = useState<string | null>(null);

  // Derived Calculations
  const totalAccounted = served + remaining;
  const consumptionRate = Math.round((served / (prepared || 1)) * 100);
  const wastePct = Math.round((wasted / (prepared || 1)) * 100);
  const redistributionPct = Math.round((redistributed / (prepared || 1)) * 100);
  const foodSavedKg = Math.round(redistributed * 0.35); // ~350g per meal portion saved
  const estimatedCostSaved = redistributed * 45; // ~₹45 per meal portion cost saved

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    appStore.logConsumption({
      meal_id: selectedMealId,
      prepared,
      served,
      remaining,
      wasted,
      redistributed
    });

    setToast(`Post-service metrics logged! Calculated ${foodSavedKg} kg food saved (${redistributionPct}% rescue rate).`);
    setTimeout(() => setToast(null), 4000);
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
            <BarChart2 className="w-5 h-5 text-amber-400" />
            <span>Post-Meal Consumption & Yield Entry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manual post-service entry of prepared, served, un-served remaining, and wasted quantities.
          </p>
        </div>

        <select
          value={selectedMealId}
          onChange={(e) => setSelectedMealId(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-amber-200 font-semibold focus:outline-none"
        >
          {todayMeals.map(m => (
            <option key={m.id} value={m.id}>
              {m.meal_type.toUpperCase()}: {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Form & Real-time System Metrics */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Entry Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-200 border-b border-slate-800 pb-3">
            Manual Service Yield Record
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Total Portions Prepared</label>
              <input
                type="number"
                value={prepared}
                onChange={(e) => setPrepared(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Portions Served to Students</label>
              <input
                type="number"
                value={served}
                onChange={(e) => setServed(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Un-served Remaining</label>
              <input
                type="number"
                value={remaining}
                onChange={(e) => setRemaining(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Trimming & Tray Waste</label>
              <input
                type="number"
                value={wasted}
                onChange={(e) => setWasted(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Rescued / Redistributed</label>
              <input
                type="number"
                value={redistributed}
                onChange={(e) => setRedistributed(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-emerald-300 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-950/30"
          >
            <Save className="w-4 h-4" />
            <span>Commit Post-Meal Yield Metrics</span>
          </button>
        </form>

        {/* Calculated System Metrics Display */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-200">System-Derived Operational Impact</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              CALCULATED
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Consumption Rate</span>
              <span className="font-mono font-bold text-amber-300 text-sm">{consumptionRate}%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Food Waste %</span>
              <span className="font-mono font-bold text-rose-400 text-sm">{wastePct}%</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
              <span className="text-emerald-300 font-semibold">Surplus Rescue %</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{redistributionPct}%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">Food Mass Rescued</span>
              </div>
              <span className="font-mono font-bold text-emerald-300 text-sm">~{foodSavedKg} kg</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300">Estimated Cost Rescued</span>
              </div>
              <span className="font-mono font-bold text-amber-300 text-sm">₹{estimatedCostSaved.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
