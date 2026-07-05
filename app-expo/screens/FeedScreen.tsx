import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator,
  Alert, Image, RefreshControl, Modal, Dimensions, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  listVenuePosts, listHomePosts, toggleLike, reportPost, hidePostLocally,
  getSavedIds, toggleSave, adoptCuratedPosts, updatePostPhotos,
} from '../lib/feed';
import { addJournalEntry } from '../lib/journal';
import type { FeedPost, PostKind, VenueFilters, HomeFilters, FeedSort, Difficulty } from '../lib/feedTypes';

const C = {
  bg: '#FBEFE6', card: '#FFFDFB', ink: '#3B2A22', inkSoft: '#8A7264',
  accent: '#C2674A', accentDeep: '#A94E33', star: '#E3A233',
  starOff: 'rgba(59,42,34,0.18)', line: 'rgba(59,42,34,0.12)',
  chip: 'rgba(255,255,255,0.65)', seg: 'rgba(59,42,34,0.06)', green: '#6f9a45',
};

const VENUE_CUISINES = ['Скара', 'Българска', 'Здравословна', 'Fast food', 'Пица', 'Италианска', 'Азиатска', 'Морска'];
const PLACE_TYPES: { key: string; label: string }[] = [
  { key: 'restaurant', label: '🍽️ Ресторант' }, { key: 'cafe', label: '☕ Кафене' },
  { key: 'bar', label: '🍸 Бар' }, { key: 'patisserie', label: '🧁 Сладкарница' },
  { key: 'street', label: '🌭 Street food' },
];
const SORTS: { key: FeedSort; label: string }[] = [
  { key: 'recent', label: 'Най-нови' }, { key: 'top', label: 'Топ оценени' }, { key: 'popular', label: 'Популярни' },
];
const PREPS: { key: number; label: string }[] = [
  { key: 15, label: 'До 15 мин' }, { key: 30, label: 'До 30 мин' }, { key: 60, label: 'До 60 мин' },
];
const DIFFS: { key: Difficulty; label: string }[] = [
  { key: 'easy', label: 'Лесно' }, { key: 'medium', label: 'Средно' }, { key: 'hard', label: 'Трудно' },
];
const DIETS: { key: string; label: string }[] = [
  { key: 'postno', label: 'Постно' }, { key: 'vegetarian', label: 'Вегетарианско' }, { key: 'vegan', label: 'Веган' },
];
const BG_CITIES = [
  'София', 'Пловдив', 'Варна', 'Бургас', 'Русе', 'Стара Загора', 'Плевен', 'Сливен',
  'Добрич', 'Шумен', 'Перник', 'Хасково', 'Ямбол', 'Пазарджик', 'Благоевград',
  'Велико Търново', 'Враца', 'Габрово', 'Асеновград', 'Видин', 'Казанлък', 'Кюстендил',
  'Кърджали', 'Монтана', 'Димитровград', 'Търговище', 'Ловеч', 'Силистра', 'Смолян',
  'Банско', 'Несебър', 'Созопол',
];

function countVenue(f: VenueFilters) {
  return [f.city, f.cuisine, f.placeType, f.minDishRating, f.worthIt, f.sort && f.sort !== 'recent' ? f.sort : undefined].filter(Boolean).length;
}
function countHome(f: HomeFilters) {
  return [f.maxPrep, f.difficulty, f.diet, f.sort && f.sort !== 'recent' ? f.sort : undefined].filter(Boolean).length;
}

type Props = {
  onBack: () => void;
  onCompose: () => void;
  reloadKey?: number; // сменя се след публикуване, за да презареди
};

function Stars({ value }: { value: number | null | undefined }) {
  const v = value ?? 0;
  return (
    <Text style={styles.starsText}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Text key={n} style={{ color: n <= v ? C.star : C.starOff }}>★</Text>
      ))}
    </Text>
  );
}

function foodEmoji(post: FeedPost): string {
  if (post.kind === 'venue') return '🍽️';
  const t = ((post.tags || []).join(' ') + ' ' + (post.dish_name || '')).toLowerCase();
  if (t.includes('сандвич')) return '🥪';
  if (t.includes('паста') || t.includes('спагет')) return '🍝';
  if (t.includes('кафе')) return '☕';
  if (t.includes('салат')) return '🥗';
  if (t.includes('десерт') || t.includes('шоколад')) return '🍫';
  if (t.includes('боул') || t.includes('смути')) return '🥣';
  if (t.includes('закуск') || t.includes('яйц') || t.includes('омлет') || t.includes('шампион')) return '🍳';
  return '🍲';
}

