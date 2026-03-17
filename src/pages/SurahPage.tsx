import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Pause, Loader2, BookText, AlignJustify } from 'lucide-react';
import { getSurahWithTranslation, getSurahAudio, AyahData } from '../api/quran';
import { VerseDisplay } from '../components/VerseDisplay';
import { MushafView } from '../components/MushafView';
import { AudioPlayer } from '../components/AudioPlayer';
import { SURAHS, BISMILLAH, TRANSLATIONS, POPULAR_RECITERS, ARABIC_FONTS } from '../data/quran-metadata';
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

  const { settings, setTranslation, setReciter, setArabicFont, setMushafMode } = useSettings();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { saveLastRead } = useLastRead();
  const audioPlayer = useAudioPlayer();

  const [arabicVerses, setArabicVerses] = useState<AyahData[]>([]);
  const [translationVerses, setTranslationVerses] = useState<AyahData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<AyahData[]>([]);

  const versesRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!loading && location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
      }
    }
  }, [loading, location.hash]);

  useEffect(() => {
    if (surahInfo) {
      saveLastRead(surahNumber, 1, surahInfo.englishName);
    }
  }, [surahNumber, surahInfo, saveLastRead]);

  const loadAudio = useCallback(async () => {
    try {
      const data = await getSurahAudio(surahNumber, settings.selectedReciter);
      setAudioData(data.ayahs);
    } catch {
      // Audio loading failed silently
    }
  }, [surahNumber, settings.selectedReciter]);

  const playVerse = useCallback(async (ayahNumberInSurah: number) => {
    if (audioData.length === 0) {
      await loadAudio();
    }

    const ayah = audioData.find(a => a.numberInSurah === ayahNumberInSurah);
    if (ayah) {
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/${settings.selectedReciter}/${ayah.number}.mp3`;
      await audioPlayer.play(audioUrl, ayahNumberInSurah);
    } else {
      const globalNumber = arabicVerses.find(v => v.numberInSurah === ayahNumberInSurah)?.number;
      if (globalNumber) {
        const audioUrl = `https://cdn.islamic.network/quran/audio/128/${settings.selectedReciter}/${globalNumber}.mp3`;
        await audioPlayer.play(audioUrl, ayahNumberInSurah);
      }
    }
  }, [audioData, loadAudio, settings.selectedReciter, audioPlayer, arabicVerses]);

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
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-900 text-white">
        <div className="absolute inset-0 islamic-pattern" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 py-8">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => surahNumber > 1 && navigate(`/surah/${surahNumber - 1}`)}
              disabled={surahNumber <= 1}
              className="flex items-center gap-1 text-xs text-white/60 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <Link to="/surahs" className="text-xs text-white/60 hover:text-white transition-colors">
              All Surahs
            </Link>
            <button
              onClick={() => surahNumber < 114 && navigate(`/surah/${surahNumber + 1}`)}
              disabled={surahNumber >= 114}
              className="flex items-center gap-1 text-xs text-white/60 hover:text-white disabled:opacity-30 transition-colors"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>

          {/* Surah Info */}
          <div className="text-center animate-fade-in">
            <p className="font-arabic text-4xl md:text-5xl mb-2 leading-relaxed">{surahInfo.name}</p>
            <h1 className="text-xl md:text-2xl font-bold mb-0.5">{surahInfo.englishName}</h1>
            <p className="text-white/60 text-sm mb-3">{surahInfo.englishNameTranslation}</p>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-white/50">
              <span>{surahInfo.revelationType}</span>
              <span className="text-white/20">|</span>
              <span>{surahInfo.numberOfAyahs} verses</span>
              <span className="text-white/20">|</span>
              <span>{surahInfo.rukus} rukus</span>
              <span className="text-white/20">|</span>
              <span>Juz {surahInfo.startJuz}</span>
            </div>
          </div>

          {/* Play Button */}
          <div className="flex justify-center mt-5">
            <button
              onClick={() => {
                if (audioPlayer.isPlaying) {
                  audioPlayer.pause();
                } else {
                  playVerse(audioPlayer.currentAyah || 1);
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-xl hover:bg-white/25 transition-all duration-200 text-sm font-medium border border-white/10"
            >
              {audioPlayer.isPlaying ? <Pause size={16} /> : <Play size={16} />}
              {audioPlayer.isPlaying ? 'Pause' : 'Play Recitation'}
            </button>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="sticky top-14 z-30 glass-heavy border-b border-border/60">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center gap-1.5 overflow-x-auto">
          {/* Mushaf / Verse Toggle */}
          <div className="shrink-0 flex bg-hover/60 rounded-lg overflow-hidden border border-border/40">
            <button
              onClick={() => setMushafMode(false)}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                !settings.mushafMode ? 'bg-primary text-white' : 'text-muted hover:text-text'
              }`}
            >
              <AlignJustify size={12} /> Verses
            </button>
            <button
              onClick={() => setMushafMode(true)}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                settings.mushafMode ? 'bg-primary text-white' : 'text-muted hover:text-text'
              }`}
            >
              <BookText size={12} /> Mushaf
            </button>
          </div>

          <select
            value={settings.arabicFont}
            onChange={(e) => setArabicFont(e.target.value as any)}
            className="shrink-0 px-2.5 py-1.5 text-xs bg-hover/60 border border-border/40 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            {ARABIC_FONTS.map(f => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>

          <select
            value={settings.selectedTranslation}
            onChange={(e) => setTranslation(e.target.value)}
            className="shrink-0 px-2.5 py-1.5 text-xs bg-hover/60 border border-border/40 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
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
            className="shrink-0 px-2.5 py-1.5 text-xs bg-hover/60 border border-border/40 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
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
        <div className="text-center py-6">
          <div className="ornamental-divider max-w-md mx-auto px-4">
            <p className="font-arabic text-2xl md:text-3xl text-primary/80 leading-relaxed shrink-0">
              {BISMILLAH}
            </p>
          </div>
        </div>
      )}

      {/* Verses */}
      <div ref={versesRef}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-primary mb-3" />
            <p className="text-muted text-sm">Loading surah...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-500 text-base mb-2">Failed to load surah</p>
            <p className="text-muted text-xs mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        ) : settings.mushafMode ? (
          <MushafView
            surahInfo={surahInfo}
            arabicVerses={arabicVerses}
            translationVerses={translationVerses}
            currentPlayingAyah={audioPlayer.currentAyah}
            isPlaying={audioPlayer.isPlaying}
            onAyahClick={(ayahNum) => {
              if (audioPlayer.currentAyah === ayahNum && audioPlayer.isPlaying) {
                audioPlayer.pause();
              } else {
                playVerse(ayahNum);
              }
            }}
          />
        ) : (
          <div className="max-w-4xl mx-auto">
            {arabicVerses.map((verse, index) => {
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
            })}
          </div>
        )}
      </div>

      {/* Surah Navigation */}
      {!loading && (
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between gap-3">
          <button
            onClick={() => surahNumber > 1 && navigate(`/surah/${surahNumber - 1}`)}
            disabled={surahNumber <= 1}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border/60 rounded-xl hover:border-primary/30 disabled:opacity-30 transition-all duration-200 shadow-card card-hover"
          >
            <ChevronLeft size={14} />
            <div className="text-left">
              <p className="text-[10px] text-muted uppercase tracking-wider">Previous</p>
              <p className="text-xs font-medium text-text">
                {surahNumber > 1 ? SURAHS[surahNumber - 2].englishName : ''}
              </p>
            </div>
          </button>
          <button
            onClick={() => surahNumber < 114 && navigate(`/surah/${surahNumber + 1}`)}
            disabled={surahNumber >= 114}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border/60 rounded-xl hover:border-primary/30 disabled:opacity-30 transition-all duration-200 shadow-card card-hover"
          >
            <div className="text-right">
              <p className="text-[10px] text-muted uppercase tracking-wider">Next</p>
              <p className="text-xs font-medium text-text">
                {surahNumber < 114 ? SURAHS[surahNumber].englishName : ''}
              </p>
            </div>
            <ChevronRight size={14} />
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
