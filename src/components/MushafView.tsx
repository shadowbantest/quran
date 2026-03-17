import React from 'react';
import { toArabicNumeral, isSajdaVerse, getArabicFontFamily, BISMILLAH } from '../data/quran-metadata';
import { useSettings } from '../contexts/SettingsContext';
import { AyahData } from '../api/quran';
import { SurahInfo } from '../types';

interface MushafViewProps {
  surahInfo: SurahInfo;
  arabicVerses: AyahData[];
  translationVerses: AyahData[];
  currentPlayingAyah: number;
  isPlaying: boolean;
  onAyahClick: (ayahNumber: number) => void;
}

const FONT_SIZE_MAP = {
  small: '1.5rem',
  medium: '2rem',
  large: '2.5rem',
  xlarge: '3rem',
};

export function MushafView({
  surahInfo,
  arabicVerses,
  translationVerses,
  currentPlayingAyah,
  isPlaying,
  onAyahClick,
}: MushafViewProps) {
  const { settings } = useSettings();
  const fontFamily = getArabicFontFamily(settings.arabicFont);
  const fontSize = FONT_SIZE_MAP[settings.arabicFontSize];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in" role="region" aria-label={`Mushaf view of Surah ${surahInfo.englishName}`}>
      {/* Mushaf Page Container */}
      <div className="bg-surface mx-2 md:mx-4 my-6 rounded-2xl border border-border/60 overflow-hidden shadow-card">
        {/* Decorative Top Border */}
        <div className="h-1.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" aria-hidden="true" />

        {/* Surah Header Frame */}
        <div className="mx-6 md:mx-10 mt-8 mb-6">
          <div className="border border-primary/25 rounded-xl px-6 py-4 text-center bg-primary/3">
            <p
              className="text-primary/80 leading-relaxed"
              style={{ fontFamily, fontSize: '1.8rem' }}
              dir="rtl"
              lang="ar"
            >
              سُورَةُ {surahInfo.name}
            </p>
          </div>
        </div>

        {/* Bismillah */}
        {surahInfo.number !== 1 && surahInfo.number !== 9 && (
          <div className="text-center mb-6" aria-label="Bismillah">
            <p
              className="text-text/80 leading-relaxed"
              style={{ fontFamily, fontSize: '1.5rem' }}
              dir="rtl"
              lang="ar"
            >
              {BISMILLAH}
            </p>
          </div>
        )}

        {/* Continuous Arabic Text */}
        <div className="px-6 md:px-10 pb-8">
          <p
            className="text-text text-justify leading-[2.8] md:leading-[3]"
            style={{ fontFamily, fontSize }}
            dir="rtl"
            lang="ar"
          >
            {arabicVerses.map((verse) => {
              const isCurrentlyPlaying = currentPlayingAyah === verse.numberInSurah && isPlaying;
              const sajda = isSajdaVerse(surahInfo.number, verse.numberInSurah);

              return (
                <React.Fragment key={verse.numberInSurah}>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Verse ${surahInfo.number}:${verse.numberInSurah}${sajda ? ' (Sajda verse)' : ''}${isCurrentlyPlaying ? ' (now playing)' : ''}`}
                    className={`cursor-pointer transition-colors duration-200 rounded-sm ${
                      isCurrentlyPlaying
                        ? 'bg-primary/15 text-primary'
                        : sajda
                          ? 'bg-rose-100/30 hover:bg-primary/8'
                          : 'hover:bg-primary/8'
                    }`}
                    onClick={() => onAyahClick(verse.numberInSurah)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onAyahClick(verse.numberInSurah); } }}
                  >
                    {verse.text}
                  </span>
                  {' '}
                  <span
                    className="inline-block text-primary/50 cursor-pointer hover:text-primary transition-colors"
                    style={{ fontSize: `calc(${fontSize} * 0.75)` }}
                    onClick={() => onAyahClick(verse.numberInSurah)}
                  >
                    ﴿{toArabicNumeral(verse.numberInSurah)}﴾
                  </span>
                  {' '}
                </React.Fragment>
              );
            })}
          </p>
        </div>

        {/* Translations below */}
        {settings.showTranslation && translationVerses.length > 0 && (
          <div className="border-t border-border/40 px-6 md:px-10 py-6">
            <h3 className="text-[10px] font-semibold text-muted mb-4 uppercase tracking-widest">Translation</h3>
            <div className="space-y-2.5">
              {translationVerses.map((verse) => (
                <p key={verse.numberInSurah} className="text-sm text-text/70 leading-relaxed">
                  <span className="font-semibold text-primary/70 text-xs mr-1.5">
                    {verse.numberInSurah}.
                  </span>
                  {verse.text}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Decorative Bottom Border */}
        <div className="h-1.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" aria-hidden="true" />
      </div>
    </div>
  );
}
