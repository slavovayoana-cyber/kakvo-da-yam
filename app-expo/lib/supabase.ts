import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ozjrsivvcgrngvzejbtl.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_zTz8IVxsWorQoQ1E_1goxw_L4XU2uV5';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    persistSession: false,
    autoRefreshToken: false,
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
