import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system');

  // Get the system preference
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }, []);

  // Get the actual applied theme (resolving 'system' to 'light' or 'dark')
  const getResolvedTheme = useCallback((): 'light' | 'dark' => {
    return theme === 'system' ? getSystemTheme() : theme;
  }, [theme, getSystemTheme]);

  // Apply the theme to the document
  const applyTheme = useCallback(
    (resolvedTheme: 'light' | 'dark') => {
      const root = window.document.documentElement;

      // Remove both classes first
      root.classList.remove('light', 'dark');

      // Add the appropriate class
      root.classList.add(resolvedTheme);

      // Set color-scheme for better browser integration
      root.style.colorScheme = resolvedTheme;
    },
    [],
  );

  // Set theme and persist to localStorage
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        if (newTheme === 'system') {
          localStorage.removeItem('fridgevision-theme');
        } else {
          localStorage.setItem('fridgevision-theme', newTheme);
        }
      }

      // Apply the resolved theme immediately
      const resolvedTheme =
        newTheme === 'system' ? getSystemTheme() : newTheme;
      applyTheme(resolvedTheme);
    },
    [applyTheme, getSystemTheme],
  );

  // Toggle between light and dark (skip system)
  const toggleTheme = useCallback(() => {
    const currentResolved = getResolvedTheme();
    setTheme(currentResolved === 'light' ? 'dark' : 'light');
  }, [getResolvedTheme, setTheme]);

  // Initialize theme from localStorage and system preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Get stored theme or default to system
    const stored = localStorage.getItem(
      'fridgevision-theme',
    ) as Theme;
    const initialTheme =
      stored && ['light', 'dark', 'system'].includes(stored)
        ? stored
        : 'system';

    setThemeState(initialTheme);

    // Apply the resolved theme
    const resolvedTheme =
      initialTheme === 'system' ? getSystemTheme() : initialTheme;
    applyTheme(resolvedTheme);
  }, [applyTheme, getSystemTheme]);

  // Listen for system theme changes when theme is set to 'system'
  useEffect(() => {
    if (typeof window === 'undefined' || theme !== 'system') return;

    const mediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)',
    );

    const handleChange = () => {
      if (theme === 'system') {
        applyTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme, applyTheme, getSystemTheme]);

  return {
    theme,
    resolvedTheme: getResolvedTheme(),
    setTheme,
    toggleTheme,
  };
}
