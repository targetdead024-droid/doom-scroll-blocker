import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDuration, formatMinutesOnly } from '../format';
import { colors, font, radius, spacing } from '../theme';

interface Props {
  budgetSeconds: number;
  onGoHome: () => void;
  onOpenSettings: () => void;
}

function msUntilTomorrow(): number {
  const now = new Date();
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0,
  );
  return tomorrow.getTime() - now.getTime();
}

export function LockScreen({ budgetSeconds, onGoHome, onOpenSettings }: Props) {
  const [countdown, setCountdown] = useState<number>(() => Math.floor(msUntilTomorrow() / 1000));

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown(Math.floor(msUntilTomorrow() / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>⏾</Text>
        </View>
        <Text style={styles.title}>You're out for today.</Text>
        <Text style={styles.subtitle}>
          You used your entire {formatMinutesOnly(budgetSeconds)} scroll budget. The feed is locked until tomorrow.
        </Text>

        <View style={styles.countdownBox}>
          <Text style={styles.countdownLabel}>Unlocks in</Text>
          <Text style={styles.countdownValue}>{formatDuration(countdown)}</Text>
        </View>

        <View style={styles.ideas}>
          <Idea emoji="📖" text="Read a page of an actual book" />
          <Idea emoji="🚶" text="Go for a 10 minute walk" />
          <Idea emoji="💧" text="Drink some water, seriously" />
          <Idea emoji="😴" text="Close your eyes for a minute" />
        </View>

        <Pressable
          onPress={onGoHome}
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}
          accessibilityRole="button"
          accessibilityLabel="Back to home"
        >
          <Text style={styles.ctaLabel}>Close the app</Text>
        </Pressable>
        <Pressable
          onPress={onOpenSettings}
          style={styles.secondaryBtn}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
        >
          <Text style={styles.secondaryLabel}>Settings</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Idea({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View style={styles.idea}>
      <Text style={styles.ideaEmoji}>{emoji}</Text>
      <Text style={styles.ideaText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 40,
    color: colors.accent,
  },
  title: {
    color: colors.text,
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: font.size.md,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  countdownBox: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    alignSelf: 'stretch',
  },
  countdownLabel: {
    color: colors.textMuted,
    fontSize: font.size.xs,
    fontWeight: font.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  countdownValue: {
    color: colors.text,
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    fontVariant: ['tabular-nums'],
  },
  ideas: {
    alignSelf: 'stretch',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  idea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bgCard,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  ideaEmoji: {
    fontSize: 20,
  },
  ideaText: {
    color: colors.text,
    fontSize: font.size.md,
    flex: 1,
  },
  cta: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ctaLabel: {
    color: colors.text,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
  },
  secondaryBtn: {
    paddingVertical: spacing.sm,
  },
  secondaryLabel: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
  },
});
