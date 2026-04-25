import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';

export default function LoadingScreen() {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in on mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Soft pulse on the scan icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Mock AI processing delay → navigate to result
    const timer = setTimeout(() => {
      router.replace('/result');
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

        {/* Pulsing icon */}
        <Animated.View
          style={[
            styles.iconWrapper,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Text style={styles.scanEmoji}>🔍</Text>
        </Animated.View>

        {/* Spinner */}
        <ActivityIndicator
          size="large"
          color={Colors.primaryDark}
          style={styles.spinner}
        />

        {/* Text */}
        <Text style={styles.mainText}>Reading your test...</Text>
        <Text style={styles.subText}>Please wait a moment</Text>

        {/* Status pill */}
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>AI is analyzing your results</Text>
        </View>

      </Animated.View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  iconWrapper: {
    marginBottom: 8,
  },
  scanEmoji: {
    fontSize: 88,
  },
  spinner: {
    transform: [{ scaleX: 1.8 }, { scaleY: 1.8 }],
  },
  mainText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  subText: {
    fontSize: 22,
    fontWeight: '500',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statusPill: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
    marginTop: 8,
  },
  statusPillText: {
    fontSize: 18,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});
