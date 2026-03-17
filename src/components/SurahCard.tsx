import React from 'react';
import { Link } from 'react-router-dom';
import { SurahInfo } from '../types';

interface SurahCardProps {
  surah: SurahInfo;
  compact?: boolean;
}

export function SurahCard({ surah, compact }: SurahCardProps) {
  if (compact) {
    return (
      <Link
        to={`/surah/${surah.number}`}
        className="flex items-center gap-3 px-4 py-3 hover:bg-hover/60 transition-all duration-200 group"
      >
        <div className="w-8 h-8 bg-primary/8 text-primary rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
          {surah.number}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text truncate">{surah.englishName}</p>
          <p className="text-xs text-muted truncate">{surah.englishNameTranslation}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
            surah.revelationType === 'Meccan'
              ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
              : 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400'
          }`}>
            {surah.revelationType}
          </span>
          <p className="font-arabic text-lg text-primary/80 shrink-0 group-hover:text-primary transition-colors">{surah.name}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/surah/${surah.number}`}
      className="group block bg-surface rounded-xl border border-border/60 p-4 card-hover shadow-card"
    >
      <div className="flex items-start justify-between mb-2.5">
        <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-white text-xs font-bold">{surah.number}</span>
        </div>
        <span className="font-arabic text-2xl text-primary/70 group-hover:text-primary transition-colors duration-200 leading-none">
          {surah.name}
        </span>
      </div>
      <div>
        <h3 className="font-semibold text-text text-sm">{surah.englishName}</h3>
        <p className="text-xs text-muted mt-0.5">{surah.englishNameTranslation}</p>
      </div>
      <div className="flex items-center gap-2.5 mt-3 pt-2.5 border-t border-border/40">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
          surah.revelationType === 'Meccan'
            ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
            : 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400'
        }`}>
          {surah.revelationType}
        </span>
        <span className="text-[10px] text-muted">{surah.numberOfAyahs} verses</span>
      </div>
    </Link>
  );
}
