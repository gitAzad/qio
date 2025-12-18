import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Linking, Platform, StyleSheet, Share, Animated } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Scan, X, Copy, ExternalLink, Share2, Save, Zap, ZapOff, Image as ImageIcon } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../theme';
import { GlassView } from '../components/GlassView';

export const ScannerScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [torch, setTorch] = useState(false);
  
  // Animation for scan line
  const translateY = useRef(new Animated.Value(0)).current;

  // ... (rest of animation logic is same)


  useEffect(() => {
    if (!permission) return;
    if (!scanned) {
      // Start animation loop
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: 280,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      translateY.setValue(0); // Reset or stop
    }
  }, [scanned, permission]);

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black justify-center items-center p-5">
        <Text className="text-white text-xl text-center mb-5 font-[Inter_600SemiBold]">
          We need your permission to show the camera
        </Text>
        <TouchableOpacity 
          onPress={requestPermission}
          className="bg-primary px-6 py-3 rounded-full"
        >
          <Text className="text-black font-bold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScanResult(data);
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(scanResult);
  };

  const openLink = async () => {
    if (await Linking.canOpenURL(scanResult)) {
      Linking.openURL(scanResult);
    }
  };

  const shareResult = async () => {
    try {
      await Share.share({
        message: scanResult,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const resetScan = () => {
    setScanned(false);
    setScanResult('');
    // Re-trigger animation
    translateY.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 280,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        enableTorch={torch}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8", "pdf417", "aztec", "datamatrix", "code128", "code39", "itf14", "codabar", "upc_a", "upc_e"],
        }}
      />
      
      {/* Overlay */}
      <View className="absolute inset-0 z-10">
        {/* Top Header */}
        <View className="flex-1 bg-black/60 justify-end items-center pb-10">
            <View className="flex-row justify-between items-center w-full px-5 absolute top-12" style={{ top: insets.top + 10 }}>
                 <Text className="text-primary text-3xl font-[Inter_700Bold]">Qio</Text>
                 <TouchableOpacity 
                   onPress={() => setTorch(!torch)}
                   className="w-12 h-12 bg-white/10 rounded-full items-center justify-center"
                 >
                     {torch ? <ZapOff color="#00E5FF" size={24} /> : <Zap color="white" size={24} />}
                 </TouchableOpacity>
            </View>
        </View>

        {/* Middle Row - Scan Frame */}
        <View className="flex-row h-[300px]">
          <View className="flex-1 bg-black/60" />
          
          <View className="w-[300px] h-[300px] relative overflow-hidden rounded-[30px] border border-white/10">
             {/* Corners */}
             <View className="absolute top-0 left-0 w-10 h-10 border-l-4 border-t-4 border-primary rounded-tl-3xl shadow-[0_0_15px_rgba(0,229,255,0.6)]" />
             <View className="absolute top-0 right-0 w-10 h-10 border-r-4 border-t-4 border-primary rounded-tr-3xl shadow-[0_0_15px_rgba(0,229,255,0.6)]" />
             <View className="absolute bottom-0 left-0 w-10 h-10 border-l-4 border-b-4 border-primary rounded-bl-3xl shadow-[0_0_15px_rgba(0,229,255,0.6)]" />
             <View className="absolute bottom-0 right-0 w-10 h-10 border-r-4 border-b-4 border-primary rounded-br-3xl shadow-[0_0_15px_rgba(0,229,255,0.6)]" />

             {/* Animated Line */}
             {!scanned && (
                <Animated.View style={[
                  { 
                    width: '100%', 
                    height: 3, 
                    backgroundColor: theme.colors.primary,
                    shadowColor: theme.colors.primary,
                    shadowOpacity: 1,
                    shadowRadius: 15,
                    elevation: 10,
                    transform: [{ translateY }],
                  }
                ]} />
             )}
              {/* Overlay glow */}
              {!scanned && (
                  <View className="absolute inset-0 bg-primary/5" />
              )}
          </View>

          <View className="flex-1 bg-black/60" />
        </View>

        {/* Bottom Text Area */}
        <View className="flex-1 bg-black/60 justify-start items-center pt-8 relative">
            <Text className="text-white/60 text-base font-[Inter_500Medium] bg-black/40 px-4 py-2 rounded-full overflow-hidden">
                Align QR or Barcode within frame.
            </Text>

            <View className="absolute bottom-5 left-8">
                 <TouchableOpacity className="w-12 h-12 bg-[#1E1E1E] rounded-xl items-center justify-center border border-white/10">
                     <ImageIcon color="white" size={24} />
                 </TouchableOpacity>
                 <Text className="text-white/60 text-xs text-center mt-1">Gallery</Text>
            </View>
        </View>
      </View>

      {/* Result Bottom Sheet Modal */}
      {scanned && (
        <View className="absolute inset-0 z-20 justify-end bg-black/50">
          <View className="bg-[#1E1E1E] rounded-t-3xl p-6 pb-24 shadow-2xl border-t border-gray-800">
             {/* Drag Handle */}
             <View className="self-center w-12 h-1.5 bg-gray-600 rounded-full mb-6" />

             <View className="items-center mb-6">
                 <View className="w-16 h-16 bg-primary/20 rounded-full items-center justify-center mb-4 border border-primary/30">
                    {scanResult.startsWith('http') ? <ExternalLink color="#00E5FF" size={32} /> : <Scan color="#00E5FF" size={32} />}
                 </View>
                 <Text className="text-white text-xl font-[Inter_700Bold] mb-1">
                    {scanResult.startsWith('http') ? 'Website Detected' : 'Text Detected'}
                 </Text>
                 <Text className="text-gray-400 text-center font-[Inter_400Regular] px-4" numberOfLines={2}>
                    {scanResult}
                 </Text>
             </View>

            <View className="flex-row gap-4 mb-6">
                <TouchableOpacity 
                    onPress={openLink}
                    className="flex-1 bg-primary h-14 rounded-xl flex-row items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                    <ExternalLink color="black" size={20} />
                    <Text className="text-black font-bold text-lg">Open Link</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={shareResult}
                    className="flex-1 bg-white/5 border border-white/10 h-14 rounded-xl flex-row items-center justify-center gap-2"
                >
                    <Share2 color="#00E5FF" size={20} />
                    <Text className="text-primary font-bold text-lg">Share</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-row justify-between px-4">
                 <TouchableOpacity className="items-center" onPress={() => {}}>
                    <Text className="text-gray-400 font-[Inter_600SemiBold]">Save</Text>
                 </TouchableOpacity>
                 <TouchableOpacity className="items-center" onPress={copyToClipboard}>
                    <Text className="text-gray-400 font-[Inter_600SemiBold]">Copy</Text>
                 </TouchableOpacity>
                 <TouchableOpacity className="items-center" onPress={resetScan}>
                    <Text className="text-white font-[Inter_600SemiBold]">Close</Text>
                 </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

