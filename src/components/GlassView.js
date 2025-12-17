import React, { useMemo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../theme';

export const GlassView = ({ style, children, intensity = 50, tint }) => {
  const { theme, isDark } = useTheme();

  const resolvedTint = tint || (isDark ? 'dark' : 'light');
  
  const styles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: isDark ? 'rgba(20, 20, 40, 0.4)' : 'rgba(255, 255, 255, 0.4)',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      overflow: 'hidden',
    },
    androidContainer: {
      backgroundColor: isDark ? 'rgba(20, 20, 40, 0.6)' : 'rgba(255, 255, 255, 0.8)',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      overflow: 'hidden',
    },
    content: {
      zIndex: 1,
    }
  }), [isDark]);

  if (Platform.OS === 'android') {
    return (
      <View style={[styles.androidContainer, style]}>
        <BlurView intensity={intensity} tint={resolvedTint} style={StyleSheet.absoluteFill} />
        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  return (
    <BlurView intensity={intensity} tint={resolvedTint} style={[styles.container, style]}>
      {children}
    </BlurView>
  );
};
