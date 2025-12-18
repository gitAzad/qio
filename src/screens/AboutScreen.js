import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { X, QrCode, Zap, Shield, Heart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';

export const AboutScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <View className="flex-1" style={{ paddingTop: insets.top, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-800">
        <Text className="text-2xl font-[Inter_700Bold]" style={{ color: theme.colors.text }}>About Qio</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <X color={theme.colors.text} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* App Icon & Name */}
        <View className="items-center mb-8">
          <LinearGradient
            colors={['#00E5FF', '#0099CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-24 h-24 rounded-3xl items-center justify-center mb-4"
          >
            <QrCode color="#000000" size={48} strokeWidth={2.5} />
          </LinearGradient>
          <Text className="text-3xl font-[Inter_700Bold] mb-2" style={{ color: theme.colors.text }}>Qio</Text>
          <Text className="text-base font-[Inter_400Regular]" style={{ color: theme.colors.textSecondary }}>Version 1.0.0</Text>
        </View>

        {/* Description */}
        <View className="rounded-2xl p-6 mb-6" style={{ backgroundColor: theme.colors.surface }}>
          <Text className="text-lg font-[Inter_600SemiBold] mb-3" style={{ color: theme.colors.text }}>
            Fast & Powerful QR Scanner
          </Text>
          <Text className="text-base font-[Inter_400Regular] leading-6" style={{ color: theme.colors.textSecondary }}>
            Qio is a modern, lightning-fast QR code scanner and generator designed for simplicity and efficiency. Scan any QR code instantly or create custom QR codes with logos and colors.
          </Text>
        </View>

        {/* Features */}
        <View className="rounded-2xl p-6 mb-6" style={{ backgroundColor: theme.colors.surface }}>
          <Text className="text-lg font-[Inter_600SemiBold] mb-4" style={{ color: theme.colors.text }}>Features</Text>
          
          <View className="flex-row items-start mb-4">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
              <Zap color="#00E5FF" size={20} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-[Inter_600SemiBold] mb-1" style={{ color: theme.colors.text }}>Lightning Fast</Text>
              <Text className="text-sm font-[Inter_400Regular]" style={{ color: theme.colors.textSecondary }}>
                Instant QR code scanning with real-time detection
              </Text>
            </View>
          </View>

          <View className="flex-row items-start mb-4">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
              <QrCode color="#00E5FF" size={20} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-[Inter_600SemiBold] mb-1" style={{ color: theme.colors.text }}>Custom QR Codes</Text>
              <Text className="text-sm font-[Inter_400Regular]" style={{ color: theme.colors.textSecondary }}>
                Create personalized QR codes with custom colors and logos
              </Text>
            </View>
          </View>

          <View className="flex-row items-start">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
              <Shield color="#00E5FF" size={20} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-[Inter_600SemiBold] mb-1" style={{ color: theme.colors.text }}>Privacy First</Text>
              <Text className="text-sm font-[Inter_400Regular]" style={{ color: theme.colors.textSecondary }}>
                All scanning happens locally on your device
              </Text>
            </View>
          </View>
        </View>

        {/* Credits */}
        <View className="rounded-2xl p-6 mb-6" style={{ backgroundColor: theme.colors.surface }}>
          <Text className="text-lg font-[Inter_600SemiBold] mb-3" style={{ color: theme.colors.text }}>Made with</Text>
          <View className="flex-row items-center">
            <Heart color="#FF0055" size={20} fill="#FF0055" />
            <Text className="text-base font-[Inter_400Regular] ml-2" style={{ color: theme.colors.textSecondary }}>
              by the Qio Team
            </Text>
          </View>
        </View>

        {/* Copyright */}
        <Text className="text-sm text-center font-[Inter_400Regular]" style={{ color: theme.colors.textSecondary }}>
          © 2025 Qio. All rights reserved.
        </Text>
      </ScrollView>
    </View>
  );
};
