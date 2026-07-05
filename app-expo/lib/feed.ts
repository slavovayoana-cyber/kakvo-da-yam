// Слой за връзка с Supabase за секцията „Какво APPна?".
// Изисква таблиците от supabase/feed_schema.sql.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, getDeviceId, getUserId } from './supabase';
import type {
  FeedPost, FeedProfile, NewVenuePost, NewHomePost,
  VenueFilters, HomeFilters, PlaceStat,
} from './feedTypes';

const PHOTO_BUCKET = 'feed-photos';
const HIDDEN_KEY = 'kakvodayam:feed_hidden:v1';
const SAVED_KEY = 'kakvodayam:feed_saved:v1';
const BLOCKED_KEY = 'kakvodayam:feed_blocked_authors:v1';
const PAGE = 20;

// ---------- Запазени рецепти (локално) ----------

export async function getSavedIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(SAVED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** Превключва „запазено" за пост; връща новото състояние (true = вече е запазено). */
export async function toggleSave(postId: string): Promise<boolean> {
  const ids = await getSavedIds();
  const idx = ids.indexOf(postId);
  if (idx >= 0) {
    ids.splice(idx, 1);
    await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(ids));
    return false;
  }
  ids.unshift(postId);
  await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(ids));
  return true;
}

// ---------- Профил (прякор) ----------

export async function getMyProfile(): Promise<FeedProfile | null> {
  const deviceId = await getDeviceId();
  const { data, error } = await supabase
    .from('feed_profiles')
    .select('*')
    .eq('device_id', deviceId)
    .maybeSingle();
  if (error) throw error;
  return (data as FeedProfile) ?? null;
}

export async function setNickname(nickname: string): Promise<FeedProfile> {
  const deviceId = await getDeviceId();
  const userId = await getUserId();
  if (!userId) throw new Error('NO_AUTH');
  const clean = nickname.trim();
  const { data, error } = await supabase
    .from('feed_profiles')
    .upsert({ device_id: deviceId, user_id: userId, nickname: clean }, { onConflict: 'device_id' })
    .select()
    .single();
  if (error) throw error;
  return data as FeedProfile;
}

/** Гарантира, че има профил преди публикуване (иначе иска прякор). */
async function requireProfile(): Promise<FeedProfile> {
  const p = await getMyProfile();
  if (!p) throw new Error('NO_PROFILE');
  return p;
}

// ---------- Помощни ----------

export function makePlaceKey(name: string, city?: string): string {
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
  return `${norm(name)}|${norm(city ?? '')}`;
}

