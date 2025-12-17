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
  background: '#f0f0f5',
  surface: '#ffffff',
  primary: '#00afba', // Darker Cyan for contrast
  secondary: '#8a00bf', // Darker Purple
  accent: '#ff0055',
  text: '#12122a',
  textSecondary: '#666680',
  border: '#dcdce0',
  success: '#00cc7d',
  error: '#ff3366',
  overlay: 'rgba(255,255,255,0.8)',
};

const darkColors = {
  background: '#050511', // Deep Space Blue/Black
  surface: '#12122a',
  primary: '#00f2ff', // Cyan
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
  const [colorScheme, setColorScheme] = React.useState(null);

  useEffect(() => {
     if (!colorScheme) {
         setColorScheme(systemColorScheme);
     }
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setColorScheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = (colorScheme || systemColorScheme) === 'dark';

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
export const theme = { ...commonTheme, colors: darkColors };
