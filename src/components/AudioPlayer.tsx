import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Loader2, X } from 'lucide-react';

interface AudioPlayerProps {
  isPlaying: boolean;
  isLoading: boolean;
  currentAyah: number;
  totalAyahs: number;
  surahName: string;
  currentTime: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (time: number) => void;
  onClose: () => void;
}

export function AudioPlayer({
  isPlaying,
  isLoading,
  currentAyah,
  totalAyahs,
  surahName,
  currentTime,
  duration,
  onPlay,
  onPause,
  onPrevious,
  onNext,
  onSeek,
  onClose,
}: AudioPlayerProps) {
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  if (currentAyah === 0) return null;

  const formatTime = (t: number) => {
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-border shadow-2xl">
      {/* Progress Bar */}
      <div
        className="h-1 bg-border cursor-pointer group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percent = x / rect.width;
          onSeek(percent * duration);
        }}
      >
        <div
          className="h-full bg-primary transition-all duration-100 group-hover:h-1.5"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text truncate">{surahName}</p>
          <p className="text-xs text-muted">
            Verse {currentAyah} of {totalAyahs}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            disabled={currentAyah <= 1}
            className="p-2 rounded-lg hover:bg-hover text-muted hover:text-text disabled:opacity-30 transition-colors"
          >
            <SkipBack size={18} />
          </button>
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors shadow-md"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={18} />
            ) : (
              <Play size={18} className="ml-0.5" />
            )}
          </button>
          <button
            onClick={onNext}
            disabled={currentAyah >= totalAyahs}
            className="p-2 rounded-lg hover:bg-hover text-muted hover:text-text disabled:opacity-30 transition-colors"
          >
            <SkipForward size={18} />
          </button>
        </div>

        {/* Time & Volume */}
        <div className="hidden sm:flex items-center gap-3 flex-1 justify-end">
          <span className="text-xs text-muted tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <button
            onClick={() => setMuted(!muted)}
            className="p-1.5 rounded-lg hover:bg-hover text-muted hover:text-text transition-colors"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-hover text-muted hover:text-text transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
