import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Radio } from 'lucide-react';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  const toggleAudio = () => {
    if (isPlaying) {
      stopAmbient();
    } else {
      startAmbient();
    }
  };

  const startAmbient = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Soft ambient chord (A minor 9 drone: A2, E3, C4, G4, B4)
      const freqs = [110.0, 164.81, 261.63, 392.0, 493.88];
      oscillatorsRef.current = freqs.map((freq) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        // Subtle LFO modulation for warm analog drift
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.1 + Math.random() * 0.1, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        oscGain.gain.setValueAtTime(0.12, ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
        return osc;
      });

      setIsPlaying(true);
    } catch (e) {
      console.warn('AudioContext initialization prevented or unsupported', e);
    }
  };

  const stopAmbient = () => {
    if (oscillatorsRef.current) {
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch (e) { /* ignore */ }
      });
      oscillatorsRef.current = [];
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (e) { /* ignore */ }
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      stopAmbient();
    };
  }, []);

  return (
    <div className="fixed top-5 right-6 z-50 flex items-center gap-3">
      <button
        onClick={toggleAudio}
        aria-label={isPlaying ? "Mute ambient audio" : "Play ambient audio"}
        title={isPlaying ? "Mute ambient sound" : "Play soft ambient soundscape"}
        className="group relative flex items-center gap-2 px-3 py-2 rounded-full bg-cinematic-surface/80 border border-cinematic-border text-amber-100/80 hover:text-amber-300 hover:bg-cinematic-surface backdrop-blur-md transition-all duration-300 shadow-xl cursor-pointer"
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-medium tracking-wide text-emerald-400/90">Soundscape On</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-gray-400 group-hover:text-amber-200 transition-colors" />
            <span className="text-xs font-medium tracking-wide text-gray-400 group-hover:text-amber-200">Ambient Music</span>
          </>
        )}
      </button>
    </div>
  );
};
