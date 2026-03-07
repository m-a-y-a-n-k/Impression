import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Define 8 beautiful color themes
export const THEMES = {
  light: {
    id: 'light',
    name: 'Light',
    icon: '☀️',
    colors: {
      primary: '#667eea',
      accent: '#764ba2',
      background: 'linear-gradient(to right, #fef9f3, #ede7f6)',
      backgroundSecondary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textPrimary: '#2d3748',
      textSecondary: 'rgba(45, 55, 72, 0.8)',
      textOnPrimary: '#ffffff',
      textOnPrimarySecondary: 'rgba(255, 255, 255, 0.9)',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      cardBorder: 'rgba(102, 126, 234, 0.3)',
      cardText: '#2d3748',
      cardTextSecondary: '#718096',
      shadow: 'rgba(0, 0, 0, 0.2)',
      overlay: 'rgba(0, 0, 0, 0.1)',
    }
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    icon: '🌙',
    colors: {
      primary: '#4a5568',
      accent: '#2d3748',
      background: 'linear-gradient(to right, #0a0a0a, #1a1a2e)',
      backgroundSecondary: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
      textPrimary: '#f7fafc',
      textSecondary: 'rgba(247, 250, 252, 0.7)',
      textOnPrimary: '#ffffff',
      textOnPrimarySecondary: 'rgba(255, 255, 255, 0.85)',
      cardBg: 'rgba(26, 32, 44, 0.95)',
      cardBorder: 'rgba(255, 255, 255, 0.1)',
      cardText: '#f7fafc',
      cardTextSecondary: 'rgba(247, 250, 252, 0.7)',
      shadow: 'rgba(0, 0, 0, 0.5)',
      overlay: 'rgba(0, 0, 0, 0.3)',
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Blue',
    icon: '🌊',
    colors: {
      primary: '#0ea5e9',
      accent: '#06b6d4',
      background: 'linear-gradient(to right, #0c1b2e, #1e3a5f)',
      backgroundSecondary: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
      textPrimary: '#e0f2fe',
      textSecondary: 'rgba(224, 242, 254, 0.8)',
      textOnPrimary: '#ffffff',
      textOnPrimarySecondary: 'rgba(255, 255, 255, 0.95)',
      cardBg: 'rgba(8, 47, 73, 0.95)',
      cardBorder: 'rgba(14, 165, 233, 0.3)',
      cardText: '#e0f2fe',
      cardTextSecondary: 'rgba(224, 242, 254, 0.8)',
      shadow: 'rgba(6, 182, 212, 0.3)',
      overlay: 'rgba(14, 165, 233, 0.15)',
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Orange',
    icon: '🌅',
    colors: {
      primary: '#f97316',
      accent: '#fb923c',
      background: 'linear-gradient(to right, #2e1306, #4a1a0a)',
      backgroundSecondary: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
      textPrimary: '#fff7ed',
      textSecondary: 'rgba(255, 247, 237, 0.8)',
      textOnPrimary: '#ffffff',
      textOnPrimarySecondary: 'rgba(255, 255, 255, 0.95)',
      cardBg: 'rgba(67, 20, 7, 0.95)',
      cardBorder: 'rgba(249, 115, 22, 0.3)',
      cardText: '#fff7ed',
      cardTextSecondary: 'rgba(255, 247, 237, 0.8)',
      shadow: 'rgba(251, 146, 60, 0.3)',
      overlay: 'rgba(249, 115, 22, 0.15)',
    }
  },
  forest: {
    id: 'forest',
    name: 'Forest Green',
    icon: '🌲',
    colors: {
      primary: '#10b981',
      accent: '#34d399',
      background: 'linear-gradient(to right, #0a2e1a, #14532d)',
      backgroundSecondary: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      textPrimary: '#ecfdf5',
      textSecondary: 'rgba(236, 253, 245, 0.8)',
      textOnPrimary: '#ffffff',
      textOnPrimarySecondary: 'rgba(255, 255, 255, 0.95)',
      cardBg: 'rgba(20, 83, 45, 0.95)',
      cardBorder: 'rgba(16, 185, 129, 0.3)',
      cardText: '#ecfdf5',
      cardTextSecondary: 'rgba(236, 253, 245, 0.8)',
      shadow: 'rgba(52, 211, 153, 0.3)',
      overlay: 'rgba(16, 185, 129, 0.15)',
    }
  },
  royal: {
    id: 'royal',
    name: 'Royal Purple',
    icon: '👑',
    colors: {
      primary: '#a855f7',
      accent: '#c084fc',
      background: 'linear-gradient(to right, #1e0a33, #3b0764)',
      backgroundSecondary: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)',
      textPrimary: '#faf5ff',
      textSecondary: 'rgba(250, 245, 255, 0.8)',
      textOnPrimary: '#ffffff',
      textOnPrimarySecondary: 'rgba(255, 255, 255, 0.95)',
      cardBg: 'rgba(59, 7, 100, 0.95)',
      cardBorder: 'rgba(168, 85, 247, 0.3)',
      cardText: '#faf5ff',
      cardTextSecondary: 'rgba(250, 245, 255, 0.8)',
      shadow: 'rgba(192, 132, 252, 0.3)',
      overlay: 'rgba(168, 85, 247, 0.15)',
    }
  },
  rose: {
    id: 'rose',
    name: 'Rose Pink',
    icon: '🌹',
    colors: {
      primary: '#ec4899',
      accent: '#f472b6',
      background: 'linear-gradient(to right, #2e0a1e, #4a0d2e)',
      backgroundSecondary: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
      textPrimary: '#fdf2f8',
      textSecondary: 'rgba(253, 242, 248, 0.8)',
      textOnPrimary: '#ffffff',
      textOnPrimarySecondary: 'rgba(255, 255, 255, 0.95)',
      cardBg: 'rgba(74, 13, 46, 0.95)',
      cardBorder: 'rgba(236, 72, 153, 0.3)',
      cardText: '#fdf2f8',
      cardTextSecondary: 'rgba(253, 242, 248, 0.8)',
      shadow: 'rgba(244, 114, 182, 0.3)',
      overlay: 'rgba(236, 72, 153, 0.15)',
    }
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Blue',
    icon: '🌌',
    colors: {
      primary: '#3b82f6',
      accent: '#60a5fa',
      background: 'linear-gradient(to right, #030712, #0c1b3d)',
      backgroundSecondary: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
      textPrimary: '#eff6ff',
      textSecondary: 'rgba(239, 246, 255, 0.8)',
      textOnPrimary: '#ffffff',
      textOnPrimarySecondary: 'rgba(255, 255, 255, 0.95)',
      cardBg: 'rgba(12, 27, 61, 0.95)',
      cardBorder: 'rgba(59, 130, 246, 0.3)',
      cardText: '#eff6ff',
      cardTextSecondary: 'rgba(239, 246, 255, 0.8)',
      shadow: 'rgba(96, 165, 250, 0.3)',
      overlay: 'rgba(59, 130, 246, 0.15)',
    }
  },
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Check localStorage first, then default to light theme
    const saved = localStorage.getItem('theme');
    return saved && THEMES[saved] ? saved : 'light';
  });

  useEffect(() => {
    // Apply theme CSS variables to document root
    const theme = THEMES[currentTheme];
    const root = document.documentElement;
    
    // Set all CSS custom properties
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--bg-primary', theme.colors.background);
    root.style.setProperty('--bg-secondary', theme.colors.backgroundSecondary);
    root.style.setProperty('--text-primary', theme.colors.textPrimary);
    root.style.setProperty('--text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--text-on-primary', theme.colors.textOnPrimary);
    root.style.setProperty('--text-on-primary-secondary', theme.colors.textOnPrimarySecondary);
    root.style.setProperty('--card-bg', theme.colors.cardBg);
    root.style.setProperty('--card-border', theme.colors.cardBorder);
    root.style.setProperty('--card-text', theme.colors.cardText);
    root.style.setProperty('--card-text-secondary', theme.colors.cardTextSecondary);
    root.style.setProperty('--shadow', theme.colors.shadow);
    root.style.setProperty('--overlay', theme.colors.overlay);

    // Add theme class to body for additional styling if needed
    root.setAttribute('data-theme', currentTheme);
    
    // Save preference to localStorage
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeId) => {
    if (THEMES[themeId]) {
      setCurrentTheme(themeId);
    }
  };

  const value = {
    currentTheme,
    theme: THEMES[currentTheme],
    changeTheme,
    availableThemes: Object.values(THEMES),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

