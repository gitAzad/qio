import React, { useMemo } from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../theme';

export const StyledInput = ({ 
  value, 
  onChangeText, 
  placeholder, 
  label,
  multiline = false,
  style 
}) => {
  const { theme, isDark } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      marginBottom: theme.spacing.m,
    },
    label: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      marginBottom: theme.spacing.xs,
      marginLeft: theme.spacing.xs,
    },
    input: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      borderRadius: theme.borderRadius.m,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      color: theme.colors.text,
      padding: theme.spacing.m,
      fontSize: 16,
    },
    multiline: {
      minHeight: 100,
    }
  }), [theme, isDark]);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        style={[styles.input, multiline && styles.multiline]}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
};
