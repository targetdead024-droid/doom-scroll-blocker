import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDuration, formatMinutesOnly } from '../format';
import { colors, font, radius, spacing } from '../theme';

interface Props {
  budgetSeconds: number;
  usedSeconds: number;
  onStartScrolling: () => void;
  onOpenSettings: () => void;
}

export function HomeScreen({ budgetSeconds, usedSeconds, onStartScrolling, onOpenSettings }: Props) {
  const remaining = Math.max(0, budgetSeconds - usedSeconds);
  const pct = budgetSeconds > 0 ? Math.min(1, usedSeconds / budgetSeconds) : 1;
  const exhausted = remaining <= 0;
  const usedPct = Math.round(pct * 100);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.brand}>DoomBreak</Text>
        <Pressable
          onPress={onOpenSettings}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          style={styles.settingsBtn}
        >
          <Text style={styles.settingsIcon}>⚙</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Today's scroll budget</Text>
        <Text style={styles.bigTime}>{formatDuration(remaining)}</Text>
        <Text style={styles.cardSub}>
          remaining of {formatMinutesOnly(budgetSeconds)}
        </Text>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${usedPct}%`,
                backgroundColor: exhausted
                  ? colors.danger
                  : pct > 0.75
                  ? colors.warning
                  : colors.accent,
              },
            ]}
          />
        </View>

        <View style={styles.statsRow}>
          <Stat label="Used" value={formatDuration(usedSeconds)} />
          <Stat label="Used %" value={`${usedPct}%`} />
        </View>
      </View>

      <Pressable
        onPress={onStartScrolling}
        disabled={exhausted}
        style={({ pressed }) => [
          styles.cta,
          exhausted && styles.ctaDisabled,
          pressed && !exhausted && { opacity: 0.85 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={exhausted ? 'Budget exhausted' : 'Open feed'}
      >
        <Text style={[styles.ctaLabel, exhausted && styles.ctaLabelDisabled]}>
          {exhausted ? "You're out for today" : 'Open the feed'}
        </Text>
      </Pressable>

      <Text style={styles.hint}>
        {exhausted
          ? 'Come back tomorrow. Go touch some grass, seriously.'
          : 'Scrolling drains your budget in real time. When it hits zero, the feed locks.'}
      </Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  brand: {
    color: colors.accent,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    letterSpacing: 3,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    color: colors.text,
    fontSize: font.size.lg,
  },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardLabel: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  bigTime: {
    color: colors.text,
    fontSize: font.size.display,
    fontWeight: font.weight.bold,
    letterSpacing: -2,
    lineHeight: font.size.display + 4,
  },
  cardSub: {
    color: colors.textMuted,
    fontSize: font.size.md,
    marginBottom: spacing.lg,
  },
  progressTrack: {
    height: 10,
    backgroundColor: colors.bgCard,
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: font.size.xs,
    fontWeight: font.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  statValue: {
    color: colors.text,
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
  },
  cta: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  ctaDisabled: {
    backgroundColor: colors.bgCard,
  },
  ctaLabel: {
    color: colors.text,
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
  },
  ctaLabelDisabled: {
    color: colors.textMuted,
  },
  hint: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 20,
  },
});
