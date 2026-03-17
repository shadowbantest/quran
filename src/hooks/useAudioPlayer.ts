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
  const listenersRef = useRef<Array<{ event: string; handler: EventListener }>>([]);
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentAyah: 0,
    duration: 0,
    currentTime: 0,
    isLoading: false,
  });

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    // Throttle timeupdate to reduce re-renders (fire every ~250ms instead of ~60ms)
    let lastUpdate = 0;
    const onTimeUpdate = () => {
      const now = Date.now();
      if (now - lastUpdate > 250) {
        lastUpdate = now;
        setState(prev => ({ ...prev, currentTime: audio.currentTime }));
      }
    };

    const onLoadedMetadata = () => {
      setState(prev => ({ ...prev, duration: audio.duration, isLoading: false }));
    };

    const onEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    const onWaiting = () => {
      setState(prev => ({ ...prev, isLoading: true }));
    };

    const onCanPlay = () => {
      setState(prev => ({ ...prev, isLoading: false }));
    };

    const onError = () => {
      setState(prev => ({ ...prev, isLoading: false, isPlaying: false }));
    };

    // Add all listeners and track them for cleanup
    const events: Array<[string, EventListener]> = [
      ['timeupdate', onTimeUpdate],
      ['loadedmetadata', onLoadedMetadata],
      ['ended', onEnded],
      ['waiting', onWaiting],
      ['canplay', onCanPlay],
      ['error', onError],
    ];

    events.forEach(([event, handler]) => {
      audio.addEventListener(event, handler);
      listenersRef.current.push({ event, handler });
    });

    return () => {
      // Remove ALL event listeners on cleanup
      listenersRef.current.forEach(({ event, handler }) => {
        audio.removeEventListener(event, handler);
      });
      listenersRef.current = [];
      audio.pause();
      audio.src = '';
      audioRef.current = null;
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
    setState({ isPlaying: false, currentAyah: 0, currentTime: 0, duration: 0, isLoading: false });
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

  const setMuted = useCallback((muted: boolean) => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, []);

  const onEnded = useCallback((callback: () => void) => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('ended', callback);
      return () => audio.removeEventListener('ended', callback);
    }
    return () => {};
  }, []);

  return {
    ...state,
    play,
    pause,
    stop,
    seek,
    setVolume,
    setMuted,
    onEnded,
    audioRef,
  };
}
