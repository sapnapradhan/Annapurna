import React, { useState, useEffect } from 'react';
import { ttsService } from '../../services/ttsService';
import { Volume2, VolumeX, Square, Play, Pause } from 'lucide-react';

interface VoiceAssistWidgetProps {
  textToRead?: string;
  label?: string;
}

export const VoiceAssistWidget: React.FC<VoiceAssistWidgetProps> = ({ 
  textToRead = "Welcome to Annapurna Campus Food Operations and Rescue Platform. Designed to nourish, built to share. Food should reach people, not bins.",
  label = "Read Screen"
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const update = () => setIsSpeaking(ttsService.isSpeaking());
    return ttsService.subscribe(update);
  }, []);

  const toggleSpeech = () => {
    if (isSpeaking) {
      ttsService.stop();
    } else {
      ttsService.speak(textToRead);
    }
  };

  if (!ttsService.isSupported()) return null;

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={toggleSpeech}
        className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md border ${
          isSpeaking
            ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md animate-pulse'
            : 'bg-white/10 dark:bg-black/30 text-slate-700 dark:text-slate-200 hover:text-[#C86D44] dark:hover:text-amber-300 border-white/20'
        }`}
        title={isSpeaking ? "Stop Voice Assistance" : "Listen to Screen (Voice Assist)"}
      >
        {isSpeaking ? (
          <>
            <Square className="w-3 h-3 fill-current" />
            <span>Stop Voice</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3 h-3 text-[#C86D44] dark:text-amber-400" />
            <span>🗣️ {label}</span>
          </>
        )}
      </button>
    </div>
  );
};
