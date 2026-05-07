import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: string;
    surface: string;
    cardBg: string;
    primaryText: string;
    secondaryText: string;
    navy: string;
    turquoise: string;
    border: string;
    inputBg: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('Kinova-theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('Kinova-theme', newTheme);
  };

  const colors = theme === 'light' ? {
    background: '#f9fafb',
    surface: '#ffffff',
    cardBg: '#ffffff',
    primaryText: '#002B49',
    secondaryText: '#6b7280',
    navy: '#002B49',
    turquoise: '#00A896',
    border: '#e5e7eb',
    inputBg: '#f9fafb',
  } : {
    background: '#002B49',
    surface: '#003d5c',
    cardBg: '#004266',
    primaryText: '#f9fafb',
    secondaryText: '#d1d5db',
    navy: '#002B49',
    turquoise: '#00A896',
    border: '#1e4d6b',
    inputBg: '#003d5c',
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
