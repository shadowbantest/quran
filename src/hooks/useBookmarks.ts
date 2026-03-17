import { useState, useEffect, useCallback } from 'react';
import { Bookmark } from '../types';

const STORAGE_KEY = 'quran-bookmarks';

function loadBookmarks(): Bookmark[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(loadBookmarks);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = useCallback((bookmark: Omit<Bookmark, 'id' | 'timestamp'>) => {
    setBookmarks(prev => {
      const exists = prev.some(
        b => b.surahNumber === bookmark.surahNumber && b.ayahNumber === bookmark.ayahNumber
      );
      if (exists) return prev;
      return [
        ...prev,
        {
          ...bookmark,
          id: `${bookmark.surahNumber}:${bookmark.ayahNumber}`,
          timestamp: Date.now(),
        },
      ];
    });
  }, []);

  const removeBookmark = useCallback((surahNumber: number, ayahNumber: number) => {
    setBookmarks(prev =>
      prev.filter(b => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber))
    );
  }, []);

  const isBookmarked = useCallback(
    (surahNumber: number, ayahNumber: number) => {
      return bookmarks.some(
        b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
      );
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (bookmark: Omit<Bookmark, 'id' | 'timestamp'>) => {
      if (isBookmarked(bookmark.surahNumber, bookmark.ayahNumber)) {
        removeBookmark(bookmark.surahNumber, bookmark.ayahNumber);
      } else {
        addBookmark(bookmark);
      }
    },
    [isBookmarked, addBookmark, removeBookmark]
  );

  const clearAll = useCallback(() => {
    setBookmarks([]);
  }, []);

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, toggleBookmark, clearAll };
}
