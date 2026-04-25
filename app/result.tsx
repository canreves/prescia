import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';

// ── Types ────────────────────────────────────────────────────────────────────

type ResultStatus = 'normal' | 'high' | 'low';

interface TestResult {
  id: string;
  emoji: string;
  name: string;
  value: string;
  normalRange: string;
  status: ResultStatus;
  explanation: string;
}

// ── Mock data (replace with real AI response) ────────────────────────────────

const MOCK_RESULTS: TestResult[] = [
  {
    id: '1',
    emoji: '🩸',
    name: 'Blood Sugar (Glucose)',
    value: '105 mg/dL',
    normalRange: '70 – 100 mg/dL',
    status: 'high',
    explanation:
      'Your blood sugar is slightly above normal. Try to reduce sugary foods and drinks, and walk for 20 minutes after meals.',
  },
  {
    id: '2',
    emoji: '💚',
    name: 'Cholesterol (Total)',
    value: '190 mg/dL',
    normalRange: 'Below 200 mg/dL',
    status: 'normal',
    explanation:
      'Great news! Your cholesterol is in the healthy range. Keep up your current diet and stay active.',
  },
  {
    id: '3',
    emoji: '🫀',
    name: 'Hemoglobin',
    value: '11.8 g/dL',
    normalRange: '12.0 – 17.5 g/dL',
    status: 'low',
    explanation:
      'Your hemoglobin is slightly low. This can cause tiredness or dizziness. Eat more iron-rich foods like spinach, lentils, and red meat — and talk to your doctor.',
  },
  {
    id: '4',
    emoji: '💪',
    name: 'Blood Pressure',
    value: '118 / 76 mmHg',
    normalRange: 'Below 120 / 80 mmHg',
    status: 'normal',
    explanation:
      'Excellent! Your blood pressure is perfectly normal. Keep up the good habits.',
  },
];

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
  const cfg = STATUS_CONFIG[item.status];

  return (
    <View style={[styles.card, { borderLeftColor: cfg.borderColor }]}>

      {/* Card header: emoji + name + status badge */}
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

      {/* Values row */}
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

      {/* Plain-language explanation */}
      <View style={styles.explanationBox}>
        <Text style={styles.explanationText}>{item.explanation}</Text>
      </View>

    </View>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function ResultScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Fixed header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Your Results</Text>
        <Text style={styles.pageSubtitle}>Explained in simple words</Text>
      </View>

      {/* Scrollable cards */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_RESULTS.map((item) => (
          <ResultCard key={item.id} item={item} />
        ))}

        {/* Medical disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️  This is for information only.{'\n'}Always consult your doctor for medical advice.
          </Text>
        </View>

        {/* Spacer so last card isn't hidden behind the sticky button */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky "Scan Another" button */}
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

  // Page header
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

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // ── Card ──────────────────────────────────────────────
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

  // Values row
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

  // Explanation
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

  // Disclaimer
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

  // Sticky bottom button
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
