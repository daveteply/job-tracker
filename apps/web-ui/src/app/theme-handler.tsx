'use client';

import { useEffect } from 'react';

import { useUserSettings } from '@job-tracker/hooks';

export function ThemeHandler() {
  const { settings } = useUserSettings();

  useEffect(() => {
    if (!settings?.appearance) return;

    const root = document.documentElement;
    const appearance = settings.appearance;

    const applyTheme = (theme: 'light' | 'dark') => {
      root.setAttribute('data-theme', theme);
    };

    if (appearance === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };

      handleChange(mediaQuery);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      applyTheme(appearance);
    }
  }, [settings?.appearance]);

  return null;
}
