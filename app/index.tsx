import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../constants/colors';

export default function HomeScreen() {
  const router = useRouter();
  const [remainingUses] = useState(3);

  const handleTakePhoto = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Needed',
          'Please allow camera access so prescia can read your test.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.85,
    });

    if (!result.canceled) {
      router.push({
        pathname: '/loading',
        params: { imageUri: result.assets[0].uri },
      });
    }
  };

  // For testing on simulator without camera
  const handlePickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (!result.canceled) {
      router.push({
        pathname: '/loading',
        params: { imageUri: result.assets[0].uri },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>prescia</Text>
          <Text style={styles.tagline}>Scan your test result</Text>
        </View>

        {/* Big Camera Button */}
        <View style={styles.centerSection}>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={handleTakePhoto}
            activeOpacity={0.8}
          >
            <Text style={styles.cameraEmoji}>📷</Text>
            <Text style={styles.photoButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <Text style={styles.hintText}>
            Point your camera at a{'\n'}medical test or prescription
          </Text>

          {/* Gallery fallback — handy for simulator testing */}
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={handlePickFromGallery}
            activeOpacity={0.75}
          >
            <Text style={styles.galleryButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Remaining uses badge */}
        <View style={styles.footer}>
          <View style={styles.remainingBadge}>
            <Text style={styles.remainingText}>
              Remaining free uses: {remainingUses}
            </Text>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // ── Header ──────────────────────────────────────────────
  header: {
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 12,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: 3,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },

  // ── Center section ──────────────────────────────────────
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
  },
  photoButton: {
    backgroundColor: Colors.primary,
    width: 230,
    height: 230,
    borderRadius: 115,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 12,
  },
  cameraEmoji: {
    fontSize: 68,
    marginBottom: 8,
  },
  photoButtonText: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  hintText: {
    fontSize: 19,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '500',
  },
  galleryButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
  },
  galleryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryDark,
  },

  // ── Footer ───────────────────────────────────────────────
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  remainingBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  remainingText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
});
