import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Volume1 } from 'lucide-react';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isSetupRef = useRef(false);
  const intervalRef = useRef<number | null>(null);

  // Load preferences
  useEffect(() => {
    const savedVol = localStorage.getItem('annapurna_audio_vol');
    if (savedVol !== null) setVolume(parseFloat(savedVol));

    const savedMute = localStorage.getItem('annapurna_audio_mute');
    if (savedMute !== null) setIsMuted(savedMute === 'true');
  }, []);

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    localStorage.setItem('annapurna_audio_vol', val.toString());
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : val * 0.15;
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    localStorage.setItem('annapurna_audio_mute', nextMute.toString());
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = nextMute ? 0 : volume * 0.15;
    }
  };

  // Indian classical / Gopala Gopala flute ambient ringtone synthesizer (Acoustic Flute & Drone in Rag Desh/Bhairavi)
  const startAudioMelody = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.15, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Gopala Gopala flute melody notes (Frequencies in Hz: Sa, Re, Ga, Ma, Pa, Dha, Ni)
      const melodyNotes = [293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 554.37, 587.33]; // D major / Desh scale
      let noteIdx = 0;

      // Soft ambient tanpura drone in background
      [146.83, 220.00, 293.66].forEach(freq => {
        const droneOsc = ctx.createOscillator();
        const droneGain = ctx.createGain();
        droneOsc.type = 'triangle';
        droneOsc.frequency.setValueAtTime(freq, ctx.currentTime);
        droneGain.gain.setValueAtTime(0.03, ctx.currentTime);
        droneOsc.connect(droneGain);
        droneGain.connect(masterGain);
        droneOsc.start();
      });

      // Play soft flute notes loop
      intervalRef.current = window.setInterval(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;

        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const now = ctx.currentTime;

        osc.type = 'sine'; // Soft bamboo flute timbre
        const freq = melodyNotes[noteIdx % melodyNotes.length];
        noteIdx++;

        osc.frequency.setValueAtTime(freq, now);

        // Flute attack & decay envelope
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.12, now + 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 1.3);
      }, 700);

      setIsPlaying(true);
      setAutoplayBlocked(false);
    } catch (e) {
      console.warn('Autoplay restricted by browser', e);
      setAutoplayBlocked(true);
    }
  };

  const stopAudioMelody = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (e) { /* ignore */ }
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudioMelody();
    } else {
      startAudioMelody();
    }
  };

  useEffect(() => {
    return () => {
      stopAudioMelody();
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      {autoplayBlocked && (
        <button
          onClick={startAudioMelody}
          className="px-3 py-1 rounded-full bg-[#C86D44] text-white text-[11px] font-bold animate-bounce shadow-md"
        >
          Enable Music
        </button>
      )}

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FDFBF7]/80 dark:bg-[#1A1715]/80 border border-[#EBE4D8] dark:border-[#2C2724] text-[#2C221E] dark:text-slate-200 backdrop-blur-md shadow-sm">
        <button
          onClick={togglePlay}
          className="p-1 rounded-full hover:text-[#C86D44] dark:hover:text-amber-400 transition-colors"
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
          className="p-1 rounded-full hover:text-[#C86D44] dark:hover:text-amber-400 transition-colors"
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

        {/* Tiny Equalizer Visualizer Bars */}
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
