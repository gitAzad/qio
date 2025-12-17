import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text, Keyboard, TouchableWithoutFeedback, ScrollView, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';
import { Share2 } from 'lucide-react-native';

import { useTheme } from '../theme';
import { GlassView } from '../components/GlassView';
import { GradientButton } from '../components/GradientButton';
import { StyledInput } from '../components/StyledInput';
import { ThemeToggle } from '../components/ThemeToggle';

export const GeneratorScreen = () => {
  const { theme, isDark } = useTheme();
  const [value, setValue] = useState('https://scanova.app');
  const [qrRef, setQrRef] = useState(null);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 60,
    },
    themeToggle: {
      position: 'absolute',
      top: 50,
      right: 20,
      zIndex: 10,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.l,
      paddingBottom: 40,
    },
    header: {
      ...theme.typography.header,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    subtext: {
      ...theme.typography.caption,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      fontSize: 16,
    },
    previewContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    qrCard: {
      borderRadius: theme.borderRadius.l,
      padding: theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    qrWrapper: {
      backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)', 
      padding: theme.spacing.l, 
      borderRadius: theme.borderRadius.m 
    },
    inputContainer: {
      borderRadius: theme.borderRadius.l,
      padding: theme.spacing.l,
    },
    actions: {
      marginTop: theme.spacing.m,
    },
    actionButton: {
      flex: 1,
    }
  }), [theme, isDark]);

  const handleShare = () => {
    if (qrRef) {
      qrRef.toDataURL(async (data) => {
        if (Platform.OS === 'web') {
          try {
            // Check if data is already a data URI or just base64
            const base64Data = data.startsWith('data:') ? data.split(',')[1] : data;
            
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], {type: 'image/png'});
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = 'qr-code.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          } catch (e) {
            console.error("Web share error:", e);
          }
        } else {
          try {
            const tempPath = FileSystem.cacheDirectory + 'qr-code.png';
            await FileSystem.writeAsStringAsync(tempPath, data, {
              encoding: FileSystem.EncodingType.Base64,
            });
            await Sharing.shareAsync(tempPath);
          } catch (error) {
            console.error("Error sharing QR code:", error);
          }
        }
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient 
        colors={[theme.colors.background, isDark ? '#0a0a1a' : '#dcdce0']} 
        style={styles.container}
      >
        <ThemeToggle style={styles.themeToggle} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>Generator</Text>
          <Text style={styles.subtext}>Create your unique QR Code</Text>

          <View style={styles.previewContainer}>
            <GlassView style={styles.qrCard}>
              <View style={styles.qrWrapper}>
                <QRCode
                  value={value || ' '}
                  size={200}
                  color="black"
                  backgroundColor="white"
                  getRef={(c) => setQrRef(c)}
                />
              </View>
            </GlassView>
          </View>

          <GlassView style={styles.inputContainer}>
            <StyledInput
              label="Content"
              placeholder="Enter URL or Text"
              value={value}
              onChangeText={setValue}
              multiline
            />
            
            <View style={styles.actions}>
              <GradientButton 
                title="Share QR" 
                icon={Share2}
                onPress={handleShare}
                style={styles.actionButton}
              />
            </View>
          </GlassView>
          
          <View style={{height: 100}} /> 
        </ScrollView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};
