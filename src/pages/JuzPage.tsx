import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { JUZS, SURAHS, toArabicNumeral } from '../data/quran-metadata';

export function JuzPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Browse by Juz</h1>
        <p className="text-muted">The Quran is divided into 30 equal parts called Juz (plural: Ajza)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {JUZS.map(juz => {
          const startSurah = SURAHS[juz.startSurah - 1];
          const endSurah = SURAHS[juz.endSurah - 1];

          return (
            <Link
              key={juz.number}
              to={`/surah/${juz.startSurah}#verse-${juz.startAyah}`}
              className="group bg-surface border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-bold">{juz.number}</span>
                </div>
                <ArrowRight size={16} className="text-muted group-hover:text-primary transition-colors mt-2" />
              </div>
              <h3 className="font-semibold text-text mb-1">Juz {juz.number}</h3>
              <p className="text-sm text-muted mb-3">{juz.name}</p>
              <div className="text-xs text-muted/70 space-y-0.5">
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
