import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Headphones, Search as SearchIcon, Bookmark, ArrowRight, Layers } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { SurahCard } from '../components/SurahCard';
import { SURAHS, BISMILLAH } from '../data/quran-metadata';
import { useLastRead } from '../hooks/useLastRead';

const FEATURED_SURAHS = [1, 2, 18, 36, 55, 67, 73, 112];

export function HomePage() {
  const { lastRead } = useLastRead();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-emerald-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 font-arabic text-[200px] leading-none opacity-20 select-none">
            ٱلْقُرْآن
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <p className="font-arabic text-2xl md:text-3xl mb-4 opacity-90">{BISMILLAH}</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              The Noble Quran
            </h1>
            <p className="text-lg md:text-xl opacity-80 mb-8 max-w-xl mx-auto">
              Read, listen, and study the Holy Quran with translations in 20+ languages,
              beautiful recitations, and powerful search.
            </p>
            <div className="mb-8">
              <SearchBar large />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/surahs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors font-medium"
              >
                <Book size={18} /> Browse Surahs
              </Link>
              <Link
                to="/juz"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors font-medium"
              >
                <Layers size={18} /> Browse by Juz
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors font-medium"
              >
                <SearchIcon size={18} /> Search Quran
              </Link>
            </div>
          </div>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-auto" style={{ fill: 'rgb(var(--color-bg))' }}>
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Continue Reading */}
        {lastRead && (
          <section className="mb-12">
            <Link
              to={`/surah/${lastRead.surahNumber}#verse-${lastRead.ayahNumber}`}
              className="block bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted font-medium mb-1">Continue Reading</p>
                  <p className="text-lg font-bold text-text">{lastRead.surahName}</p>
                  <p className="text-sm text-muted">Verse {lastRead.ayahNumber}</p>
                </div>
                <ArrowRight size={20} className="text-primary" />
              </div>
            </Link>
          </section>
        )}

        {/* Quick Stats */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Surahs', value: '114', icon: Book },
              { label: 'Verses', value: '6,236', icon: Layers },
              { label: 'Reciters', value: '8+', icon: Headphones },
              { label: 'Translations', value: '20+', icon: SearchIcon },
            ].map(stat => (
              <div key={stat.label} className="bg-surface rounded-2xl border border-border p-4 text-center">
                <stat.icon size={20} className="mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold text-text">{stat.value}</p>
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Surahs */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text">Popular Surahs</h2>
            <Link
              to="/surahs"
              className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_SURAHS.map(num => {
              const surah = SURAHS[num - 1];
              return <SurahCard key={surah.number} surah={surah} />;
            })}
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text mb-6 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Multiple Translations',
                description: 'Read the Quran in 20+ languages with renowned translators including Sahih International, Yusuf Ali, Pickthall, and more.',
                icon: Book,
              },
              {
                title: 'Audio Recitations',
                description: 'Listen to beautiful recitations from world-renowned Qaris including Mishary Alafasy, Abdul Basit, Al-Sudais, and more.',
                icon: Headphones,
              },
              {
                title: 'Smart Search',
                description: 'Search across the entire Quran by keyword, surah name, verse reference (e.g., 2:255), or topic.',
                icon: SearchIcon,
              },
            ].map(feature => (
              <div key={feature.title} className="bg-surface rounded-2xl border border-border p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-bold text-text mb-2">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
