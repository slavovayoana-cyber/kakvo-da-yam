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

// On first launch we opt the user into a gentle 2/day cadence (lunch + dinner)
// if they grant permission — breakfast stays off so it's never spammy.
const FIRST_RUN_SETTINGS: NotifSettings = {
  breakfast: false,
  lunch: true,
  dinner: true,
};

const STORAGE_KEY = 'notif_settings_v1';
const FIRST_RUN_KEY = 'notif_first_run_done_v1';

// MARK: - Messages

const MESSAGES: Record<NotifSlot, string[]> = {
  breakfast: [
    'Добро утро. Да започнем деня с най-трудния въпрос.',
    'Закуска или пак ще живееш на кафе и надежди?',
    'Току-що проверихме хладилника. Положението е същото.',
    'Ако закусиш сега, бъдещото ти аз ще ти е благодарно.',
    'Няма да казваме, че си гладен. Стомахът ти вече го прави.',
    'Събуди се. Време е да вземем поне ЕДНО добро решение днес.',
  ],
  lunch: [
    'Напомняне: работата не се брои за обяд.',
    'Ако обядът ти е „ще видим по-късно“, това е интервенция.',
    'Мозъкът ти работи. Стомахът ти стачкува.',
    'Време е да спреш да се преструваш, че не си гладен.',
    'Следващият ти импулсивен избор може да е баничка.',
    'Не можем да вдигнем заплатата ти. Но можем да помогнем с обяда.',
    'Това не е нотификация. Това е вик за помощ от стомаха ти.',
    'Стомахът ти звъни. Да вдигнем ли?',
    'Не казваме, че си гладен. Казваме, че ставаш опасен.',
    'Стомахът ти вече написа три жалби.',
  ],
  dinner: [
    'Ако не решиш скоро, ще ядеш каквото намериш първо.',
    'Да позная ли? Пак не знаеш какво ти се яде.',
    'Време е за вечеря, преди да започнеш да ядеш от скука.',
    'Хладилникът няма да се отвори за пети път сам.',
    'Това е последното предупреждение преди режима „каквото има“.',
    'Спри да чакаш вдъхновение. Търсим вечеря, не сродна душа.',
    'Да отвориш хладилника 6 пъти не се брои за готвене.',
    'Има хора, които знаят какво ще вечерят. Не сме от тях.',
    'Светът праща хора на Луната. Ти още избираш вечеря.',
    'Отвори ме преди да поръчаш нещо, за което после ще съжаляваш.',
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

// Picks a message that varies by weekday so each day shows a different line.
// We offset each slot by a different amount so breakfast/lunch/dinner on the
// same day don't all land on the same index of their pools.
function messageForDay(slot: NotifSlot, weekday: number): string {
  const msgs = MESSAGES[slot];
  const offset = slot === 'lunch' ? 3 : slot === 'dinner' ? 6 : 0;
  return msgs[(weekday - 1 + offset) % msgs.length];
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

// Android 8+ requires every notification to belong to a channel, otherwise
// scheduled reminders silently never appear. Created once before scheduling.
const ANDROID_CHANNEL_ID = 'meal-reminders';

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Напомняния за хранене',
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: undefined,
  });
}

export async function scheduleAll(settings: NotifSettings): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const granted = await requestPermissions();
  if (!granted) return;

  await ensureAndroidChannel();

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
          body: messageForDay(slot, weekday),
          sound: false,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday,
          hour,
          minute,
          channelId: ANDROID_CHANNEL_ID,
        },
      });
    }
  }
}

export async function cancelAll(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Runs once on the very first app launch: prompts for notification permission
 * and, if granted, opts the user into the default 2/day cadence (lunch +
 * dinner). Subsequent launches are a no-op so we never re-prompt or override
 * the user's own choices.
 */
export async function runFirstLaunchSetup(): Promise<void> {
  try {
    const done = await AsyncStorage.getItem(FIRST_RUN_KEY);
    if (done) return;
    await AsyncStorage.setItem(FIRST_RUN_KEY, '1');

    const granted = await requestPermissions();
    if (granted) {
      await saveSettings(FIRST_RUN_SETTINGS);
      await scheduleAll(FIRST_RUN_SETTINGS);
    }
  } catch {
    // ignore — notifications are non-critical
  }
}
