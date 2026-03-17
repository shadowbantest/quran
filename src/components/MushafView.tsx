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
    <div className="max-w-4xl mx-auto">
      {/* Mushaf Page Container */}
      <div className="bg-surface mx-2 md:mx-4 my-6 rounded-2xl border-2 border-primary/20 overflow-hidden shadow-xl">
        {/* Decorative Top Border */}
        <div className="h-3 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />

        {/* Surah Header Frame */}
        <div className="mx-6 md:mx-10 mt-8 mb-6">
          <div className="border-2 border-primary/40 rounded-xl px-6 py-4 text-center bg-primary/5">
            <p
              className="text-primary leading-relaxed"
              style={{ fontFamily, fontSize: '1.8rem' }}
              dir="rtl"
            >
              سُورَةُ {surahInfo.name}
            </p>
          </div>
        </div>

        {/* Bismillah */}
        {surahInfo.number !== 1 && surahInfo.number !== 9 && (
          <div className="text-center mb-6">
            <p
              className="text-text leading-relaxed"
              style={{ fontFamily, fontSize: '1.6rem' }}
              dir="rtl"
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
          >
            {arabicVerses.map((verse) => {
              const isCurrentlyPlaying = currentPlayingAyah === verse.numberInSurah && isPlaying;
              const sajda = isSajdaVerse(surahInfo.number, verse.numberInSurah);

              return (
                <React.Fragment key={verse.numberInSurah}>
                  <span
                    className={`cursor-pointer transition-colors duration-200 rounded-sm ${
                      isCurrentlyPlaying
                        ? 'bg-primary/20 text-primary'
                        : sajda
                          ? 'bg-rose-100/50 hover:bg-primary/10'
                          : 'hover:bg-primary/10'
                    }`}
                    onClick={() => onAyahClick(verse.numberInSurah)}
                    title={`${surahInfo.number}:${verse.numberInSurah}`}
                  >
                    {verse.text}
                  </span>
                  {' '}
                  <span
                    className="inline-block text-primary cursor-pointer"
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

        {/* Show translations below if enabled */}
        {settings.showTranslation && translationVerses.length > 0 && (
          <div className="border-t-2 border-primary/20 px-6 md:px-10 py-6">
            <h3 className="text-sm font-semibold text-muted mb-4 uppercase tracking-wider">Translation</h3>
            <div className="space-y-3">
              {translationVerses.map((verse) => (
                <p key={verse.numberInSurah} className="text-sm text-text/80 leading-relaxed">
                  <span className="font-semibold text-primary text-xs mr-2">
                    {verse.numberInSurah}.
                  </span>
                  {verse.text}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Decorative Bottom Border */}
        <div className="h-3 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />
      </div>
    </div>
  );
}
