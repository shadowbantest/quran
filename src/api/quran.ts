const BASE_URL = 'https://api.alquran.cloud/v1';

interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

interface AyahData {
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

interface SurahData {
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

interface SearchMatch {
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

interface SearchData {
  count: number;
  matches: SearchMatch[];
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  const data: ApiResponse<T> = await response.json();
  if (data.code !== 200) {
    throw new Error(`API returned error code: ${data.code}`);
  }
  return data.data;
}

export async function getSurah(surahNumber: number, edition: string = 'quran-uthmani'): Promise<SurahData> {
  return fetchApi<SurahData>(`/surah/${surahNumber}/${edition}`);
}

export async function getSurahWithTranslation(
  surahNumber: number,
  translationEdition: string = 'en.sahih'
): Promise<{ arabic: SurahData; translation: SurahData }> {
  const data = await fetchApi<SurahData[]>(
    `/surah/${surahNumber}/editions/quran-uthmani,${translationEdition}`
  );
  return { arabic: data[0], translation: data[1] };
}

export async function getAyah(
  reference: string | number,
  edition: string = 'quran-uthmani'
): Promise<AyahData> {
  return fetchApi<AyahData>(`/ayah/${reference}/${edition}`);
}

export async function getAyahWithTranslation(
  reference: string | number,
  translationEdition: string = 'en.sahih'
): Promise<{ arabic: AyahData; translation: AyahData }> {
  const data = await fetchApi<AyahData[]>(
    `/ayah/${reference}/editions/quran-uthmani,${translationEdition}`
  );
  return { arabic: data[0], translation: data[1] };
}

export async function getJuz(juzNumber: number, edition: string = 'quran-uthmani'): Promise<{ number: number; ayahs: AyahData[] }> {
  return fetchApi<{ number: number; ayahs: AyahData[] }>(`/juz/${juzNumber}/${edition}`);
}

export async function getJuzWithTranslation(
  juzNumber: number,
  translationEdition: string = 'en.sahih'
): Promise<{ arabic: { number: number; ayahs: AyahData[] }; translation: { number: number; ayahs: AyahData[] } }> {
  const data = await fetchApi<{ number: number; ayahs: AyahData[] }[]>(
    `/juz/${juzNumber}/editions/quran-uthmani,${translationEdition}`
  );
  return { arabic: data[0], translation: data[1] };
}

export async function getPage(pageNumber: number, edition: string = 'quran-uthmani'): Promise<{ number: number; ayahs: AyahData[] }> {
  return fetchApi<{ number: number; ayahs: AyahData[] }>(`/page/${pageNumber}/${edition}`);
}

export async function searchQuran(
  keyword: string,
  edition: string = 'en.sahih',
  surahNumber?: number
): Promise<SearchData> {
  const surahParam = surahNumber ? `/${surahNumber}` : '';
  return fetchApi<SearchData>(`/search/${encodeURIComponent(keyword)}/${edition}${surahParam}`);
}

export async function getAvailableEditions(
  format?: 'text' | 'audio',
  type?: string,
  language?: string
): Promise<EditionData[]> {
  let params = '';
  if (format) params += `?format=${format}`;
  if (type) params += `${params ? '&' : '?'}type=${type}`;
  if (language) params += `${params ? '&' : '?'}language=${language}`;
  return fetchApi<EditionData[]>(`/edition${params}`);
}

export async function getSurahAudio(
  surahNumber: number,
  reciterEdition: string = 'ar.alafasy'
): Promise<SurahData> {
  return fetchApi<SurahData>(`/surah/${surahNumber}/${reciterEdition}`);
}

export function getVerseAudioUrl(surahNumber: number, ayahNumber: number, reciter: string = 'Alafasy'): string {
  const surahStr = String(surahNumber).padStart(3, '0');
  const ayahStr = String(ayahNumber).padStart(3, '0');
  return `https://cdn.islamic.network/quran/audio/128/${reciter}/${surahStr}${ayahStr}.mp3`;
}

export function getVerseAudioUrlByGlobalNumber(globalAyahNumber: number): string {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`;
}

export type { AyahData, SurahData, EditionData, SearchMatch, SearchData };
