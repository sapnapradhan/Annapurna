import React, { useState, useEffect } from 'react';
import { appStore } from '../../services/store';
import { Forecast } from '../../types';
import { TrendingUp, Cpu, BarChart3, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export const ForecastingPage: React.FC = () => {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);

  useEffect(() => {
    setForecasts(appStore.getForecasts());
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <span>Demand Forecasting & Prep Recommendation Engine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Algorithmic demand prediction derived from historical turnout, day-of-week participation rates, and weather factors.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-amber-400" />
          <span>CALCULATED PREDICTION VIEW</span>
        </div>
      </div>

      {/* Mandatory Notice */}
      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-amber-200/90 text-xs flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
        <span>
          <strong>System Guarantee:</strong> Every metric below is derived automatically from turnstile check-in logs. Authority admins manually set the final kitchen prep size — the system only provides algorithmic guidance.
        </span>
      </div>

      {/* Forecast Cards Table */}
      <div className="space-y-4">
        {forecasts.map((f) => (
          <div key={f.meal_id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase mr-2">{f.meal_type}</span>
                <span className="font-bold text-slate-100 text-base">{f.meal_name}</span>
              </div>
              <span className="text-xs font-mono text-slate-400">Date: {f.date}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium mb-1">Historical Avg Turnout</div>
                <div className="text-xl font-bold font-mono text-slate-200">{f.historical_attendance}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Past 4 weeks</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium mb-1">Participation Rate</div>
                <div className="text-xl font-bold font-mono text-amber-300">{f.participation_rate}%</div>
                <div className="text-[10px] text-amber-400/80 mt-0.5">Expected capacity fill</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium mb-1">Predicted Student Demand</div>
                <div className="text-xl font-bold font-mono text-slate-100">{f.predicted_demand}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Statistical forecast</div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                <div className="text-[11px] text-emerald-300 font-semibold mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Recommended Prep</span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-300">{f.recommended_prep_qty}</div>
                <div className="text-[10px] text-emerald-400/80 mt-0.5">Includes 2.5% safety buffer</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
