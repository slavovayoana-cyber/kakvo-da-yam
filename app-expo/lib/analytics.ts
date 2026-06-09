import PostHog from 'posthog-react-native';
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

let posthog: PostHog | null = null;

// ── Init ─────────────────────────────────────────────────────────────────

/**
 * Initialise analytics once at app start. Sets up PostHog and, after the iOS
 * App Tracking Transparency prompt, enables Meta (Facebook) ad attribution so
 * install campaigns can measure conversions.
 */
export async function initAnalytics(): Promise<void> {
  // PostHog — product analytics (installs, screens, events, funnels).
  try {
    if (!POSTHOG_API_KEY.startsWith('REPLACE_')) {
      posthog = new PostHog(POSTHOG_API_KEY, {
        host: POSTHOG_HOST,
        // Autocapture lifecycle + app open/close out of the box.
        captureAppLifecycleEvents: true,
      });
    }
  } catch {
    // analytics must never crash the app
  }

  // Meta SDK — ask for tracking permission (iOS ATT), then enable ad events.
  try {
    if (Platform.OS === 'ios') {
      const current = await getTrackingPermissionsAsync();
      let granted = current.granted;
      if (current.status === 'undetermined') {
        const res = await requestTrackingPermissionsAsync();
        granted = res.granted;
      }
      // Only collect advertiser ID / auto-log if the user allowed tracking.
      Settings.setAdvertiserTrackingEnabled(granted);
      Settings.setAdvertiserIDCollectionEnabled(granted);
    }
    Settings.initializeSDK();
    AppEventsLogger.logEvent('app_launch');
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
