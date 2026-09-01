import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, Shield, Sparkles, QrCode, TrendingUp, BarChart3, 
  Leaf, Users, ArrowRight, CheckCircle2, Building2, Lock, ChevronDown, Activity, UserPlus, LogIn, Truck, MapPin, Play, Heart, Smile, X, Info, Award
} from 'lucide-react';
import { appStore } from '../services/store';
import { themeStore, ThemeMode } from '../services/themeStore';
import { UserRole } from '../types';
import { AudioPlayer } from '../components/common/AudioPlayer';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { WeatherWidget } from '../components/common/WeatherWidget';
import { LiveStatusWidget } from '../components/landing/LiveStatusWidget';
import { MusicChoiceModal } from '../components/common/MusicChoiceModal';
import { VoiceAssistWidget } from '../components/common/VoiceAssistWidget';
import { DynamicParticles } from '../components/common/DynamicParticles';
import { ThreeDElementCanvas } from '../components/common/ThreeDElementCanvas';
import { GoogleAIAssistantModal } from '../components/common/GoogleAIAssistantModal';
import { AnthropicAIAssistantModal } from '../components/common/AnthropicAIAssistantModal';

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
    image: '/story-child-1.jpg',
    slogan: 'NO CHILD SHOULD SLEEP HUNGRY',
    subtext: 'ITER Ladies Hostels (LH1 to LH5) food operations calculate surplus food in real time to rescue children in need across Bhubaneswar.',
    tag: '⚠️ HUNGER ERADICATION MISSION',
    iconColor: 'text-amber-500 dark:text-amber-400'
  },
  {
    id: 'story-2',
    image: '/story-child-2.jpg',
    slogan: 'FROM SURPLUS TO SMILING FACES',
    subtext: 'Every unserved meal tray is verified, temperature-checked, and dispatched to local Robin Hood Army & Feeding India hubs.',
    tag: '🚚 REAL-TIME FOOD RESCUE DISPATCH',
    iconColor: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    id: 'story-3',
    image: '/story-child-3.jpg',
    slogan: 'NOURISHING DREAMS, ONE MEAL AT A TIME',
    subtext: 'Transforming food waste into joy, smiles, and hope across Odisha.',
    tag: '💖 COMMUNITY IMPACT',
    iconColor: 'text-pink-600 dark:text-pink-400'
  },
  {
    id: 'story-4',
    image: '/story-child-4.jpg',
    slogan: 'HOPE, HAPPINESS & HEALTH FOR ALL',
    subtext: 'Empowering children with nutrition and care through student-led campus food sustainability.',
    tag: '🌟 TEAM ASTRA VISION',
    iconColor: 'text-cyan-600 dark:text-cyan-400'
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onNavigateRegister,
  onNavigateLogin,
  onNavigateRescue,
  onReplayIntro
}) => {
  const [theme, setTheme] = useState<ThemeMode>(themeStore.getTheme());
  const [scrolled, setScrolled] = useState(false);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [showTeamAstraModal, setShowTeamAstraModal] = useState(false);
  const [showGoogleAIModal, setShowGoogleAIModal] = useState(false);
  const [showAnthropicAIModal, setShowAnthropicAIModal] = useState(false);

  const [showMusicPopup, setShowMusicPopup] = useState<boolean>(() => {
    return localStorage.getItem('annapurna_music_consent') === null;
  });

  useEffect(() => {
    const updateTheme = () => setTheme(themeStore.getTheme());
    return themeStore.subscribe(updateTheme);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-play Children Food Story Reel every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStoryIdx((prev) => (prev + 1) % CHILDREN_STORIES.length);
    }, 4500);
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
  const isDark = theme === 'dark';

  return (
    <div 
      className={`relative min-h-screen font-clean selection:bg-[#C86D44] selection:text-white transition-colors duration-500 overflow-x-hidden ${
        isDark 
          ? 'text-slate-100 bg-cover bg-center bg-fixed' 
          : 'text-[#2C221E] bg-[#FFFDF7]'
      }`}
      style={isDark ? { backgroundImage: `url('/new-hero-bg.jpg')` } : {}}
    >
      {/* Ambient Dynamic Background Overlay for Dark Mode */}
      {isDark && <div className="fixed inset-0 bg-black/55 backdrop-blur-[2px] pointer-events-none z-0" />}
      <DynamicParticles />

      {/* Music Choice Modal */}
      {showMusicPopup && (
        <MusicChoiceModal onChoiceMade={handleMusicChoice} />
      )}

      {/* TEAM ASTRA ABOUT MODAL */}
      {showTeamAstraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300 font-clean">
          <div className={`w-full max-w-2xl p-8 rounded-3xl border shadow-2xl space-y-6 relative overflow-hidden ${
            isDark 
              ? 'bg-[#1A1715]/95 text-white border-amber-500/40' 
              : 'bg-white text-slate-900 border-amber-800/20'
          }`}>
            <button
              onClick={() => setShowTeamAstraModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-500/10 hover:bg-slate-500/20 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 border-b border-slate-500/20 pb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-[#C86D44] text-white flex items-center justify-center font-bold text-2xl shadow-xl border border-amber-300">
                🚀
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-[#C86D44] dark:text-amber-300 font-mono text-[10px] font-bold uppercase tracking-widest">
                  TEAM ASTRA • INNOVATION PROJECT
                </div>
                <h2 className="font-display-title font-bold text-2xl sm:text-3xl text-[#2C221E] dark:text-amber-100 mt-1">
                  About Team Astra
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed font-normal text-slate-700 dark:text-slate-200">
              <p>
                <strong className="text-[#C86D44] dark:text-amber-300 font-semibold">Team Astra</strong> is an engineering innovation squad dedicated to solving real-world campus challenges through intelligent software architecture.
              </p>

              <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-white/5 border border-amber-500/20 dark:border-white/10 space-y-2">
                <h3 className="font-bold text-[#C86D44] dark:text-amber-300 font-mono text-xs uppercase tracking-wider">🌟 PLATFORM MISSION</h3>
                <p className="text-xs leading-relaxed">
                  Annapurna bridges the gap between ITER Ladies Hostels (LH1 to LH5) dining halls and local community food rescue networks in Bhubaneswar, eliminating food waste and nourishing children in need.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-white/5 border border-amber-500/20 dark:border-white/10 text-center">
                  <div className="font-bold text-base text-[#C86D44] dark:text-amber-200 font-mono">ITER LH1 – LH5</div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">HOSTEL MESS INTEGRATION</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-white/5 border border-amber-500/20 dark:border-white/10 text-center">
                  <div className="font-bold text-base text-emerald-600 dark:text-emerald-300 font-mono">ZERO WASTE</div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">SURPLUS RESCUE GOAL</div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowTeamAstraModal(false)}
                className="px-8 py-3 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                CLOSE ABOUT TEAM ASTRA
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 font-clean">
        {/* Persistent Live Ops Status Widget */}
        <LiveStatusWidget />

        {/* Floating Header Navigation Bar */}
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 max-w-6xl w-[94%] transition-all duration-300">
          <div className={`border shadow-2xl rounded-full px-6 py-3 flex items-center justify-between gap-4 transition-colors ${
            isDark 
              ? 'bg-black/80 backdrop-blur-2xl border-white/20' 
              : 'bg-white/95 backdrop-blur-2xl border-amber-900/15 text-[#2C221E]'
          }`}>
            
            {/* Crisp Visible Circular Logo Badge & Title */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-11 h-11 rounded-full bg-white p-1 border-2 border-amber-400 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="ANNAPURNA Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div>
                <span className="font-display-title font-bold text-lg sm:text-xl tracking-wide text-[#2C221E] dark:text-amber-100 leading-none block">
                  Annapurna
                </span>
                <span className="text-[9px] font-mono text-[#C86D44] dark:text-amber-300 tracking-wider uppercase block mt-0.5">
                  ITER LH1 - LH5
                </span>
              </div>
            </div>

            {/* Nav Links with Clean Spacing */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-mono font-bold tracking-wider uppercase text-slate-700 dark:text-slate-200">
              <a href="#features" className="hover:text-[#C86D44] dark:hover:text-amber-300 hover:scale-105 transition-all duration-200">FEATURES</a>
              <a href="#weather" className="hover:text-[#C86D44] dark:hover:text-amber-300 hover:scale-105 transition-all duration-200">WEATHER</a>
              <button
                onClick={() => setShowGoogleAIModal(true)}
                className="px-3 py-1 rounded-full bg-amber-500/20 text-[#C86D44] dark:text-amber-300 hover:scale-105 transition-all duration-200 flex items-center gap-1.5 cursor-pointer border border-amber-500/40 font-mono text-[10px]"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>GOOGLE AI STUDIO</span>
              </button>
              <button
                onClick={() => setShowTeamAstraModal(true)}
                className="hover:text-[#C86D44] dark:hover:text-amber-300 hover:scale-105 transition-all duration-200 flex items-center gap-1.5 cursor-pointer text-[#C86D44] dark:text-amber-300"
              >
                <Award className="w-3.5 h-3.5" />
                <span>ABOUT TEAM ASTRA</span>
              </button>
              <button
                onClick={onNavigateRescue}
                className="hover:text-[#C86D44] dark:hover:text-amber-300 hover:scale-105 transition-all duration-200 flex items-center gap-1 cursor-pointer text-[#C86D44] dark:text-amber-300"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>FOOD RESCUE</span>
              </button>
            </nav>

            {/* Controls & Interactive Hover Zoom CTAs */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <AudioPlayer />
              <VoiceAssistWidget label="Read" textToRead="Welcome to Annapurna by Team Astra. Designed to nourish, built to share for ITER Ladies Hostels LH1 to LH5." />
              <ThemeToggle />

              <button
                onClick={onReplayIntro}
                className="hidden sm:inline-block px-3 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-[#C86D44] dark:text-amber-200 hover:text-white border border-[#C86D44]/30 dark:border-amber-400/40 bg-[#C86D44]/10 dark:bg-white/10 backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-200"
                title="Replay Story"
              >
                Story
              </button>

              <button
                onClick={onNavigateLogin}
                className="px-5 py-2 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-1.5 border border-amber-300/30"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            </div>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
          <div className={`max-w-4xl mx-auto text-center space-y-8 p-8 sm:p-12 rounded-3xl border shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-700 transition-colors ${
            isDark 
              ? 'bg-black/75 border-white/20 text-white' 
              : 'bg-white/95 border-amber-900/15 text-[#2C221E]'
          }`}>
            
            {/* Eyebrow Label */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[#C86D44] dark:text-amber-300 text-xs font-mono font-bold uppercase tracking-widest backdrop-blur-md">
                <MapPin className="w-3.5 h-3.5" />
                <span>ITER LADIES HOSTELS (LH1, LH2, LH3, LH4, LH5) · BHUBANESWAR</span>
              </div>
            </div>

            {/* Interactive 3D Canvas Emblem */}
            <ThreeDElementCanvas />

            {/* High-Contrast Headline */}
            <h1 className="font-display-title font-bold text-3xl sm:text-5xl text-[#2C221E] dark:text-amber-100 leading-tight tracking-wide drop-shadow-2xl">
              Designed to Nourish. <br />
              <span className="text-[#C86D44] dark:text-amber-400 font-display-title underline decoration-amber-500/50">
                Built to Share.
              </span>
            </h1>

            {/* Supporting Statement */}
            <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-700 dark:text-slate-200 font-normal leading-relaxed drop-shadow">
              Every meal has a story. Annapurna connects ITER Ladies Hostels (LH1 to LH5) dining facilities directly with local community food rescue networks.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setShowGoogleAIModal(true)}
                className="group w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-[#C86D44] hover:from-amber-600 hover:to-[#B35C33] text-black font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border border-amber-300/40"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>ASK GOOGLE AI STUDIO</span>
              </button>

              <button
                onClick={onNavigateRescue}
                className="group w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border border-amber-300/40"
              >
                <span>EXPLORE FOOD RESCUE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onNavigateRegister}
                className="group w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#C86D44]/10 dark:bg-white/10 hover:bg-[#C86D44]/20 dark:hover:bg-white/20 border border-[#C86D44]/30 dark:border-white/30 text-[#C86D44] dark:text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <span>REGISTER LH STUDENT ACCOUNT</span>
                <ArrowRight className="w-4 h-4 text-[#C86D44] dark:text-amber-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Scroll Indicator */}
            <div className="pt-4 flex flex-col items-center text-[#C86D44] dark:text-amber-300 text-[11px] font-mono tracking-widest uppercase animate-bounce">
              <span>SCROLL DOWN FOR IMPACT STORIES & TELEMETRY</span>
              <ChevronDown className="w-5 h-5 mt-1 text-[#C86D44] dark:text-amber-400" />
            </div>
          </div>
        </section>

        {/* DYNAMIC CHILDREN IMPACT STORY REEL */}
        <section id="children-stories" className="py-20 px-6 max-w-5xl mx-auto border-t border-slate-500/20">
          <div className={`text-center max-w-xl mx-auto mb-12 p-6 rounded-3xl border backdrop-blur-xl space-y-2 ${
            isDark 
              ? 'bg-black/75 border-white/20 text-white' 
              : 'bg-white/95 border-amber-900/15 text-[#2C221E] shadow-xl'
          }`}>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-[#C86D44] dark:text-amber-400 uppercase">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
              <span>HUNGRY TO SMILING FACES IMPACT REEL</span>
            </div>
            <h2 className="font-display-title text-2xl sm:text-3xl font-bold text-[#2C221E] dark:text-amber-100 tracking-wide">
              No Child Should Sleep Hungry
            </h2>
          </div>

          {/* Real Photo Slide Card */}
          <div className="relative rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl bg-black/80 backdrop-blur-2xl transition-all duration-700 min-h-[440px] flex flex-col justify-end p-8 sm:p-12">
            
            {/* Background Image Layer */}
            <img
              src={currentStory.image}
              alt={currentStory.slogan}
              className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-4 text-center text-white">
              {/* Tag Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 border border-white/30 text-xs font-mono font-bold tracking-wider uppercase backdrop-blur-md">
                <Smile className={`w-4 h-4 ${currentStory.iconColor}`} />
                <span>{currentStory.tag}</span>
              </div>

              {/* Slogan */}
              <h3 className="font-display-title font-bold text-2xl sm:text-4xl text-amber-200 leading-tight drop-shadow-2xl">
                "{currentStory.slogan}"
              </h3>

              {/* Subtext */}
              <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-100 font-normal leading-relaxed drop-shadow-md">
                {currentStory.subtext}
              </p>

              {/* Slide Dots */}
              <div className="flex items-center justify-center gap-3 pt-4">
                {CHILDREN_STORIES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStoryIdx(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer hover:scale-125 ${
                      activeStoryIdx === idx ? 'w-10 bg-amber-400' : 'w-2.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Campus Weather Telemetry */}
        <section id="weather" className="py-16 px-6 max-w-5xl mx-auto border-t border-slate-500/20">
          <div className={`text-center max-w-xl mx-auto mb-8 p-6 rounded-3xl border backdrop-blur-xl ${
            isDark 
              ? 'bg-black/75 border-white/20 text-white' 
              : 'bg-white/95 border-amber-900/15 text-[#2C221E] shadow-xl'
          }`}>
            <h2 className="text-xs font-mono font-bold tracking-widest text-[#C86D44] dark:text-amber-400 uppercase">BHUBANESWAR · ODISHA TELEMETRY</h2>
            <h3 className="font-display-title text-2xl sm:text-3xl font-bold text-[#2C221E] dark:text-amber-100 tracking-wide">Campus Climate & Weather Forecast</h3>
          </div>
          <WeatherWidget />
        </section>

        {/* Feature Showcase Grid */}
        <section id="features" className="py-20 px-6 max-w-6xl mx-auto border-t border-slate-500/20">
          <div className={`text-center max-w-2xl mx-auto mb-14 p-6 rounded-3xl border backdrop-blur-xl space-y-2 ${
            isDark 
              ? 'bg-black/75 border-white/20 text-white' 
              : 'bg-white/95 border-amber-900/15 text-[#2C221E] shadow-xl'
          }`}>
            <h2 className="text-xs font-mono font-bold tracking-widest text-[#C86D44] dark:text-amber-400 uppercase">Dual Interface Architecture</h2>
            <h3 className="font-display-title text-2xl sm:text-3xl font-bold text-[#2C221E] dark:text-amber-100 tracking-wide">Designed for Ops Authority & LH1-5 Students</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Authority Side Card */}
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 backdrop-blur-xl transition-all duration-300 hover:[transform:perspective(1000px)_rotateX(2deg)_rotateY(-2deg)_scale3d(1.02,1.02,1.02)] hover:border-amber-500/50 ${
              isDark 
                ? 'bg-black/80 border-white/20 text-white' 
                : 'bg-white/95 border-amber-900/15 text-slate-900 shadow-xl'
            }`}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-[#C86D44] dark:text-amber-300 text-xs font-mono font-bold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Authority Dashboard</span>
              </div>
              <h4 className="font-display-title text-xl font-bold text-[#2C221E] dark:text-amber-100 tracking-wide">Operational Density & Control</h4>
              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-200 font-normal">
                {[
                  'PDF Mess Menu Uploader & Schedule Replacement for LH1 to LH5',
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
                className="w-full py-3.5 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-amber-300/30 shadow-lg"
              >
                Log In to Authority Operations
              </button>
            </div>

            {/* Student Side Card */}
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 backdrop-blur-xl transition-all duration-300 hover:[transform:perspective(1000px)_rotateX(2deg)_rotateY(2deg)_scale3d(1.02,1.02,1.02)] hover:border-emerald-500/50 ${
              isDark 
                ? 'bg-black/80 border-white/20 text-white' 
                : 'bg-white/95 border-amber-900/15 text-slate-900 shadow-xl'
            }`}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>Student Mobile App (LH1 to LH5)</span>
              </div>
              <h4 className="font-display-title text-xl font-bold text-[#2C221E] dark:text-amber-100 tracking-wide">Personalized & Mobile-First</h4>
              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-200 font-normal">
                {[
                  'Personalized greeting & next-upcoming meal card for LH1 to LH5',
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
                className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-emerald-400/30 shadow-lg"
              >
                Register LH Student Dining Account
              </button>
            </div>
          </div>
        </section>

        {/* TEAM ASTRA ABOUT US SECTION */}
        <section id="team-astra" className="py-20 px-6 max-w-5xl mx-auto border-t border-slate-500/20">
          <div className={`p-8 sm:p-12 rounded-3xl border shadow-2xl backdrop-blur-2xl text-center space-y-6 relative overflow-hidden ${
            isDark 
              ? 'bg-black/85 border-amber-500/40 text-white' 
              : 'bg-white/95 border-amber-900/15 text-slate-900 shadow-xl'
          }`}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-[#C86D44] dark:text-amber-300 text-xs font-mono font-bold tracking-widest uppercase border border-amber-400/30">
              <Award className="w-4 h-4" />
              <span>DEVELOPER CREDITS & ABOUT US</span>
            </div>

            <h2 className="font-display-title font-bold text-3xl sm:text-4xl text-[#2C221E] dark:text-amber-100">
              Powered by Team Astra
            </h2>

            <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              Annapurna is designed and engineered by <strong className="text-[#C86D44] dark:text-amber-300 font-semibold">Team Astra</strong> to revolutionize campus dining operations across ITER Ladies Hostels (LH1, LH2, LH3, LH4, LH5).
            </p>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => setShowTeamAstraModal(true)}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-[#C86D44] to-amber-500 hover:from-amber-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2 border border-amber-300/40"
              >
                <Info className="w-4 h-4" />
                <span>READ ABOUT TEAM ASTRA & VISION</span>
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`py-10 border-t text-center text-xs backdrop-blur-md font-clean ${
          isDark 
            ? 'border-white/10 text-slate-300 bg-black/90' 
            : 'border-amber-900/10 text-slate-600 bg-white/90'
        }`}>
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm font-bold text-[#2C221E] dark:text-amber-100 tracking-wide">
              <div className="w-7 h-7 rounded-full bg-white p-0.5 border border-amber-400 shrink-0 overflow-hidden flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="ANNAPURNA Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <span>Annapurna • Team Astra • ITER Ladies Hostels (LH1 - LH5)</span>
            </div>
            <div>© {new Date().getFullYear()} ANNAPURNA by Team Astra. All rights reserved.</div>
          </div>
        </footer>

        {/* Google AI Studio Assistant Modal */}
        <GoogleAIAssistantModal 
          isOpen={showGoogleAIModal}
          onClose={() => setShowGoogleAIModal(false)}
        />

        {/* Anthropic AI Claude Assistant Modal */}
        <AnthropicAIAssistantModal 
          isOpen={showAnthropicAIModal}
          onClose={() => setShowAnthropicAIModal(false)}
        />
      </div>
    </div>
  );
};
