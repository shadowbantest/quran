import React from 'react';
import { Bookmark, BookmarkCheck, Play, Pause, Share2, Copy } from 'lucide-react';
import { toArabicNumeral, isSajdaVerse } from '../data/quran-metadata';
import { useSettings } from '../contexts/SettingsContext';

interface VerseDisplayProps {
  surahNumber: number;
  ayahNumber: number;
  arabicText: string;
  translationText?: string;
  transliterationText?: string;
  isPlaying?: boolean;
  isBookmarked?: boolean;
  onPlay?: () => void;
  onBookmark?: () => void;
  globalAyahNumber?: number;
}

const FONT_SIZE_MAP = {
  small: { arabic: 'text-xl', translation: 'text-sm' },
  medium: { arabic: 'text-2xl md:text-3xl', translation: 'text-base' },
  large: { arabic: 'text-3xl md:text-4xl', translation: 'text-lg' },
  xlarge: { arabic: 'text-4xl md:text-5xl', translation: 'text-xl' },
};

export function VerseDisplay({
  surahNumber,
  ayahNumber,
  arabicText,
  translationText,
  transliterationText,
  isPlaying,
  isBookmarked,
  onPlay,
  onBookmark,
}: VerseDisplayProps) {
  const { settings } = useSettings();
  const isSajda = isSajdaVerse(surahNumber, ayahNumber);
  const arabicSize = FONT_SIZE_MAP[settings.arabicFontSize].arabic;
  const translationSize = FONT_SIZE_MAP[settings.fontSize].translation;

  const handleCopy = async () => {
    const text = `${arabicText}\n\n${translationText || ''}\n\n- Quran ${surahNumber}:${ayahNumber}`;
    await navigator.clipboard.writeText(text);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Quran ${surahNumber}:${ayahNumber}`,
        text: `${arabicText}\n\n${translationText || ''}`,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div
      id={`verse-${ayahNumber}`}
      className={`group relative py-6 px-4 md:px-6 border-b border-border/50 transition-all duration-300 ${
        isPlaying ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-hover/50'
      } ${isSajda ? 'bg-rose-50/50 dark:bg-rose-900/10' : ''}`}
    >
      {/* Verse Number Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <span className="text-primary text-sm font-bold">{surahNumber}:{ayahNumber}</span>
          </div>
          {isSajda && (
            <span className="text-xs px-2 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 font-medium">
              Sajda
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onPlay && (
            <button
              onClick={onPlay}
              className="p-2 rounded-lg hover:bg-primary/10 text-muted hover:text-primary transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
          )}
          {onBookmark && (
            <button
              onClick={onBookmark}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked
                  ? 'text-primary bg-primary/10'
                  : 'hover:bg-primary/10 text-muted hover:text-primary'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-primary/10 text-muted hover:text-primary transition-colors"
            title="Copy"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg hover:bg-primary/10 text-muted hover:text-primary transition-colors"
            title="Share"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Arabic Text */}
      {settings.showArabic && (
        <p
          className={`font-arabic ${arabicSize} leading-[2.2] text-right text-text mb-4`}
          dir="rtl"
        >
          {arabicText}
          <span className="inline-block mx-2 text-primary font-arabic">
            ﴿{toArabicNumeral(ayahNumber)}﴾
          </span>
        </p>
      )}

      {/* Transliteration */}
      {settings.showTransliteration && transliterationText && (
        <p className="text-sm text-muted italic mb-3 leading-relaxed">
          {transliterationText}
        </p>
      )}

      {/* Translation */}
      {settings.showTranslation && translationText && (
        <p className={`${translationSize} text-text/80 leading-relaxed`}>
          {translationText}
        </p>
      )}
    </div>
  );
}
