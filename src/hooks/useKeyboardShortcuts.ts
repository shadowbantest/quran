import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ShortcutHandlers {
  onPlayPause?: () => void;
  onNextVerse?: () => void;
  onPrevVerse?: () => void;
  onNextSurah?: () => void;
  onPrevSurah?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers = {}) {
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger shortcuts when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      switch (e.key) {
        case '/':
          e.preventDefault();
          navigate('/search');
          // Focus search input after navigation
          setTimeout(() => {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            input?.focus();
          }, 100);
          break;
        case ' ':
          if (handlers.onPlayPause) {
            e.preventDefault();
            handlers.onPlayPause();
          }
          break;
        case 'j':
        case 'ArrowDown':
          if (handlers.onNextVerse) {
            e.preventDefault();
            handlers.onNextVerse();
          }
          break;
        case 'k':
        case 'ArrowUp':
          if (handlers.onPrevVerse) {
            e.preventDefault();
            handlers.onPrevVerse();
          }
          break;
        case 'ArrowRight':
          if (handlers.onNextSurah) {
            e.preventDefault();
            handlers.onNextSurah();
          }
          break;
        case 'ArrowLeft':
          if (handlers.onPrevSurah) {
            e.preventDefault();
            handlers.onPrevSurah();
          }
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, handlers.onPlayPause, handlers.onNextVerse, handlers.onPrevVerse, handlers.onNextSurah, handlers.onPrevSurah]);
}
