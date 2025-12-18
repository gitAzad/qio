import './global.css';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/theme';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as Linking from 'expo-linking';
import { useEffect, useRef } from 'react';

const AppContent = () => {
  const { theme, isDark } = useTheme();
  const navigationRef = useRef();

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.colors.background,
      card: theme.colors.surface,
      primary: theme.colors.primary,
      text: theme.colors.text,
    },
  };

  // Handle deep links
  useEffect(() => {
    const handleDeepLink = ({ url }) => {
      if (!url || !navigationRef.current) return;

      const { hostname, path, queryParams } = Linking.parse(url);
      
      // Handle different deep link routes
      if (path === 'scan' || hostname === 'scan') {
        navigationRef.current.navigate('Main', { screen: 'Scanner' });
      } else if (path === 'create' || hostname === 'create') {
        navigationRef.current.navigate('Main', { screen: 'Create' });
      } else if (path === 'history' || hostname === 'history') {
        navigationRef.current.navigate('Main', { screen: 'History' });
      } else if (path === 'settings' || hostname === 'settings') {
        navigationRef.current.navigate('Main', { screen: 'Settings' });
      }
    };

    // Handle initial URL (app opened from link)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    // Handle URL when app is already open
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <NavigationContainer ref={navigationRef} theme={navigationTheme}>
          <AppNavigator />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
};

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212'}}>
        <ActivityIndicator size="large" color="#00E5FF" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
