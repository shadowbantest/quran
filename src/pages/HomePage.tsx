import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Headphones, Search as SearchIcon, ArrowRight, Layers, Star, BookOpen, Globe, Sparkles } from 'lucide-react';
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
      <section className="relative overflow-hidden text-white" style={{ background: 'var(--gradient-hero)' }} aria-label="Welcome">
        <div className="absolute inset-0 islamic-star-pattern" aria-hidden="true" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/8 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl" aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.03]" aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/[0.05]" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Decorative Bismillah */}
            <div className="animate-fade-in mb-8">
              <div className="inline-block">
                <p className="font-arabic text-xl md:text-2xl text-white/60 tracking-wide" dir="rtl" lang="ar">{BISMILLAH}</p>
                <div className="diamond-divider mt-3 opacity-40" aria-hidden="true">
                  <span className="w-1.5 h-1.5 bg-white/60 rotate-45 inline-block" />
                </div>
              </div>
            </div>

            <h1 className="animate-fade-in-up text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight leading-tight">
              <span className="block">The Noble</span>
              <span className="block bg-gradient-to-r from-teal-200 via-white to-teal-200 bg-clip-text text-transparent">Quran</span>
            </h1>
            <p className="animate-fade-in-up stagger-2 text-base md:text-lg text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">
              Read, listen, and study the Holy Quran with translations, beautiful recitations, and powerful search.
            </p>

            <div className="animate-fade-in-up stagger-3 mb-10 max-w-xl mx-auto">
              <SearchBar large />
            </div>

            <div className="animate-fade-in-up stagger-4 flex flex-wrap justify-center gap-3">
              <Link
                to="/surahs"
                className="group inline-flex items-center gap-2.5 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all duration-300 text-sm font-semibold border border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/5"
              >
                <Book size={16} aria-hidden="true" /> Browse Surahs
                <ArrowRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" aria-hidden="true" />
              </Link>
              <Link
                to="/juz"
                className="group inline-flex items-center gap-2.5 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all duration-300 text-sm font-semibold border border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/5"
              >
                <Layers size={16} aria-hidden="true" /> Browse by Juz
              </Link>
              <Link
                to="/search"
                className="group inline-flex items-center gap-2.5 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all duration-300 text-sm font-semibold border border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/5"
              >
                <SearchIcon size={16} aria-hidden="true" /> Search
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 60" className="w-full h-auto block" preserveAspectRatio="none" style={{ fill: 'rgb(var(--color-bg))' }}>
            <path d="M0,30 C240,50 480,10 720,30 C960,50 1200,10 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Continue Reading */}
        {lastRead && (
          <section className="animate-fade-in mb-10" aria-label="Continue reading">
            <Link
              to={`/surah/${lastRead.surahNumber}#verse-${lastRead.ayahNumber}`}
              className="group block relative overflow-hidden rounded-2xl border border-primary/15 p-5 md:p-6 hover:border-primary/30 transition-all duration-300"
              style={{ background: 'var(--gradient-card)' }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" aria-hidden="true" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-md shadow-primary/20" aria-hidden="true">
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-[0.15em] mb-1">Continue Reading</p>
                    <p className="text-lg font-bold text-text">{lastRead.surahName}</p>
                    <p className="text-xs text-muted mt-0.5">Verse {lastRead.ayahNumber}</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors" aria-hidden="true">
                  <ArrowRight size={18} className="text-primary group-hover:translate-x-0.5 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Quick Stats */}
        <section className="mb-12" aria-label="Quran statistics">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Surahs', value: '114', icon: Book, desc: 'Chapters' },
              { label: 'Verses', value: '6,236', icon: Star, desc: 'Total Ayahs' },
              { label: 'Reciters', value: '8+', icon: Headphones, desc: 'Beautiful voices' },
              { label: 'Languages', value: '20+', icon: Globe, desc: 'Translations' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`animate-fade-in-up stagger-${i + 1} group relative overflow-hidden bg-surface rounded-2xl border border-border/50 p-5 text-center card-hover shadow-card`}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                  <stat.icon size={18} className="text-primary" />
                </div>
                <p className="text-2xl font-extrabold text-text tracking-tight">{stat.value}</p>
                <p className="text-xs font-semibold text-muted mt-0.5">{stat.label}</p>
                <p className="text-[10px] text-muted/60 mt-0.5">{stat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Surahs */}
        <section className="mb-12" aria-label="Popular surahs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-text flex items-center gap-2">
                <Sparkles size={18} className="text-primary" aria-hidden="true" />
                Popular Surahs
              </h2>
              <p className="text-xs text-muted mt-1">Most frequently read chapters</p>
            </div>
            <Link
              to="/surahs"
              className="group text-primary text-xs font-semibold hover:underline flex items-center gap-1.5 uppercase tracking-wider bg-primary/5 px-3.5 py-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              View All <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Keyboard shortcuts */}
        <section className="mb-10" aria-label="Keyboard shortcuts">
          <div className="bg-surface rounded-2xl border border-border/50 p-5 shadow-card islamic-pattern-subtle">
            <div className="text-center">
              <p className="text-xs font-semibold text-muted mb-3 uppercase tracking-wider">Keyboard Shortcuts</p>
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted">
                <span><kbd className="px-2 py-1 bg-hover rounded-md text-[11px] font-mono border border-border/60 shadow-sm">/</kbd> Search</span>
                <span><kbd className="px-2 py-1 bg-hover rounded-md text-[11px] font-mono border border-border/60 shadow-sm">Space</kbd> Play/Pause</span>
                <span><kbd className="px-2 py-1 bg-hover rounded-md text-[11px] font-mono border border-border/60 shadow-sm">j/k</kbd> Next/Prev</span>
                <span><kbd className="px-2 py-1 bg-hover rounded-md text-[11px] font-mono border border-border/60 shadow-sm">&larr;/&rarr;</kbd> Surah nav</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
