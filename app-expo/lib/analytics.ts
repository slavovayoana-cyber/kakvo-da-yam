import PostHog from 'posthog-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppEventsLogger, Settings } from 'react-native-fbsdk-next';
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';
import { AppState, Platform } from 'react-native';

// ── Config ───────────────────────────────────────────────────────────────
// PostHog project API key — find it in PostHog → Project Settings → API Keys.
// Safe to ship in the client (it's a write-only "project" key, not personal).
export const POSTHOG_API_KEY = 'phc_AdiRajjJRDeTz9Ehdm8oQNfAobZGh6JLAxpRRaqAnsLN';
export const POSTHOG_HOST = 'https://eu.i.posthog.com'; // EU cloud

// Show the iOS App Tracking Transparency prompt on first launch. It must appear
// before any tracking data is collected, and App Review (which only opens the
// app once or twice on a fresh install) has to be able to see it.
const ATT_DONE_KEY = 'att_prompt_done_v1';

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

/** Resolves once the app is in the foreground (`active`) — iOS silently drops
 * the ATT prompt if it is requested while the app is not active. */
function whenActive(): Promise<void> {
  return new Promise((resolve) => {
    if (AppState.currentState === 'active') return resolve();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        sub.remove();
        resolve();
      }
    });
  });
}

/**
 * Shows the iOS ATT prompt once, on the first launch, after the app is active.
 * On Android this is a no-op (no ATT; Meta uses GAID directly).
 */
async function maybeRequestTracking(): Promise<void> {
  if (Platform.OS !== 'ios') return;
  try {
    if (await AsyncStorage.getItem(ATT_DONE_KEY)) return;

    const current = await getTrackingPermissionsAsync();
    if (current.status !== 'undetermined') return;

    // Wait until the app is foregrounded, then give the UI a beat to settle so
    // iOS reliably presents the system prompt.
    await whenActive();
    await new Promise((r) => setTimeout(r, 600));

    const res = await requestTrackingPermissionsAsync();
    // Only mark as done if the user actually answered. If iOS dropped the prompt
    // (e.g. another system alert was up), status stays "undetermined" — leave the
    // flag unset so we retry on the next launch instead of never asking again.
    if (res.status !== 'undetermined') {
      await AsyncStorage.setItem(ATT_DONE_KEY, '1');
    }
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
