import React, { useState, useMemo } from 'react';
import { Search, Grid3X3, List } from 'lucide-react';
import { SurahCard } from '../components/SurahCard';
import { SURAHS } from '../data/quran-metadata';
import { usePageTitle } from '../hooks/usePageTitle';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'Meccan' | 'Medinan';

export function SurahListPage() {
  usePageTitle('All Surahs');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = useMemo(() => {
    let result = SURAHS;
    if (filter !== 'all') {
      result = result.filter(s => s.revelationType === filter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        s =>
          s.englishName.toLowerCase().includes(q) ||
          s.englishNameTranslation.toLowerCase().includes(q) ||
          s.name.includes(search) ||
          String(s.number) === q
      );
    }
    return result;
  }, [search, filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text mb-1">All Surahs</h1>
        <p className="text-sm text-muted">Browse all 114 chapters of the Holy Quran</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search surahs..."
            className="w-full pl-9 pr-4 py-2 bg-surface border border-border/60 rounded-xl text-sm text-text placeholder:text-muted/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
          />
        </div>
        <div className="flex gap-1.5">
          <div className="flex bg-surface border border-border/60 rounded-xl overflow-hidden">
            {(['all', 'Meccan', 'Medinan'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 text-xs font-medium transition-all duration-200 capitalize ${
                  filter === f ? 'bg-primary text-white' : 'text-muted hover:text-text hover:bg-hover'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex bg-surface border border-border/60 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-all duration-200 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted hover:text-text'}`}
            >
              <Grid3X3 size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-all duration-200 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-muted hover:text-text'}`}
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-3">{filtered.length} surahs</p>

      {/* Surah Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map(surah => (
            <SurahCard key={surah.number} surah={surah} />
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border/60 divide-y divide-border/30 shadow-card">
          {filtered.map(surah => (
            <SurahCard key={surah.number} surah={surah} compact />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted text-base">No surahs found</p>
          <p className="text-muted/50 text-xs mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
