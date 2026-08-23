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
    image: '/story-child-1.jpg',
    slogan: 'No child should go to bed hungry.',
    subtext: 'ITER Ladies Hostels (LH1 to LH5) calculate surplus food to rescue children across Bhubaneswar.'
  },
  {
    id: 2,
    image: '/story-child-2.jpg',
    slogan: 'Every surplus meal can feed a hungry child.',
    subtext: 'Connecting campus dining kitchens directly with local children rescue networks.'
  },
  {
    id: 3,
    image: '/story-child-3.jpg',
    slogan: 'From mess surplus to community joy.',
    subtext: 'Nourishment brought from ITER hostel tables to young lives in need.'
  },
  {
    id: 4,
    image: '/story-child-4.jpg',
    slogan: 'Feeding hope, one meal at a time.',
    subtext: 'Team Astra mission: Bringing dignity, warmth, and smiles to young lives.'
  }
];

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isFinalResolve, setIsFinalResolve] = useState(false);

  const handleFinish = () => {
    localStorage.setItem('annapurna_intro_seen', 'true');
    onComplete();
  };

  // Scene progression timer (1.4s per scene)
  useEffect(() => {
    if (currentSceneIdx < SCENES.length - 1) {
      const timer = setTimeout(() => {
        setCurrentSceneIdx(prev => prev + 1);
      }, 1400);
      return () => clearTimeout(timer);
    } else if (currentSceneIdx === SCENES.length - 1 && !isFinalResolve) {
      const timer = setTimeout(() => {
        setIsFinalResolve(true);
      }, 1500);
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

      {/* Background Image Scene Transition with Slow Zoom */}
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

      {/* Text Overlay */}
      {!isFinalResolve ? (
        <div className="relative z-20 max-w-2xl mx-auto text-center px-6 space-y-4 animate-in fade-in zoom-in-95 duration-700">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold uppercase tracking-widest border border-amber-500/30 backdrop-blur-md">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            <span>ITER LADIES HOSTELS (LH1 - LH5) FOOD RESCUE</span>
          </div>

          <h1 className="font-cursive font-bold text-3xl sm:text-5xl text-amber-100 leading-tight drop-shadow-2xl">
            "{scene.slogan}"
          </h1>

          <p className="text-xs sm:text-base text-slate-200 font-medium max-w-lg mx-auto leading-relaxed drop-shadow-md">
            {scene.subtext}
          </p>

          <div className="pt-6 flex justify-center gap-2">
            {SCENES.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentSceneIdx ? 'w-8 bg-amber-400' : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative z-20 max-w-xl mx-auto text-center px-6 space-y-6 animate-in fade-in zoom-in-95 duration-1000">
          <div className="w-20 h-20 mx-auto rounded-full p-2 bg-white/20 border-2 border-amber-400 shadow-2xl backdrop-blur-xl scale-125">
            <img src="/logo.png" alt="Annapurna" className="w-full h-full object-contain" />
          </div>

          <div className="space-y-2">
            <h2 className="font-cursive font-bold text-4xl sm:text-5xl text-amber-100 tracking-wider">
              ANNAPURNA
            </h2>
            <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">
              By Team Astra • ITER Ladies Hostels (LH1 - LH5)
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-[#C86D44] text-white font-bold text-xs uppercase tracking-widest shadow-2xl hover:scale-110 transition-all cursor-pointer inline-flex items-center gap-2 border border-amber-300/40"
          >
            <span>ENTER PLATFORM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
