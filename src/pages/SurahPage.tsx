import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Pause, Loader2, BookOpen } from 'lucide-react';
import { getSurahWithTranslation, getSurahAudio, AyahData } from '../api/quran';
import { VerseDisplay } from '../components/VerseDisplay';
import { AudioPlayer } from '../components/AudioPlayer';
import { SURAHS, BISMILLAH, TRANSLATIONS, POPULAR_RECITERS } from '../data/quran-metadata';
import { useSettings } from '../contexts/SettingsContext';
import { useBookmarks } from '../hooks/useBookmarks';
import { useLastRead } from '../hooks/useLastRead';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export function SurahPage() {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const surahNumber = parseInt(number || '1');
  const surahInfo = SURAHS[surahNumber - 1];

  const { settings, setTranslation, setReciter } = useSettings();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { saveLastRead } = useLastRead();
  const audioPlayer = useAudioPlayer();

  const [arabicVerses, setArabicVerses] = useState<AyahData[]>([]);
  const [translationVerses, setTranslationVerses] = useState<AyahData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<AyahData[]>([]);
  const [showControls, setShowControls] = useState(false);

  const versesRef = useRef<HTMLDivElement>(null);

  // Fetch surah data
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getSurahWithTranslation(surahNumber, settings.selectedTranslation)
      .then(data => {
        if (!cancelled) {
          setArabicVerses(data.arabic.ayahs);
          setTranslationVerses(data.translation.ayahs);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [surahNumber, settings.selectedTranslation]);

  // Scroll to verse from hash
  useEffect(() => {
    if (!loading && location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
      }
    }
  }, [loading, location.hash]);

  // Save last read position
  useEffect(() => {
    if (surahInfo) {
      saveLastRead(surahNumber, 1, surahInfo.englishName);
    }
  }, [surahNumber, surahInfo, saveLastRead]);

  // Load audio data
  const loadAudio = useCallback(async () => {
    try {
      const data = await getSurahAudio(surahNumber, settings.selectedReciter);
      setAudioData(data.ayahs);
    } catch {
      // Audio loading failed silently
    }
  }, [surahNumber, settings.selectedReciter]);

  // Play verse audio
  const playVerse = useCallback(async (ayahNumberInSurah: number) => {
    if (audioData.length === 0) {
      await loadAudio();
    }

    const ayah = audioData.find(a => a.numberInSurah === ayahNumberInSurah);
    if (ayah) {
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/${settings.selectedReciter}/${ayah.number}.mp3`;
      await audioPlayer.play(audioUrl, ayahNumberInSurah);
    } else {
      // Fallback: construct URL
      const globalNumber = arabicVerses.find(v => v.numberInSurah === ayahNumberInSurah)?.number;
      if (globalNumber) {
        const audioUrl = `https://cdn.islamic.network/quran/audio/128/${settings.selectedReciter}/${globalNumber}.mp3`;
        await audioPlayer.play(audioUrl, ayahNumberInSurah);
      }
    }
  }, [audioData, loadAudio, settings.selectedReciter, audioPlayer, arabicVerses]);

  // Auto-advance to next verse
  useEffect(() => {
    const cleanup = audioPlayer.onEnded(() => {
      const nextAyah = audioPlayer.currentAyah + 1;
      if (nextAyah <= (surahInfo?.numberOfAyahs || 0)) {
        playVerse(nextAyah);
        const el = document.getElementById(`verse-${nextAyah}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    return cleanup;
  }, [audioPlayer, playVerse, surahInfo]);

  // Preload audio when component mounts
  useEffect(() => {
    loadAudio();
  }, [loadAudio]);

  if (!surahInfo) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-2xl font-bold text-text mb-2">Surah not found</p>
        <Link to="/surahs" className="text-primary hover:underline">Browse all surahs</Link>
      </div>
    );
  }

  return (
    <div className={`${audioPlayer.currentAyah > 0 ? 'pb-24' : ''}`}>
      {/* Surah Header */}
      <div className="bg-gradient-to-br from-primary via-primary-dark to-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => surahNumber > 1 && navigate(`/surah/${surahNumber - 1}`)}
              disabled={surahNumber <= 1}
              className="flex items-center gap-1 text-sm text-white/70 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <Link to="/surahs" className="text-sm text-white/70 hover:text-white transition-colors">
              All Surahs
            </Link>
            <button
              onClick={() => surahNumber < 114 && navigate(`/surah/${surahNumber + 1}`)}
              disabled={surahNumber >= 114}
              className="flex items-center gap-1 text-sm text-white/70 hover:text-white disabled:opacity-30 transition-colors"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>

          {/* Surah Info */}
          <div className="text-center">
            <p className="font-arabic text-4xl md:text-5xl mb-3">{surahInfo.name}</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{surahInfo.englishName}</h1>
            <p className="text-white/70 mb-4">{surahInfo.englishNameTranslation}</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
              <span>{surahInfo.revelationType}</span>
              <span>|</span>
              <span>{surahInfo.numberOfAyahs} verses</span>
              <span>|</span>
              <span>{surahInfo.rukus} rukus</span>
              <span>|</span>
              <span>Juz {surahInfo.startJuz}</span>
            </div>
          </div>

          {/* Play All Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => {
                if (audioPlayer.isPlaying) {
                  audioPlayer.pause();
                } else {
                  playVerse(audioPlayer.currentAyah || 1);
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
            >
              {audioPlayer.isPlaying ? <Pause size={18} /> : <Play size={18} />}
              {audioPlayer.isPlaying ? 'Pause Recitation' : 'Play Recitation'}
            </button>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="sticky top-16 z-30 bg-surface/95 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center gap-3 overflow-x-auto">
          <button
            onClick={() => setShowControls(!showControls)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted hover:text-text bg-hover rounded-lg transition-colors"
          >
            <BookOpen size={14} /> Options
          </button>

          <select
            value={settings.selectedTranslation}
            onChange={(e) => setTranslation(e.target.value)}
            className="shrink-0 px-3 py-1.5 text-sm bg-hover border-none rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            {TRANSLATIONS.map(t => (
              <option key={t.identifier} value={t.identifier}>
                {t.englishName}
              </option>
            ))}
          </select>

          <select
            value={settings.selectedReciter}
            onChange={(e) => setReciter(e.target.value)}
            className="shrink-0 px-3 py-1.5 text-sm bg-hover border-none rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            {POPULAR_RECITERS.map(r => (
              <option key={r.identifier} value={r.identifier}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bismillah */}
      {surahNumber !== 1 && surahNumber !== 9 && (
        <div className="text-center py-8 border-b border-border/50">
          <p className="font-arabic text-3xl md:text-4xl text-primary leading-relaxed">
            {BISMILLAH}
          </p>
        </div>
      )}

      {/* Verses */}
      <div ref={versesRef} className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-primary mb-4" />
            <p className="text-muted">Loading surah...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-500 text-lg mb-2">Failed to load surah</p>
            <p className="text-muted text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          arabicVerses.map((verse, index) => {
            const translation = translationVerses[index];
            return (
              <VerseDisplay
                key={verse.numberInSurah}
                surahNumber={surahNumber}
                ayahNumber={verse.numberInSurah}
                arabicText={verse.text}
                translationText={translation?.text}
                globalAyahNumber={verse.number}
                isPlaying={audioPlayer.currentAyah === verse.numberInSurah && audioPlayer.isPlaying}
                isBookmarked={isBookmarked(surahNumber, verse.numberInSurah)}
                onPlay={() => {
                  if (audioPlayer.currentAyah === verse.numberInSurah && audioPlayer.isPlaying) {
                    audioPlayer.pause();
                  } else {
                    playVerse(verse.numberInSurah);
                  }
                }}
                onBookmark={() =>
                  toggleBookmark({
                    surahNumber,
                    ayahNumber: verse.numberInSurah,
                    surahName: surahInfo.englishName,
                    text: verse.text,
                    translation: translation?.text,
                  })
                }
              />
            );
          })
        )}
      </div>

      {/* Surah Navigation */}
      {!loading && (
        <div className="max-w-4xl mx-auto px-4 py-8 flex justify-between">
          <button
            onClick={() => surahNumber > 1 && navigate(`/surah/${surahNumber - 1}`)}
            disabled={surahNumber <= 1}
            className="flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl hover:border-primary/30 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={16} />
            <div className="text-left">
              <p className="text-xs text-muted">Previous</p>
              <p className="text-sm font-medium text-text">
                {surahNumber > 1 ? SURAHS[surahNumber - 2].englishName : ''}
              </p>
            </div>
          </button>
          <button
            onClick={() => surahNumber < 114 && navigate(`/surah/${surahNumber + 1}`)}
            disabled={surahNumber >= 114}
            className="flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl hover:border-primary/30 disabled:opacity-30 transition-all"
          >
            <div className="text-right">
              <p className="text-xs text-muted">Next</p>
              <p className="text-sm font-medium text-text">
                {surahNumber < 114 ? SURAHS[surahNumber].englishName : ''}
              </p>
            </div>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Audio Player */}
      <AudioPlayer
        isPlaying={audioPlayer.isPlaying}
        isLoading={audioPlayer.isLoading}
        currentAyah={audioPlayer.currentAyah}
        totalAyahs={surahInfo.numberOfAyahs}
        surahName={surahInfo.englishName}
        currentTime={audioPlayer.currentTime}
        duration={audioPlayer.duration}
        onPlay={() => playVerse(audioPlayer.currentAyah || 1)}
        onPause={() => audioPlayer.pause()}
        onPrevious={() => {
          if (audioPlayer.currentAyah > 1) playVerse(audioPlayer.currentAyah - 1);
        }}
        onNext={() => {
          if (audioPlayer.currentAyah < surahInfo.numberOfAyahs) playVerse(audioPlayer.currentAyah + 1);
        }}
        onSeek={(time) => audioPlayer.seek(time)}
        onClose={() => audioPlayer.stop()}
      />
    </div>
  );
}
