import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Text, Linking, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { Scan, X, Copy, ExternalLink } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

import { useTheme } from '../theme';
import { GlassView } from '../components/GlassView';
import { GradientButton } from '../components/GradientButton';

const { width } = Dimensions.get('window');
const SCAN_SIZE = width * 0.7;

export const ScannerScreen = () => {
  const { theme } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState('');

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black', // Always black for camera background
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    permissionText: {
      color: 'white',
      marginBottom: 20,
      textAlign: 'center',
      ...theme.typography.subheader,
    },
    overlayTop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: 40,
    },
    headerText: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
    },
    subtext: {
      color: '#ccc',
      marginTop: 8,
    },
    row: {
      flexDirection: 'row',
    },
    sideOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    scanFrame: {
      width: SCAN_SIZE,
      height: SCAN_SIZE,
      position: 'relative',
    },
    overlayBottom: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    corner: {
      position: 'absolute',
      width: 20,
      height: 20,
      borderColor: theme.colors.primary,
      borderWidth: 4,
    },
    tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
    tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
    bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
    br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
    scanLine: {
      position: 'absolute',
      width: '100%',
      height: 2,
      backgroundColor: theme.colors.primary,
      top: 0,
      shadowColor: theme.colors.primary,
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 5,
    },
    
    modalOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      paddingBottom: 50,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.m,
    },
    modalTitle: {
      color: theme.colors.text,
      fontSize: 20,
      fontWeight: 'bold',
    },
    resultText: {
      color: theme.colors.textSecondary,
      fontSize: 16,
      marginBottom: theme.spacing.l,
      backgroundColor: 'rgba(0,0,0,0.05)',
      padding: theme.spacing.m,
      borderRadius: theme.borderRadius.s,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    modalActions: {
      flexDirection: 'row',
    },
    actionBtn: {
      flex: 1,
    }
  }), [theme]);

  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <GradientButton onPress={requestPermission} title="Grant Permission" />
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

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
      
      {/* Overlay */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.overlayTop}>
          <Text style={styles.headerText}>Scan Result</Text>
          <Text style={styles.subtext}>Align QR code within the frame</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.sideOverlay} />
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
            {!scanned && <View style={styles.scanLine} />}
          </View>
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.overlayBottom} />
      </View>

      {/* Result Modal - Using absolute positioning for custom modal look */}
      {scanned && (
        <View style={styles.modalOverlay}>
          <GlassView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>QR Code Detected</Text>
              <TouchableOpacity onPress={() => setScanned(false)}>
                <X color={theme.colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.resultText} numberOfLines={4}>{scanResult}</Text>
            
            <View style={styles.modalActions}>
              <GradientButton 
                title="Copy" 
                icon={Copy} 
                onPress={copyToClipboard}
                style={styles.actionBtn}
                colors={['#333', '#555']}
              />
              <View style={{width: 10}} />
              <GradientButton 
                title="Open" 
                icon={ExternalLink} 
                onPress={openLink}
                style={styles.actionBtn}
              />
            </View>
          </GlassView>
        </View>
      )}
    </View>
  );
};
