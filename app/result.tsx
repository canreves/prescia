import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../constants/colors';
import type { TestResult, ResultStatus } from '../types';

// ── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ResultStatus,
  { label: string; bgColor: string; textColor: string; borderColor: string }
> = {
  normal: {
    label: '✓  Normal',
    bgColor: Colors.statusNormalBg,
    textColor: Colors.statusNormal,
    borderColor: Colors.statusNormalBorder,
  },
  high: {
    label: '↑  High',
    bgColor: Colors.statusHighBg,
    textColor: Colors.statusHigh,
    borderColor: Colors.statusHighBorder,
  },
  low: {
    label: '↓  Low',
    bgColor: Colors.statusLowBg,
    textColor: Colors.statusLow,
    borderColor: Colors.statusLowBorder,
  },
};

// ── Components ───────────────────────────────────────────────────────────────

function ResultCard({ item }: { item: TestResult }) {
  const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.normal;

  return (
    <View style={[styles.card, { borderLeftColor: cfg.borderColor }]}>

      <View style={styles.cardHeader}>
        <Text style={styles.cardEmoji}>{item.emoji}</Text>
        <View style={styles.cardTitleBlock}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bgColor }]}>
            <Text style={[styles.statusLabel, { color: cfg.textColor }]}>
              {cfg.label}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.valuesRow}>
        <View style={styles.valueCell}>
          <Text style={styles.valueCellLabel}>YOUR RESULT</Text>
          <Text style={[styles.valueCellNumber, { color: cfg.textColor }]}>
            {item.value}
          </Text>
        </View>
        <View style={styles.valueDivider} />
        <View style={styles.valueCell}>
          <Text style={styles.valueCellLabel}>NORMAL RANGE</Text>
          <Text style={styles.valueCellNumber}>{item.normalRange}</Text>
        </View>
      </View>

      <View style={styles.explanationBox}>
        <Text style={styles.explanationText}>{item.explanation}</Text>
      </View>

    </View>
  );
}

function ErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={[styles.card, { borderLeftColor: Colors.statusHighBorder }]}>
      <Text style={styles.errorEmoji}>⚠️</Text>
      <Text style={styles.errorTitle}>Could not read this test</Text>
      <Text style={styles.errorBody}>
        The photo may be blurry or the document may not be a medical test.
        Please try again with a clearer photo.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function ResultScreen() {
  const router = useRouter();
  const { results: rawResults } = useLocalSearchParams<{ results: string }>();

  let results: TestResult[] = [];
  let parseError = false;

  try {
    if (rawResults) {
      results = JSON.parse(rawResults) as TestResult[];
    } else {
      parseError = true;
    }
  } catch {
    parseError = true;
  }

  const hasResults = !parseError && results.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Your Results</Text>
        <Text style={styles.pageSubtitle}>Explained in simple words</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {hasResults ? (
          results.map((item) => <ResultCard key={item.id} item={item} />)
        ) : (
          <ErrorCard onRetry={() => router.replace('/')} />
        )}

        {hasResults && (
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              ⚠️  This is for information only.{'\n'}Always consult your doctor for medical advice.
            </Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.stickyBottom}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => router.replace('/')}
          activeOpacity={0.85}
        >
          <Text style={styles.scanButtonText}>📷   Scan Another Test</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  pageHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 19,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // ── Result card ──────────────────────────────────────────
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  cardEmoji: {
    fontSize: 36,
    lineHeight: 42,
  },
  cardTitleBlock: {
    flex: 1,
    gap: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 28,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '800',
  },
  valuesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  valueCell: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  valueCellLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
  valueCellNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  valueDivider: {
    width: 1,
    height: 44,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  explanationBox: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 14,
    padding: 14,
  },
  explanationText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.text,
    lineHeight: 27,
  },

  // ── Error card ────────────────────────────────────────────
  errorEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  errorBody: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
  },

  // ── Disclaimer ────────────────────────────────────────────
  disclaimer: {
    backgroundColor: '#FFF9C4',
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
  },
  disclaimerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5D4037',
    textAlign: 'center',
    lineHeight: 24,
  },

  // ── Sticky bottom ─────────────────────────────────────────
  stickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 32,
  },
  scanButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 7,
  },
  scanButtonText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.3,
  },
});
