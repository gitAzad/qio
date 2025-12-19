import React, { useState, useRef } from 'react';
import { View, Text, Keyboard, TouchableWithoutFeedback, ScrollView, Platform, TouchableOpacity, TextInput, Modal, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Share2, Search, PlusCircle, Palette, X, ImageIcon, Check } from 'lucide-react-native';

import { useTheme } from '../theme';

const PRESET_COLORS = [
  '#000000', // Black
  '#00E5FF', // Cyan
  '#FF0055', // Red/Pink
  '#2962FF', // Blue
  '#00C853', // Green
  '#FFD600', // Yellow
  '#6200EA', // Purple
  '#FF6D00', // Orange
];

export const GeneratorScreen = () => {
  const { theme, isDark } = useTheme();
  const [value, setValue] = useState('https://qio.mdazad.com');
  const qrRef = useRef(null);
  
  // Customization State
  const [logo, setLogo] = useState(null);
  const [color, setColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColorsEnabled, setCustomColorsEnabled] = useState(false);

  // Logo Picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true, 
    });

    if (!result.canceled) {
      if (result.assets[0].base64) {
        const type = result.assets[0].mimeType || 'image/jpeg';
        setLogo(`data:${type};base64,${result.assets[0].base64}`);
      } else {
        setLogo(result.assets[0].uri);
      }
    }
  };

  const toggleCustomColors = () => {
      setCustomColorsEnabled(!customColorsEnabled);
      if (customColorsEnabled) {
          setColor('#000000'); 
      }
  };

  const handleShare = async () => {
    if (!qrRef.current) {
      console.log('QR ref not available');
      return;
    }

    try {
      qrRef.current.toDataURL(async (data) => {
        try {
          // Web Implementation
          if (Platform.OS === 'web') {
            const link = document.createElement('a');
            link.href = `data:image/png;base64,${data}`;
            link.download = `qr-code-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
          }

          // Native Implementation
          const base64Data = data.startsWith('data:') ? data.split(',')[1] : data;
          const filename = `qr-code-${Date.now()}.png`;
          const tempPath = `${FileSystem.cacheDirectory}${filename}`;
          
          // Write the file using writeAsStringAsync (more reliable on Android)
          await FileSystem.writeAsStringAsync(tempPath, base64Data, {
            encoding: 'base64',
          });
          
          // Verify file exists
          const fileInfo = await FileSystem.getInfoAsync(tempPath);
          if (!fileInfo.exists) {
            throw new Error('File was not created');
          }
          
          // Share the file
          await Sharing.shareAsync(tempPath, {
            mimeType: 'image/png',
            dialogTitle: 'Share QR Code',
            UTI: 'public.png'
          });
        } catch (error) {
          console.error("Error sharing QR code:", error);
          alert('Failed to share QR code. Please try again.');
        }
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert('Failed to generate QR code. Please try again.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ width: '100%', maxWidth: 600, alignSelf: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 120 }}>
          
          <Text className="text-xl font-[Inter_700Bold] text-center mb-6" style={{ color: theme.colors.text }}>Create QR Code</Text>
          
          <Text className="text-sm mb-2 font-[Inter_500Medium]" style={{ color: theme.colors.textSecondary }}>Input</Text>
          <View className="bg-white rounded-xl flex-row items-center px-4 h-12 mb-2">
              <TextInput 
                  value={value}
                  onChangeText={setValue}
                  placeholder="Enter URL or Text"
                  placeholderTextColor="#999"
                  className="flex-1 text-black font-[Inter_400Regular]"
                  autoCapitalize="none"
              />
              <Search color="#999" size={20} />
          </View>
          <Text className="text-xs mb-6" style={{ color: theme.colors.textSecondary }}>Content Type: Text / URL</Text>

          {/* Preview Area */}
          <View className="items-center mb-8">
            <View className="p-8 rounded-3xl w-full items-center justify-center aspect-square shadow-lg" style={{ backgroundColor: theme.colors.surface }}>
                <View className="bg-white p-4 rounded-xl items-center justify-center w-full h-full overflow-hidden">
                    <QRCode
                        value={value || ' '}
                        size={260}
                        color={color}
                        backgroundColor="white"
                        logo={logo ? { uri: logo } : undefined}
                        logoSize={50}
                        logoBackgroundColor="white"
                        logoMargin={2}
                        getRef={(c) => (qrRef.current = c)}
                    />
                </View>
            </View>
          </View>

          {/* Add Logo Option */}
          <View className="flex-row justify-between items-center mb-4">
                  <Text className="font-[Inter_500Medium]" style={{ color: theme.colors.text }}>Add Logo</Text>
                  <TouchableOpacity onPress={pickImage} className="flex-row items-center gap-2">
                     <Text className="text-xs" style={{ color: theme.colors.textSecondary }}>{logo ? 'Change' : 'Upload'}</Text>
                     {logo ? (
                         <Image source={{ uri: logo }} style={{ width: 24, height: 24, borderRadius: 12 }} />
                     ) : (
                         <PlusCircle color="#00E5FF" size={20} />
                     )}
                  </TouchableOpacity>
              </View>

          {/* Custom Colors Option */}
          <View className="flex-col mb-8">
              <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-[Inter_500Medium]" style={{ color: theme.colors.text }}>Custom Colors</Text>
                  <TouchableOpacity onPress={toggleCustomColors}>
                    <View className={`w-12 h-7 rounded-full justify-center px-1 ${customColorsEnabled ? 'bg-primary' : 'bg-gray-700'}`}>
                        <View className={`w-5 h-5 bg-white rounded-full ${customColorsEnabled ? 'self-end' : 'self-start'}`} />
                    </View>
                  </TouchableOpacity>
              </View>
              
              {/* Color Palette */}
              {customColorsEnabled && (
                  <View className="flex-row flex-wrap gap-3 mt-2 justify-center">
                      {PRESET_COLORS.map((c) => (
                          <TouchableOpacity 
                            key={c} 
                            onPress={() => setColor(c)}
                            className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                          >
                             {color === c && <View className="flex-1 items-center justify-center"><Check size={14} color={c === '#000000' ? 'white' : 'black'} /></View>}
                          </TouchableOpacity>
                      ))}
                  </View>
              )}
          </View>
          
          <TouchableOpacity onPress={handleShare} activeOpacity={0.8} className="shadow-lg">
            <LinearGradient
                colors={['#00E5FF', '#00B8CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="h-14 rounded-2xl flex-row items-center justify-center gap-3 shadow-xl"
                style={{ shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
            >
                <Share2 color="white" size={22} strokeWidth={2.5} />
                <Text className="text-white font-[Inter_700Bold] text-lg">Share QR Code</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

