import { supabase, getDeviceId } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type CoupleSession = {
  id: string;
  code: string;
  creator_device_id: string;
  partner_device_id: string | null;
  meal_pool: string[];
  status: 'waiting' | 'active' | 'matched' | 'expired';
  matched_meal_id: string | null;
  created_at: string;
  expires_at: string;
};

export type CoupleSwipe = {
  id: string;
  session_id: string;
  device_id: string;
  meal_id: string;
  direction: 'left' | 'right';
  created_at: string;
};

export type SessionRole = 'creator' | 'partner';

const POOL_SIZE = 50;

function generateCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function pickPool(allMealIds: string[], n: number): string[] {
  const shuffled = [...allMealIds].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

export async function createSession(allMealIds: string[]): Promise<{
  session: CoupleSession;
  role: SessionRole;
}> {
  const deviceId = await getDeviceId();
  const pool = pickPool(allMealIds, POOL_SIZE);

  // Try a few times in case of code collision
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    const { data, error } = await supabase
      .from('couple_sessions')
      .insert({
        code,
        creator_device_id: deviceId,
        meal_pool: pool,
        status: 'waiting',
      })
      .select()
      .single();

    if (!error && data) {
      return { session: data as CoupleSession, role: 'creator' };
    }
    // 23505 = unique violation (code collision) — retry
    if (error && error.code !== '23505') {
      throw error;
    }
  }
  throw new Error('Could not create session — too many code collisions');
}

export async function findSessionByCode(
  code: string,
): Promise<CoupleSession | null> {
  const { data, error } = await supabase
    .from('couple_sessions')
    .select('*')
    .eq('code', code)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error) throw error;
  return (data as CoupleSession) ?? null;
}

export async function getSession(sessionId: string): Promise<CoupleSession | null> {
  const { data, error } = await supabase
    .from('couple_sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle();
  if (error) throw error;
  return (data as CoupleSession) ?? null;
}

export async function joinSession(
  sessionId: string,
): Promise<{ session: CoupleSession; role: SessionRole }> {
  const deviceId = await getDeviceId();
  const { data, error } = await supabase
    .from('couple_sessions')
    .update({
      partner_device_id: deviceId,
      status: 'active',
    })
    .eq('id', sessionId)
    .is('partner_device_id', null)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Session already has a partner or expired');

  return { session: data as CoupleSession, role: 'partner' };
}

export async function recordSwipe(
  sessionId: string,
  mealId: string,
  direction: 'left' | 'right',
): Promise<void> {
  const deviceId = await getDeviceId();
  const { error } = await supabase.from('couple_swipes').insert({
    session_id: sessionId,
    device_id: deviceId,
    meal_id: mealId,
    direction,
  });
  // 23505 = unique violation (already swiped same meal). Safe to ignore.
  if (error && error.code !== '23505') {
    console.warn('[recordSwipe] failed:', error.message, error.code);
    throw error;
  }
}

export async function getSwipes(sessionId: string): Promise<CoupleSwipe[]> {
  const { data, error } = await supabase
    .from('couple_swipes')
    .select('*')
    .eq('session_id', sessionId);
  if (error) throw error;
  return (data as CoupleSwipe[]) ?? [];
}

export async function markSessionMatched(
  sessionId: string,
  mealId: string,
): Promise<void> {
  await supabase
    .from('couple_sessions')
    .update({ status: 'matched', matched_meal_id: mealId })
    .eq('id', sessionId);
}

export function subscribeToSession(
  sessionId: string,
  onUpdate: (session: CoupleSession) => void,
): RealtimeChannel {
  return supabase
    .channel(`couple_session:${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'couple_sessions',
        filter: `id=eq.${sessionId}`,
      },
      (payload) => {
        onUpdate(payload.new as CoupleSession);
      },
    )
    .subscribe();
}

export function subscribeToSwipes(
  sessionId: string,
  onSwipe: (swipe: CoupleSwipe) => void,
): RealtimeChannel {
  return supabase
    .channel(`couple_swipes:${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'couple_swipes',
        filter: `session_id=eq.${sessionId}`,
      },
      (payload) => {
        onSwipe(payload.new as CoupleSwipe);
      },
    )
    .subscribe();
}

/**
 * Given the swipes seen so far, find the first meal both partners
 * swiped right on. Returns the meal id or null.
 */
export function detectMatch(
  swipes: CoupleSwipe[],
  creatorId: string,
  partnerId: string | null,
): string | null {
  if (!partnerId) return null;
  const creatorRights = new Set(
    swipes
      .filter((s) => s.device_id === creatorId && s.direction === 'right')
      .map((s) => s.meal_id),
  );
  const partnerRights = swipes
    .filter((s) => s.device_id === partnerId && s.direction === 'right')
    .map((s) => s.meal_id);

  for (const mealId of partnerRights) {
    if (creatorRights.has(mealId)) return mealId;
  }
  return null;
}
