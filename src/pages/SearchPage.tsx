import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { searchQuran, SearchMatch } from '../api/quran';
import { useSettings } from '../contexts/SettingsContext';
import { TRANSLATIONS } from '../data/quran-metadata';
import { usePageTitle } from '../hooks/usePageTitle';

export function SearchPage() {
  usePageTitle('Search');
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { settings } = useSettings();

  const [results, setResults] = useState<SearchMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchQuran(q, settings.selectedTranslation);
      setResults(data.matches);
      setTotalCount(data.count);
    } catch (err: any) {
      setError(err.message || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [settings.selectedTranslation]);

  useEffect(() => {
    if (query) {
      doSearch(query);
    }
  }, [query, doSearch]);

  const handleSearch = (q: string) => {
    setSearchParams({ q });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-text mb-1">Search the Quran</h1>
      <p className="text-sm text-muted mb-5">Search across translations, or enter a verse reference like 2:255</p>

      <div className="mb-5">
        <SearchBar initialQuery={query} onSearch={handleSearch} autoFocus={!query} />
      </div>

      <div className="flex items-center gap-2.5 mb-5">
        <label className="text-xs text-muted font-medium">Search in:</label>
        <select
          value={settings.selectedTranslation}
          onChange={(e) => {
            if (query) {
              doSearch(query);
            }
          }}
          className="px-2.5 py-1.5 text-xs bg-surface border border-border/60 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {TRANSLATIONS.filter(t => t.language === 'en').map(t => (
            <option key={t.identifier} value={t.identifier}>{t.englishName}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-16">
          <Loader2 size={28} className="animate-spin text-primary mb-3" />
          <p className="text-muted text-sm">Searching...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-500 text-sm mb-1">{error}</p>
          <p className="text-muted text-xs">Try a different search term</p>
        </div>
      ) : results.length > 0 ? (
        <div>
          <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-3">{totalCount} results found</p>
          <div className="space-y-2.5">
            {results.map((match, index) => (
              <Link
                key={`${match.surah.number}-${match.numberInSurah}-${index}`}
                to={`/surah/${match.surah.number}#verse-${match.numberInSurah}`}
                className="block bg-surface border border-border/60 rounded-xl p-4 hover:border-primary/30 hover:shadow-card-hover transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-primary/8 text-primary rounded-lg flex items-center justify-center text-[10px] font-bold">
                      {match.surah.number}:{match.numberInSurah}
                    </div>
                    <div>
                      <span className="text-xs font-medium text-text">{match.surah.englishName}</span>
                      <span className="text-[10px] text-muted ml-1.5">{match.surah.englishNameTranslation}</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-muted group-hover:text-primary transition-colors" />
                </div>
                <p className="text-xs text-text/70 leading-relaxed">{match.text}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : query ? (
        <div className="text-center py-16">
          <p className="text-muted text-base mb-1">No results for "{query}"</p>
          <p className="text-muted/50 text-xs">Try different keywords or check spelling</p>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="font-arabic text-4xl text-primary/20 mb-3">ٱقْرَأْ</p>
          <p className="text-muted text-base mb-1">Search the Quran</p>
          <p className="text-muted/50 text-xs max-w-sm mx-auto">
            Enter keywords to search translations, or type <strong>2:255</strong> to go directly to Ayat al-Kursi.
          </p>
        </div>
      )}
    </div>
  );
}
