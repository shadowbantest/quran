import React from 'react';
import { Link } from 'react-router-dom';
import { BookmarkX, Trash2, ArrowRight } from 'lucide-react';
import { useBookmarks } from '../hooks/useBookmarks';

export function BookmarksPage() {
  const { bookmarks, removeBookmark, clearAll } = useBookmarks();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Bookmarks</h1>
          <p className="text-muted">{bookmarks.length} saved verses</p>
        </div>
        {bookmarks.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Remove all bookmarks?')) clearAll();
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 size={14} /> Clear All
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16">
          <BookmarkX size={48} className="mx-auto text-muted/30 mb-4" />
          <p className="text-muted text-lg mb-2">No bookmarks yet</p>
          <p className="text-muted/60 text-sm mb-6">
            Bookmark verses while reading to save them here
          </p>
          <Link
            to="/surahs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
          >
            Start Reading
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks
            .sort((a, b) => b.timestamp - a.timestamp)
            .map(bookmark => (
              <div
                key={bookmark.id}
                className="bg-surface border border-border rounded-xl p-5 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    to={`/surah/${bookmark.surahNumber}#verse-${bookmark.ayahNumber}`}
                    className="flex-1 min-w-0"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-xs font-bold">
                        {bookmark.surahNumber}:{bookmark.ayahNumber}
                      </div>
                      <span className="text-sm font-medium text-text">{bookmark.surahName}</span>
                      <ArrowRight size={14} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="font-arabic text-lg text-text leading-relaxed mb-2 line-clamp-2" dir="rtl">
                      {bookmark.text}
                    </p>
                    {bookmark.translation && (
                      <p className="text-sm text-muted line-clamp-2">{bookmark.translation}</p>
                    )}
                  </Link>
                  <button
                    onClick={() => removeBookmark(bookmark.surahNumber, bookmark.ayahNumber)}
                    className="p-2 text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"
                    title="Remove bookmark"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-xs text-muted/50 mt-2">
                  {new Date(bookmark.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
