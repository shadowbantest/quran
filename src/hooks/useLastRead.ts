import { useState, useCallback } from 'react';

interface LastRead {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  timestamp: number;
}

const STORAGE_KEY = 'quran-last-read';

function loadLastRead(): LastRead | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function useLastRead() {
  const [lastRead, setLastRead] = useState<LastRead | null>(loadLastRead);

  const saveLastRead = useCallback((surahNumber: number, ayahNumber: number, surahName: string) => {
    const data: LastRead = { surahNumber, ayahNumber, surahName, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setLastRead(data);
  }, []);

  return { lastRead, saveLastRead };
}
