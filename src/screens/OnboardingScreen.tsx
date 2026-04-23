import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, spacing } from '../theme';

interface Props {
  onComplete: (budgetSeconds: number) => void;
}

const PRESETS = [
  { label: '5 min', value: 5 * 60 },
  { label: '10 min', value: 10 * 60 },
  { label: '15 min', value: 15 * 60 },
  { label: '20 min', value: 20 * 60 },
  { label: '30 min', value: 30 * 60 },
  { label: '45 min', value: 45 * 60 },
];

export function OnboardingScreen({ onComplete }: Props) {
  const [selected, setSelected] = useState<number>(10 * 60);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>DoomBreak</Text>
        <Text style={styles.title}>Give yourself a scroll budget.</Text>
        <Text style={styles.subtitle}>
          Pick how long you're allowed to scroll each day. When it's gone, the feed locks until tomorrow.
        </Text>
      </View>

      <View style={styles.presetGrid}>
        {PRESETS.map((p) => {
          const active = selected === p.value;
          return (
            <Pressable
              key={p.value}
              onPress={() => setSelected(p.value)}
              style={[styles.preset, active && styles.presetActive]}
              accessibilityRole="button"
              accessibilityLabel={`Select ${p.label} daily budget`}
            >
              <Text style={[styles.presetLabel, active && styles.presetLabelActive]}>{p.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={() => onComplete(selected)}
        style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}
        accessibilityRole="button"
        accessibilityLabel="Start using DoomBreak"
      >
        <Text style={styles.ctaLabel}>Start</Text>
      </Pressable>

      <Text style={styles.footnote}>You can change this anytime in Settings.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xxl + spacing.lg,
    backgroundColor: colors.bg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    letterSpacing: 3,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    marginBottom: spacing.md,
    lineHeight: 34,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: font.size.md,
    lineHeight: 22,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  preset: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
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
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
  },
  presetLabelActive: {
    color: colors.text,
  },
  cta: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginTop: 'auto',
  },
  ctaLabel: {
    color: colors.text,
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
  },
  footnote: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
