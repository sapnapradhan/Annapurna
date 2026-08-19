import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Volume1 } from 'lucide-react';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      if (typeof window === 'undefined' || typeof Audio === 'undefined') return;

      const savedVol = localStorage.getItem('annapurna_audio_vol');
      if (savedVol !== null) setVolume(parseFloat(savedVol));

      const savedMute = localStorage.getItem('annapurna_audio_mute');
      if (savedMute !== null) setIsMuted(savedMute === 'true');

      const audio = new Audio('/audio/background-music.mp3');
      audio.loop = true;
      audio.volume = savedMute === 'true' ? 0 : (savedVol ? parseFloat(savedVol) : 0.5);
      audioRef.current = audio;

      // Check saved music consent
      const consent = localStorage.getItem('annapurna_music_consent');
      if (consent === 'enabled') {
        audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    } catch (e) {
      console.warn('AudioPlayer init catch:', e);
    }

    return () => {
      try {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const handleVolumeChange = (val: number) => {
    try {
      setVolume(val);
      localStorage.setItem('annapurna_audio_vol', val.toString());
      if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : val;
      }
    } catch (e) {
      console.warn('Volume change error:', e);
    }
  };

  const toggleMute = () => {
    try {
      const nextMute = !isMuted;
      setIsMuted(nextMute);
      localStorage.setItem('annapurna_audio_mute', nextMute.toString());
      if (audioRef.current) {
        audioRef.current.volume = nextMute ? 0 : volume;
      }
    } catch (e) {
      console.warn('Toggle mute error:', e);
    }
  };

  const togglePlay = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/audio/background-music.mp3');
        audioRef.current.loop = true;
      }

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          localStorage.setItem('annapurna_music_consent', 'enabled');
        }).catch(e => {
          console.warn('Audio play error:', e);
        });
      }
    } catch (e) {
      console.warn('Toggle play error:', e);
    }
  };

  const stopMusicCompletely = () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      localStorage.setItem('annapurna_music_consent', 'disabled');
    } catch (e) {
      console.warn('Stop music error:', e);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 dark:bg-black/30 border border-white/20 text-[#2C221E] dark:text-slate-200 backdrop-blur-md shadow-sm">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="p-1 rounded-full hover:text-[#C86D44] dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
          title={isPlaying ? "Pause Music" : "Play Music"}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Explicit Stop Music Button if playing */}
        {isPlaying && (
          <button
            onClick={stopMusicCompletely}
            className="px-2 py-0.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-[9px] font-mono font-bold uppercase transition-colors cursor-pointer"
            title="Stop Music Completely"
          >
            STOP
          </button>
        )}

        {/* Mute/Unmute Button */}
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
          className="w-12 h-1 accent-[#C86D44] dark:accent-amber-400 cursor-pointer hidden sm:inline-block"
          title="Volume Control"
        />

        {/* Subtle Waveform Equalizer Indicator */}
        {isPlaying && !isMuted && (
          <div className="flex items-end gap-0.5 h-3 ml-0.5">
            <span className="w-0.5 h-full bg-amber-400 rounded-full animate-pulse" />
            <span className="w-0.5 h-2 bg-amber-400 rounded-full animate-bounce" />
            <span className="w-0.5 h-2.5 bg-amber-400 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};
