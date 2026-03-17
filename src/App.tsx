import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Loader2 } from 'lucide-react';

// Code-split all pages
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const SurahListPage = lazy(() => import('./pages/SurahListPage').then(m => ({ default: m.SurahListPage })));
const SurahPage = lazy(() => import('./pages/SurahPage').then(m => ({ default: m.SurahPage })));
const SearchPage = lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));
const BookmarksPage = lazy(() => import('./pages/BookmarksPage').then(m => ({ default: m.BookmarksPage })));
const JuzPage = lazy(() => import('./pages/JuzPage').then(m => ({ default: m.JuzPage })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24" role="status">
      <Loader2 size={24} className="animate-spin text-primary" aria-hidden="true" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <BrowserRouter>
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/surahs" element={<SurahListPage />} />
                  <Route path="/surah/:number" element={<SurahPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/bookmarks" element={<BookmarksPage />} />
                  <Route path="/juz" element={<JuzPage />} />
                </Routes>
              </ErrorBoundary>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </SettingsProvider>
    </ErrorBoundary>
  );
}
