import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MoodId } from './types';

const STORAGE_KEY = 'kakvodayam:journal:v1';

export type JournalEntry = {
  id: string;
  mealId: string;
  mealName: string;
  mealEmoji: string;
  moodId: MoodId;
  cookedAt: number;
  note?: string;
};

export async function getJournal(): Promise<JournalEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as JournalEntry[];
  } catch {
    return [];
  }
}

export async function addJournalEntry(
  entry: Omit<JournalEntry, 'id' | 'cookedAt'> & { cookedAt?: number },
): Promise<JournalEntry> {
  const now = entry.cookedAt ?? Date.now();
  const newEntry: JournalEntry = {
    id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
    cookedAt: now,
    ...entry,
  };
  const existing = await getJournal();
  const next = [newEntry, ...existing];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return newEntry;
}

export async function removeJournalEntry(id: string): Promise<void> {
  const existing = await getJournal();
  const next = existing.filter((e) => e.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export async function clearJournal(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export function hasCookedToday(
  entries: JournalEntry[],
  mealId: string,
): boolean {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const cutoff = startOfDay.getTime();
  return entries.some((e) => e.mealId === mealId && e.cookedAt >= cutoff);
}

export function formatRelativeDate(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return 'току-що';
  if (diffMin < 60) return `преди ${diffMin} мин.`;
  if (diffHr < 24) return `преди ${diffHr} ч.`;
  if (diffDay === 1) return 'вчера';
  if (diffDay < 7) return `преди ${diffDay} дни`;
  if (diffDay < 14) return 'миналата седмица';
  if (diffDay < 30) return `преди ${Math.floor(diffDay / 7)} седмици`;
  if (diffDay < 60) return 'миналия месец';
  return `преди ${Math.floor(diffDay / 30)} месеца`;
}
