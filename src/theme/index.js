import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const commonTheme = {
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    round: 9999,
  },
  typography: {
    header: {
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    subheader: {
      fontSize: 20,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
    },
  },
};

const lightColors = {
  background: '#F5F5F5',
  surface: '#FFFFFF',
  primary: '#00B8CC', // Darker Cyan for better contrast
  secondary: '#8a00bf', // Darker Purple
  accent: '#ff0055',
  text: '#000000',
  textSecondary: '#666666',
  border: '#E0E0E0',
  success: '#00cc7d',
  error: '#ff3366',
  overlay: 'rgba(0,0,0,0.1)',
};

const darkColors = {
  background: '#121212', // Dark background matching current design
  surface: '#1E1E1E',
  primary: '#00E5FF', // Cyan
  secondary: '#bd00ff', // Electric Purple
  accent: '#ff0055', // Neon Red/Pink
  text: '#ffffff',
  textSecondary: '#a0a0b0',
  border: '#2a2a4a',
  success: '#00ff9d',
  error: '#ff3366',
  overlay: 'rgba(0,0,0,0.7)',
};

const ThemeContext = createContext({
  theme: { ...commonTheme, colors: darkColors },
  isDark: true,
});

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = React.useState(true); // Default to dark mode

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const isDark = isDarkMode;

  const theme = useMemo(() => {
    const colors = isDark ? darkColors : lightColors;
    
    // Update caption color based on theme
    const typography = {
        ...commonTheme.typography,
        caption: {
            ...commonTheme.typography.caption,
            color: colors.textSecondary,
        }
    }

    return {
      ...commonTheme,
      colors,
      typography,
    };
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

// Backwards compatibility for now, but should be replaced
export const theme = { 
  ...commonTheme, 
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#00E5FF',
    secondary: '#bd00ff',
    accent: '#ff0055',
    text: '#ffffff',
    textSecondary: '#a0a0b0',
    border: '#2a2a4a',
    success: '#00ff9d',
    error: '#ff3366',
    overlay: 'rgba(0,0,0,0.7)',
  }
};
