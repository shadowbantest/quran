import React from 'react';
import { Link } from 'react-router-dom';
import { SurahInfo } from '../types';
import { toArabicNumeral } from '../data/quran-metadata';

interface SurahCardProps {
  surah: SurahInfo;
  compact?: boolean;
}

export function SurahCard({ surah, compact }: SurahCardProps) {
  if (compact) {
    return (
      <Link
        to={`/surah/${surah.number}`}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-hover transition-all group"
      >
        <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
          {surah.number}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text truncate">{surah.englishName}</p>
          <p className="text-xs text-muted truncate">{surah.englishNameTranslation}</p>
        </div>
        <p className="font-arabic text-lg text-primary shrink-0">{surah.name}</p>
      </Link>
    );
  }

  return (
    <Link
      to={`/surah/${surah.number}`}
      className="group block bg-surface rounded-2xl border border-border p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-sm">
          <span className="text-white text-sm font-bold">{surah.number}</span>
        </div>
        <span className="font-arabic text-2xl text-primary group-hover:scale-105 transition-transform">
          {surah.name}
        </span>
      </div>
      <div>
        <h3 className="font-semibold text-text">{surah.englishName}</h3>
        <p className="text-sm text-muted mt-0.5">{surah.englishNameTranslation}</p>
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          surah.revelationType === 'Meccan'
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
        }`}>
          {surah.revelationType}
        </span>
        <span className="text-xs text-muted">{surah.numberOfAyahs} verses</span>
      </div>
    </Link>
  );
}
