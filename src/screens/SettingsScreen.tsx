import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatMinutesOnly } from '../format';
import { colors, font, radius, spacing } from '../theme';

interface Props {
  budgetSeconds: number;
  usedSeconds: number;
  onSaveBudget: (seconds: number) => void;
  onResetToday: () => void;
  onBack: () => void;
}

const PRESETS = [
  { label: '5 min', value: 5 * 60 },
  { label: '10 min', value: 10 * 60 },
  { label: '15 min', value: 15 * 60 },
  { label: '20 min', value: 20 * 60 },
  { label: '30 min', value: 30 * 60 },
  { label: '45 min', value: 45 * 60 },
  { label: '60 min', value: 60 * 60 },
  { label: '90 min', value: 90 * 60 },
];

function confirm(message: string, onConfirm: () => void) {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    if (typeof window !== 'undefined' && window.confirm(message)) onConfirm();
    return;
  }
  Alert.alert('Are you sure?', message, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Confirm', style: 'destructive', onPress: onConfirm },
  ]);
}

export function SettingsScreen({
  budgetSeconds,
  usedSeconds,
  onSaveBudget,
  onResetToday,
  onBack,
}: Props) {
  const [selected, setSelected] = useState<number>(budgetSeconds);
  const dirty = selected !== budgetSeconds;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={styles.backBtn}
        >
          <Text style={styles.backLabel}>‹  Back</Text>
        </Pressable>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 64 }} />
      </View>

      <Text style={styles.sectionLabel}>Daily scroll budget</Text>
      <Text style={styles.sectionHelp}>
        Currently: {formatMinutesOnly(budgetSeconds)} per day.
      </Text>

      <View style={styles.presetGrid}>
        {PRESETS.map((p) => {
          const active = selected === p.value;
          return (
            <Pressable
              key={p.value}
              onPress={() => setSelected(p.value)}
              style={[styles.preset, active && styles.presetActive]}
              accessibilityRole="button"
              accessibilityLabel={`Choose ${p.label}`}
            >
              <Text style={[styles.presetLabel, active && styles.presetLabelActive]}>{p.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={() => onSaveBudget(selected)}
        disabled={!dirty}
        style={({ pressed }) => [
          styles.saveBtn,
          !dirty && styles.saveBtnDisabled,
          dirty && pressed && { opacity: 0.85 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Save new budget"
      >
        <Text style={[styles.saveLabel, !dirty && styles.saveLabelDisabled]}>
          {dirty ? 'Save budget' : 'Saved'}
        </Text>
      </Pressable>

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>Today's usage</Text>
      <Text style={styles.sectionHelp}>
        You've used {formatMinutesOnly(usedSeconds)} so far.
      </Text>
      <Pressable
        onPress={() =>
          confirm("Reset today's usage to zero? You'll get your full budget back.", onResetToday)
        }
        style={({ pressed }) => [styles.dangerBtn, pressed && { opacity: 0.85 }]}
        accessibilityRole="button"
        accessibilityLabel="Reset today's usage"
      >
        <Text style={styles.dangerLabel}>Reset today's usage</Text>
      </Pressable>

      <Text style={styles.footnote}>
        This is meant to help you, not punish you. Set a budget you can stick to.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg,
    paddingTop: spacing.xxl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  backBtn: {
    width: 64,
  },
  backLabel: {
    color: colors.accent,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
  },
  title: {
    color: colors.text,
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
  },
  sectionLabel: {
    color: colors.text,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    marginBottom: spacing.xs,
  },
  sectionHelp: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    marginBottom: spacing.md,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  preset: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgElevated,
  },
  presetActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  presetLabel: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
  },
  presetLabelActive: {
    color: colors.text,
  },
  saveBtn: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: colors.bgCard,
  },
  saveLabel: {
    color: colors.text,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
  },
  saveLabelDisabled: {
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xl,
  },
  dangerBtn: {
    borderWidth: 1,
    borderColor: colors.danger,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  dangerLabel: {
    color: colors.danger,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
  },
  footnote: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    textAlign: 'center',
    marginTop: 'auto',
  },
});
