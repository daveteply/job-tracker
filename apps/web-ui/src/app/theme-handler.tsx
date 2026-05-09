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

      // Update PWA theme-color meta tag to match the user's selected theme
      const color = theme === 'light' ? '#ffffff' : '#1d232a';
      let meta = document.querySelector('meta[name="theme-color"]');

      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'theme-color');
        document.head.appendChild(meta);
      }

      meta.setAttribute('content', color);
    };

    let cleanup: (() => void) | undefined;

    if (appearance === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };

      handleChange(mediaQuery);
      mediaQuery.addEventListener('change', handleChange);
      cleanup = () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      applyTheme(appearance);
    }

    return cleanup;
  }, [settings?.appearance]);

  return null;
}
