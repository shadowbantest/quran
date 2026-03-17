import React from 'react';
import { Link } from 'react-router-dom';
import { BookmarkX, Trash2, ArrowRight } from 'lucide-react';
import { useBookmarks } from '../hooks/useBookmarks';

export function BookmarksPage() {
  const { bookmarks, removeBookmark, clearAll } = useBookmarks();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text mb-1">Bookmarks</h1>
          <p className="text-sm text-muted">{bookmarks.length} saved verses</p>
        </div>
        {bookmarks.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Remove all bookmarks?')) clearAll();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/15 rounded-lg transition-colors font-medium"
          >
            <Trash2 size={12} /> Clear All
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16">
          <BookmarkX size={40} className="mx-auto text-muted/20 mb-3" />
          <p className="text-muted text-base mb-1">No bookmarks yet</p>
          <p className="text-muted/50 text-xs mb-5">
            Bookmark verses while reading to save them here
          </p>
          <Link
            to="/surahs"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors text-sm font-medium"
          >
            Start Reading
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {bookmarks
            .sort((a, b) => b.timestamp - a.timestamp)
            .map(bookmark => (
              <div
                key={bookmark.id}
                className="bg-surface border border-border/60 rounded-xl p-4 group shadow-card card-hover"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    to={`/surah/${bookmark.surahNumber}#verse-${bookmark.ayahNumber}`}
                    className="flex-1 min-w-0"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 bg-primary/8 text-primary rounded-lg flex items-center justify-center text-[10px] font-bold">
                        {bookmark.surahNumber}:{bookmark.ayahNumber}
                      </div>
                      <span className="text-xs font-medium text-text">{bookmark.surahName}</span>
                      <ArrowRight size={12} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="font-arabic text-base text-text/80 leading-relaxed mb-1.5 line-clamp-2" dir="rtl">
                      {bookmark.text}
                    </p>
                    {bookmark.translation && (
                      <p className="text-xs text-muted line-clamp-2 leading-relaxed">{bookmark.translation}</p>
                    )}
                  </Link>
                  <button
                    onClick={() => removeBookmark(bookmark.surahNumber, bookmark.ayahNumber)}
                    className="p-1.5 text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/15 rounded-lg transition-colors shrink-0"
                    title="Remove bookmark"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <p className="text-[10px] text-muted/40 mt-2">
                  {new Date(bookmark.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
