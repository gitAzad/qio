import React, { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';

export const GradientButton = ({ 
  onPress, 
  title, 
  colors, 
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  textStyle,
  icon: Icon,
  loading = false,
  disabled = false
}) => {
  const { theme } = useTheme();

  const buttonColors = colors || [theme.colors.primary, theme.colors.secondary];

  const styles = useMemo(() => StyleSheet.create({
    touchable: {
      borderRadius: theme.borderRadius.m,
      overflow: 'hidden',
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    gradient: {
      paddingVertical: theme.spacing.m,
      paddingHorizontal: theme.spacing.l,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    text: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
    icon: {
      marginRight: 8,
    }
  }), [theme]);

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.8} 
      style={[styles.touchable, style]}
      disabled={disabled || loading}
    >
      <LinearGradient
        colors={disabled ? ['#333', '#444'] : buttonColors}
        start={start}
        end={end}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            {Icon && <Icon color="#fff" size={20} style={styles.icon} />}
            <Text style={[styles.text, textStyle]}>{title}</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};
