import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, UtensilsCrossed, Play } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
}

interface StoryScene {
  id: number;
  image: string;
  slogan: string;
  subtext: string;
}

const SCENES: StoryScene[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=2000&q=80',
    slogan: 'Every meal begins with a simple idea.',
    subtext: 'Food is crafted to bring energy and life.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2000&q=80',
    slogan: 'Food is meant to be shared.',
    subtext: 'Connecting people around the table.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=2000&q=80',
    slogan: 'What is surplus to one can be a meal for another.',
    subtext: 'Good food deserves a second table.'
  },
  {
    id: 4,
    image: '/background.jpg',
    slogan: 'Let\'s keep good food moving.',
    subtext: 'From campus messes directly to communities in need.'
  }
];

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isFinalResolve, setIsFinalResolve] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [started, setStarted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFinish = () => {
    localStorage.setItem('annapurna_intro_seen', 'true');
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onComplete();
  };

  const startIntro = async () => {
    setStarted(true);
    // Try starting audio
    const audio = new Audio('/audio/background-music.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    try {
      await audio.play();
      setAutoplayBlocked(false);
    } catch (e) {
      // Audio fallback / non-blocking
      setAutoplayBlocked(false);
    }
  };

  useEffect(() => {
    startIntro();
  }, []);

  // Scene progression timer (1.2 seconds per scene, total 5 seconds)
  useEffect(() => {
    if (!started) return;

    if (currentSceneIdx < SCENES.length - 1) {
      const timer = setTimeout(() => {
        setCurrentSceneIdx(prev => prev + 1);
      }, 1300);
      return () => clearTimeout(timer);
    } else if (currentSceneIdx === SCENES.length - 1 && !isFinalResolve) {
      const timer = setTimeout(() => {
        setIsFinalResolve(true);
      }, 1400);
      return () => clearTimeout(timer);
    } else if (isFinalResolve) {
      const timer = setTimeout(() => {
        handleFinish();
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [started, currentSceneIdx, isFinalResolve]);

  const scene = SCENES[currentSceneIdx];

  return (
    <div className="fixed inset-0 z-50 bg-[#07080c] text-white font-sans overflow-hidden flex items-center justify-center select-none">
      {/* Background Image Scene Transition with Ken Burns Slow Zoom */}
      {SCENES.map((sc, idx) => (
        <div
          key={sc.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSceneIdx && !isFinalResolve ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{ transition: 'opacity 1s ease-in-out, transform 4s ease-out' }}
        >
          <img
            src={sc.image}
            alt={sc.slogan}
            className="w-full h-full object-cover filter contrast-110 brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-black/40 to-[#07080c]/60" />
        </div>
      ))}

      {/* Final Logo Resolve Scene */}
      <div
        className={`absolute inset-0 bg-provided-image flex items-center justify-center transition-opacity duration-1000 ${
          isFinalResolve ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-[#07080c]/90 backdrop-blur-sm" />
        <div className="relative z-10 text-center space-y-6 px-6 max-w-2xl animate-in zoom-in-95 duration-700">
          <div className="w-16 h-16 rounded-2xl bg-[#C86D44] text-white flex items-center justify-center font-serif font-bold text-3xl shadow-2xl mx-auto">
            A
          </div>
          <div>
            <h1 className="font-serif font-bold text-4xl sm:text-5xl tracking-widest text-amber-100 uppercase">
              ANNAPURNA
            </h1>
            <p className="text-xs font-mono font-bold tracking-widest text-[#C86D44] mt-2 uppercase">
              Campus Food Operations & Rescue Platform
            </p>
          </div>
          <div className="pt-2">
            <h2 className="text-[#C86D44] font-mono font-bold text-sm uppercase tracking-widest border-y border-[#C86D44]/30 py-2 inline-block">
              FEED PEOPLE. REDUCE WASTE. CREATE IMPACT.
            </h2>
          </div>
        </div>
      </div>

      {/* Scene Text Overlay */}
      {!isFinalResolve && (
        <div className="relative z-20 text-center max-w-3xl px-6 space-y-3 animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C86D44]/20 border border-[#C86D44]/40 text-[#C86D44] dark:text-amber-300 text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Story {currentSceneIdx + 1} of 4</span>
          </div>

          <h2 className="font-serif font-bold text-3xl sm:text-5xl tracking-tight text-white leading-tight drop-shadow-lg">
            "<span className="italic font-serif-display font-normal text-amber-200">{scene.slogan}</span>"
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-light drop-shadow">
            {scene.subtext}
          </p>

          {/* Scene Dots */}
          <div className="flex items-center justify-center gap-2 pt-6">
            {SCENES.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentSceneIdx ? 'w-8 bg-[#C86D44]' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Autoplay Manual Trigger if restricted */}
      {autoplayBlocked && (
        <div className="absolute top-8 z-30">
          <button
            onClick={startIntro}
            className="px-6 py-3 rounded-full bg-[#C86D44] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xl animate-pulse cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>ENTER EXPERIENCE</span>
          </button>
        </div>
      )}

      {/* Skip Button (Bottom-Right) */}
      <button
        onClick={handleFinish}
        className="absolute bottom-8 right-8 z-30 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 text-slate-300 hover:text-white border border-white/20 text-xs font-mono font-semibold tracking-wider backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-xl"
      >
        <span>SKIP INTRO</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