function FoodImage({ uri, emoji, size = 'card' }: { uri: string | null | undefined; emoji: string; size?: 'card' | 'small' | 'big' }) {
  const [err, setErr] = useState(false);
  if (!uri || err) {
    return <Text style={{ fontSize: size === 'big' ? 64 : size === 'small' ? 24 : 44 }}>{emoji}</Text>;
  }
  return <Image source={{ uri }} style={styles.photoImg} onError={() => setErr(true)} resizeMode="cover" />;
}

export function FeedScreen({ onBack, onCompose, reloadKey = 0 }: Props) {
  const insets = useSafeAreaInsets();
  const [kind, setKind] = useState<PostKind>('venue');
  const [view, setView] = useState<'cards' | 'list'>('cards');
  const [venueFilters, setVenueFilters] = useState<VenueFilters>({});
  const [homeFilters, setHomeFilters] = useState<HomeFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showCity, setShowCity] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set());
  const [savedOnly, setSavedOnly] = useState(false);
  const [detailPost, setDetailPost] = useState<FeedPost | null>(null);

  const activeCount = kind === 'venue' ? countVenue(venueFilters) : countHome(homeFilters);

  useEffect(() => { getSavedIds().then((ids) => setSavedSet(new Set(ids))).catch(() => {}); }, [reloadKey]);
  useEffect(() => { adoptCuratedPosts(); }, []);

  const changePhoto = async (p: FeedPost) => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) { Alert.alert('Няма разрешение', 'Разреши достъп до снимките в настройките.'); return; }
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsMultipleSelection: true, selectionLimit: 3, quality: 0.7 });
      if (res.canceled || !res.assets?.length) return;
      const urls = await updatePostPhotos(p.id, res.assets.map((a) => a.uri));
      setDetailPost({ ...p, photo_url: urls[0] ?? null, photo_urls: urls });
      setPosts((prev) => prev.map((x) => x.id === p.id ? { ...x, photo_url: urls[0] ?? null, photo_urls: urls } : x));
    } catch {
      Alert.alert('Опа', 'Смяната не успя. Можеш да сменяш снимки само на свои постове.');
    }
  };

  const onSave = async (p: FeedPost) => {
    const nowSaved = await toggleSave(p.id);
    setSavedSet((prev) => {
      const next = new Set(prev);
      if (nowSaved) next.add(p.id); else next.delete(p.id);
      return next;
    });
  };

  const onCooked = async (p: FeedPost) => {
    try {
      await addJournalEntry({ mealId: p.id, mealName: p.dish_name, mealEmoji: '🍲', moodId: 'comfort' });
      Alert.alert('Браво! 🍽️', 'Записахме го в Дневника ти.');
    } catch {
      Alert.alert('Опа', 'Не успяхме да го запишем. Опитай пак.');
    }
  };

  const visiblePosts = savedOnly ? posts.filter((p) => savedSet.has(p.id)) : posts;

  const load = useCallback(async () => {
    try {
      const data = kind === 'venue'
        ? await listVenuePosts(venueFilters)
        : await listHomePosts(homeFilters);
      setPosts(data);
    } catch (e) {
      Alert.alert('Проблем', 'Неуспешно зареждане. Провери връзката.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [kind, venueFilters, homeFilters]);

  useEffect(() => { setLoading(true); load(); }, [load, reloadKey]);

  const onRefresh = () => { setRefreshing(true); load(); };

  const onLike = async (p: FeedPost) => {
    const liked = !!p.liked_by_me;
    // оптимистично
    setPosts((prev) => prev.map((x) => x.id === p.id
      ? { ...x, liked_by_me: !liked, like_count: x.like_count + (liked ? -1 : 1) }
      : x));
    try { await toggleLike(p.id, liked); }
    catch { load(); }
  };

  const onMore = (p: FeedPost) => {
    Alert.alert('Този пост', undefined, [
      { text: 'Докладвай (неуместно)', style: 'destructive', onPress: () => {
        reportPost(p.id).catch(() => {});
        setPosts((prev) => prev.filter((x) => x.id !== p.id));
      } },
      { text: 'Скрий', onPress: () => {
        hidePostLocally(p.id).catch(() => {});
        setPosts((prev) => prev.filter((x) => x.id !== p.id));
      } },
      { text: 'Отказ', style: 'cancel' },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.appbar}>
        <Pressable onPress={onBack} hitSlop={10} style={styles.iconbtn}>
          <Text style={styles.iconTxt}>←</Text>
        </Pressable>
        <Text style={styles.title}>Какво <Text style={{ color: C.accent }}>APP</Text>на?</Text>
        <View style={styles.viewtoggle}>
          <Pressable onPress={() => setView('cards')} style={[styles.vbtn, view === 'cards' && styles.vbtnOn]}>
            <Text style={[styles.vtxt, view === 'cards' && styles.vtxtOn]}>▦</Text>
          </Pressable>
          <Pressable onPress={() => setView('list')} style={[styles.vbtn, view === 'list' && styles.vbtnOn]}>
            <Text style={[styles.vtxt, view === 'list' && styles.vtxtOn]}>☰</Text>
          </Pressable>
        </View>
      </View>

      {/* Segmented */}
      <View style={styles.seg}>
        {(['venue', 'home'] as PostKind[]).map((k) => (
          <Pressable key={k} onPress={() => setKind(k)} style={[styles.segBtn, kind === k && styles.segBtnOn]}>
            <Text style={[styles.segTxt, kind === k && styles.segTxtOn]}>
              {k === 'venue' ? '🍴 Заведения' : '🍲 Вкъщи'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Quick filters + Филтри */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.crRow} contentContainerStyle={styles.crContent}>
        <Pressable onPress={() => setShowFilters(true)} style={[styles.cr, styles.crFilt]}>
          <Text style={[styles.crTxt, styles.crTxtOn]}>⚙ Филтри{activeCount ? ` · ${activeCount}` : ''}</Text>
        </Pressable>
        <Pressable onPress={() => setSavedOnly((v) => !v)} style={[styles.cr, savedOnly && styles.crOn]}>
          <Text style={[styles.crTxt, savedOnly && styles.crTxtOn]}>💾 Запазени</Text>
        </Pressable>
        {kind === 'venue'
          ? VENUE_CUISINES.map((c) => {
              const on = venueFilters.cuisine === c;
              return (
                <Pressable key={c} onPress={() => setVenueFilters((f) => ({ ...f, cuisine: on ? undefined : c }))} style={[styles.cr, on && styles.crOn]}>
                  <Text style={[styles.crTxt, on && styles.crTxtOn]}>{c}</Text>
                </Pressable>
              );
            })
          : PREPS.map((p) => {
              const on = homeFilters.maxPrep === p.key;
              return (
                <Pressable key={p.key} onPress={() => setHomeFilters((f) => ({ ...f, maxPrep: on ? undefined : p.key }))} style={[styles.cr, on && styles.crOn]}>
                  <Text style={[styles.crTxt, on && styles.crTxtOn]}>{p.label}</Text>
                </Pressable>
              );
            })}
      </ScrollView>

      {/* Feed */}
      {loading ? (
        <View style={styles.center}><ActivityIndicator color={C.accent} /></View>
      ) : visiblePosts.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>{savedOnly ? '💾' : '🍽️'}</Text>
          <Text style={styles.emptyTitle}>{savedOnly ? 'Няма запазени тук' : 'Все още няма постове'}</Text>
          <Text style={styles.emptySub}>{savedOnly ? 'Докосни 🔖 на рецепта, за да я запазиш.' : 'Бъди първата! Сподели какво яде.'}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 14, paddingBottom: 120 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />}
        >
          {visiblePosts.map((p) => view === 'cards'
            ? <PostCard key={p.id} post={p} saved={savedSet.has(p.id)} onLike={() => onLike(p)} onMore={() => onMore(p)} onSave={() => onSave(p)} onOpen={() => setDetailPost(p)} />
            : <PostRow key={p.id} post={p} saved={savedSet.has(p.id)} onLike={() => onLike(p)} onMore={() => onMore(p)} onSave={() => onSave(p)} onOpen={() => setDetailPost(p)} />)}
        </ScrollView>
      )}

      {/* Filter sheet */}
      <Modal visible={showFilters} transparent animationType="slide" onRequestClose={() => setShowFilters(false)}>
        <Pressable style={styles.backdrop} onPress={() => setShowFilters(false)} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.sheetHead}>
            <Text style={styles.sheetTitle}>Филтри</Text>
            <Pressable onPress={() => setShowFilters(false)} hitSlop={10}><Text style={styles.sheetX}>✕</Text></Pressable>
          </View>
          <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ gap: 16, paddingBottom: 8 }}>
            {kind === 'venue' ? (
              <>
                <View style={{ gap: 8 }}>
                  <Text style={styles.fgLabel}>Град</Text>
                  <Pressable onPress={() => { setCitySearch(''); setShowCity(true); }} style={styles.cityBtn}>
                    <Text style={[styles.cityBtnTxt, !venueFilters.city && { color: C.inkSoft }]}>{venueFilters.city ?? 'Всички градове'}</Text>
                    <Text style={styles.cityChevron}>▾</Text>
                  </Pressable>
                </View>
                <FGroup label="Сортирай по">
                  {SORTS.map((s) => (
                    <FChip key={s.key} on={(venueFilters.sort ?? 'recent') === s.key}
                      onPress={() => setVenueFilters((f) => ({ ...f, sort: s.key }))}>{s.label}</FChip>
                  ))}
                </FGroup>
                <FGroup label="Кухня">
                  {VENUE_CUISINES.map((c) => (
                    <FChip key={c} on={venueFilters.cuisine === c}
                      onPress={() => setVenueFilters((f) => ({ ...f, cuisine: f.cuisine === c ? undefined : c }))}>{c}</FChip>
                  ))}
                </FGroup>
                <FGroup label="Тип място">
                  {PLACE_TYPES.map((t) => (
                    <FChip key={t.key} on={venueFilters.placeType === t.key}
                      onPress={() => setVenueFilters((f) => ({ ...f, placeType: f.placeType === t.key ? undefined : t.key }))}>{t.label}</FChip>
                  ))}
                </FGroup>
                <FGroup label="Само">
                  <FChip on={venueFilters.minDishRating === 4}
                    onPress={() => setVenueFilters((f) => ({ ...f, minDishRating: f.minDishRating ? undefined : 4 }))}>⭐ 4+</FChip>
                  <FChip on={!!venueFilters.worthIt}
                    onPress={() => setVenueFilters((f) => ({ ...f, worthIt: f.worthIt ? undefined : true }))}>💰 Струваше си</FChip>
                </FGroup>
              </>
            ) : (
              <>
                <FGroup label="Сортирай по">
                  {SORTS.map((s) => (
                    <FChip key={s.key} on={(homeFilters.sort ?? 'recent') === s.key}
                      onPress={() => setHomeFilters((f) => ({ ...f, sort: s.key }))}>{s.label}</FChip>
                  ))}
                </FGroup>
                <FGroup label="Време">
                  {PREPS.map((p) => (
                    <FChip key={p.key} on={homeFilters.maxPrep === p.key}
                      onPress={() => setHomeFilters((f) => ({ ...f, maxPrep: f.maxPrep === p.key ? undefined : p.key }))}>{p.label}</FChip>
                  ))}
                </FGroup>
                <FGroup label="Трудност">
                  {DIFFS.map((d) => (
                    <FChip key={d.key} on={homeFilters.difficulty === d.key}
                      onPress={() => setHomeFilters((f) => ({ ...f, difficulty: f.difficulty === d.key ? undefined : d.key }))}>{d.label}</FChip>
                  ))}
                </FGroup>
                <FGroup label="Диета">
                  {DIETS.map((d) => (
                    <FChip key={d.key} on={homeFilters.diet === d.key}
                      onPress={() => setHomeFilters((f) => ({ ...f, diet: f.diet === d.key ? undefined : d.key }))}>{d.label}</FChip>
                  ))}
                </FGroup>
              </>
            )}
          </ScrollView>
          <View style={styles.sheetFoot}>
            <Pressable onPress={() => (kind === 'venue' ? setVenueFilters({}) : setHomeFilters({}))} style={styles.clearBtn}>
              <Text style={styles.clearTxt}>Изчисти</Text>
            </Pressable>
            <Pressable onPress={() => setShowFilters(false)} style={styles.applyBtn}>
              <Text style={styles.applyTxt}>Готово</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* City picker */}
      <Modal visible={showCity} transparent animationType="fade" onRequestClose={() => setShowCity(false)}>
        <Pressable style={styles.backdrop} onPress={() => setShowCity(false)} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.sheetHead}>
            <Text style={styles.sheetTitle}>Избери град</Text>
            <Pressable onPress={() => setShowCity(false)} hitSlop={10}><Text style={styles.sheetX}>✕</Text></Pressable>
          </View>
          <TextInput
            value={citySearch} onChangeText={setCitySearch}
            placeholder="Търси или напиши град…" placeholderTextColor={C.inkSoft}
            style={styles.cityInput}
          />
          <ScrollView style={{ maxHeight: 320 }} keyboardShouldPersistTaps="handled">
            <Pressable style={styles.cityItem} onPress={() => { setVenueFilters((f) => ({ ...f, city: undefined })); setShowCity(false); }}>
              <Text style={styles.cityItemTxt}>Всички градове</Text>
            </Pressable>
            {BG_CITIES.filter((c) => c.toLowerCase().includes(citySearch.trim().toLowerCase())).map((c) => (
              <Pressable key={c} style={styles.cityItem} onPress={() => { setVenueFilters((f) => ({ ...f, city: c })); setShowCity(false); }}>
                <Text style={styles.cityItemTxt}>{c}</Text>
              </Pressable>
            ))}
            {citySearch.trim() && !BG_CITIES.some((c) => c.toLowerCase() === citySearch.trim().toLowerCase()) ? (
              <Pressable style={styles.cityItem} onPress={() => { setVenueFilters((f) => ({ ...f, city: citySearch.trim() })); setShowCity(false); }}>
                <Text style={[styles.cityItemTxt, { color: C.accentDeep, fontWeight: '700' }]}>Търси „{citySearch.trim()}"</Text>
              </Pressable>
            ) : null}
          </ScrollView>
        </View>
      </Modal>

      {/* Detail */}
      <Modal visible={!!detailPost} animationType="slide" onRequestClose={() => setDetailPost(null)}>
        {detailPost ? (
          <View style={[styles.root, { paddingTop: insets.top }]}>
            <View style={styles.appbar}>
              <Pressable onPress={() => setDetailPost(null)} hitSlop={10} style={styles.iconbtn}><Text style={styles.iconTxt}>←</Text></Pressable>
              <Text style={styles.title} numberOfLines={1}>{detailPost.dish_name}</Text>
              <View style={{ width: 34 }} />
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
              {(detailPost.photo_urls?.length ?? 0) > 1 ? (
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{ height: 240 }}>
                  {detailPost.photo_urls!.map((u, i) => (
                    <Image key={i} source={{ uri: u }} style={{ width: Dimensions.get('window').width, height: 240 }} resizeMode="cover" />
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.dPhoto}>
                  <FoodImage uri={detailPost.photo_urls?.[0] ?? detailPost.photo_url} emoji={foodEmoji(detailPost)} size="big" />
                </View>
              )}
              <View style={{ padding: 18, gap: 12 }}>
                <Text style={styles.dTitle}>{detailPost.dish_name}</Text>
                {detailPost.kind === 'venue' && detailPost.place_name ? (
                  <Text style={styles.place}>📍 {detailPost.place_name}{detailPost.place_city ? ` · ${detailPost.place_city}` : ''}</Text>
                ) : null}
                {detailPost.kind === 'venue' ? (
                  <View style={styles.rating2}>
                    <View style={styles.rrow}><Text style={styles.rk}>🍴 Ястие</Text><Stars value={detailPost.dish_rating} /></View>
                    {detailPost.place_rating ? <View style={styles.rrow}><Text style={styles.rk}>🏠 Място</Text><Stars value={detailPost.place_rating} /></View> : null}
                  </View>
                ) : (
                  <View style={styles.metaRow}>
                    {detailPost.prep_minutes ? <Text style={styles.metaChip}>⏱️ {detailPost.prep_minutes} мин</Text> : null}
                    {detailPost.difficulty ? <Text style={styles.metaChip}>🔥 {diffLabel(detailPost.difficulty)}</Text> : null}
                    {detailPost.servings ? <Text style={styles.metaChip}>🍽️ {detailPost.servings} порции</Text> : null}
                  </View>
                )}
                {detailPost.comment ? <Text style={styles.comment}>{detailPost.comment}</Text> : null}
                {detailPost.ingredients ? (
                  <View style={{ gap: 4 }}>
                    <Text style={styles.dSection}>🧂 Съставки</Text>
                    <Text style={styles.dBody}>{detailPost.ingredients}</Text>
                  </View>
                ) : null}
                {detailPost.steps ? (
                  <View style={{ gap: 4 }}>
                    <Text style={styles.dSection}>👩‍🍳 Приготвяне</Text>
                    <Text style={styles.dBody}>{detailPost.steps}</Text>
                  </View>
                ) : null}
                <View style={styles.dActions}>
                  {detailPost.kind !== 'venue' ? (
                    <Pressable onPress={() => onCooked(detailPost)} style={styles.cookedBtn}><Text style={styles.cookedTxt}>🍳 Готвих го</Text></Pressable>
                  ) : null}
                  <Pressable onPress={() => onSave(detailPost)} style={styles.saveBtn}>
                    <Text style={styles.saveBtnTxt}>{savedSet.has(detailPost.id) ? '🔖 Запазено' : '📑 Запази'}</Text>
                  </Pressable>
                </View>
                <Pressable onPress={() => changePhoto(detailPost)} style={styles.photoBtn}>
                  <Text style={styles.photoBtnTxt}>📷 Промени снимка</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        ) : null}
      </Modal>

    </View>
  );
}

function FGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.fgLabel}>{label}</Text>
      <View style={styles.fgChips}>{children}</View>
    </View>
  );
}

