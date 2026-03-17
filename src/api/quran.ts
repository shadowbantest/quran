import { getCached, setCache, getMemoryCached, setMemoryCache } from '../utils/cache';

const BASE_URL = 'https://api.alquran.cloud/v1';

interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

export interface AyahData {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
  };
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: AyahData[];
}

interface EditionData {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
}

export interface SearchMatch {
  number: number;
  text: string;
  numberInSurah: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
  };
  edition: EditionData;
}

export interface SearchData {
  count: number;
  matches: SearchMatch[];
}

// Retry with exponential backoff
async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      if (response.status >= 500 && i < retries) {
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 500));
        continue;
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 500));
    }
  }
  throw new Error('Request failed after retries');
}

async function fetchApi<T>(endpoint: string, useCache = true): Promise<T> {
  const cacheKey = `api:${endpoint}`;

  if (useCache) {
    // Check memory cache first (fastest)
    const memoryCached = getMemoryCached<T>(cacheKey);
    if (memoryCached) return memoryCached;

    // Check IndexedDB cache
    const dbCached = await getCached<T>(cacheKey);
    if (dbCached) {
      setMemoryCache(cacheKey, dbCached);
      return dbCached;
    }
  }

  const response = await fetchWithRetry(`${BASE_URL}${endpoint}`);
  const json: ApiResponse<T> = await response.json();

  if (json.code !== 200 || !json.data) {
    throw new Error(`API returned error code: ${json.code}`);
  }

  // Validate that we actually got data
  const data = json.data;

  if (useCache) {
    setMemoryCache(cacheKey, data);
    setCache(cacheKey, data);
  }

  return data;
}

export async function getSurah(surahNumber: number, edition: string = 'quran-uthmani'): Promise<SurahData> {
  const data = await fetchApi<SurahData>(`/surah/${surahNumber}/${edition}`);
  // Validate ayah count
  if (data.ayahs && data.ayahs.length !== data.numberOfAyahs) {
    console.warn(`Surah ${surahNumber}: expected ${data.numberOfAyahs} ayahs, got ${data.ayahs.length}`);
  }
  return data;
}

export async function getSurahWithTranslation(
  surahNumber: number,
  translationEdition: string = 'en.sahih'
): Promise<{ arabic: SurahData; translation: SurahData }> {
  const data = await fetchApi<SurahData[]>(
    `/surah/${surahNumber}/editions/quran-uthmani,${translationEdition}`
  );
  if (!Array.isArray(data) || data.length < 2) {
    throw new Error('Invalid response: expected Arabic and translation data');
  }
  return { arabic: data[0], translation: data[1] };
}

export async function getAyah(
  reference: string | number,
  edition: string = 'quran-uthmani'
): Promise<AyahData> {
  return fetchApi<AyahData>(`/ayah/${reference}/${edition}`);
}

export async function getJuz(juzNumber: number, edition: string = 'quran-uthmani'): Promise<{ number: number; ayahs: AyahData[] }> {
  return fetchApi<{ number: number; ayahs: AyahData[] }>(`/juz/${juzNumber}/${edition}`);
}

export async function searchQuran(
  keyword: string,
  edition: string = 'en.sahih',
  surahNumber?: number
): Promise<SearchData> {
  const surahParam = surahNumber ? `/${surahNumber}` : '';
  // Don't cache search results (too variable)
  return fetchApi<SearchData>(`/search/${encodeURIComponent(keyword)}/${edition}${surahParam}`, false);
}

export async function getSurahAudio(
  surahNumber: number,
  reciterEdition: string = 'ar.alafasy'
): Promise<SurahData> {
  return fetchApi<SurahData>(`/surah/${surahNumber}/${reciterEdition}`);
}

export type { EditionData };
