import React from 'react';
import { Music, VolumeX, Volume2, Sparkles, X } from 'lucide-react';

interface MusicChoiceModalProps {
  onChoiceMade: (enableMusic: boolean) => void;
}

export const MusicChoiceModal: React.FC<MusicChoiceModalProps> = ({ onChoiceMade }) => {
  const handleChoice = (enableMusic: boolean) => {
    localStorage.setItem('annapurna_music_consent', enableMusic ? 'enabled' : 'disabled');
    onChoiceMade(enableMusic);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Modal Card */}
      <div className="relative max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#1A1715]/95 text-white border border-amber-500/30 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-300">
        
        {/* Close button */}
        <button 
          onClick={() => handleChoice(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-full bg-[#C86D44]/20 border border-[#C86D44]/40 flex items-center justify-center text-[#C86D44] dark:text-amber-300 mx-auto shadow-lg">
          <Music className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C86D44]/20 border border-[#C86D44]/40 text-[#C86D44] dark:text-amber-300 text-[10px] font-mono font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>ANNAPURNA AUDIO</span>
          </div>

          <h2 className="font-cursive font-bold text-2xl text-amber-100 leading-tight">
            Play background music?
          </h2>

          <p className="text-xs text-slate-300 font-normal leading-relaxed">
            Add a little atmosphere to the Annapurna campus food operations experience.
          </p>
        </div>

        <div className="space-y-2.5 pt-1">
          <button
            onClick={() => handleChoice(true)}
            className="w-full py-3 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>YES, PLAY MUSIC</span>
          </button>

          <button
            onClick={() => handleChoice(false)}
            className="w-full py-2.5 rounded-full bg-[#25201D] hover:bg-[#302B27] text-slate-300 hover:text-white border border-[#38322E] font-semibold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <VolumeX className="w-4 h-4 text-slate-400" />
            <span>NO, CONTINUE SILENTLY</span>
          </button>
        </div>
      </div>
    </div>
  );
};
