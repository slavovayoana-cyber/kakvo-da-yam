import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// MARK: - Types

export type NotifSlot = 'breakfast' | 'lunch' | 'dinner';

export interface NotifSettings {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

const DEFAULT_SETTINGS: NotifSettings = {
  breakfast: false,
  lunch: false,
  dinner: false,
};

const STORAGE_KEY = 'notif_settings_v1';

// MARK: - Messages

const MESSAGES: Record<NotifSlot, string[]> = {
  breakfast: [
    'Добро утро. Хладилникът те чака.',
    'Ако не закусиш сега, ще вземеш лоши решения по-късно.',
  ],
  lunch: [
    'Стомахът ти изпрати напомняне. Ние го препредаваме.',
    'Ако не ядеш сега, следващото ти решение ще е грешно.',
    'Животът е кратък. Обядът — още по-кратък.',
    'Обедното меню е единственото нещо в България, което все още е изгодно.',
  ],
  dinner: [
    'Какво е за вечеря? Хладилникът не знае. Ние може би.',
    'Ако не решиш сега, ще ядеш корнфлейкс пак.',
  ],
};

// Weekday hours (24h format)
const HOURS: Record<NotifSlot, number> = {
  breakfast: 8,
  lunch: 12,
  dinner: 19,
};
const MINUTES: Record<NotifSlot, number> = {
  breakfast: 30,
  lunch: 30,
  dinner: 0,
};

// Weekend hours (later)
const WEEKEND_HOURS: Record<NotifSlot, number> = {
  breakfast: 10,
  lunch: 13,
  dinner: 19,
};

function randomMessage(slot: NotifSlot): string {
  const msgs = MESSAGES[slot];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

// MARK: - Permissions

export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// MARK: - Storage

export async function loadSettings(): Promise<NotifSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: NotifSettings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

// MARK: - Scheduling

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function scheduleAll(settings: NotifSettings): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const granted = await requestPermissions();
  if (!granted) return;

  const slots: NotifSlot[] = ['breakfast', 'lunch', 'dinner'];

  for (const slot of slots) {
    if (!settings[slot]) continue;

    // Schedule for each day of the week
    for (let weekday = 1; weekday <= 7; weekday++) {
      const isWeekend = weekday === 1 || weekday === 7; // Sun=1, Sat=7
      const hour = isWeekend ? WEEKEND_HOURS[slot] : HOURS[slot];
      const minute = MINUTES[slot];

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Какво да ям?',
          body: randomMessage(slot),
          sound: false,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday,
          hour,
          minute,
        },
      });
    }
  }
}

export async function cancelAll(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
