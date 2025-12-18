import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { History, Scan, QrCode, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

import { GeneratorScreen } from '../screens/GeneratorScreen';
import { ScannerScreen } from '../screens/ScannerScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { theme } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  const getIconComponent = (routeName) => {
    switch (routeName) {
      case 'History':
        return History;
      case 'Scanner':
        return Scan;
      case 'Create':
        return QrCode;
      case 'Settings':
        return Settings;
      default:
        return Scan;
    }
  };

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom + 20 }]}>
      <BlurView intensity={80} tint="dark" style={styles.floatingBar}>
        <View style={styles.tabBarContainer}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const Icon = getIconComponent(route.name);

            const onPress = () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.7}
                style={styles.tabButton}
              >
                <Icon 
                  color={isFocused ? theme.colors.primary : "#B0B0B0"} 
                  size={24}
                  strokeWidth={isFocused ? 2.5 : 2}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Scanner" component={ScannerScreen} />
      <Tab.Screen name="Create" component={GeneratorScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="About" component={AboutScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    // Ensure clicks pass through to the screen behind the empty areas
    pointerEvents: 'box-none', 
  },
  floatingBar: {
    // Make it a capsule/pill shape
    borderRadius: 35, 
    overflow: 'hidden',
    // Dark background with high opacity for better contrast
    backgroundColor: 'rgba(40, 40, 40, 0.95)', 
    // Subtle border for depth
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    // Width adjusted for 4 items
    width: 260, 
  },
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly', // Even spacing for 3 items
    height: 65, // Fixed height for the capsule
    paddingHorizontal: 10,
  },
  tabButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
});