import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { FeedScreen } from './src/screens/FeedScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LockScreen } from './src/screens/LockScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  loadUsage,
  resetUsage,
  saveSettings,
  saveUsage,
  todayKey,
} from './src/storage';
import { colors } from './src/theme';
import type { Screen, Settings } from './src/types';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [usedSeconds, setUsedSeconds] = useState(0);
  const [screen, setScreen] = useState<Screen>('onboarding');
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      const [s, u] = await Promise.all([loadSettings(), loadUsage()]);
      setSettings(s);
      setUsedSeconds(u.usedSeconds);
      if (!s.onboarded) {
        setScreen('onboarding');
      } else if (u.usedSeconds >= s.dailyBudgetSeconds) {
        setScreen('lock');
      } else {
        setScreen('home');
      }
      setLoaded(true);
    })();
  }, []);

  const persistUsage = useCallback((next: number) => {
    if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    persistTimerRef.current = setTimeout(() => {
      saveUsage({ date: todayKey(), usedSeconds: next }).catch(() => {});
    }, 500);
  }, []);

  const handleOnboardingComplete = useCallback(async (budgetSeconds: number) => {
    const next: Settings = { ...settings, dailyBudgetSeconds: budgetSeconds, onboarded: true };
    setSettings(next);
    await saveSettings(next);
    setScreen('home');
  }, [settings]);

  const handleStartScrolling = useCallback(() => {
    if (usedSeconds >= settings.dailyBudgetSeconds) {
      setScreen('lock');
    } else {
      setScreen('feed');
    }
  }, [usedSeconds, settings.dailyBudgetSeconds]);

  const handleTick = useCallback((next: number) => {
    setUsedSeconds(next);
    persistUsage(next);
  }, [persistUsage]);

  const handleExhausted = useCallback(async (next: number) => {
    await saveUsage({ date: todayKey(), usedSeconds: next });
    setScreen('lock');
  }, []);

  const handleExitFeed = useCallback(async () => {
    await saveUsage({ date: todayKey(), usedSeconds });
    setScreen('home');
  }, [usedSeconds]);

  const handleSaveBudget = useCallback(async (seconds: number) => {
    const next: Settings = { ...settings, dailyBudgetSeconds: seconds };
    setSettings(next);
    await saveSettings(next);
    if (usedSeconds >= seconds) {
      setScreen('lock');
    }
  }, [settings, usedSeconds]);

  const handleResetToday = useCallback(async () => {
    await resetUsage();
    setUsedSeconds(0);
    setScreen('home');
  }, []);

  if (!loaded) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.root} />
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  let content: React.ReactNode = null;
  if (screen === 'onboarding') {
    content = <OnboardingScreen onComplete={handleOnboardingComplete} />;
  } else if (screen === 'home') {
    content = (
      <HomeScreen
        budgetSeconds={settings.dailyBudgetSeconds}
        usedSeconds={usedSeconds}
        onStartScrolling={handleStartScrolling}
        onOpenSettings={() => setScreen('settings')}
      />
    );
  } else if (screen === 'feed') {
    content = (
      <FeedScreen
        budgetSeconds={settings.dailyBudgetSeconds}
        initialUsedSeconds={usedSeconds}
        onTick={handleTick}
        onExit={handleExitFeed}
        onExhausted={handleExhausted}
      />
    );
  } else if (screen === 'lock') {
    content = (
      <LockScreen
        budgetSeconds={settings.dailyBudgetSeconds}
        onGoHome={() => setScreen('home')}
        onOpenSettings={() => setScreen('settings')}
      />
    );
  } else if (screen === 'settings') {
    content = (
      <SettingsScreen
        budgetSeconds={settings.dailyBudgetSeconds}
        usedSeconds={usedSeconds}
        onSaveBudget={handleSaveBudget}
        onResetToday={handleResetToday}
        onBack={() => setScreen(usedSeconds >= settings.dailyBudgetSeconds ? 'lock' : 'home')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      {content}
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
