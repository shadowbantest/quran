import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, Search, Bookmark, Settings, Menu, X, Home, Layers, Moon, Sun, Type } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { ARABIC_FONTS } from '../data/quran-metadata';

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();
  const { settings, setTheme, setFontSize, setArabicFontSize, setArabicFont, setMushafMode, updateSettings } = useSettings();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/surahs', icon: Book, label: 'Surahs' },
    { path: '/juz', icon: Layers, label: 'Juz' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-bg text-text transition-colors duration-300">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-hover transition-colors"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-arabic text-lg">قـ</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-text leading-tight">Al-Quran</h1>
                <p className="text-[10px] text-muted leading-none">The Noble Quran</p>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-primary text-white shadow-md'
                    : 'text-muted hover:text-text hover:bg-hover'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(settings.theme === 'dark' ? 'light' : settings.theme === 'light' ? 'sepia' : 'dark')}
              className="p-2 rounded-lg hover:bg-hover transition-colors"
              title="Toggle theme"
            >
              {settings.theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="p-2 rounded-lg hover:bg-hover transition-colors"
              title="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-surface shadow-xl pt-20 px-4">
            <nav className="space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-muted hover:text-text hover:bg-hover'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSettingsOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-surface shadow-xl pt-20 px-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Settings</h2>
              <button onClick={() => setSettingsOpen(false)} className="p-1 hover:bg-hover rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Theme */}
              <div>
                <label className="text-sm font-medium text-muted mb-2 block">Theme</label>
                <div className="flex gap-2">
                  {(['light', 'dark', 'sepia'] as const).map(theme => (
                    <button
                      key={theme}
                      onClick={() => setTheme(theme)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm capitalize transition-all ${
                        settings.theme === theme ? 'bg-primary text-white' : 'bg-hover text-text'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Sizes */}
              <div>
                <label className="text-sm font-medium text-muted mb-2 flex items-center gap-2">
                  <Type size={14} /> Arabic Font Size
                </label>
                <div className="flex gap-2">
                  {(['small', 'medium', 'large', 'xlarge'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => setArabicFontSize(size)}
                      className={`flex-1 py-2 px-2 rounded-lg text-xs capitalize transition-all ${
                        settings.arabicFontSize === size ? 'bg-primary text-white' : 'bg-hover text-text'
                      }`}
                    >
                      {size === 'xlarge' ? 'XL' : size.charAt(0).toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted mb-2 flex items-center gap-2">
                  <Type size={14} /> Translation Font Size
                </label>
                <div className="flex gap-2">
                  {(['small', 'medium', 'large', 'xlarge'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`flex-1 py-2 px-2 rounded-lg text-xs capitalize transition-all ${
                        settings.fontSize === size ? 'bg-primary text-white' : 'bg-hover text-text'
                      }`}
                    >
                      {size === 'xlarge' ? 'XL' : size.charAt(0).toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Arabic Font */}
              <div>
                <label className="text-sm font-medium text-muted mb-2 block">Arabic Font</label>
                <select
                  value={settings.arabicFont}
                  onChange={(e) => setArabicFont(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-hover border-none rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  {ARABIC_FONTS.map(f => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
                <p className="text-xs text-muted mt-1.5 font-arabic" style={{ fontFamily: ARABIC_FONTS.find(f => f.id === settings.arabicFont)?.family }}>
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                </p>
              </div>

              {/* Reading Mode */}
              <div>
                <label className="text-sm font-medium text-muted mb-2 block">Reading Mode</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMushafMode(false)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all ${
                      !settings.mushafMode ? 'bg-primary text-white' : 'bg-hover text-text'
                    }`}
                  >
                    Verse by Verse
                  </button>
                  <button
                    onClick={() => setMushafMode(true)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all ${
                      settings.mushafMode ? 'bg-primary text-white' : 'bg-hover text-text'
                    }`}
                  >
                    Mushaf
                  </button>
                </div>
              </div>

              {/* Display Options */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted block">Display</label>
                {([
                  { key: 'showArabic', label: 'Show Arabic Text' },
                  { key: 'showTranslation', label: 'Show Translation' },
                  { key: 'showTransliteration', label: 'Show Transliteration' },
                ] as const).map(option => (
                  <label key={option.key} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm">{option.label}</span>
                    <div
                      onClick={() => updateSettings({ [option.key]: !settings[option.key] })}
                      className={`w-10 h-6 rounded-full transition-colors cursor-pointer flex items-center ${
                        settings[option.key] ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${
                          settings[option.key] ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted text-sm">
            Al-Quran - Read, Listen & Study the Holy Quran
          </p>
          <p className="text-muted/60 text-xs mt-2">
            Quran text from Tanzil.net | API by AlQuran.cloud
          </p>
        </div>
      </footer>
    </div>
  );
}
