import React, { createContext, useContext } from 'react';
import { useTheme, type Theme } from '~/hooks/useTheme';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeState = useTheme();

  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      'useThemeContext must be used within a ThemeProvider',
    );
  }
  return context;
}

// For backward compatibility, also export the original hook
export { useTheme } from '~/hooks/useTheme';
export type { Theme } from '~/hooks/useTheme';
