import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings, ThemeMode, ReadingMode, FontSize, ArabicFont } from '../types';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  readingMode: 'translation',
  fontSize: 'medium',
  arabicFontSize: 'large',
  selectedTranslation: 'en.sahih',
  selectedReciter: 'ar.alafasy',
  showTransliteration: false,
  showArabic: true,
  showTranslation: true,
  autoScroll: false,
  mushafMode: false,
  arabicFont: 'amiri-quran',
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  setTheme: (theme: ThemeMode) => void;
  setReadingMode: (mode: ReadingMode) => void;
  setFontSize: (size: FontSize) => void;
  setArabicFontSize: (size: FontSize) => void;
  setTranslation: (edition: string) => void;
  setReciter: (edition: string) => void;
  setArabicFont: (font: ArabicFont) => void;
  setMushafMode: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem('quran-app-settings');
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  useEffect(() => {
    localStorage.setItem('quran-app-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'sepia');
    root.classList.add(settings.theme);
  }, [settings.theme]);

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    setTheme: (theme) => updateSettings({ theme }),
    setReadingMode: (mode) => updateSettings({ readingMode: mode }),
    setFontSize: (size) => updateSettings({ fontSize: size }),
    setArabicFontSize: (size) => updateSettings({ arabicFontSize: size }),
    setTranslation: (edition) => updateSettings({ selectedTranslation: edition }),
    setReciter: (edition) => updateSettings({ selectedReciter: edition }),
    setArabicFont: (font) => updateSettings({ arabicFont: font }),
    setMushafMode: (enabled) => updateSettings({ mushafMode: enabled }),
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
