import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { JUZS, SURAHS } from '../data/quran-metadata';
import { usePageTitle } from '../hooks/usePageTitle';

export function JuzPage() {
  usePageTitle('Browse by Juz');
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text mb-1">Browse by Juz</h1>
        <p className="text-sm text-muted">The Quran is divided into 30 equal parts called Juz</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {JUZS.map((juz, i) => {
          const startSurah = SURAHS[juz.startSurah - 1];
          const endSurah = SURAHS[juz.endSurah - 1];

          return (
            <Link
              key={juz.number}
              to={`/surah/${juz.startSurah}#verse-${juz.startAyah}`}
              className={`animate-fade-in stagger-${Math.min(i % 6 + 1, 8)} group bg-surface border border-border/60 rounded-xl p-4 card-hover shadow-card`}
            >
              <div className="flex items-start justify-between mb-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">{juz.number}</span>
                </div>
                <ArrowRight size={14} className="text-muted group-hover:text-primary transition-colors mt-2" />
              </div>
              <h3 className="font-semibold text-text text-sm mb-0.5">Juz {juz.number}</h3>
              <p className="text-xs text-muted mb-2.5">{juz.name}</p>
              <div className="text-[10px] text-muted/60 space-y-0.5">
                <p>
                  Starts: {startSurah.englishName} {juz.startSurah}:{juz.startAyah}
                </p>
                <p>
                  Ends: {endSurah.englishName} {juz.endSurah}:{juz.endAyah}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
