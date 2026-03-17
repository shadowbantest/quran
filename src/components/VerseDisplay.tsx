import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Play, Pause, Share2, Copy, Check } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

  const verseRef = `${surahNumber}:${ayahNumber}`;

  const handleCopy = async () => {
    const text = `${arabicText}\n\n${translationText || ''}\n\n- Quran ${verseRef}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Quran ${verseRef}`,
        text: `${arabicText}\n\n${translationText || ''}`,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <article
      id={`verse-${ayahNumber}`}
      className={`group relative py-6 px-5 md:px-8 transition-all duration-300 ${
        isPlaying ? 'verse-playing bg-primary/[0.04]' : 'hover:bg-hover/30'
      } ${isSajda ? 'bg-rose-50/30 dark:bg-rose-900/5' : ''}`}
      aria-label={`Verse ${verseRef}`}
    >
      {/* Bottom border with gradient */}
      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" aria-hidden="true" />

      {/* Verse Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {/* Verse number badge */}
          <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            isPlaying
              ? 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-md shadow-primary/20'
              : 'bg-primary/8 text-primary hover:bg-primary/12'
          }`} aria-hidden="true">
            {verseRef}
            {isPlaying && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full animate-pulse" aria-hidden="true" />
            )}
          </div>
          {isSajda && (
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 font-semibold uppercase tracking-wider border border-rose-200/50 dark:border-rose-800/30">
              Sajda
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity duration-200">
          {onPlay && (
            <button
              onClick={onPlay}
              className={`p-2 min-w-[44px] min-h-[44px] sm:p-2 sm:min-w-[36px] sm:min-h-[36px] rounded-xl transition-all duration-200 ${
                isPlaying
                  ? 'text-primary bg-primary/10 shadow-sm'
                  : 'text-muted hover:text-primary hover:bg-primary/8'
              }`}
              aria-label={isPlaying ? `Pause verse ${verseRef}` : `Play verse ${verseRef}`}
            >
              {isPlaying ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
            </button>
          )}
          {onBookmark && (
            <button
              onClick={onBookmark}
              className={`p-2 min-w-[44px] min-h-[44px] sm:p-2 sm:min-w-[36px] sm:min-h-[36px] rounded-xl transition-all duration-200 ${
                isBookmarked
                  ? 'text-gold bg-gold/10'
                  : 'text-muted hover:text-gold hover:bg-gold/8'
              }`}
              aria-label={isBookmarked ? `Remove bookmark for verse ${verseRef}` : `Bookmark verse ${verseRef}`}
              aria-pressed={isBookmarked}
            >
              {isBookmarked ? <BookmarkCheck size={15} aria-hidden="true" /> : <Bookmark size={15} aria-hidden="true" />}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-2 min-w-[44px] min-h-[44px] sm:p-2 sm:min-w-[36px] sm:min-h-[36px] rounded-xl text-muted hover:text-primary hover:bg-primary/8 transition-all duration-200"
            aria-label={copied ? 'Copied!' : `Copy verse ${verseRef}`}
          >
            {copied ? <Check size={15} className="text-green-500" aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
          </button>
          <button
            onClick={handleShare}
            className="hidden sm:inline-flex p-2 min-w-[36px] min-h-[36px] rounded-xl text-muted hover:text-primary hover:bg-primary/8 transition-all duration-200"
            aria-label={`Share verse ${verseRef}`}
          >
            <Share2 size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Arabic Text */}
      {settings.showArabic && (
        <div className="relative mb-4">
          <p
            className={`${arabicSize} leading-[2.6] md:leading-[2.8] text-right text-text`}
            dir="rtl"
            lang="ar"
            style={{ fontFamily, wordSpacing: '0.05em' }}
          >
            {arabicText}
            <span className="inline-block mx-2 text-primary/50" style={{ fontFamily }} aria-hidden="true">
              ﴿{toArabicNumeral(ayahNumber)}﴾
            </span>
          </p>
        </div>
      )}

      {/* Transliteration */}
      {settings.showTransliteration && transliterationText && (
        <p className="text-xs text-muted italic mb-3 leading-relaxed pl-1 border-l-2 border-primary/10 ml-1" lang="ar-Latn">
          {transliterationText}
        </p>
      )}

      {/* Translation */}
      {settings.showTranslation && translationText && (
        <p className={`${translationSize} text-text/65 leading-relaxed`}>
          {translationText}
        </p>
      )}
    </article>
  );
}
