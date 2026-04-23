import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DailyUsage, Settings } from './types';

const SETTINGS_KEY = 'dsb:settings:v1';
const USAGE_KEY = 'dsb:usage:v1';

export const DEFAULT_SETTINGS: Settings = {
  dailyBudgetSeconds: 10 * 60,
  onboarded: false,
};

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function loadSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(s: Settings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export async function loadUsage(): Promise<DailyUsage> {
  try {
    const raw = await AsyncStorage.getItem(USAGE_KEY);
    const today = todayKey();
    if (!raw) return { date: today, usedSeconds: 0 };
    const parsed = JSON.parse(raw) as DailyUsage;
    if (parsed.date !== today) return { date: today, usedSeconds: 0 };
    return parsed;
  } catch {
    return { date: todayKey(), usedSeconds: 0 };
  }
}

export async function saveUsage(u: DailyUsage): Promise<void> {
  await AsyncStorage.setItem(USAGE_KEY, JSON.stringify(u));
}

export async function resetAll(): Promise<void> {
  await AsyncStorage.multiRemove([SETTINGS_KEY, USAGE_KEY]);
}

export async function resetUsage(): Promise<void> {
  await AsyncStorage.removeItem(USAGE_KEY);
}
