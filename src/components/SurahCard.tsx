import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
        className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-hover/60 transition-all duration-200 group"
      >
        <div className="w-9 h-9 bg-gradient-to-br from-primary/15 to-primary/5 text-primary rounded-xl flex items-center justify-center text-xs font-bold shrink-0 group-hover:from-primary group-hover:to-primary-dark group-hover:text-white transition-all duration-300">
          {surah.number}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text truncate group-hover:text-primary transition-colors">{surah.englishName}</p>
          <p className="text-xs text-muted truncate">{surah.englishNameTranslation}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className={`hidden sm:inline text-[10px] px-2 py-0.5 rounded-full font-medium ${
            surah.revelationType === 'Meccan'
              ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
              : 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400'
          }`}>
            {surah.revelationType}
          </span>
          <p className="font-arabic text-lg text-primary/70 shrink-0 group-hover:text-primary transition-colors" dir="rtl" lang="ar">{surah.name}</p>
          <ArrowRight size={14} className="text-muted/0 group-hover:text-primary transition-all" aria-hidden="true" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/surah/${surah.number}`}
      className="group block bg-surface rounded-2xl border border-border/50 p-5 card-rich shadow-card relative overflow-hidden"
    >
      {/* Subtle background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          {/* Number badge */}
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-md shadow-primary/15 group-hover:shadow-primary/25 group-hover:scale-105 transition-all duration-300">
              <span className="text-white text-xs font-bold">{surah.number}</span>
            </div>
          </div>
          {/* Arabic name */}
          <span className="font-arabic text-2xl text-primary/60 group-hover:text-primary transition-colors duration-300 leading-none" dir="rtl" lang="ar">
            {surah.name}
          </span>
        </div>

        <div className="mb-3">
          <h3 className="font-bold text-text text-sm group-hover:text-primary transition-colors duration-200">{surah.englishName}</h3>
          <p className="text-xs text-muted mt-0.5">{surah.englishNameTranslation}</p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/40">
          <div className="flex items-center gap-2.5">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              surah.revelationType === 'Meccan'
                ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                : 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400'
            }`}>
              {surah.revelationType}
            </span>
            <span className="text-[10px] text-muted font-medium">{surah.numberOfAyahs} verses</span>
          </div>
          <ArrowRight size={14} className="text-muted/0 group-hover:text-primary transition-all duration-200" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
