import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator,
  Alert, Image, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  listVenuePosts, listHomePosts, toggleLike, reportPost, hidePostLocally,
} from '../lib/feed';
import type { FeedPost, PostKind } from '../lib/feedTypes';

const C = {
  bg: '#FBEFE6', card: '#FFFDFB', ink: '#3B2A22', inkSoft: '#8A7264',
  accent: '#C2674A', accentDeep: '#A94E33', star: '#E3A233',
  starOff: 'rgba(59,42,34,0.18)', line: 'rgba(59,42,34,0.12)',
  chip: 'rgba(255,255,255,0.65)', seg: 'rgba(59,42,34,0.06)', green: '#6f9a45',
};

const VENUE_CUISINES = ['Скара', 'Българска', 'Fast food', 'Пица', 'Азиатска', 'Морска', 'Кафене'];
const HOME_QUICK = ['До 30 мин', 'Постно', 'Десерт'];

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

export function FeedScreen({ onBack, onCompose, reloadKey = 0 }: Props) {
  const insets = useSafeAreaInsets();
  const [kind, setKind] = useState<PostKind>('venue');
  const [view, setView] = useState<'cards' | 'list'>('cards');
  const [quick, setQuick] = useState<string | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      let data: FeedPost[];
      if (kind === 'venue') {
        data = await listVenuePosts(quick ? { cuisine: quick } : {});
      } else {
        const f: any = {};
        if (quick === 'До 30 мин') f.maxPrep = 30;
        else if (quick === 'Постно') f.diet = 'postno';
        // 'Десерт' би бил таг — оставяме за по-късно
        data = await listHomePosts(f);
      }
      setPosts(data);
    } catch (e) {
      Alert.alert('Проблем', 'Неуспешно зареждане. Провери връзката.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [kind, quick]);

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

  const quickChips = kind === 'venue' ? VENUE_CUISINES : HOME_QUICK;

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
          <Pressable key={k} onPress={() => { setKind(k); setQuick(null); }} style={[styles.segBtn, kind === k && styles.segBtnOn]}>
            <Text style={[styles.segTxt, kind === k && styles.segTxtOn]}>
              {k === 'venue' ? '🍴 Заведения' : '🍲 Вкъщи'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Quick filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.crRow} contentContainerStyle={styles.crContent}>
        {quickChips.map((c) => {
          const on = quick === c;
          return (
            <Pressable key={c} onPress={() => setQuick(on ? null : c)} style={[styles.cr, on && styles.crOn]}>
              <Text style={[styles.crTxt, on && styles.crTxtOn]}>{c}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Feed */}
      {loading ? (
        <View style={styles.center}><ActivityIndicator color={C.accent} /></View>
      ) : posts.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>🍽️</Text>
          <Text style={styles.emptyTitle}>Все още няма постове</Text>
          <Text style={styles.emptySub}>Бъди първата! Сподели какво яде.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 14, paddingBottom: 120 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />}
        >
          {posts.map((p) => view === 'cards'
            ? <PostCard key={p.id} post={p} onLike={() => onLike(p)} onMore={() => onMore(p)} />
            : <PostRow key={p.id} post={p} onLike={() => onLike(p)} onMore={() => onMore(p)} />)}
        </ScrollView>
      )}

      {/* FAB */}
      <Pressable onPress={onCompose} style={[styles.fab, { bottom: insets.bottom + 22 }]}>
        <Text style={styles.fabTxt}>＋</Text>
      </Pressable>
    </View>
  );
}

function PostCard({ post, onLike, onMore }: { post: FeedPost; onLike: () => void; onMore: () => void }) {
  const isVenue = post.kind === 'venue';
  return (
    <View style={styles.card}>
      <View style={styles.photo}>
        {post.photo_url
          ? <Image source={{ uri: post.photo_url }} style={styles.photoImg} />
          : <Text style={styles.photoEmoji}>{isVenue ? '🍽️' : '🍲'}</Text>}
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

        {post.comment ? <Text style={styles.comment}>{post.comment}</Text> : null}
        {!isVenue && post.ingredients ? (
          <Text style={styles.recipe} numberOfLines={4}>🧂 {post.ingredients}</Text>
        ) : null}
        {!isVenue && post.steps ? (
          <Text style={styles.recipe} numberOfLines={6}>👩‍🍳 {post.steps}</Text>
        ) : null}

        <View style={styles.foot}>
          <Text style={styles.who}>{post.author_nickname ?? 'Анонимен'}</Text>
          <Pressable onPress={onLike} hitSlop={8}>
            <Text style={[styles.like, post.liked_by_me && styles.likeOn]}>
              {post.liked_by_me ? '❤️' : '🤍'} {post.like_count}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function PostRow({ post, onLike, onMore }: { post: FeedPost; onLike: () => void; onMore: () => void }) {
  const isVenue = post.kind === 'venue';
  return (
    <Pressable onLongPress={onMore} style={styles.lrow}>
      <View style={styles.lphoto}>
        {post.photo_url
          ? <Image source={{ uri: post.photo_url }} style={styles.photoImg} />
          : <Text style={styles.lphotoEmoji}>{isVenue ? '🍽️' : '🍲'}</Text>}
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

  crRow: { maxHeight: 52, marginTop: 4 },
  crContent: { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  cr: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 999, backgroundColor: C.chip, borderWidth: 1, borderColor: C.line },
  crOn: { backgroundColor: C.ink, borderColor: C.ink },
  crTxt: { fontSize: 13, fontWeight: '600', color: C.ink },
  crTxtOn: { color: C.bg },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: C.ink, marginBottom: 4 },
  emptySub: { fontSize: 14, color: C.inkSoft, textAlign: 'center' },

  card: { backgroundColor: C.card, borderRadius: 20, borderWidth: 1, borderColor: C.line, overflow: 'hidden', marginBottom: 14 },
  photo: { height: 150, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEDFD2' },
  photoImg: { width: '100%', height: '100%' },
  photoEmoji: { fontSize: 44 },
  worth: { position: 'absolute', right: 10, top: 10, backgroundColor: C.green, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
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
  who: { fontSize: 12.5, fontWeight: '700', color: C.ink },
  like: { fontSize: 13, fontWeight: '700', color: C.inkSoft },
  likeOn: { color: C.accent },

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
