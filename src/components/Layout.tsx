import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, Search, Bookmark, Settings, X, Home, Layers, Moon, Sun, CloudMoon, Type } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { ARABIC_FONTS } from '../data/quran-metadata';

export function Layout({ children }: { children: React.ReactNode }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();
  const { settings, setTheme, setFontSize, setArabicFontSize, setArabicFont, setMushafMode, updateSettings } = useSettings();
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);

  // Close settings on route change
  useEffect(() => {
    setSettingsOpen(false);
  }, [location.pathname]);

  // ESC to close settings + focus trap
  useEffect(() => {
    if (!settingsOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSettingsOpen(false);
        settingsButtonRef.current?.focus();
      }

      // Focus trap
      if (e.key === 'Tab' && settingsPanelRef.current) {
        const focusable = settingsPanelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    // Focus the close button when settings opens
    const closeBtn = settingsPanelRef.current?.querySelector<HTMLElement>('button');
    closeBtn?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settingsOpen]);

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
  const themeLabel = `Switch theme (current: ${settings.theme})`;

  return (
    <div className="min-h-screen bg-bg text-text transition-colors duration-300">
      {/* Skip to content */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-heavy border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="Al-Quran Home">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center shadow-sm" aria-hidden="true">
              <span className="text-white font-arabic text-base leading-none">قـ</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold text-text leading-tight tracking-tight block">Al-Quran</span>
              <span className="text-[10px] text-muted leading-none block">The Noble Quran</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive(item.path) ? 'page' : undefined}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted hover:text-text hover:bg-hover'
                }`}
              >
                <item.icon size={15} aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setTheme(settings.theme === 'dark' ? 'light' : settings.theme === 'light' ? 'sepia' : 'dark')}
              className="p-2 rounded-lg hover:bg-hover transition-colors text-muted hover:text-text"
              aria-label={themeLabel}
            >
              {themeIcon}
            </button>
            <button
              ref={settingsButtonRef}
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`p-2 rounded-lg transition-colors ${settingsOpen ? 'bg-primary/10 text-primary' : 'text-muted hover:text-text hover:bg-hover'}`}
              aria-label="Open settings"
              aria-expanded={settingsOpen}
              aria-controls="settings-panel"
            >
              <Settings size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Panel Overlay */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
          onClick={() => setSettingsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Settings Panel */}
      <aside
        id="settings-panel"
        ref={settingsPanelRef}
        role="dialog"
        aria-modal={settingsOpen}
        aria-label="Settings"
        className={`fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] z-[70] glass-heavy shadow-2xl transition-transform duration-300 ease-out ${
          settingsOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        tabIndex={-1}
      >
        <div className="h-full overflow-y-auto pt-16 px-5 pb-8">
          <div className="flex items-center justify-between mb-6 pt-2">
            <h2 className="text-base font-bold" id="settings-title">Settings</h2>
            <button
              onClick={() => {
                setSettingsOpen(false);
                settingsButtonRef.current?.focus();
              }}
              className="p-1.5 hover:bg-hover rounded-lg transition-colors"
              aria-label="Close settings"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-5">
            {/* Theme */}
            <fieldset>
              <legend className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Theme</legend>
              <div className="flex gap-1.5" role="radiogroup" aria-label="Theme selection">
                {([
                  { key: 'light' as const, label: 'Light', icon: <Sun size={14} aria-hidden="true" /> },
                  { key: 'dark' as const, label: 'Dark', icon: <Moon size={14} aria-hidden="true" /> },
                  { key: 'sepia' as const, label: 'Sepia', icon: <CloudMoon size={14} aria-hidden="true" /> },
                ]).map(theme => (
                  <button
                    key={theme.key}
                    onClick={() => setTheme(theme.key)}
                    role="radio"
                    aria-checked={settings.theme === theme.key}
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
            </fieldset>

            {/* Arabic Font Size */}
            <fieldset>
              <legend className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                <Type size={12} className="inline mr-1" aria-hidden="true" />Arabic Size
              </legend>
              <div className="flex gap-1.5" role="radiogroup" aria-label="Arabic font size">
                {(['small', 'medium', 'large', 'xlarge'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setArabicFontSize(size)}
                    role="radio"
                    aria-checked={settings.arabicFontSize === size}
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
            </fieldset>

            {/* Translation Font Size */}
            <fieldset>
              <legend className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                <Type size={12} className="inline mr-1" aria-hidden="true" />Translation Size
              </legend>
              <div className="flex gap-1.5" role="radiogroup" aria-label="Translation font size">
                {(['small', 'medium', 'large', 'xlarge'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    role="radio"
                    aria-checked={settings.fontSize === size}
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
            </fieldset>

            {/* Arabic Font */}
            <div>
              <label htmlFor="arabic-font-select" className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Arabic Font</label>
              <select
                id="arabic-font-select"
                value={settings.arabicFont}
                onChange={(e) => setArabicFont(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-hover border border-border/50 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer transition-all"
              >
                {ARABIC_FONTS.map(f => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
              <p className="text-base text-muted mt-2 font-arabic text-center py-1" style={{ fontFamily: ARABIC_FONTS.find(f => f.id === settings.arabicFont)?.family }} dir="rtl" aria-label="Font preview">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </p>
            </div>

            {/* Reading Mode */}
            <fieldset>
              <legend className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Reading Mode</legend>
              <div className="flex gap-1.5" role="radiogroup" aria-label="Reading mode">
                <button
                  onClick={() => setMushafMode(false)}
                  role="radio"
                  aria-checked={!settings.mushafMode}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                    !settings.mushafMode ? 'bg-primary text-white shadow-sm' : 'bg-hover text-text hover:bg-border/50'
                  }`}
                >
                  Verse by Verse
                </button>
                <button
                  onClick={() => setMushafMode(true)}
                  role="radio"
                  aria-checked={settings.mushafMode}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                    settings.mushafMode ? 'bg-primary text-white shadow-sm' : 'bg-hover text-text hover:bg-border/50'
                  }`}
                >
                  Mushaf
                </button>
              </div>
            </fieldset>

            {/* Display Toggles */}
            <fieldset className="space-y-2.5">
              <legend className="text-xs font-semibold text-muted uppercase tracking-wider">Display</legend>
              {([
                { key: 'showArabic', label: 'Arabic Text' },
                { key: 'showTranslation', label: 'Translation' },
                { key: 'showTransliteration', label: 'Transliteration' },
              ] as const).map(option => (
                <div key={option.key} className="flex items-center justify-between py-1">
                  <label htmlFor={`toggle-${option.key}`} className="text-sm cursor-pointer">{option.label}</label>
                  <button
                    id={`toggle-${option.key}`}
                    role="switch"
                    aria-checked={settings[option.key]}
                    onClick={() => updateSettings({ [option.key]: !settings[option.key] })}
                    className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                      settings[option.key] ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        settings[option.key] ? 'translate-x-4' : 'translate-x-0'
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              ))}
            </fieldset>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main id="main-content" className="pt-14 pb-16 lg:pb-0 min-h-screen" tabIndex={-1}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass-heavy border-t border-border/60" aria-label="Mobile navigation">
        <div className="flex items-center justify-around h-14 px-2">
          {navItems.map(item => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={active ? 'page' : undefined}
                aria-label={item.label}
                className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-all duration-200 min-w-[48px] min-h-[44px] ${
                  active ? 'text-primary' : 'text-muted'
                }`}
              >
                <item.icon size={active ? 20 : 18} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
                <span className={`text-[10px] leading-none ${active ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <footer className="hidden lg:block bg-surface/50 border-t border-border/50 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted/70 text-xs">
            Al-Quran &middot; Arabic text via AlQuran.cloud (Uthmanic script) &middot; Audio via Islamic Network
          </p>
        </div>
      </footer>
    </div>
  );
}
