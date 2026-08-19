import React, { useState, useEffect } from 'react';
import { HelpCircle, Clock, ShieldCheck, Activity, X, ChevronRight } from 'lucide-react';
import { appStore } from '../../services/store';

export const LiveStatusWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'pulse' | 'qa'>('pulse');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayMeals = (typeof appStore.getTodayMeals === 'function' ? appStore.getTodayMeals() : appStore.getMeals()) || [];
  const activeMeal = todayMeals.find(m => m.status === 'open') || todayMeals[1] || todayMeals[0];

  const faqs = [
    {
      q: "What is ANNAPURNA?",
      a: "ANNAPURNA is an operational campus dining platform designed to automate recording, check-ins, consumption logs, food rescue, and demand forecasting."
    },
    {
      q: "How does Student QR Check-in work?",
      a: "Students open the Student App, tap Check-in, scan the dynamic QR displayed at the mess turnstile, and validate their single meal entry in <2 seconds."
    },
    {
      q: "Is menu creation automated?",
      a: "No. Manual control stays manual. Mess authority administrators retain 100% control over meal creation, items, pricing, and timings."
    },
    {
      q: "How does Surplus Food Rescue work?",
      a: "Post-service, authority staff declare remaining un-served food, complete a 4-step safety verification checklist, and dispatch verified trays to registered NGOs."
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 px-4 py-3 rounded-full bg-cinematic-surface/90 border border-amber-500/30 text-amber-100 hover:text-white shadow-2xl hover:border-amber-400 backdrop-blur-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div className="text-left">
            <div className="text-xs font-mono font-semibold tracking-wider text-amber-400 uppercase">Ops Pulse Live</div>
            <div className="text-xs text-gray-300 font-light">Ask Platform & Status</div>
          </div>
          <HelpCircle className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform ml-1" />
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 rounded-2xl bg-cinematic-surface border border-cinematic-border shadow-2xl overflow-hidden backdrop-blur-2xl text-gray-200 animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-cinematic-surface to-amber-950/30 border-b border-cinematic-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="font-serif font-bold text-amber-200 text-sm tracking-wide">ANNAPURNA Operational Pulse</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sub Navigation */}
          <div className="flex border-b border-cinematic-border bg-black/40 text-xs">
            <button
              onClick={() => setActiveTab('pulse')}
              className={`flex-1 py-2.5 font-medium transition-colors ${activeTab === 'pulse' ? 'text-amber-300 border-b-2 border-amber-400 bg-white/5' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Live Mess Pulse
            </button>
            <button
              onClick={() => setActiveTab('qa')}
              className={`flex-1 py-2.5 font-medium transition-colors ${activeTab === 'qa' ? 'text-amber-300 border-b-2 border-amber-400 bg-white/5' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Ask Platform
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-80 overflow-y-auto space-y-4 text-xs">
            {activeTab === 'pulse' ? (
              <>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Campus Time</span>
                  </div>
                  <span className="font-mono font-bold text-amber-300 text-sm">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-gray-400 font-medium uppercase tracking-wider text-[10px]">Active Service Session</div>
                  {activeMeal ? (
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-emerald-300 capitalize">{activeMeal.meal_type}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
                          {activeMeal.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="font-medium text-white mb-2">{activeMeal.name}</div>
                      <div className="text-[11px] text-emerald-200/80">
                        {activeMeal.open_time} – {activeMeal.close_time} • Expected: {activeMeal.expected_qty} students
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 text-center text-gray-500 bg-white/5 rounded-xl">No active meal session right now</div>
                  )}
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-200/90 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Manual authority controls active. System automation limited to logging & forecasting.</span>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all">
                    <div className="font-semibold text-amber-200 mb-1 flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                      <span>{faq.q}</span>
                    </div>
                    <div className="text-gray-300 text-[11px] leading-relaxed pl-5">{faq.a}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
