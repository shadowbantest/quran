import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, Search, Bookmark, Settings, Menu, X, Home, Layers, Moon, Sun, CloudMoon, Type } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { ARABIC_FONTS } from '../data/quran-metadata';

export function Layout({ children }: { children: React.ReactNode }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();
  const { settings, setTheme, setFontSize, setArabicFontSize, setArabicFont, setMushafMode, updateSettings } = useSettings();

  // Close settings on route change
  useEffect(() => {
    setSettingsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/surahs', icon: Book, label: 'Surahs' },
    { path: '/juz', icon: Layers, label: 'Juz' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/bookmarks', icon: Bookmark, label: 'Saved' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const themeIcon = settings.theme === 'dark' ? <Moon size={18} /> : settings.theme === 'sepia' ? <CloudMoon size={18} /> : <Sun size={18} />;

  return (
    <div className="min-h-screen bg-bg text-text transition-colors duration-300">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-heavy border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-glow transition-shadow duration-300">
              <span className="text-white font-arabic text-base leading-none">قـ</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-text leading-tight tracking-tight">Al-Quran</h1>
              <p className="text-[10px] text-muted leading-none">The Noble Quran</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted hover:text-text hover:bg-hover'
                }`}
              >
                <item.icon size={15} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setTheme(settings.theme === 'dark' ? 'light' : settings.theme === 'light' ? 'sepia' : 'dark')}
              className="p-2 rounded-lg hover:bg-hover transition-colors text-muted hover:text-text"
              title={`Theme: ${settings.theme}`}
            >
              {themeIcon}
            </button>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`p-2 rounded-lg transition-colors ${settingsOpen ? 'bg-primary/10 text-primary' : 'text-muted hover:text-text hover:bg-hover'}`}
              title="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Panel Overlay */}
      {settingsOpen && (
        <div className="fixed inset-0 z-[60]" onClick={() => setSettingsOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        </div>
      )}

      {/* Settings Panel */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] z-[70] glass-heavy shadow-2xl transition-transform duration-300 ease-out ${
          settingsOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto pt-16 px-5 pb-8">
          <div className="flex items-center justify-between mb-6 pt-2">
            <h2 className="text-base font-bold">Settings</h2>
            <button onClick={() => setSettingsOpen(false)} className="p-1.5 hover:bg-hover rounded-lg transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-5">
            {/* Theme */}
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Theme</label>
              <div className="flex gap-1.5">
                {([
                  { key: 'light' as const, label: 'Light', icon: <Sun size={14} /> },
                  { key: 'dark' as const, label: 'Dark', icon: <Moon size={14} /> },
                  { key: 'sepia' as const, label: 'Sepia', icon: <CloudMoon size={14} /> },
                ]).map(theme => (
                  <button
                    key={theme.key}
                    onClick={() => setTheme(theme.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      settings.theme === theme.key
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-hover text-text hover:bg-border/50'
                    }`}
                  >
                    {theme.icon}
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Arabic Font Size */}
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Type size={12} /> Arabic Size
              </label>
              <div className="flex gap-1.5">
                {(['small', 'medium', 'large', 'xlarge'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setArabicFontSize(size)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      settings.arabicFontSize === size
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-hover text-text hover:bg-border/50'
                    }`}
                  >
                    {size === 'xlarge' ? 'XL' : size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Translation Font Size */}
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Type size={12} /> Translation Size
              </label>
              <div className="flex gap-1.5">
                {(['small', 'medium', 'large', 'xlarge'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      settings.fontSize === size
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-hover text-text hover:bg-border/50'
                    }`}
                  >
                    {size === 'xlarge' ? 'XL' : size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Arabic Font */}
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Arabic Font</label>
              <select
                value={settings.arabicFont}
                onChange={(e) => setArabicFont(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-hover border border-border/50 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer transition-all"
              >
                {ARABIC_FONTS.map(f => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
              <p className="text-base text-muted mt-2 font-arabic text-center py-1" style={{ fontFamily: ARABIC_FONTS.find(f => f.id === settings.arabicFont)?.family }}>
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </p>
            </div>

            {/* Reading Mode */}
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Reading Mode</label>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setMushafMode(false)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                    !settings.mushafMode
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-hover text-text hover:bg-border/50'
                  }`}
                >
                  Verse by Verse
                </button>
                <button
                  onClick={() => setMushafMode(true)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                    settings.mushafMode
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-hover text-text hover:bg-border/50'
                  }`}
                >
                  Mushaf
                </button>
              </div>
            </div>

            {/* Display Toggles */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider block">Display</label>
              {([
                { key: 'showArabic', label: 'Arabic Text' },
                { key: 'showTranslation', label: 'Translation' },
                { key: 'showTransliteration', label: 'Transliteration' },
              ] as const).map(option => (
                <label key={option.key} className="flex items-center justify-between cursor-pointer py-1">
                  <span className="text-sm">{option.label}</span>
                  <div
                    onClick={() => updateSettings({ [option.key]: !settings[option.key] })}
                    className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer ${
                      settings[option.key] ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
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

      {/* Main Content */}
      <main className="pt-14 pb-16 lg:pb-0 min-h-screen">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass-heavy border-t border-border/60">
        <div className="flex items-center justify-around h-14 px-2">
          {navItems.map(item => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-all duration-200 min-w-[48px] ${
                  active
                    ? 'text-primary'
                    : 'text-muted'
                }`}
              >
                <item.icon size={active ? 20 : 18} strokeWidth={active ? 2.5 : 2} />
                <span className={`text-[10px] leading-none ${active ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer - hidden on mobile since we have bottom nav */}
      <footer className="hidden lg:block bg-surface/50 border-t border-border/50 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted/70 text-xs">
            Al-Quran &middot; Quran text from Tanzil.net &middot; API by AlQuran.cloud
          </p>
        </div>
      </footer>
    </div>
  );
}
