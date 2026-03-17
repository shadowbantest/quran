export interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  rukus: number;
  startJuz: number;
}

export interface Verse {
  number: number;
  numberInSurah: number;
  text: string;
  textUthmani?: string;
  translation?: string;
  transliteration?: string;
  audio?: string;
  sajda?: boolean;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  verses: Verse[];
}

export interface JuzInfo {
  number: number;
  name: string;
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
}

export interface SajdaInfo {
  surah: number;
  ayah: number;
  recommended: boolean;
  obligatory: boolean;
}

export interface Bookmark {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  text: string;
  translation?: string;
  timestamp: number;
}

export interface Reciter {
  id: number;
  name: string;
  style?: string;
  identifier: string;
}

export interface TranslationEdition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  type: string;
}

export interface SearchResult {
  surah: number;
  surahName: string;
  ayah: number;
  text: string;
  translation?: string;
  edition?: string;
}

export type ThemeMode = 'light' | 'dark' | 'sepia';
export type ReadingMode = 'translation' | 'reading' | 'sideBySide';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
export type ArabicFont = 'uthmanic' | 'me-quran' | 'amiri-quran' | 'amiri' | 'scheherazade' | 'noto-naskh' | 'noto-nastaliq' | 'lateef' | 'al-qalam';

export interface AppSettings {
  theme: ThemeMode;
  readingMode: ReadingMode;
  fontSize: FontSize;
  arabicFontSize: FontSize;
  selectedTranslation: string;
  selectedReciter: string;
  showTransliteration: boolean;
  showArabic: boolean;
  showTranslation: boolean;
  autoScroll: boolean;
  mushafMode: boolean;
  arabicFont: ArabicFont;
}
