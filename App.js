import './global.css';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/theme';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

const AppContent = () => {
  const { theme, isDark } = useTheme();

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

  return (
    <SafeAreaProvider>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <NavigationContainer theme={navigationTheme}>
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
