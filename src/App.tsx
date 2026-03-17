import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { SurahListPage } from './pages/SurahListPage';
import { SurahPage } from './pages/SurahPage';
import { SearchPage } from './pages/SearchPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { JuzPage } from './pages/JuzPage';

export default function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/surahs" element={<SurahListPage />} />
            <Route path="/surah/:number" element={<SurahPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/juz" element={<JuzPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </SettingsProvider>
  );
}