function FChip({ on, onPress, children }: { on: boolean; onPress: () => void; children: React.ReactNode }) {
  return (
    <Pressable onPress={onPress} style={[styles.fchip, on && styles.fchipOn]}>
      <Text style={[styles.fchipTxt, on && styles.fchipTxtOn]}>{children}</Text>
    </Pressable>
  );
}

function PostCard({ post, saved, onLike, onMore, onSave, onOpen }: { post: FeedPost; saved: boolean; onLike: () => void; onMore: () => void; onSave: () => void; onOpen: () => void }) {
  const isVenue = post.kind === 'venue';
  return (
    <Pressable style={styles.card} onPress={onOpen}>
      <View style={styles.photo}>
        <FoodImage uri={post.photo_urls?.[0] ?? post.photo_url} emoji={foodEmoji(post)} />
        {(post.photo_urls?.length ?? 0) > 1 ? (
          <View style={styles.photoCount}><Text style={styles.photoCountTxt}>📷 {post.photo_urls!.length}</Text></View>
        ) : null}
        {isVenue && post.worth_it ? (
          <View style={styles.worth}><Text style={styles.worthTxt}>💰 струваше си</Text></View>
        ) : null}
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.dish}>{post.dish_name}</Text>
          <Pressable onPress={onMore} hitSlop={10}><Text style={styles.more}>⋯</Text></Pressable>
        </View>
        {isVenue && post.place_name ? (
          <Text style={styles.place}>📍 {post.place_name}{post.place_city ? ` · ${post.place_city}` : ''}</Text>
        ) : null}

        {isVenue ? (
          <View style={styles.rating2}>
            <View style={styles.rrow}><Text style={styles.rk}>🍴 Ястие</Text><Stars value={post.dish_rating} /></View>
            {post.place_rating ? (
              <View style={styles.rrow}><Text style={styles.rk}>🏠 Място</Text><Stars value={post.place_rating} /></View>
            ) : null}
          </View>
        ) : (
          <View style={styles.metaRow}>
            {post.prep_minutes ? <Text style={styles.metaChip}>⏱️ {post.prep_minutes} мин</Text> : null}
            {post.difficulty ? <Text style={styles.metaChip}>🔥 {diffLabel(post.difficulty)}</Text> : null}
            {post.servings ? <Text style={styles.metaChip}>🍽️ {post.servings} порции</Text> : null}
          </View>
        )}

        {post.comment ? <Text style={styles.comment} numberOfLines={2}>{post.comment}</Text> : null}
        {!isVenue ? (
          <Text style={styles.recipeLink}>📋 Виж рецептата →</Text>
        ) : null}

        <View style={styles.foot}>
          <Text style={styles.who}>{post.author_nickname ?? 'Анонимен'}</Text>
          <View style={styles.footActions}>
            <Pressable onPress={onSave} hitSlop={8}>
              <Text style={[styles.save, saved && styles.saveOn]}>{saved ? '🔖' : '📑'}</Text>
            </Pressable>
            <Pressable onPress={onLike} hitSlop={8}>
              <Text style={[styles.like, post.liked_by_me && styles.likeOn]}>
                {post.liked_by_me ? '❤️' : '🤍'} {post.like_count}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function PostRow({ post, saved, onLike, onMore, onSave, onOpen }: { post: FeedPost; saved: boolean; onLike: () => void; onMore: () => void; onSave: () => void; onOpen: () => void }) {
  const isVenue = post.kind === 'venue';
  return (
    <Pressable onPress={onOpen} onLongPress={onMore} style={styles.lrow}>
      <View style={styles.lphoto}>
        <FoodImage uri={post.photo_urls?.[0] ?? post.photo_url} emoji={foodEmoji(post)} size="small" />
      </View>
      <View style={styles.lbody}>
        <Text style={styles.ldish} numberOfLines={1}>
          {post.dish_name}
          {isVenue && post.place_name ? <Text style={styles.lcity}> · {post.place_name}</Text> : null}
        </Text>
        <Text style={styles.lrate}>
          🍴 {post.dish_rating.toFixed(1)}
          {isVenue && post.place_rating ? ` · 🏠 ${post.place_rating.toFixed(1)}` : ''}
          {!isVenue && post.prep_minutes ? ` · ⏱️ ${post.prep_minutes} мин` : ''}
        </Text>
      </View>
      <Pressable onPress={onSave} hitSlop={8}>
        <Text style={[styles.save, saved && styles.saveOn]}>{saved ? '🔖' : '📑'}</Text>
      </Pressable>
      <Pressable onPress={onLike} hitSlop={8}>
        <Text style={[styles.like, post.liked_by_me && styles.likeOn]}>
          {post.liked_by_me ? '❤️' : '🤍'} {post.like_count}
        </Text>
      </Pressable>
    </Pressable>
  );
}

function diffLabel(d: string) {
  return d === 'easy' ? 'Лесно' : d === 'hard' ? 'Трудно' : 'Средно';
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  appbar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, gap: 10 },
  iconbtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: C.chip },
  iconTxt: { fontSize: 20, color: C.ink },
  title: { flex: 1, fontFamily: 'InstrumentSerif_400Regular', fontSize: 24, color: C.ink },
  viewtoggle: { flexDirection: 'row', backgroundColor: C.seg, borderRadius: 999, padding: 3, gap: 2 },
  vbtn: { width: 30, height: 27, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  vbtnOn: { backgroundColor: C.accent },
  vtxt: { fontSize: 14, color: C.inkSoft },
  vtxtOn: { color: '#fff' },

  seg: { flexDirection: 'row', marginHorizontal: 14, backgroundColor: C.seg, borderRadius: 999, padding: 4, gap: 4 },
  segBtn: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 999 },
  segBtnOn: { backgroundColor: C.accent },
  segTxt: { fontSize: 14, fontWeight: '700', color: C.inkSoft },
  segTxtOn: { color: '#fff' },

  crRow: { flexGrow: 0, height: 60, marginTop: 2 },
  crContent: { paddingHorizontal: 14, gap: 8, alignItems: 'center' },
  cr: { height: 38, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 999, backgroundColor: C.chip, borderWidth: 1, borderColor: C.line },
  crOn: { backgroundColor: C.ink, borderColor: C.ink },
  crTxt: { fontSize: 13, lineHeight: 18, fontWeight: '600', color: C.ink },
  crTxtOn: { color: '#fff' },
  crFilt: { backgroundColor: C.accent, borderColor: C.accentDeep },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: { backgroundColor: C.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 18, paddingTop: 14 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sheetTitle: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 24, color: C.ink },
  sheetX: { fontSize: 18, color: C.inkSoft },
  fgLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, color: C.inkSoft },
  fgChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  fchip: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 999, backgroundColor: C.chip, borderWidth: 1, borderColor: C.line },
  fchipOn: { backgroundColor: C.accent, borderColor: C.accentDeep },
  fchipTxt: { fontSize: 13, fontWeight: '600', color: C.ink },
  fchipTxtOn: { color: '#fff' },
  cityBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 },
  cityBtnTxt: { fontSize: 15, fontWeight: '600', color: C.ink },
  cityChevron: { fontSize: 14, color: C.inkSoft },
  cityInput: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, color: C.ink, marginBottom: 8 },
  cityItem: { paddingVertical: 12, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: C.line },
  cityItemTxt: { fontSize: 15, color: C.ink },
  sheetFoot: { flexDirection: 'row', gap: 10, marginTop: 14 },
  clearBtn: { paddingHorizontal: 18, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: C.chip },
  clearTxt: { fontSize: 14, fontWeight: '700', color: C.inkSoft },
  applyBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: C.accent, alignItems: 'center' },
  applyTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: C.ink, marginBottom: 4 },
  emptySub: { fontSize: 14, color: C.inkSoft, textAlign: 'center' },

  card: { backgroundColor: C.card, borderRadius: 20, borderWidth: 1, borderColor: C.line, overflow: 'hidden', marginBottom: 14 },
  photo: { height: 150, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEDFD2' },
  photoImg: { width: '100%', height: '100%' },
  photoEmoji: { fontSize: 44 },
  worth: { position: 'absolute', right: 10, top: 10, backgroundColor: C.green, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
  photoCount: { position: 'absolute', left: 10, top: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
  photoCountTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
  worthTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
  cardBody: { padding: 13 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dish: { flex: 1, fontFamily: 'InstrumentSerif_400Regular', fontSize: 20, color: C.ink },
  more: { fontSize: 20, color: C.inkSoft, paddingHorizontal: 6 },
  place: { fontSize: 12, color: C.accentDeep, fontWeight: '600', marginTop: 2, marginBottom: 6 },
  rating2: { gap: 3, marginBottom: 8 },
  rrow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rk: { fontSize: 12, fontWeight: '700', color: C.inkSoft, width: 62 },
  starsText: { fontSize: 14, letterSpacing: 1 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  metaChip: { fontSize: 11, fontWeight: '600', color: C.inkSoft, backgroundColor: C.seg, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4, overflow: 'hidden' },
  comment: { fontSize: 13.5, lineHeight: 20, color: C.ink, marginBottom: 8 },
  recipe: { fontSize: 12.5, lineHeight: 18, color: C.inkSoft, marginBottom: 6 },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  footActions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  who: { fontSize: 12.5, fontWeight: '700', color: C.ink },
  like: { fontSize: 13, fontWeight: '700', color: C.inkSoft },
  likeOn: { color: C.accent },
  save: { fontSize: 16, color: C.inkSoft },
  saveOn: { color: C.accent },
  cookedBtn: { backgroundColor: C.accent, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' },
  cookedTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },
  recipeLink: { fontSize: 13, fontWeight: '700', color: C.accentDeep, marginBottom: 8 },

  dPhoto: { height: 240, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEDFD2' },
  dTitle: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 28, color: C.ink },
  dSection: { fontSize: 13, fontWeight: '800', color: C.ink, marginTop: 4 },
  dBody: { fontSize: 14.5, lineHeight: 22, color: C.ink },
  dActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  saveBtn: { flex: 1, borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingVertical: 12, alignItems: 'center', backgroundColor: C.chip },
  saveBtnTxt: { fontSize: 14, fontWeight: '700', color: C.ink },
  photoBtn: { borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingVertical: 12, alignItems: 'center', backgroundColor: C.chip },
  photoBtnTxt: { fontSize: 14, fontWeight: '700', color: C.accentDeep },

  lrow: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 8, marginBottom: 10 },
  lphoto: { width: 52, height: 52, borderRadius: 12, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEDFD2' },
  lphotoEmoji: { fontSize: 24 },
  lbody: { flex: 1, minWidth: 0 },
  ldish: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 16, color: C.ink },
  lcity: { fontFamily: undefined, fontSize: 12, color: C.inkSoft },
  lrate: { fontSize: 12, color: C.inkSoft, fontWeight: '600', marginTop: 3 },

  fab: { position: 'absolute', right: 20, width: 58, height: 58, borderRadius: 29, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', shadowColor: C.accentDeep, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  fabTxt: { color: '#fff', fontSize: 32, marginTop: -2 },
});
