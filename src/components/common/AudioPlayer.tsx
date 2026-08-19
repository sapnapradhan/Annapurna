import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Volume1, Music } from 'lucide-react';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showAutoplayPrompt, setShowAutoplayPrompt] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const savedVol = localStorage.getItem('annapurna_audio_vol');
    if (savedVol !== null) setVolume(parseFloat(savedVol));

    const savedMute = localStorage.getItem('annapurna_audio_mute');
    if (savedMute !== null) setIsMuted(savedMute === 'true');

    // Create persistent HTML5 Audio element pointing to /audio/background-music.mp3 or /background-music.mp3
    const audio = new Audio();
    audio.src = '/audio/background-music.mp3';
    audio.loop = true;
    audio.volume = savedMute === 'true' ? 0 : (savedVol ? parseFloat(savedVol) : 0.5);
    audioRef.current = audio;

    // Check if audio file exists or handle error with ambient synth fallback
    audio.addEventListener('error', () => {
      // If MP3 file is missing in public, try /background-music.mp3
      if (audio.src.includes('/audio/')) {
        audio.src = '/background-music.mp3';
      }
    });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    localStorage.setItem('annapurna_audio_vol', val.toString());
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : val;
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    localStorage.setItem('annapurna_audio_mute', nextMute.toString());
    if (audioRef.current) {
      audioRef.current.volume = nextMute ? 0 : volume;
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setShowAutoplayPrompt(false);
      } catch (e) {
        // If MP3 fails or autoplay blocked, start ambient synth fallback
        startSynthFallback();
        setIsPlaying(true);
        setShowAutoplayPrompt(false);
      }
    }
  };

  // Synthesizer melody fallback if MP3 file is unreadable
  const startSynthFallback = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.12, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const notes = [293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 554.37, 587.33];
      let idx = 0;

      synthIntervalRef.current = window.setInterval(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const now = ctx.currentTime;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[idx % notes.length], now);
        idx++;

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.1, now + 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(noteGain);
        noteGain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 1.3);
      }, 700);
    } catch (err) {
      console.warn('Synth fallback Error', err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {showAutoplayPrompt && (
        <button
          onClick={togglePlay}
          className="px-3 py-1 rounded-full bg-[#C86D44] text-white text-[11px] font-bold animate-bounce shadow-md"
        >
          ENTER ANNAPURNA 🎵
        </button>
      )}

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FDFBF7]/90 dark:bg-[#1A1715]/90 border border-[#EBE4D8] dark:border-[#2C2724] text-[#2C221E] dark:text-slate-200 backdrop-blur-md shadow-sm">
        <button
          onClick={togglePlay}
          className="p-1 rounded-full hover:text-[#C86D44] dark:hover:text-amber-400 transition-colors cursor-pointer"
          title={isPlaying ? "Pause Background Music" : "Play Background Music"}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 text-[#C86D44] dark:text-amber-400" />
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          onClick={toggleMute}
          className="p-1 rounded-full hover:text-[#C86D44] dark:hover:text-amber-400 transition-colors cursor-pointer"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          ) : volume < 0.5 ? (
            <Volume1 className="w-3.5 h-3.5 text-[#C86D44] dark:text-amber-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-[#C86D44] dark:text-amber-400" />
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="w-14 h-1 accent-[#C86D44] dark:accent-amber-400 cursor-pointer hidden sm:inline-block"
          title="Volume Control"
        />

        {/* Subtle Waveform Equalizer Indicator */}
        {isPlaying && !isMuted && (
          <div className="flex items-end gap-0.5 h-3 ml-1">
            <span className="w-0.5 h-full bg-[#C86D44] dark:bg-amber-400 rounded-full animate-pulse" />
            <span className="w-0.5 h-2 bg-[#C86D44] dark:bg-amber-400 rounded-full animate-bounce" />
            <span className="w-0.5 h-2.5 bg-[#C86D44] dark:bg-amber-400 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};
