import React from 'react';

export const theme = {
  colors: {
    background: '#151718', // Main background
    surface: '#1a1d21',    // Card/panel backgrounds
    panel: '#0b1220',      // Darker panels
    primary: '#6ee7b7',    // Primary accent color (mint green)
    secondary: '#60a5fa',  // Secondary accent (blue)
    warning: '#f59e0b',    // Warning/yellow
    danger: '#ef4444',     // Error/red
    text: '#ECEDEE',       // Primary text
    textSecondary: '#9BA1A6', // Secondary text
    textMuted: '#687076',  // Muted text
    border: '#2a2d31',     // Border colors
    overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlays
    
    // Legacy support for existing code
    bg: '#151718',
    muted: '#9BA1A6',
    
    // Tab colors
    tabIconDefault: '#687076',
    tabIconSelected: '#6ee7b7',
    icon: '#9BA1A6',
    tint: '#6ee7b7',
  },
  spacing: (n: number) => n * 8,
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 24,
    full: 9999,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export const ThemeContext = React.createContext(theme);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export default theme;