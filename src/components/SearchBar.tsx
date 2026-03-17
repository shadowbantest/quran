import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SURAHS } from '../data/quran-metadata';

interface SearchBarProps {
  large?: boolean;
  autoFocus?: boolean;
  initialQuery?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({ large, autoFocus, initialQuery = '', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<typeof SURAHS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (query.length > 0) {
      const q = query.toLowerCase();
      const filtered = SURAHS.filter(
        s =>
          s.englishName.toLowerCase().includes(q) ||
          s.englishNameTranslation.toLowerCase().includes(q) ||
          s.name.includes(query) ||
          String(s.number) === q
      ).slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Check if it's a surah:ayah reference
    const refMatch = query.match(/^(\d+):(\d+)$/);
    if (refMatch) {
      navigate(`/surah/${refMatch[1]}#verse-${refMatch[2]}`);
      return;
    }

    // Check if it's just a surah number
    const numMatch = query.match(/^(\d+)$/);
    if (numMatch && parseInt(numMatch[1]) >= 1 && parseInt(numMatch[1]) <= 114) {
      navigate(`/surah/${numMatch[1]}`);
      return;
    }

    setShowSuggestions(false);
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className={`relative ${large ? 'max-w-2xl mx-auto' : ''}`}>
          <Search
            size={large ? 20 : 16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search surahs, verses, or type 2:255 for Ayat al-Kursi..."
            className={`w-full bg-surface border border-border rounded-2xl ${
              large ? 'pl-12 pr-12 py-4 text-base' : 'pl-10 pr-10 py-2.5 text-sm'
            } text-text placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSuggestions([]); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-text"
            >
              <X size={large ? 20 : 16} />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className={`absolute z-50 top-full mt-2 w-full ${large ? 'max-w-2xl left-1/2 -translate-x-1/2' : ''} bg-surface border border-border rounded-xl shadow-xl overflow-hidden`}>
          {suggestions.map(surah => (
            <button
              key={surah.number}
              onMouseDown={() => {
                navigate(`/surah/${surah.number}`);
                setQuery('');
                setShowSuggestions(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-hover transition-colors text-left"
            >
              <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
                {surah.number}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text">{surah.englishName}</p>
                <p className="text-xs text-muted">{surah.englishNameTranslation} - {surah.numberOfAyahs} verses</p>
              </div>
              <span className="font-arabic text-lg text-primary">{surah.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
