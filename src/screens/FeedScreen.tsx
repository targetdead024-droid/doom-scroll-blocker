import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppState,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { generateFeed } from '../feedData';
import { formatDuration } from '../format';
import { colors, font, radius, spacing } from '../theme';
import type { FeedPost } from '../types';

interface Props {
  budgetSeconds: number;
  initialUsedSeconds: number;
  onTick: (usedSeconds: number) => void;
  onExit: () => void;
  onExhausted: (usedSeconds: number) => void;
}

export function FeedScreen({
  budgetSeconds,
  initialUsedSeconds,
  onTick,
  onExit,
  onExhausted,
}: Props) {
  const posts = useMemo(() => generateFeed(80, 42), []);
  const [usedSeconds, setUsedSeconds] = useState<number>(initialUsedSeconds);
  const exhaustedRef = useRef(false);
  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    exhaustedRef.current = false;
    lastTickRef.current = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const deltaMs = now - lastTickRef.current;
      lastTickRef.current = now;
      // Cap delta so that background/sleep time doesn't suddenly exhaust the budget.
      const delta = Math.min(2, Math.max(0, deltaMs / 1000));

      setUsedSeconds((prev) => {
        const next = Math.min(budgetSeconds, prev + delta);
        onTick(next);
        if (next >= budgetSeconds && !exhaustedRef.current) {
          exhaustedRef.current = true;
          onExhausted(next);
        }
        return next;
      });
    }, 1000);

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        lastTickRef.current = Date.now();
      }
    });

    return () => {
      clearInterval(interval);
      sub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgetSeconds]);

  const remaining = Math.max(0, budgetSeconds - usedSeconds);
  const pct = budgetSeconds > 0 ? Math.min(1, usedSeconds / budgetSeconds) : 1;
  const low = remaining <= 30;

  const renderItem = ({ item }: ListRenderItemInfo<FeedPost>) => <Post post={item} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={onExit}
          accessibilityRole="button"
          accessibilityLabel="Exit feed and save progress"
          style={styles.closeBtn}
        >
          <Text style={styles.closeLabel}>Close</Text>
        </Pressable>

        <View style={styles.timerPill}>
          <View style={[styles.timerDot, low && { backgroundColor: colors.danger }]} />
          <Text style={[styles.timerText, low && { color: colors.danger }]}>
            {formatDuration(remaining)} left
          </Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.round(pct * 100)}%`,
              backgroundColor: low ? colors.danger : pct > 0.75 ? colors.warning : colors.accent,
            },
          ]}
        />
      </View>

      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function Post({ post }: { post: FeedPost }) {
  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <View style={[styles.avatar, { backgroundColor: post.avatarColor }]}>
          <Text style={styles.avatarInitial}>{post.author[0]}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.postAuthor}>{post.author}</Text>
          <Text style={styles.postHandle}>
            @{post.handle} · {post.timeAgo}
          </Text>
        </View>
      </View>
      <Text style={styles.postContent}>{post.content}</Text>
      {post.imageHue !== undefined ? (
        <View
          style={[
            styles.postImage,
            { backgroundColor: `hsl(${post.imageHue}, 55%, 28%)` },
          ]}
        >
          <View
            style={[
              styles.postImageHighlight,
              { backgroundColor: `hsl(${(post.imageHue + 40) % 360}, 65%, 45%)` },
            ]}
          />
        </View>
      ) : null}
      <View style={styles.postActions}>
        <Text style={styles.actionText}>♡ {post.likes.toLocaleString()}</Text>
        <Text style={styles.actionText}>💬 {post.comments}</Text>
        <Text style={styles.actionText}>↺ {post.reposts}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  closeBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.bgElevated,
  },
  closeLabel: {
    color: colors.text,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.bgElevated,
  },
  timerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  timerText: {
    color: colors.text,
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    fontVariant: ['tabular-nums'],
  },
  progressTrack: {
    height: 3,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.bgCard,
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  post: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: colors.text,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
  },
  postAuthor: {
    color: colors.text,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
  },
  postHandle: {
    color: colors.textMuted,
    fontSize: font.size.xs,
  },
  postContent: {
    color: colors.text,
    fontSize: font.size.md,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  postImage: {
    height: 160,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  postImageHighlight: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -40,
    right: -40,
    opacity: 0.7,
  },
  postActions: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.xs,
  },
  actionText: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
  },
});
