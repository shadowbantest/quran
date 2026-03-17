import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Headphones, Search as SearchIcon, ArrowRight, Layers, Star } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { SurahCard } from '../components/SurahCard';
import { SURAHS, BISMILLAH } from '../data/quran-metadata';
import { useLastRead } from '../hooks/useLastRead';
import { usePageTitle } from '../hooks/usePageTitle';

const FEATURED_SURAHS = [1, 2, 18, 36, 55, 67, 73, 112];

export function HomePage() {
  const { lastRead } = useLastRead();
  usePageTitle();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-900 text-white" aria-label="Welcome">
        <div className="absolute inset-0 islamic-pattern" aria-hidden="true" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="animate-fade-in mb-6">
              <p className="font-arabic text-xl md:text-2xl text-white/70" dir="rtl" lang="ar">{BISMILLAH}</p>
            </div>

            <h1 className="animate-fade-in-up text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
              The Noble Quran
            </h1>
            <p className="animate-fade-in-up stagger-2 text-base md:text-lg text-white/70 mb-8 max-w-lg mx-auto leading-relaxed">
              Read, listen, and study the Holy Quran with translations, beautiful recitations, and powerful search.
            </p>

            <div className="animate-fade-in-up stagger-3 mb-8">
              <SearchBar large />
            </div>

            <div className="animate-fade-in-up stagger-4 flex flex-wrap justify-center gap-2.5">
              <Link
                to="/surahs"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-xl hover:bg-white/25 transition-all duration-200 text-sm font-medium border border-white/10"
              >
                <Book size={16} aria-hidden="true" /> Browse Surahs
              </Link>
              <Link
                to="/juz"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-xl hover:bg-white/25 transition-all duration-200 text-sm font-medium border border-white/10"
              >
                <Layers size={16} aria-hidden="true" /> Browse by Juz
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-xl hover:bg-white/25 transition-all duration-200 text-sm font-medium border border-white/10"
              >
                <SearchIcon size={16} aria-hidden="true" /> Search
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 48" className="w-full h-auto block" preserveAspectRatio="none" style={{ fill: 'rgb(var(--color-bg))' }}>
            <path d="M0,24 C360,48 720,0 1080,24 C1260,36 1380,48 1440,48 L1440,48 L0,48 Z" />
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Continue Reading */}
        {lastRead && (
          <section className="animate-fade-in mb-10" aria-label="Continue reading">
            <Link
              to={`/surah/${lastRead.surahNumber}#verse-${lastRead.ayahNumber}`}
              className="group block bg-gradient-to-r from-primary/8 via-primary/4 to-transparent border border-primary/15 rounded-2xl p-5 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center" aria-hidden="true">
                    <Book size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted font-medium uppercase tracking-wider mb-0.5">Continue Reading</p>
                    <p className="text-base font-bold text-text">{lastRead.surahName}</p>
                    <p className="text-xs text-muted">Verse {lastRead.ayahNumber}</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-primary group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
              </div>
            </Link>
          </section>
        )}

        {/* Quick Stats */}
        <section className="mb-10" aria-label="Quran statistics">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Surahs', value: '114', icon: Book },
              { label: 'Verses', value: '6,236', icon: Star },
              { label: 'Reciters', value: '8+', icon: Headphones },
              { label: 'Languages', value: '20+', icon: Layers },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`animate-fade-in-up stagger-${i + 1} bg-surface rounded-xl border border-border/60 p-4 text-center card-hover shadow-card`}
              >
                <div className="w-8 h-8 bg-primary/8 rounded-lg flex items-center justify-center mx-auto mb-2" aria-hidden="true">
                  <stat.icon size={16} className="text-primary" />
                </div>
                <p className="text-xl font-bold text-text">{stat.value}</p>
                <p className="text-xs text-muted mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Surahs */}
        <section className="mb-10" aria-label="Popular surahs">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-text">Popular Surahs</h2>
            <Link
              to="/surahs"
              className="text-primary text-xs font-semibold hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              View All <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FEATURED_SURAHS.map((num, i) => {
              const surah = SURAHS[num - 1];
              return (
                <div key={surah.number} className={`animate-fade-in-up stagger-${i + 1}`}>
                  <SurahCard surah={surah} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Keyboard shortcuts hint */}
        <section className="mb-10" aria-label="Keyboard shortcuts">
          <div className="bg-surface rounded-xl border border-border/60 p-4 shadow-card text-center">
            <p className="text-xs text-muted">
              <span className="font-semibold">Keyboard shortcuts:</span>{' '}
              <kbd className="px-1.5 py-0.5 bg-hover rounded text-[10px] font-mono">/</kbd> Search{' '}
              <kbd className="px-1.5 py-0.5 bg-hover rounded text-[10px] font-mono">Space</kbd> Play/Pause{' '}
              <kbd className="px-1.5 py-0.5 bg-hover rounded text-[10px] font-mono">j/k</kbd> Next/Prev verse{' '}
              <kbd className="px-1.5 py-0.5 bg-hover rounded text-[10px] font-mono">&larr;/&rarr;</kbd> Prev/Next surah
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