/** Качва локална снимка в Storage и връща публичен URL. */
export async function uploadPhoto(localUri: string, contentType = 'image/jpeg'): Promise<string> {
  const deviceId = await getDeviceId();
  const ext = contentType.includes('png') ? 'png' : 'jpg';
  const rand = Math.random().toString(36).slice(2);
  const path = `${deviceId}/${Date.now()}_${rand}.${ext}`;

  const res = await fetch(localUri);
  const bytes = await res.arrayBuffer();

  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, bytes, { contentType, upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Качва няколко локални снимки и връща публичните им URL-и. */
export async function uploadPhotos(localUris: string[]): Promise<string[]> {
  const urls: string[] = [];
  for (const uri of localUris.slice(0, 3)) {
    urls.push(await uploadPhoto(uri));
  }
  return urls;
}

// ---------- Създаване ----------

export async function createVenuePost(input: NewVenuePost): Promise<FeedPost> {
  const profile = await requireProfile();
  const userId = await getUserId();
  if (!userId) throw new Error('NO_AUTH');
  const photo_urls = input.photoUris?.length ? await uploadPhotos(input.photoUris) : [];

  const { data, error } = await supabase
    .from('feed_posts')
    .insert({
      author_device_id: profile.device_id,
      user_id: userId,
      kind: 'venue',
      mod_status: 'pending',   // изчаква AI проверка на снимките
      photo_urls,
      photo_url: photo_urls[0] ?? null,
      dish_name: input.dishName.trim(),
      comment: input.comment?.trim() || null,
      dish_rating: input.dishRating,
      place_name: input.placeName.trim(),
      place_city: input.placeCity?.trim() || null,
      place_maps_url: input.placeMapsUrl || null,
      place_key: makePlaceKey(input.placeName, input.placeCity),
      place_rating: input.placeRating ?? null,
      worth_it: input.worthIt ?? null,
      cuisine: input.cuisine ?? null,
      place_type: input.placeType ?? null,
      tags: input.tags ?? [],
    })
    .select()
    .single();
  if (error) throw error;
  return { ...(data as FeedPost), author_nickname: profile.nickname, liked_by_me: false };
}

export async function createHomePost(input: NewHomePost): Promise<FeedPost> {
  const profile = await requireProfile();
  const userId = await getUserId();
  if (!userId) throw new Error('NO_AUTH');
  const photo_urls = input.photoUris?.length ? await uploadPhotos(input.photoUris) : [];

  const { data, error } = await supabase
    .from('feed_posts')
    .insert({
      author_device_id: profile.device_id,
      user_id: userId,
      kind: 'home',
      mod_status: 'pending',   // изчаква AI проверка на снимките
      photo_urls,
      photo_url: photo_urls[0] ?? null,
      dish_name: input.dishName.trim(),
      comment: input.comment?.trim() || null,
      dish_rating: input.dishRating,
      prep_minutes: input.prepMinutes ?? null,
      difficulty: input.difficulty ?? null,
      servings: input.servings ?? null,
      diet: input.diet ?? null,
      ingredients: input.ingredients?.trim() || null,
      steps: input.steps?.trim() || null,
      tags: input.tags ?? [],
    })
    .select()
    .single();
  if (error) throw error;
  return { ...(data as FeedPost), author_nickname: profile.nickname, liked_by_me: false };
}

// ---------- Четене ----------

function applySort(query: any, sort: string | undefined) {
  if (sort === 'top') return query.order('dish_rating', { ascending: false }).order('created_at', { ascending: false });
  if (sort === 'popular') return query.order('like_count', { ascending: false }).order('created_at', { ascending: false });
  return query.order('created_at', { ascending: false });
}

/** Добавя liked_by_me + author_nickname и маха локално скритите постове. */
async function enrich(rows: any[]): Promise<FeedPost[]> {
  const deviceId = await getDeviceId();
  const hidden = await getHiddenIds();
  const blocked = await getBlockedAuthors();
  const posts: FeedPost[] = rows
    .filter((r) => !hidden.includes(r.id) && !blocked.includes(r.author_device_id))
    .map((r) => ({
      ...r,
      author_nickname: r.author?.nickname ?? null,
    }));

  if (posts.length) {
    const ids = posts.map((p) => p.id);
    const { data: likes } = await supabase
      .from('feed_likes')
      .select('post_id')
      .eq('device_id', deviceId)
      .in('post_id', ids);
    const likedSet = new Set((likes ?? []).map((l: any) => l.post_id));
    posts.forEach((p) => { p.liked_by_me = likedSet.has(p.id); });
  }
  return posts;
}

export async function listVenuePosts(f: VenueFilters = {}, page = 0): Promise<FeedPost[]> {
  let q = supabase
    .from('feed_posts')
    .select('*, author:feed_profiles(nickname)')
    .eq('kind', 'venue')
    .eq('status', 'active');

  if (f.cuisine) q = q.eq('cuisine', f.cuisine);
  if (f.placeType) q = q.eq('place_type', f.placeType);
  if (f.city) q = q.ilike('place_city', f.city);
  if (f.minDishRating) q = q.gte('dish_rating', f.minDishRating);
  if (f.worthIt) q = q.eq('worth_it', true);

  q = applySort(q, f.sort).range(page * PAGE, page * PAGE + PAGE - 1);
  const { data, error } = await q;
  if (error) throw error;
  return enrich(data ?? []);
}

export async function listHomePosts(f: HomeFilters = {}, page = 0): Promise<FeedPost[]> {
  let q = supabase
    .from('feed_posts')
    .select('*, author:feed_profiles(nickname)')
    .eq('kind', 'home')
    .eq('status', 'active');

  if (f.maxPrep) q = q.lte('prep_minutes', f.maxPrep);
  if (f.difficulty) q = q.eq('difficulty', f.difficulty);
  if (f.diet) q = q.contains('diet', [f.diet]);

  q = applySort(q, f.sort).range(page * PAGE, page * PAGE + PAGE - 1);
  const { data, error } = await q;
  if (error) throw error;
  return enrich(data ?? []);
}

/** „Осиновява" курираните рецепти под текущия акаунт (веднъж), за да може
 *  редакторът да им сменя снимките. Прави нищо, ако вече са осиновени. */
export async function adoptCuratedPosts(): Promise<void> {
  try { await supabase.rpc('feed_adopt_curated'); } catch { /* тихо */ }
}

/** Качва нови снимки (до 3) и ги записва на поста (само за свои постове — RLS). */
export async function updatePostPhotos(postId: string, uris: string[]): Promise<string[]> {
  // Вече качените снимки (http/https) се запазват както са; качват се само новите локални.
  const urls: string[] = [];
  for (const uri of uris.slice(0, 3)) {
    urls.push(/^https?:/.test(uri) ? uri : await uploadPhoto(uri));
  }
  const { error } = await supabase
    .from('feed_posts')
    .update({ photo_urls: urls, photo_url: urls[0] ?? null })
    .eq('id', postId);
  if (error) throw error;
  return urls;
}

/** Предложения за заведения от вече публикуваните постове (без външно API). */
export async function searchPlaces(query: string): Promise<{ place_name: string; place_city: string | null; place_key: string }[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const { data, error } = await supabase
    .from('feed_place_stats')
    .select('place_key, place_name, place_city')
    .ilike('place_name', `%${q}%`)
    .limit(6);
  if (error) throw error;
  return (data ?? []) as { place_name: string; place_city: string | null; place_key: string }[];
}

/** Зарежда постове по списък от id-та (за „Запазени" в Дневника), в реда на ids. */
export async function getPostsByIds(ids: string[]): Promise<FeedPost[]> {
  if (!ids.length) return [];
  const { data, error } = await supabase
    .from('feed_posts')
    .select('*, author:feed_profiles(nickname)')
    .in('id', ids)
    .eq('status', 'active');
  if (error) throw error;
  const byId = new Map<string, FeedPost>();
  (data ?? []).forEach((r: any) => byId.set(r.id, { ...r, author_nickname: r.author?.nickname ?? null }));
  return ids.map((id) => byId.get(id)).filter(Boolean) as FeedPost[];
}

/** Обобщена статистика за заведение (среден рейтинг, брой постове). */
export async function getPlaceStats(placeKey: string): Promise<PlaceStat | null> {
  const { data, error } = await supabase
    .from('feed_place_stats')
    .select('*')
    .eq('place_key', placeKey)
    .maybeSingle();
  if (error) throw error;
  return (data as PlaceStat) ?? null;
}

// ---------- Харесвания ----------

export async function toggleLike(postId: string, currentlyLiked: boolean): Promise<boolean> {
  const deviceId = await getDeviceId();
  const userId = await getUserId();
  if (!userId) throw new Error('NO_AUTH');
  if (currentlyLiked) {
    const { error } = await supabase
      .from('feed_likes')
      .delete()
      .eq('post_id', postId)
      .eq('device_id', deviceId);
    if (error) throw error;
    return false;
  }
  const { error } = await supabase
    .from('feed_likes')
    .insert({ post_id: postId, device_id: deviceId, user_id: userId });
  if (error) throw error;
  return true;
}

// ---------- Модерация ----------

export async function reportPost(postId: string, reason?: string): Promise<void> {
  const deviceId = await getDeviceId();
  const userId = await getUserId();
  const { error } = await supabase
    .from('feed_reports')
    .insert({ post_id: postId, device_id: deviceId, user_id: userId, reason: reason ?? null });
  if (error) throw error;
  // и скриваме локално веднага
  await hidePostLocally(postId);
}

// Локално скриване (веднага, без сървър) — за „скрий този пост" и блокиране.
async function getHiddenIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(HIDDEN_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export async function hidePostLocally(postId: string): Promise<void> {
  const ids = await getHiddenIds();
  if (!ids.includes(postId)) {
    ids.push(postId);
    await AsyncStorage.setItem(HIDDEN_KEY, JSON.stringify(ids));
  }
}

// Блокиране на потребител (локално): скрива всичките му постове.
async function getBlockedAuthors(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(BLOCKED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export async function blockAuthor(authorDeviceId: string): Promise<void> {
  const ids = await getBlockedAuthors();
  if (!ids.includes(authorDeviceId)) {
    ids.push(authorDeviceId);
    await AsyncStorage.setItem(BLOCKED_KEY, JSON.stringify(ids));
  }
}
