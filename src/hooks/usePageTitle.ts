import { useEffect } from 'react';

const BASE_TITLE = 'Al-Quran';

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : `${BASE_TITLE} - Read, Listen & Study the Holy Quran`;
    return () => {
      document.title = `${BASE_TITLE} - Read, Listen & Study the Holy Quran`;
    };
  }, [title]);
}
