import PostHog from 'posthog-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppEventsLogger, Settings } from 'react-native-fbsdk-next';
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';
import { Platform } from 'react-native';

// ── Config ───────────────────────────────────────────────────────────────
// PostHog project API key — find it in PostHog → Project Settings → API Keys.
// Safe to ship in the client (it's a write-only "project" key, not personal).
export const POSTHOG_API_KEY = 'phc_AdiRajjJRDeTz9Ehdm8oQNfAobZGh6JLAxpRRaqAnsLN';
export const POSTHOG_HOST = 'https://eu.i.posthog.com'; // EU cloud

// Show the iOS App Tracking Transparency prompt only after the user has opened
// the app a few times and seen its value — this lifts opt-in rates a lot.
const LAUNCH_COUNT_KEY = 'app_launch_count_v1';
const ATT_DONE_KEY = 'att_prompt_done_v1';
const ATT_AFTER_LAUNCHES = 3;

let posthog: PostHog | null = null;

// ── Init ─────────────────────────────────────────────────────────────────

/**
 * Initialise analytics once at app start. PostHog starts immediately; Meta is
 * initialised with whatever tracking permission already exists. The iOS ATT
 * prompt itself is deferred to the Nth launch (see maybeRequestTracking).
 */
export async function initAnalytics(): Promise<void> {
  // PostHog — product analytics (installs, screens, events, funnels).
  try {
    if (!POSTHOG_API_KEY.startsWith('REPLACE_')) {
      posthog = new PostHog(POSTHOG_API_KEY, {
        host: POSTHOG_HOST,
        captureAppLifecycleEvents: true,
      });
    }
  } catch {
    // analytics must never crash the app
  }

  // Meta SDK — init with current permission (no prompt yet on iOS).
  try {
    if (Platform.OS === 'ios') {
      const current = await getTrackingPermissionsAsync();
      Settings.setAdvertiserTrackingEnabled(current.granted);
      Settings.setAdvertiserIDCollectionEnabled(current.granted);
    }
    Settings.initializeSDK();
    AppEventsLogger.logEvent('app_launch');
  } catch {
    // ignore
  }

  // Count this launch and, once the threshold is reached, show the ATT prompt.
  maybeRequestTracking();
}

/**
 * Increments the launch counter and, on the 3rd+ launch, shows the iOS ATT
 * prompt once. On Android this is a no-op (no ATT; Meta uses GAID directly).
 */
async function maybeRequestTracking(): Promise<void> {
  if (Platform.OS !== 'ios') return;
  try {
    if (await AsyncStorage.getItem(ATT_DONE_KEY)) return;

    const raw = await AsyncStorage.getItem(LAUNCH_COUNT_KEY);
    const count = (raw ? parseInt(raw, 10) : 0) + 1;
    await AsyncStorage.setItem(LAUNCH_COUNT_KEY, String(count));
    if (count < ATT_AFTER_LAUNCHES) return;

    const current = await getTrackingPermissionsAsync();
    if (current.status !== 'undetermined') return;

    await AsyncStorage.setItem(ATT_DONE_KEY, '1');
    const res = await requestTrackingPermissionsAsync();
    Settings.setAdvertiserTrackingEnabled(res.granted);
    Settings.setAdvertiserIDCollectionEnabled(res.granted);
  } catch {
    // ignore
  }
}

// ── Event tracking ───────────────────────────────────────────────────────

type Props = Record<string, string | number | boolean | null>;

/** Track a product event in PostHog and mirror key ones to Meta. */
export function track(event: string, props?: Props): void {
  try {
    posthog?.capture(event, props ?? undefined);
  } catch {
    // ignore
  }
}

/** Log a Meta App Event — used for ad campaign optimization/conversions. */
export function trackMeta(event: string, params?: Record<string, string | number>): void {
  try {
    AppEventsLogger.logEvent(event, params as never);
  } catch {
    // ignore
  }
}

// ── Convenience wrappers for the app's key actions ───────────────────────

export const Analytics = {
  mealPicked(meal: string, mood: string, time: string | null) {
    track('meal_picked', { meal, mood, time: time ?? 'any' });
    trackMeta('meal_picked');
  },
  moodSelected(mood: string) {
    track('mood_selected', { mood });
  },
  timeSelected(time: string) {
    track('time_selected', { time });
  },
  rerolled(count: number) {
    track('rerolled', { count });
  },
  nearbyOpened(meal: string) {
    track('nearby_opened', { meal });
    trackMeta('nearby_opened');
  },
  shared(meal: string) {
    track('shared', { meal });
    trackMeta('fb_mobile_content_view', { meal: 0 });
  },
  cooked(meal: string) {
    track('cooked', { meal });
  },
  coupleStarted() {
    track('couple_started');
    trackMeta('couple_started');
  },
  coupleMatched(meal: string) {
    track('couple_matched', { meal });
  },
  notificationsEnabled(slots: string) {
    track('notifications_enabled', { slots });
  },
};
