import React from 'react';
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
  onMuteToggle?: (muted: boolean) => void;
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
  onMuteToggle,
}: AudioPlayerProps) {
  const [muted, setMuted] = React.useState(false);

  if (currentAyah === 0) return null;

  const formatTime = (t: number) => {
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleMuteToggle = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    onMuteToggle?.(newMuted);
  };

  return (
    <div
      className="fixed bottom-14 lg:bottom-0 left-0 right-0 z-50 animate-slide-up"
      role="region"
      aria-label="Audio player"
    >
      <div className="glass-heavy border-t border-border/60 shadow-2xl">
        {/* Progress Bar */}
        <div
          className="h-1 bg-border/40 cursor-pointer group"
          role="slider"
          aria-label="Playback progress"
          aria-valuenow={Math.round(currentTime)}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          tabIndex={0}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = x / rect.width;
            onSeek(percent * duration);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') onSeek(Math.min(duration, currentTime + 5));
            if (e.key === 'ArrowLeft') onSeek(Math.max(0, currentTime - 5));
          }}
        >
          <div
            className="h-full bg-primary transition-all duration-150 group-hover:h-1.5"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-3 py-2.5 flex items-center gap-3">
          {/* Info */}
          <div className="flex-1 min-w-0" aria-live="polite">
            <p className="text-xs font-semibold text-text truncate">{surahName}</p>
            <p className="text-[10px] text-muted">
              Verse {currentAyah} of {totalAyahs}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={onPrevious}
              disabled={currentAyah <= 1}
              className="p-2 min-w-[44px] min-h-[44px] rounded-lg hover:bg-hover text-muted hover:text-text disabled:opacity-30 transition-colors"
              aria-label="Previous verse"
            >
              <SkipBack size={16} aria-hidden="true" />
            </button>
            <button
              onClick={isPlaying ? onPause : onPlay}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm bg-primary text-white"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : isPlaying ? (
                <Pause size={16} aria-hidden="true" />
              ) : (
                <Play size={16} className="ml-0.5" aria-hidden="true" />
              )}
            </button>
            <button
              onClick={onNext}
              disabled={currentAyah >= totalAyahs}
              className="p-2 min-w-[44px] min-h-[44px] rounded-lg hover:bg-hover text-muted hover:text-text disabled:opacity-30 transition-colors"
              aria-label="Next verse"
            >
              <SkipForward size={16} aria-hidden="true" />
            </button>
          </div>

          {/* Time, Volume, Close */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="hidden sm:inline text-[10px] text-muted tabular-nums" aria-hidden="true">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <button
              onClick={handleMuteToggle}
              className="hidden sm:inline-flex p-1.5 rounded-lg hover:bg-hover text-muted hover:text-text transition-colors"
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <VolumeX size={14} aria-hidden="true" /> : <Volume2 size={14} aria-hidden="true" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 min-w-[44px] min-h-[44px] sm:p-1.5 sm:min-w-0 sm:min-h-0 rounded-lg hover:bg-hover text-muted hover:text-text transition-colors"
              aria-label="Close audio player"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
