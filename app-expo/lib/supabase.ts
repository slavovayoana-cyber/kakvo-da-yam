import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ozjrsivvcgrngvzejbtl.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_zTz8IVxsWorQoQ1E_1goxw_L4XU2uV5';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

const DEVICE_ID_KEY = 'kakvodayam:device_id:v1';

export async function getDeviceId(): Promise<string> {
  let id = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (id) return id;
  id = `dev_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
  await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}

/**
 * Гарантира невидим (анонимен) акаунт — създава го при първо ползване.
 * Дава стабилен user id (auth.uid()), с който заключваме собствеността на постовете.
 * Нужно е „Anonymous sign-ins" да е включено в Supabase → Authentication.
 */
export async function ensureAuth(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) return session.user.id;
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    return data.user?.id ?? null;
  } catch {
    return null; // приложението продължава да работи; feed действията ще уведомят при нужда
  }
}

/** Връща текущия user id (или го създава). null ако анонимният вход не е включен. */
export async function getUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) return user.id;
  return ensureAuth();
}
