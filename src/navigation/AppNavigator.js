import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { QrCode, Scan } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

import { GeneratorScreen } from '../screens/GeneratorScreen';
import { ScannerScreen } from '../screens/ScannerScreen';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarShowLabel: false,
        tabBarBackground: () => (
            Platform.OS === 'ios' ? 
            <BlurView tint="dark" intensity={80} style={StyleSheet.absoluteFill} /> : 
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#101020' }]} />
        ),
      }}
    >
      <Tab.Screen 
        name="Generator" 
        component={GeneratorScreen}
        options={{
          tabBarIcon: ({ color, size }) => <QrCode color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Scanner" 
        component={ScannerScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.scanIconWrapper, focused && styles.scanIconFocused]}>
              <Scan color={focused ? 'white' : color} size={32} />
            </View>
          ),
          tabBarIconStyle: styles.scanIconStyle,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Platform.OS === 'android' ? '#101020' : 'transparent',
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    height: 60,
    paddingBottom: 5,
  },
  scanIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Lift it up
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  scanIconFocused: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  scanIconStyle: {
    // Ensuring hit slop or layout is fine
  }
});
