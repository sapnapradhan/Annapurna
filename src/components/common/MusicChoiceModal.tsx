import React from 'react';
import { Music, VolumeX, Volume2, Sparkles } from 'lucide-react';

interface MusicChoiceModalProps {
  onChoiceMade: (enableMusic: boolean) => void;
}

export const MusicChoiceModal: React.FC<MusicChoiceModalProps> = ({ onChoiceMade }) => {
  const handleChoice = (enableMusic: boolean) => {
    localStorage.setItem('annapurna_music_consent', enableMusic ? 'enabled' : 'disabled');
    onChoiceMade(enableMusic);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07080c] text-white font-sans flex items-center justify-center p-6 select-none w-screen h-screen">
      {/* Background provided image with dark backdrop */}
      <div className="absolute inset-0 bg-provided-image opacity-30 filter contrast-125 saturate-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-[#07080c]/90 to-[#07080c]/80 backdrop-blur-md" />

      {/* Modal Container */}
      <div className="relative z-10 max-w-md w-full p-8 sm:p-10 rounded-3xl bg-[#1A1715]/95 border border-[#2C2724] shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-500">
        
        <div className="w-16 h-16 rounded-full bg-[#C86D44]/20 border border-[#C86D44]/40 flex items-center justify-center text-[#C86D44] dark:text-amber-300 mx-auto shadow-lg">
          <Music className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C86D44]/15 border border-[#C86D44]/30 text-[#C86D44] dark:text-amber-300 text-[10px] font-mono font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>ANNAPURNA AUDIO EXPERIENCE</span>
          </div>

          <h2 className="font-cinzel font-bold text-2xl sm:text-3xl text-amber-100 uppercase tracking-wider leading-tight">
            Would you like to play background music?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            Add a little atmosphere to the Annapurna campus dining and food rescue experience.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => handleChoice(true)}
            className="w-full py-4 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>YES, PLAY MUSIC</span>
          </button>

          <button
            onClick={() => handleChoice(false)}
            className="w-full py-3.5 rounded-full bg-[#25201D] hover:bg-[#302B27] text-slate-300 hover:text-white border border-[#38322E] font-semibold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <VolumeX className="w-4 h-4 text-slate-400" />
            <span>NO, CONTINUE SILENTLY</span>
          </button>
        </div>
      </div>
    </div>
  );
};
