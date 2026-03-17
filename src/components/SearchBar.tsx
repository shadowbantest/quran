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

    const refMatch = query.match(/^(\d+):(\d+)$/);
    if (refMatch) {
      navigate(`/surah/${refMatch[1]}#verse-${refMatch[2]}`);
      return;
    }

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
            size={large ? 18 : 15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search surahs, verses, or type 2:255..."
            className={`w-full bg-surface border border-border/60 rounded-xl ${
              large ? 'pl-11 pr-11 py-3.5 text-sm' : 'pl-9 pr-9 py-2 text-sm'
            } text-text placeholder:text-muted/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all`}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSuggestions([]); }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
            >
              <X size={large ? 18 : 15} />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className={`absolute z-50 top-full mt-1.5 w-full ${large ? 'max-w-2xl left-1/2 -translate-x-1/2' : ''} bg-surface border border-border/60 rounded-xl shadow-xl overflow-hidden animate-scale-in`}>
          {suggestions.map(surah => (
            <button
              key={surah.number}
              onMouseDown={() => {
                navigate(`/surah/${surah.number}`);
                setQuery('');
                setShowSuggestions(false);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-hover/60 transition-colors text-left"
            >
              <div className="w-7 h-7 bg-primary/8 text-primary rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0">
                {surah.number}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text">{surah.englishName}</p>
                <p className="text-[10px] text-muted">{surah.englishNameTranslation} - {surah.numberOfAyahs} verses</p>
              </div>
              <span className="font-arabic text-base text-primary/60">{surah.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
