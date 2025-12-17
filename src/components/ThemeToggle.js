import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet, View } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useTheme } from '../theme';

export const ThemeToggle = ({ style }) => {
  const { isDark, toggleTheme, theme } = useTheme();
  
  const animatedValue = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isDark ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isDark]);

  const rotateInterpolation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sunOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const moonOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <TouchableOpacity 
      onPress={toggleTheme} 
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      <Animated.View style={[
        styles.iconContainer, 
        { 
          transform: [{ rotate: rotateInterpolation }],
        }
      ]}>
        <Animated.View style={[styles.icon, { opacity: sunOpacity }]}>
            <Sun color={theme.colors.text} size={24} />
        </Animated.View>
        <Animated.View style={[styles.icon, { opacity: moonOpacity, position: 'absolute' }]}>
            <Moon color={theme.colors.text} size={24} />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
      alignItems: 'center',
      justifyContent: 'center',
  }
});
