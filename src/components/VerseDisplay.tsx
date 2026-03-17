import React from 'react';
import { Bookmark, BookmarkCheck, Play, Pause, Share2, Copy } from 'lucide-react';
import { toArabicNumeral, isSajdaVerse, getArabicFontFamily } from '../data/quran-metadata';
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
  const fontFamily = getArabicFontFamily(settings.arabicFont);

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
      className={`group relative py-5 px-4 md:px-6 border-b border-border/40 transition-all duration-300 ${
        isPlaying ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-hover/30'
      } ${isSajda ? 'bg-rose-50/30 dark:bg-rose-900/5' : ''}`}
    >
      {/* Verse Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Verse number badge */}
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
            isPlaying ? 'bg-primary text-white' : 'bg-primary/8 text-primary'
          }`}>
            {surahNumber}:{ayahNumber}
          </div>
          {isSajda && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 font-semibold uppercase tracking-wider">
              Sajda
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
          {onPlay && (
            <button
              onClick={onPlay}
              className={`p-1.5 rounded-lg transition-colors ${
                isPlaying ? 'text-primary bg-primary/10' : 'text-muted hover:text-primary hover:bg-primary/8'
              }`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            </button>
          )}
          {onBookmark && (
            <button
              onClick={onBookmark}
              className={`p-1.5 rounded-lg transition-colors ${
                isBookmarked
                  ? 'text-primary bg-primary/10'
                  : 'text-muted hover:text-primary hover:bg-primary/8'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary/8 transition-colors"
            title="Copy"
          >
            <Copy size={15} />
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary/8 transition-colors"
            title="Share"
          >
            <Share2 size={15} />
          </button>
        </div>
      </div>

      {/* Arabic Text */}
      {settings.showArabic && (
        <p
          className={`${arabicSize} leading-[2.2] text-right text-text mb-3`}
          dir="rtl"
          style={{ fontFamily }}
        >
          {arabicText}
          <span className="inline-block mx-2 text-primary/60" style={{ fontFamily }}>
            ﴿{toArabicNumeral(ayahNumber)}﴾
          </span>
        </p>
      )}

      {/* Transliteration */}
      {settings.showTransliteration && transliterationText && (
        <p className="text-xs text-muted italic mb-2 leading-relaxed">
          {transliterationText}
        </p>
      )}

      {/* Translation */}
      {settings.showTranslation && translationText && (
        <p className={`${translationSize} text-text/70 leading-relaxed`}>
          {translationText}
        </p>
      )}
    </div>
  );
}
