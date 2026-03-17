import { useState, useRef, useCallback, useEffect } from 'react';

interface AudioPlayerState {
  isPlaying: boolean;
  currentAyah: number;
  duration: number;
  currentTime: number;
  isLoading: boolean;
}

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentAyah: 0,
    duration: 0,
    currentTime: 0,
    isLoading: false,
  });

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    audio.addEventListener('timeupdate', () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    });

    audio.addEventListener('loadedmetadata', () => {
      setState(prev => ({ ...prev, duration: audio.duration, isLoading: false }));
    });

    audio.addEventListener('ended', () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    });

    audio.addEventListener('waiting', () => {
      setState(prev => ({ ...prev, isLoading: true }));
    });

    audio.addEventListener('canplay', () => {
      setState(prev => ({ ...prev, isLoading: false }));
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const play = useCallback(async (url: string, ayahNumber: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.src !== url) {
      audio.src = url;
      setState(prev => ({ ...prev, isLoading: true }));
    }
    setState(prev => ({ ...prev, currentAyah: ayahNumber, isPlaying: true }));
    try {
      await audio.play();
    } catch {
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setState(prev => ({ ...prev, isPlaying: false, currentAyah: 0, currentTime: 0 }));
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const onEnded = useCallback((callback: () => void) => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('ended', callback);
      return () => audio.removeEventListener('ended', callback);
    }
  }, []);

  return {
    ...state,
    play,
    pause,
    stop,
    seek,
    setVolume,
    onEnded,
    audioRef,
  };
}
