import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, Shield, Sparkles, QrCode, TrendingUp, BarChart3, 
  Leaf, Users, ArrowRight, CheckCircle2, Building2, Lock, ChevronDown, Activity, UserPlus, LogIn, Truck, MapPin
} from 'lucide-react';
import { appStore } from '../services/store';
import { UserRole } from '../types';
import { AudioPlayer } from '../components/common/AudioPlayer';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { WeatherWidget } from '../components/common/WeatherWidget';
import { LiveStatusWidget } from '../components/landing/LiveStatusWidget';

interface LandingPageProps {
  onLoginSuccess: (role: UserRole) => void;
  onNavigateRegister: () => void;
  onNavigateLogin: () => void;
  onNavigateRescue: () => void;
  onReplayIntro: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onNavigateRegister,
  onNavigateLogin,
  onNavigateRescue,
  onReplayIntro
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-provided-image text-[#2C221E] dark:text-slate-100 font-sans selection:bg-[#C86D44] selection:text-white transition-colors duration-300">
      {/* Light Localized Backdrop Overlay preserving Bold Background Visibility */}
      <div className="fixed inset-0 bg-[#FDFBF7]/40 dark:bg-[#12100F]/50 pointer-events-none z-0" />

      <div className="relative z-10">
        {/* Persistent Live Ops Status Widget */}
        <LiveStatusWidget />

        {/* Floating Pill Navigation Bar */}
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 max-w-6xl w-[94%] transition-all duration-300">
          <div className="bg-[#FDFBF7]/90 dark:bg-[#12100F]/90 backdrop-blur-xl border border-[#EBE4D8] dark:border-[#2C2724] shadow-2xl rounded-full px-5 py-2.5 flex items-center justify-between">
            {/* Logo Emblem */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C86D44] text-white flex items-center justify-center font-cinzel font-bold text-base shadow-md border border-amber-300/30">
                A
              </div>
              <div>
                <span className="font-cinzel font-bold text-base tracking-widest text-[#2C221E] dark:text-amber-100 uppercase">
                  ANNAPURNA
                </span>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-6 text-[11px] font-mono font-bold tracking-widest text-slate-700 dark:text-slate-300 uppercase">
              <a href="#features" className="hover:text-[#C86D44] dark:hover:text-amber-400 transition-colors">FEATURES</a>
              <a href="#weather" className="hover:text-[#C86D44] dark:hover:text-amber-400 transition-colors">WEATHER</a>
              <button
                onClick={onNavigateRescue}
                className="hover:text-[#C86D44] dark:hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer text-[#C86D44] dark:text-amber-300"
              >
                <Truck className="w-3 h-3" />
                <span>FOOD RESCUE</span>
              </button>
            </nav>

            {/* Controls & CTAs */}
            <div className="flex items-center gap-2 sm:gap-3">
              <AudioPlayer />
              <ThemeToggle />

              <button
                onClick={onReplayIntro}
                className="hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-[#C86D44] dark:hover:text-amber-300 border border-[#EBE4D8] dark:border-[#2C2724] bg-[#F5EFE6] dark:bg-[#1A1715] transition-colors"
                title="Replay Story"
              >
                Story
              </button>

              <button
                onClick={onNavigateRescue}
                className="px-3.5 py-1.5 rounded-full text-[11px] font-bold text-[#C86D44] dark:text-amber-300 bg-[#C86D44]/15 hover:bg-[#C86D44]/25 border border-[#C86D44]/40 transition-all cursor-pointer flex items-center gap-1"
              >
                <Truck className="w-3 h-3" />
                <span className="hidden sm:inline">Rescue</span>
              </button>

              <button
                onClick={onNavigateLogin}
                className="px-4 py-1.5 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-[11px] uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-3 h-3" />
                <span>Login</span>
              </button>
            </div>
          </div>
        </header>

        {/* Full-Screen Editorial Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8 p-10 rounded-3xl bg-[#FDFBF7]/90 dark:bg-[#12100F]/90 border border-[#EBE4D8] dark:border-[#2C2724] shadow-2xl backdrop-blur-md">
            
            {/* Small Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C86D44]/15 border border-[#C86D44]/30 text-[#C86D44] dark:text-amber-300 text-[10px] font-mono font-bold uppercase tracking-widest">
              <MapPin className="w-3 h-3" />
              <span>CAMPUS FOOD OPERATIONS · BHUBANESWAR, ODISHA</span>
            </div>

            {/* Editorial Chiseled Serif Headline (Matching Reference Screenshot) */}
            <h1 className="font-cinzel font-bold text-4xl sm:text-6xl md:text-7xl tracking-widest text-[#2C221E] dark:text-white leading-[1.15] uppercase">
              DESIGNED TO NOURISH. <br />
              <span className="text-[#C86D44] dark:text-amber-300 font-cinzel">
                BUILT TO SHARE.
              </span>
            </h1>

            {/* Supporting Short Statement */}
            <p className="max-w-xl mx-auto text-base sm:text-lg text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
              Every meal has a story. Annapurna connects campus dining facilities directly with local community food rescue networks.
            </p>

            {/* Editorial Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={onNavigateRescue}
                className="group w-full sm:w-auto px-8 py-4 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>EXPLORE FOOD RESCUE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onNavigateRegister}
                className="group w-full sm:w-auto px-8 py-4 rounded-full bg-[#F5EFE6] dark:bg-[#1A1715] border border-[#EBE4D8] dark:border-[#2C2724] text-[#2C221E] dark:text-slate-200 hover:border-[#C86D44] font-bold text-xs uppercase tracking-widest shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>REGISTER STUDENT ACCOUNT</span>
                <ArrowRight className="w-4 h-4 text-[#C86D44] dark:text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Scroll Indicator */}
            <div className="pt-8 flex flex-col items-center text-slate-400 text-[10px] font-mono tracking-widest uppercase animate-bounce">
              <span>EXPLORE PLATFORM & TELEMETRY</span>
              <ChevronDown className="w-4 h-4 mt-1 text-[#C86D44]" />
            </div>
          </div>
        </section>

        {/* Campus Weather Telemetry */}
        <section id="weather" className="py-16 px-6 max-w-5xl mx-auto border-t border-[#EBE4D8]/80 dark:border-[#2C2724]/80">
          <div className="text-center max-w-xl mx-auto mb-8 p-6 rounded-3xl bg-[#FDFBF7]/90 dark:bg-[#12100F]/90 border border-[#EBE4D8] dark:border-[#2C2724]">
            <h2 className="text-xs font-mono font-bold tracking-widest text-[#C86D44] dark:text-amber-400 uppercase">BHUBANESWAR · ODISHA TELEMETRY</h2>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#2C221E] dark:text-white uppercase tracking-widest">Campus Climate & Weather Forecast</h3>
          </div>
          <WeatherWidget />
        </section>

        {/* Feature Showcase Grid */}
        <section id="features" className="py-20 px-6 max-w-6xl mx-auto border-t border-[#EBE4D8]/80 dark:border-[#2C2724]/80">
          <div className="text-center max-w-2xl mx-auto mb-14 p-6 rounded-3xl bg-[#FDFBF7]/90 dark:bg-[#12100F]/90 border border-[#EBE4D8] dark:border-[#2C2724] space-y-2">
            <h2 className="text-xs font-mono font-bold tracking-widest text-[#C86D44] dark:text-amber-400 uppercase">Dual Interface Architecture</h2>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#2C221E] dark:text-white uppercase tracking-widest">Designed for Ops Authority & Hostel Students</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Authority Side Card */}
            <div className="p-8 rounded-3xl bg-[#FDFBF7]/95 dark:bg-[#1A1715]/95 border border-[#EBE4D8] dark:border-[#2C2724] shadow-xl space-y-6 backdrop-blur-md">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C86D44]/15 text-[#C86D44] dark:text-amber-300 text-xs font-mono font-bold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Authority Dashboard</span>
              </div>
              <h4 className="font-cinzel text-2xl font-bold text-[#2C221E] dark:text-white uppercase tracking-wider">Operational Density & Control</h4>
              <ul className="space-y-3 text-xs text-slate-800 dark:text-slate-200">
                {[
                  'Under-1-minute menu creation & CSV bulk importer',
                  'Per-date meal timing overrides for campus holidays',
                  'Time-bound dynamic QR session generator',
                  'Real-time check-in attendance progress & turned feed',
                  'Post-meal consumption entry with auto-calculated waste & cost impact',
                  '4-step Surplus Food Rescue & NGO verification workflow',
                  'Algorithmic prep forecasting derived from attendance trends'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C86D44] dark:text-amber-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onNavigateLogin}
                className="w-full py-3.5 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Log In to Authority Operations
              </button>
            </div>

            {/* Student Side Card */}
            <div className="p-8 rounded-3xl bg-[#FDFBF7]/95 dark:bg-[#1A1715]/95 border border-[#EBE4D8] dark:border-[#2C2724] shadow-xl space-y-6 backdrop-blur-md">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>Student Mobile App</span>
              </div>
              <h4 className="font-cinzel text-2xl font-bold text-[#2C221E] dark:text-white uppercase tracking-wider">Personalized & Mobile-First</h4>
              <ul className="space-y-3 text-xs text-slate-800 dark:text-slate-200">
                {[
                  'Personalized greeting & next-upcoming meal card',
                  '5-tab bottom navigation optimized for single-hand use',
                  'Instant camera & simulator QR scan for turnstile check-in',
                  'Duplicate check-in prevention with session token validation',
                  'Multi-tier post-meal review (Stars, Quantity, Taste, Temperature)',
                  'Monthly attendance ratio charts & meal history log',
                  'Personal impact summary without gamified leaderboards'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onNavigateRegister}
                className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Register Student Dining Account
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 border-t border-[#EBE4D8]/80 dark:border-[#2C2724]/80 text-center text-xs text-slate-600 dark:text-slate-400 bg-[#FDFBF7]/80 dark:bg-[#12100F]/80">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-cinzel text-sm font-bold text-[#2C221E] dark:text-slate-200 tracking-wider">
              <UtensilsCrossed className="w-4 h-4 text-[#C86D44] dark:text-amber-400" />
              <span>ANNAPURNA • BHUBANESWAR, ODISHA</span>
            </div>
            <div>© {new Date().getFullYear()} ANNAPURNA Food Operations. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </div>
  );
};
