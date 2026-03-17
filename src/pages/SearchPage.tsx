import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { searchQuran, SearchMatch } from '../api/quran';
import { useSettings } from '../contexts/SettingsContext';
import { TRANSLATIONS } from '../data/quran-metadata';

export function SearchPage() {
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text mb-2">Search the Quran</h1>
      <p className="text-muted mb-6">Search across translations, or enter a verse reference like 2:255</p>

      <div className="mb-6">
        <SearchBar initialQuery={query} onSearch={handleSearch} autoFocus={!query} />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm text-muted">Search in:</label>
        <select
          value={settings.selectedTranslation}
          onChange={(e) => {
            // Re-search with new translation
            if (query) {
              doSearch(query);
            }
          }}
          className="px-3 py-1.5 text-sm bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {TRANSLATIONS.filter(t => t.language === 'en').map(t => (
            <option key={t.identifier} value={t.identifier}>{t.englishName}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-16">
          <Loader2 size={32} className="animate-spin text-primary mb-4" />
          <p className="text-muted">Searching...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-muted text-sm">Try a different search term</p>
        </div>
      ) : results.length > 0 ? (
        <div>
          <p className="text-sm text-muted mb-4">{totalCount} results found</p>
          <div className="space-y-4">
            {results.map((match, index) => (
              <Link
                key={`${match.surah.number}-${match.numberInSurah}-${index}`}
                to={`/surah/${match.surah.number}#verse-${match.numberInSurah}`}
                className="block bg-surface border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-xs font-bold">
                      {match.surah.number}:{match.numberInSurah}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-text">{match.surah.englishName}</span>
                      <span className="text-xs text-muted ml-2">{match.surah.englishNameTranslation}</span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-muted group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-text/80 leading-relaxed">{match.text}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : query ? (
        <div className="text-center py-16">
          <p className="text-muted text-lg mb-2">No results found for "{query}"</p>
          <p className="text-muted/60 text-sm">Try different keywords or check the spelling</p>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="font-arabic text-4xl text-primary/30 mb-4">ٱقْرَأْ</p>
          <p className="text-muted text-lg mb-2">Search the Quran</p>
          <p className="text-muted/60 text-sm max-w-md mx-auto">
            Enter keywords to search translations, or type a verse reference like <strong>2:255</strong> to
            go directly to Ayat al-Kursi.
          </p>
        </div>
      )}
    </div>
  );
}
