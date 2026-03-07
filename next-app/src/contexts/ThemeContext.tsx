"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
  backgroundSecondary: string;
  textPrimary: string;
  textSecondary: string;
  textOnPrimary: string;
  textOnPrimarySecondary: string;
  cardBg: string;
  cardBorder: string;
  cardText: string;
  cardTextSecondary: string;
  shadow: string;
  overlay: string;
}

interface Theme {
  id: string;
  name: string;
  icon: string;
  colors: ThemeColors;
}

interface ThemeContextType {
  currentTheme: string;
  theme: Theme;
  changeTheme: (themeId: string) => void;
  availableThemes: Theme[];
}

export const THEMES: Record<string, Theme> = {
  light: {
    id: 'light',
    name: 'Light',
    icon: '☀️',
    colors: {
      primary: '#667eea', accent: '#764ba2', background: 'linear-gradient(to right, #fef9f3, #ede7f6)',
      backgroundSecondary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', textPrimary: '#2d3748',
      textSecondary: 'rgba(45, 55, 72, 0.8)', textOnPrimary: '#ffffff', textOnPrimarySecondary: 'rgba(255, 255, 255, 0.9)',
      cardBg: 'rgba(255, 255, 255, 0.95)', cardBorder: 'rgba(102, 126, 234, 0.3)', cardText: '#2d3748',
      cardTextSecondary: '#718096', shadow: 'rgba(0, 0, 0, 0.2)', overlay: 'rgba(0, 0, 0, 0.1)',
    }
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    icon: '🌙',
    colors: {
      primary: '#4a5568', accent: '#2d3748', background: 'linear-gradient(to right, #0a0a0a, #1a1a2e)',
      backgroundSecondary: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)', textPrimary: '#f7fafc',
      textSecondary: 'rgba(247, 250, 252, 0.7)', textOnPrimary: '#ffffff', textOnPrimarySecondary: 'rgba(255, 255, 255, 0.85)',
      cardBg: 'rgba(26, 32, 44, 0.95)', cardBorder: 'rgba(255, 255, 255, 0.1)', cardText: '#f7fafc',
      cardTextSecondary: 'rgba(247, 250, 252, 0.7)', shadow: 'rgba(0, 0, 0, 0.5)', overlay: 'rgba(0, 0, 0, 0.3)',
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Blue',
    icon: '🌊',
    colors: {
      primary: '#0ea5e9', accent: '#06b6d4', background: 'linear-gradient(to right, #0c1b2e, #1e3a5f)',
      backgroundSecondary: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', textPrimary: '#e0f2fe',
      textSecondary: 'rgba(224, 242, 254, 0.8)', textOnPrimary: '#ffffff', textOnPrimarySecondary: 'rgba(255, 255, 255, 0.95)',
      cardBg: 'rgba(8, 47, 73, 0.95)', cardBorder: 'rgba(14, 165, 233, 0.3)', cardText: '#e0f2fe',
      cardTextSecondary: 'rgba(224, 242, 254, 0.8)', shadow: 'rgba(6, 182, 212, 0.3)', overlay: 'rgba(14, 165, 233, 0.15)',
    }
  },
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('theme');
    return saved && THEMES[saved] ? saved : 'light';
  });

  useEffect(() => {
    const theme = THEMES[currentTheme];
    const root = document.documentElement;
    const colors = theme.colors;
    
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--bg-primary', colors.background);
    root.style.setProperty('--bg-secondary', colors.backgroundSecondary);
    root.style.setProperty('--text-primary', colors.textPrimary);
    root.style.setProperty('--text-secondary', colors.textSecondary);
    root.style.setProperty('--text-on-primary', colors.textOnPrimary);
    root.style.setProperty('--text-on-primary-secondary', colors.textOnPrimarySecondary);
    root.style.setProperty('--card-bg', colors.cardBg);
    root.style.setProperty('--card-border', colors.cardBorder);
    root.style.setProperty('--card-text', colors.cardText);
    root.style.setProperty('--card-text-secondary', colors.cardTextSecondary);
    root.style.setProperty('--shadow', colors.shadow);
    root.style.setProperty('--overlay', colors.overlay);

    root.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeId: string) => { if (THEMES[themeId]) setCurrentTheme(themeId); };

  return (
    <ThemeContext.Provider value={{
      currentTheme, theme: THEMES[currentTheme], changeTheme, availableThemes: Object.values(THEMES)
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
