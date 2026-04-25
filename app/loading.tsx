import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { analyzeTest } from '../services/analyzeTest';
import { Colors } from '../constants/colors';

const STATUS_STEPS = [
  'Uploading photo...',
  'Analyzing results...',
  'Almost done...',
];

export default function LoadingScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

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

    // Cycle status label text every 3 seconds
    const labelTimer = setInterval(() => {
      setStatusIndex((i) => Math.min(i + 1, STATUS_STEPS.length - 1));
    }, 3000);

    const run = async () => {
      try {
        if (!imageUri) throw new Error('No image provided');
        const results = await analyzeTest(imageUri);
        clearInterval(labelTimer);
        router.replace({
          pathname: '/result',
          params: { results: JSON.stringify(results) },
        });
      } catch {
        clearInterval(labelTimer);
        Alert.alert(
          'Could not read test',
          'Something went wrong reading your test. Please try again.',
          [{ text: 'OK', onPress: () => router.replace('/') }]
        );
      }
    };

    run();

    return () => clearInterval(labelTimer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

        <Animated.View style={[styles.iconWrapper, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.scanEmoji}>🔍</Text>
        </Animated.View>

        <ActivityIndicator
          size="large"
          color={Colors.primaryDark}
          style={styles.spinner}
        />

        <Text style={styles.mainText}>Reading your test...</Text>
        <Text style={styles.subText}>Please wait a moment</Text>

        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>{STATUS_STEPS[statusIndex]}</Text>
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
