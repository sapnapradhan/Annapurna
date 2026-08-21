import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, Shield, Sparkles, QrCode, TrendingUp, BarChart3, 
  Leaf, Users, ArrowRight, CheckCircle2, Building2, Lock, ChevronDown, Activity, UserPlus, LogIn, Truck, MapPin, Play, Heart, Smile
} from 'lucide-react';
import { appStore } from '../services/store';
import { UserRole } from '../types';
import { AudioPlayer } from '../components/common/AudioPlayer';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { WeatherWidget } from '../components/common/WeatherWidget';
import { LiveStatusWidget } from '../components/landing/LiveStatusWidget';
import { MusicChoiceModal } from '../components/common/MusicChoiceModal';
import { VoiceAssistWidget } from '../components/common/VoiceAssistWidget';
import { DynamicParticles } from '../components/common/DynamicParticles';

interface LandingPageProps {
  onLoginSuccess: (role: UserRole) => void;
  onNavigateRegister: () => void;
  onNavigateLogin: () => void;
  onNavigateRescue: () => void;
  onReplayIntro: () => void;
}

const CHILDREN_STORIES = [
  {
    id: 'story-1',
    slogan: 'NO CHILD SHOULD SLEEP HUNGRY',
    subtext: 'Bhubaneswar Campus Dining feeds 400+ hostel students daily, automatically calculating surplus food to rescue children in need.',
    tag: '⚠️ HUNGER ERADICATION MISSION',
    bgGradient: 'from-amber-900/60 via-rose-950/40 to-black/60',
    iconColor: 'text-amber-400'
  },
  {
    id: 'story-2',
    slogan: 'FROM SURPLUS TO SMILING FACES',
    subtext: 'Every unserved meal tray is verified, temperature-checked, and dispatched to local Robin Hood Army & Feeding India hubs.',
    tag: '🚚 REAL-TIME FOOD RESCUE DISPATCH',
    bgGradient: 'from-emerald-950/60 via-amber-950/40 to-black/60',
    iconColor: 'text-emerald-400'
  },
  {
    id: 'story-3',
    slogan: 'NOURISHING DREAMS, ONE MEAL AT A TIME',
    subtext: 'Transforming food waste into joy, smiles, and hope across Odisha.',
    tag: '💖 COMMUNITY IMPACT',
    bgGradient: 'from-purple-950/60 via-[#C86D44]/30 to-black/60',
    iconColor: 'text-pink-400'
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onNavigateRegister,
  onNavigateLogin,
  onNavigateRescue,
  onReplayIntro
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  const [showMusicPopup, setShowMusicPopup] = useState<boolean>(() => {
    return localStorage.getItem('annapurna_music_consent') === null;
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-play Children Food Story Reel every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStoryIdx((prev) => (prev + 1) % CHILDREN_STORIES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleMusicChoice = (enableMusic: boolean) => {
    setShowMusicPopup(false);
    if (enableMusic) {
      try {
        const audio = new Audio('/audio/background-music.mp3');
        audio.loop = true;
        audio.volume = 0.5;
        audio.play().catch(e => console.warn('Audio play error', e));
      } catch (e) {
        console.warn('Audio init error:', e);
      }
    }
  };

  const currentStory = CHILDREN_STORIES[activeStoryIdx];

  return (
    <div className="relative min-h-screen bg-homepage-image text-[#2C221E] dark:text-slate-100 font-sans selection:bg-[#C86D44] selection:text-white transition-colors duration-300 overflow-x-hidden">
      {/* Ambient Dynamic Background Particles */}
      <DynamicParticles />

      {/* Light Backdrop Scrim */}
      <div className="fixed inset-0 bg-transparent pointer-events-none z-0" />

      {/* Main Page Music Choice Consent Popup */}
      {showMusicPopup && (
        <MusicChoiceModal onChoiceMade={handleMusicChoice} />
      )}

      <div className="relative z-10">
        {/* Persistent Live Ops Status Widget */}
        <LiveStatusWidget />

        {/* Floating Pill Navigation Bar */}
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 max-w-6xl w-[94%] transition-all duration-300">
          <div className="bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-full px-5 py-2.5 flex items-center justify-between">
            {/* Logo Emblem */}
            <div className="flex items-center gap-2.5">
              <img 
                src="/logo.png" 
                alt="ANNAPURNA Logo" 
                className="h-8 w-auto object-contain shrink-0" 
              />
              <div>
                <span className="font-cursive font-bold text-xl tracking-wider text-[#2C221E] dark:text-amber-100">
                  Annapurna
                </span>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-6 text-[11px] font-mono font-bold tracking-widest text-slate-800 dark:text-slate-200 uppercase">
              <a href="#children-stories" className="hover:text-[#C86D44] dark:hover:text-amber-400 transition-colors text-[#C86D44] dark:text-amber-300">CHILDREN STORIES</a>
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
              <VoiceAssistWidget label="Read Screen" textToRead="Welcome to Annapurna. Designed to nourish, built to share. Annapurna connects campus dining facilities with local community food rescue networks in Bhubaneswar, Odisha and state-wide." />
              <ThemeToggle />

              <button
                onClick={onReplayIntro}
                className="hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:text-[#C86D44] dark:hover:text-amber-300 border border-white/20 bg-white/10 dark:bg-black/30 transition-colors backdrop-blur-md"
                title="Replay Story"
              >
                Story
              </button>

              <button
                onClick={onNavigateRescue}
                className="px-3.5 py-1.5 rounded-full text-[11px] font-bold text-[#C86D44] dark:text-amber-300 bg-[#C86D44]/20 hover:bg-[#C86D44]/30 border border-[#C86D44]/40 transition-all cursor-pointer flex items-center gap-1 backdrop-blur-md"
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

        {/* Full-Screen Editorial Hero Section (Translucent Glass Container) */}
        <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-7 p-10 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl">
            
            {/* Eyebrow Label */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C86D44]/20 border border-[#C86D44]/40 text-[#C86D44] dark:text-amber-300 text-[10px] font-mono font-bold uppercase tracking-widest backdrop-blur-md">
                <MapPin className="w-3 h-3" />
                <span>CAMPUS FOOD OPERATIONS · BHUBANESWAR, ODISHA</span>
              </div>
            </div>

            {/* Cursive Display Headline */}
            <h1 className="font-cursive font-bold text-4xl sm:text-5xl md:text-6xl text-[#2C221E] dark:text-amber-100 leading-[1.15] drop-shadow-lg">
              Designed to Nourish. <br />
              <span className="text-[#C86D44] dark:text-amber-300 font-cursive">
                Built to Share.
              </span>
            </h1>

            {/* Supporting Statement */}
            <p className="max-w-xl mx-auto text-xs sm:text-base text-slate-800 dark:text-slate-200 font-normal leading-relaxed drop-shadow">
              Every meal has a story. Annapurna connects campus dining facilities directly with local community food rescue networks.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={onNavigateRescue}
                className="group w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>EXPLORE FOOD RESCUE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onNavigateRegister}
                className="group w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 dark:bg-black/30 border border-white/30 text-[#2C221E] dark:text-slate-100 hover:border-[#C86D44] font-bold text-xs uppercase tracking-widest shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <span>REGISTER STUDENT ACCOUNT</span>
                <ArrowRight className="w-4 h-4 text-[#C86D44] dark:text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Scroll Indicator */}
            <div className="pt-6 flex flex-col items-center text-slate-400 text-[10px] font-mono tracking-widest uppercase animate-bounce">
              <span>SEE CHILDREN FOOD STORIES & TELEMETRY</span>
              <ChevronDown className="w-4 h-4 mt-1 text-[#C86D44]" />
            </div>
          </div>
        </section>

        {/* DYNAMIC CHILDREN FOOD STORY REEL / SLIDESHOW SECTION */}
        <section id="children-stories" className="py-20 px-6 max-w-5xl mx-auto border-t border-white/20 dark:border-white/10">
          <div className="text-center max-w-xl mx-auto mb-10 p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 backdrop-blur-xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-[#C86D44] dark:text-amber-400 uppercase">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
              <span>HUNGRY TO SMILING FACES IMPACT REEL</span>
            </div>
            <h2 className="font-cursive text-3xl sm:text-4xl font-bold text-[#2C221E] dark:text-white tracking-wide">
              No Child Should Sleep Hungry
            </h2>
          </div>

          {/* Animated Story Reel Card */}
          <div className={`p-8 sm:p-12 rounded-3xl bg-gradient-to-br ${currentStory.bgGradient} border border-amber-500/30 shadow-2xl backdrop-blur-2xl transition-all duration-700 space-y-6 text-center text-white relative overflow-hidden`}>
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold tracking-wider uppercase backdrop-blur-md">
              <Smile className={`w-4 h-4 ${currentStory.iconColor}`} />
              <span>{currentStory.tag}</span>
            </div>

            {/* Slogan */}
            <h3 className="font-cursive font-bold text-3xl sm:text-5xl text-amber-200 leading-tight drop-shadow-xl">
              "{currentStory.slogan}"
            </h3>

            {/* Subtext */}
            <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-200 font-medium leading-relaxed drop-shadow">
              {currentStory.subtext}
            </p>

            {/* Slide Indicators */}
            <div className="flex items-center justify-center gap-2 pt-4">
              {CHILDREN_STORIES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStoryIdx(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeStoryIdx === idx ? 'w-8 bg-[#C86D44] dark:bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Campus Weather Telemetry */}
        <section id="weather" className="py-16 px-6 max-w-5xl mx-auto border-t border-white/20 dark:border-white/10">
          <div className="text-center max-w-xl mx-auto mb-8 p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 backdrop-blur-xl">
            <h2 className="text-xs font-mono font-bold tracking-widest text-[#C86D44] dark:text-amber-400 uppercase">BHUBANESWAR · ODISHA TELEMETRY</h2>
            <h3 className="font-cursive text-2xl sm:text-3xl font-bold text-[#2C221E] dark:text-white tracking-wide">Campus Climate & Weather Forecast</h3>
          </div>
          <WeatherWidget />
        </section>

        {/* Feature Showcase Grid */}
        <section id="features" className="py-20 px-6 max-w-6xl mx-auto border-t border-white/20 dark:border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-14 p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 backdrop-blur-xl space-y-2">
            <h2 className="text-xs font-mono font-bold tracking-widest text-[#C86D44] dark:text-amber-400 uppercase">Dual Interface Architecture</h2>
            <h3 className="font-cursive text-2xl sm:text-3xl font-bold text-[#2C221E] dark:text-white tracking-wide">Designed for Ops Authority & Hostel Students</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Authority Side Card */}
            <div className="p-8 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl space-y-6 backdrop-blur-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C86D44]/20 text-[#C86D44] dark:text-amber-300 text-xs font-mono font-bold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Authority Dashboard</span>
              </div>
              <h4 className="font-cursive text-2xl font-bold text-[#2C221E] dark:text-white tracking-wide">Operational Density & Control</h4>
              <ul className="space-y-3 text-xs text-slate-800 dark:text-slate-200 font-medium">
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
                className="w-full py-3 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Log In to Authority Operations
              </button>
            </div>

            {/* Student Side Card */}
            <div className="p-8 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl space-y-6 backdrop-blur-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>Student Mobile App</span>
              </div>
              <h4 className="font-cursive text-2xl font-bold text-[#2C221E] dark:text-white tracking-wide">Personalized & Mobile-First</h4>
              <ul className="space-y-3 text-xs text-slate-800 dark:text-slate-200 font-medium">
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
                className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Register Student Dining Account
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 border-t border-white/20 dark:border-white/10 text-center text-xs text-slate-700 dark:text-slate-300 bg-white/5 dark:bg-black/40 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-cursive text-base font-bold text-[#2C221E] dark:text-slate-200 tracking-wider">
              <img 
                src="/logo.png" 
                alt="ANNAPURNA Logo" 
                className="h-6 w-auto object-contain shrink-0" 
              />
              <span>Annapurna • Bhubaneswar, Odisha</span>
            </div>
            <div>© {new Date().getFullYear()} ANNAPURNA Food Operations. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </div>
  );
};
