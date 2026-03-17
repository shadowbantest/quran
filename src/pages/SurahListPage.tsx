import React, { useState, useMemo } from 'react';
import { Search, Grid3X3, List, Filter } from 'lucide-react';
import { SurahCard } from '../components/SurahCard';
import { SURAHS } from '../data/quran-metadata';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'Meccan' | 'Medinan';

export function SurahListPage() {
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">All Surahs</h1>
        <p className="text-muted">Browse all 114 chapters of the Holy Quran</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search surahs..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex bg-surface border border-border rounded-xl overflow-hidden">
            {(['all', 'Meccan', 'Medinan'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors capitalize ${
                  filter === f ? 'bg-primary text-white' : 'text-muted hover:text-text hover:bg-hover'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex bg-surface border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted hover:text-text'}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-muted hover:text-text'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted mb-4">Showing {filtered.length} surahs</p>

      {/* Surah Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(surah => (
            <SurahCard key={surah.number} surah={surah} />
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border divide-y divide-border/50">
          {filtered.map(surah => (
            <SurahCard key={surah.number} surah={surah} compact />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted text-lg">No surahs found</p>
          <p className="text-muted/60 text-sm mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
