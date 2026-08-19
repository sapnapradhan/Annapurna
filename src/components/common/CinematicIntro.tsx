import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';
import { DynamicParticles } from './DynamicParticles';

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
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=2000&q=80',
    slogan: 'No child should go to bed hungry.',
    subtext: 'Every surplus meal holds the power to nourish a growing child.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=2000&q=80',
    slogan: 'Every surplus meal can feed a hungry child.',
    subtext: 'Connecting hostel mess kitchens directly to local children shelters.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=80',
    slogan: 'From mess surplus to community service.',
    subtext: 'Nourishment brought from campus tables to those in need.'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2000&q=80',
    slogan: 'Feeding hope, one meal at a time.',
    subtext: 'Bringing dignity, warmth, and smiles to young lives.'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=2000&q=80',
    slogan: 'Together, we can eliminate campus food waste.',
    subtext: 'Food should reach people, not bins.'
  }
];

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isFinalResolve, setIsFinalResolve] = useState(false);

  const handleFinish = () => {
    localStorage.setItem('annapurna_intro_seen', 'true');
    onComplete();
  };

  // Scene progression timer (1.2s per scene)
  useEffect(() => {
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
      }, 2300);
      return () => clearTimeout(timer);
    }
  }, [currentSceneIdx, isFinalResolve]);

  const scene = SCENES[currentSceneIdx];

  return (
    <div className="fixed inset-0 z-50 bg-[#090807] text-white font-sans overflow-hidden flex items-center justify-center select-none w-screen h-screen">
      {/* Ambient Dynamic Floating Particles */}
      <DynamicParticles />

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
          <div className="absolute inset-0 bg-gradient-to-t from-[#090807] via-black/50 to-[#090807]/70" />
        </div>
      ))}

      {/* Final Logo Resolve Scene */}
      <div
        className={`absolute inset-0 bg-homepage-pattern flex items-center justify-center transition-opacity duration-1000 ${
          isFinalResolve ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-[#090807]/90 backdrop-blur-md" />
        <div className="relative z-10 text-center space-y-5 px-6 max-w-3xl animate-in zoom-in-95 duration-700">
          <div className="w-16 h-16 rounded-full bg-[#C86D44] text-white flex items-center justify-center font-cursive font-bold text-3xl shadow-2xl mx-auto border-2 border-amber-300/40">
            A
          </div>
          <div>
            <h1 className="font-cursive font-bold text-5xl sm:text-7xl text-amber-100 uppercase tracking-wide drop-shadow-2xl">
              ANNAPURNA
            </h1>
            <p className="text-xs font-mono font-bold tracking-widest text-[#C86D44] mt-2 uppercase">
              CAMPUS FOOD OPERATIONS & HUNGER RELIEF PLATFORM
            </p>
          </div>
          <div className="pt-3">
            <h2 className="text-[#C86D44] dark:text-amber-300 font-cursive font-bold text-lg sm:text-2xl tracking-wide border-y border-[#C86D44]/40 py-2 inline-block">
              Feed People. Reduce Waste. Create Impact.
            </h2>
          </div>
        </div>
      </div>

      {/* Scene Text Overlay with Cursive Typography & Scaled Sizing */}
      {!isFinalResolve && (
        <div className="relative z-20 text-center max-w-3xl px-6 space-y-4 animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C86D44]/25 border border-[#C86D44]/40 text-[#C86D44] dark:text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-md">
            <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
            <span>Hunger Relief Mission • Story {currentSceneIdx + 1} of 5</span>
          </div>

          {/* Cursive Font Slogan Headline */}
          <h2 className="font-cursive font-bold text-3xl sm:text-5xl md:text-6xl text-amber-100 leading-tight drop-shadow-2xl">
            "{scene.slogan}"
          </h2>

          <p className="text-xs sm:text-base text-slate-200 font-normal drop-shadow max-w-xl mx-auto">
            {scene.subtext}
          </p>

          {/* Scene Dots */}
          <div className="flex items-center justify-center gap-2 pt-4">
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
