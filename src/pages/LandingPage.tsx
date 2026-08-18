import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, Shield, Sparkles, QrCode, TrendingUp, BarChart3, 
  Leaf, Users, ArrowRight, CheckCircle2, Building2, Lock, ChevronDown, Activity
} from 'lucide-react';
import { appStore } from '../services/store';
import { UserRole } from '../types';
import { AudioPlayer } from '../components/landing/AudioPlayer';
import { LiveStatusWidget } from '../components/landing/LiveStatusWidget';

interface LandingPageProps {
  onLoginSuccess: (role: UserRole) => void;
  onNavigateRegister: () => void;
  onNavigateLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onLoginSuccess,
  onNavigateRegister,
  onNavigateLogin
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQuickLogin = (role: UserRole) => {
    appStore.loginAs(role);
    onLoginSuccess(role);
  };

  return (
    <div className="relative min-h-screen bg-[#07080c] text-gray-100 font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
      {/* Audio Player Toggle */}
      <AudioPlayer />

      {/* Persistent Live Status & Ask Widget */}
      <LiveStatusWidget />

      {/* Top Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'py-3 bg-[#0a0c14]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-emerald-500 p-0.5 shadow-lg shadow-amber-900/30">
              <div className="w-full h-full bg-[#0a0c14] rounded-[10px] flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="font-serif font-bold text-xl tracking-widest text-amber-100 uppercase">
                ANNAPURNA
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-300">
                OPS v2.4
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-amber-300 transition-colors">Features</a>
            <a href="#architecture" className="hover:text-amber-300 transition-colors">Architecture</a>
            <a href="#impact" className="hover:text-amber-300 transition-colors">Surplus Rescue</a>
            <a href="#forecasting" className="hover:text-amber-300 transition-colors">Forecasting</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateRegister}
              className="px-4 py-2 rounded-full text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              Student Register
            </button>
            <button
              onClick={onNavigateLogin}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold text-xs tracking-wider uppercase shadow-xl shadow-amber-900/20 hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Account Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
        {/* Full-bleed cinematic dark hero image with slow zoom */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=80"
            alt="Campus Dining Hall Atmosphere"
            className="w-full h-full object-cover opacity-20 filter contrast-125 saturate-50 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-[#07080c]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07080c] via-transparent to-[#07080c]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-medium tracking-wider uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Precision Campus Food Operations & Rescue Platform</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.15]">
            Campus Dining Operations, <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-400 bg-clip-text text-transparent italic font-normal">
              Engineered for Absolute Precision.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-300 font-light leading-relaxed">
            Eliminate mess food waste, automate turnstile check-ins, capture multi-tier student feedback, 
            and forecast prep quantities with precision — all while preserving manual operational authority.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleQuickLogin('authority')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 text-gray-950 font-extrabold text-sm uppercase tracking-wider shadow-2xl hover:shadow-amber-500/20 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Launch Authority Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleQuickLogin('student')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cinematic-surface/90 border border-white/15 text-gray-200 hover:text-white hover:border-amber-400/50 backdrop-blur-xl font-bold text-sm uppercase tracking-wider hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Launch Student Mobile App</span>
              <QrCode className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Turnstile Scan Time', val: '< 1.8 sec', icon: QrCode, color: 'text-amber-400' },
              { label: 'Average Waste Saved', val: '28.4%', icon: Leaf, color: 'text-emerald-400' },
              { label: 'Demand Accuracy', val: '94.2%', icon: TrendingUp, color: 'text-amber-400' },
              { label: 'Food Rescue Rate', val: '100%', icon: Shield, color: 'text-emerald-400' },
            ].map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-left">
                <m.icon className={`w-5 h-5 mb-2 ${m.color}`} />
                <div className="text-2xl font-bold font-mono text-white">{m.val}</div>
                <div className="text-xs text-gray-400 font-medium mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-gray-400 text-xs animate-bounce">
          <span>Explore Platform Features</span>
          <ChevronDown className="w-4 h-4 mt-1" />
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/10 relative">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">Dual Purpose Architecture</h2>
          <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white">Built for Operations Administrators & Campus Students</h3>
          <p className="text-gray-400 text-sm">Two specialized interfaces designed for speed, clarity, and real-time execution.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Authority Side Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-cinematic-surface via-cinematic-surface/90 to-black/60 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Building2 className="w-32 h-32 text-amber-400" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-6">
              <Building2 className="w-3.5 h-3.5" />
              <span>Authority Dashboard</span>
            </div>
            <h4 className="font-serif text-2xl font-bold text-white mb-4">Operational Density & Control</h4>
            <ul className="space-y-3 text-sm text-gray-300 mb-8">
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
                  <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleQuickLogin('authority')}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Access Authority Control Room
            </button>
          </div>

          {/* Student Side Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-cinematic-surface via-cinematic-surface/90 to-black/60 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-32 h-32 text-emerald-400" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono mb-6">
              <Users className="w-3.5 h-3.5" />
              <span>Student Mobile App</span>
            </div>
            <h4 className="font-serif text-2xl font-bold text-white mb-4">Personalized & Mobile-First</h4>
            <ul className="space-y-3 text-sm text-gray-300 mb-8">
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
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleQuickLogin('student')}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Open Student Mobile Experience
            </button>
          </div>
        </div>
      </section>

      {/* Role Selection Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-3xl bg-cinematic-surface border border-cinematic-border shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <span className="font-serif font-bold text-lg text-white">ANNAPURNA Authentication</span>
              </div>
              <button
                onClick={() => setLoginModalOpen(false)}
                className="text-gray-400 hover:text-white text-xs font-mono"
              >
                ESC
              </button>
            </div>

            <p className="text-xs text-gray-400">
              Select your role to access the corresponding environment. Credentials will be validated via Supabase Auth RLS.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => { setLoginModalOpen(false); handleQuickLogin('student'); }}
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400 hover:bg-emerald-950/20 text-left transition-all group flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm group-hover:text-emerald-300">Student Portal</div>
                    <div className="text-xs text-gray-400">Hostel Resident & Dining Check-in</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => { setLoginModalOpen(false); handleQuickLogin('authority'); }}
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400 hover:bg-amber-950/20 text-left transition-all group flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm group-hover:text-amber-300">Authority Operations</div>
                    <div className="text-xs text-gray-400">Mess Admin, Food Rescue & Ops</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-serif text-sm font-bold text-gray-300">
            <UtensilsCrossed className="w-4 h-4 text-amber-400" />
            <span>ANNAPURNA Campus Food Operations Platform</span>
          </div>
          <div>© {new Date().getFullYear()} ANNAPURNA Food Operations. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};
