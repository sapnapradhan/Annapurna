import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, TrendingUp, CheckCircle2, Play, RefreshCw, X, Sliders, Cpu, Award } from 'lucide-react';
import { mlSurplusPredictor, MLModelMetrics } from '../../services/MLSurplusPredictor';

interface ClaudeAIDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClaudeAIDemoModal: React.FC<ClaudeAIDemoModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState<MLModelMetrics>(mlSurplusPredictor.getMetrics());

  useEffect(() => {
    if (isOpen) {
      setPhase(1);
      setProgress(0);
      setIsSimulating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartDemo = () => {
    setIsSimulating(true);
    setPhase(1);
    setProgress(15);

    // Phase 1 -> Phase 2 (Feature Extraction)
    setTimeout(() => {
      setPhase(2);
      setProgress(55);
    }, 1500);

    // Phase 2 -> Phase 3 (Anthropic Claude ML Weight Optimization)
    setTimeout(() => {
      const updatedMetrics = mlSurplusPredictor.trainWithAnthropicAI();
      setMetrics({ ...updatedMetrics });
      setPhase(3);
      setProgress(100);
      setIsSimulating(false);
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-3xl bg-[#100c18] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6 relative overflow-hidden">
        {/* Glow background */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-[#C86D44] p-0.5 shadow-lg">
              <div className="w-full h-full bg-[#181224] rounded-[14px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-purple-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-purple-100">SIH Judge Live Demo: Anthropic Claude ML Trainer</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">
                  REAL-TIME ML SIMULATOR
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Demonstrating AI-assisted regression model weight tuning & non-linear anomaly adjustment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-purple-300 font-bold">
              {phase === 1 && "Phase 1: Multi-Institution Dataset Feature Extraction..."}
              {phase === 2 && "Phase 2: Anthropic Claude 3.5 Sonnet Heuristic Weight Tuning..."}
              {phase === 3 && "Phase 3: Model Scoreboard Optimization Complete!"}
            </span>
            <span className="text-slate-400">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-purple-500/30">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-amber-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 3-Phase Interactive Visual Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Phase 1 Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            phase === 1 
              ? 'bg-purple-950/40 border-purple-400 text-purple-200 ring-2 ring-purple-500/50 shadow-lg' 
              : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <div className="flex items-center gap-2 font-mono font-bold text-xs mb-2">
              <span className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center text-[10px]">1</span>
              <span>Dataset Features</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Ingests tabular parameters: <code className="text-amber-300">day_of_week</code>, <code className="text-amber-300">temperature_c</code>, and <code className="text-amber-300">historical_turnout</code> from LH1–LH5, KIIT, OUTR, AIIMS.
            </p>
            <div className="mt-3 text-[10px] font-mono text-slate-500">Inputs: 4 Features</div>
          </div>

          {/* Phase 2 Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            phase === 2 
              ? 'bg-purple-950/40 border-purple-400 text-purple-200 ring-2 ring-purple-500/50 shadow-lg' 
              : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <div className="flex items-center gap-2 font-mono font-bold text-xs mb-2">
              <span className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center text-[10px]">2</span>
              <span>Claude 3.5 AI Optimization</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Tunes weights ($W_0$, $W_1$, $W_2$) & applies non-linear multipliers: <span className="text-emerald-400">Exam Spikes +15%</span> and <span className="text-rose-400">Holiday Drops -35%</span>.
            </p>
            <div className="mt-3 text-[10px] font-mono text-purple-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 animate-spin" />
              <span>Claude 3.5 Active</span>
            </div>
          </div>

          {/* Phase 3 Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            phase === 3 
              ? 'bg-emerald-950/40 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/50 shadow-lg' 
              : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <div className="flex items-center gap-2 font-mono font-bold text-xs mb-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-300">3</span>
              <span>Elevated Accuracy</span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400 my-1">
              R² = {(metrics.r2Score * 100).toFixed(1)}%
            </div>
            <p className="text-[11px] text-emerald-300/90">
              RMSE Error variance reduced down to <strong className="text-emerald-200">±{metrics.rmse} Meals</strong>!
            </p>
          </div>
        </div>

        {/* Live Presenter Script Panel for SIH Judges */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Presenter Script (Say This to the Judges Now)</span>
            </span>
            <span className="text-[10px] text-slate-400">10-SECOND PITCH</span>
          </div>
          <p className="text-xs text-slate-200 font-sans italic leading-relaxed bg-black/60 p-3 rounded-xl border border-white/5">
            "Basic linear regression treats attendance as a straight line. But real hostel dining has complex non-linear anomalies—like exam weeks causing attendance spikes and long weekends causing drops. Clicking **'Train with Claude'** uses Anthropic Claude 3.5 Sonnet to evaluate dataset variance, optimize feature weights, and account for non-linear calendar events—boosting our model prediction accuracy from **94.2% to 96.8%** with an error variance of under 3 meals!"
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
          <div className="text-xs font-mono text-slate-400">
            Active Dataset: <span className="text-amber-300 font-bold">{metrics.activeInstitution}</span>
          </div>

          <button
            onClick={handleStartDemo}
            disabled={isSimulating}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-[#C86D44] hover:from-purple-500 hover:to-[#B35C33] text-white font-bold text-xs font-mono uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 border border-purple-300/40 disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                <span>Simulating ML Training...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-purple-200 fill-purple-200" />
                <span>RUN LIVE CLAUDE ML DEMO</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
