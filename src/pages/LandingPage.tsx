import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, Shield, Sparkles, QrCode, TrendingUp, BarChart3, 
  Leaf, Users, ArrowRight, CheckCircle2, Building2, Lock, ChevronDown, Activity, UserPlus, LogIn
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
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onNavigateRegister,
  onNavigateLogin
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
      {/* Editorial Overlay for Content Readability over Provided Background Image */}
      <div className="fixed inset-0 bg-[#FDFBF7]/85 dark:bg-[#12100F]/90 backdrop-blur-[2px] pointer-events-none z-0" />

      <div className="relative z-10">
        {/* Persistent Live Ops Status Widget */}
        <LiveStatusWidget />

        {/* Top Navbar */}
        <header
          className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
            scrolled
              ? 'py-3.5 bg-[#FDFBF7]/90 dark:bg-[#12100F]/90 backdrop-blur-md border-b border-[#EBE4D8] dark:border-[#2C2724] shadow-sm'
              : 'py-6 bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C86D44] text-white flex items-center justify-center shadow-md font-serif font-bold text-lg">
                A
              </div>
              <div>
                <span className="font-serif font-bold text-lg tracking-widest text-[#2C221E] dark:text-amber-100 uppercase">
                  ANNAPURNA
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-mono bg-[#C86D44]/10 border border-[#C86D44]/20 text-[#C86D44] dark:text-amber-300">
                  CAMPUS OPS v2.4
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              <a href="#features" className="hover:text-[#C86D44] dark:hover:text-amber-300 transition-colors">Features</a>
              <a href="#weather" className="hover:text-[#C86D44] dark:hover:text-amber-300 transition-colors">Campus Weather</a>
              <a href="#impact" className="hover:text-[#C86D44] dark:hover:text-amber-300 transition-colors">Food Rescue</a>
            </nav>

            <div className="flex items-center gap-3">
              {/* Integrated Music Controls */}
              <AudioPlayer />

              {/* Light/Dark Mode Switcher */}
              <ThemeToggle />

              <button
                onClick={onNavigateRegister}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>

              <button
                onClick={onNavigateLogin}
                className="px-4 py-2 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C86D44]/10 border border-[#C86D44]/20 text-[#C86D44] dark:text-amber-300 text-xs font-mono font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Food Operations & Rescue Platform</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#2C221E] dark:text-white leading-[1.15]">
              Campus Dining Operations, <br />
              <span className="italic font-normal text-[#C86D44] dark:text-amber-300">
                Designed with Restraint & Precision.
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
              Eliminate mess food waste, automate turnstile check-ins, capture student feedback, 
              and forecast prep quantities accurately — maintaining total manual operational control.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={onNavigateRegister}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#C86D44] hover:bg-[#B35C33] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Student Account</span>
              </button>

              <button
                onClick={onNavigateLogin}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FDFBF7] dark:bg-[#1A1715] border border-[#EBE4D8] dark:border-[#2C2724] text-[#2C221E] dark:text-slate-200 hover:border-[#C86D44] font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-[#C86D44] dark:text-amber-400" />
                <span>Sign In to Account</span>
              </button>
            </div>

            {/* Metrics Row */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
              {[
                { label: 'Turnstile Scan Time', val: '< 1.8 sec', icon: QrCode },
                { label: 'Average Waste Saved', val: '28.4%', icon: Leaf },
                { label: 'Demand Accuracy', val: '94.2%', icon: TrendingUp },
                { label: 'Food Rescue Rate', val: '100%', icon: Shield },
              ].map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#FDFBF7]/90 dark:bg-[#1A1715]/90 border border-[#EBE4D8] dark:border-[#2C2724] shadow-sm">
                  <m.icon className="w-4 h-4 text-[#C86D44] dark:text-amber-400 mb-1.5" />
                  <div className="text-xl font-bold font-mono text-[#2C221E] dark:text-white">{m.val}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Native Weather Forecast Section */}
        <section id="weather" className="py-16 px-6 max-w-5xl mx-auto border-t border-[#EBE4D8] dark:border-[#2C2724]">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h2 className="text-xs font-mono font-bold tracking-widest text-[#C86D44] dark:text-amber-400 uppercase">Live Campus Weather Telemetry</h2>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C221E] dark:text-white">Real-Time Forecast & Climate Impact</h3>
          </div>
          <WeatherWidget />
        </section>

        {/* Feature Showcase Grid */}
        <section id="features" className="py-20 px-6 max-w-6xl mx-auto border-t border-[#EBE4D8] dark:border-[#2C2724]">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-xs font-mono font-bold tracking-widest text-[#C86D44] dark:text-amber-400 uppercase">Dual Interface Architecture</h2>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C221E] dark:text-white">Designed for Ops Authority & Hostel Students</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Authority Side Card */}
            <div className="p-8 rounded-3xl bg-[#FDFBF7]/90 dark:bg-[#1A1715]/90 border border-[#EBE4D8] dark:border-[#2C2724] shadow-lg space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C86D44]/10 text-[#C86D44] dark:text-amber-300 text-xs font-mono font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Authority Dashboard</span>
              </div>
              <h4 className="font-serif text-2xl font-bold text-[#2C221E] dark:text-white">Operational Density & Control</h4>
              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
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
                className="w-full py-3.5 rounded-xl bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Log In to Authority Operations
              </button>
            </div>

            {/* Student Side Card */}
            <div className="p-8 rounded-3xl bg-[#FDFBF7]/90 dark:bg-[#1A1715]/90 border border-[#EBE4D8] dark:border-[#2C2724] shadow-lg space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-semibold">
                <Users className="w-3.5 h-3.5" />
                <span>Student Mobile App</span>
              </div>
              <h4 className="font-serif text-2xl font-bold text-[#2C221E] dark:text-white">Personalized & Mobile-First</h4>
              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
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
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Register Student Dining Account
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 border-t border-[#EBE4D8] dark:border-[#2C2724] text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-serif text-sm font-bold text-[#2C221E] dark:text-slate-300">
              <UtensilsCrossed className="w-4 h-4 text-[#C86D44] dark:text-amber-400" />
              <span>ANNAPURNA Campus Food Operations Platform</span>
            </div>
            <div>© {new Date().getFullYear()} ANNAPURNA Food Operations. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </div>
  );
};
