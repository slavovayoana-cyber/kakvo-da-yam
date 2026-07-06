import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, Pressable, StyleSheet, ScrollView, Alert, Share, Platform, ActivityIndicator,
  Image, Modal,
} from 'react-native';
import { getSavedIds, getPostsByIds } from '../lib/feed';
import type { FeedPost } from '../lib/feedTypes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { ALL_THEME, getTheme } from '../lib/moodSystem';
import { tapLight, tapMedium } from '../lib/haptics';
import { EmojiImage } from '../components/EmojiImage';
import { PersonalityCard } from '../components/PersonalityCard';
import { PersonalityShareCard } from '../components/PersonalityShareCard';
import {
  type JournalEntry,
  formatRelativeDate,
  removeJournalEntry,
} from '../lib/journal';
import { computePersonality } from '../lib/personality';

type Props = {
  entries: JournalEntry[];
  onBack: () => void;
  onChange: () => void;
};

export function JournalScreen({ entries, onBack, onChange }: Props) {
  const theme = ALL_THEME;
  const insets = useSafeAreaInsets();
  const personalityResult = computePersonality(entries);
  const cardRef = useRef<View>(null);

  const sharePersonality = async () => {
    tapLight();
    const p = personalityResult.personality;
    const fallbackMessage = `Кулинарната ми личност: ${p.emoji} ${p.title}\n„${p.tagline}"\n\n— от приложението „Какво да ям?"\n📲 https://noomup.com/kakvo-da-yam/`;

    try {
      if (cardRef.current) {
        const uri = await captureRef(cardRef, {
          format: 'png',
          quality: 1,
          result: 'tmpfile',
          width: 1080,
          height: 1920,
        });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'Кулинарната ми личност',
            UTI: 'public.png',
          });
          return;
        }
      }
    } catch {
      // capture failed — fall through to text share
    }

    try {
      await Share.share(
        Platform.OS === 'ios'
          ? { message: fallbackMessage }
          : { message: fallbackMessage, title: 'Какво да ям?' },
      );
    } catch {
      // dismissed
    }
  };

  const handleDelete = (entry: JournalEntry) => {
    Alert.alert(
      'Изтрий запис',
      `Наистина ли искаш да премахнеш "${entry.mealName}" от дневника?`,
      [
        { text: 'Отказ', style: 'cancel' },
        {
          text: 'Изтрий',
          style: 'destructive',
          onPress: async () => {
            tapMedium();
            await removeJournalEntry(entry.id);
            onChange();
          },
        },
      ],
    );
  };

  const [tab, setTab] = useState<'cooked' | 'saved'>('cooked');
  const [saved, setSaved] = useState<FeedPost[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [detail, setDetail] = useState<FeedPost | null>(null);

  // Отваря рецептата по id (за записи в „Сготвено", които идват от Feed).
  const openById = async (id: string) => {
    try {
      const posts = await getPostsByIds([id]);
      if (posts.length) setDetail(posts[0]);
    } catch { /* не е рецепта от feed-а — нищо */ }
  };
  useEffect(() => {
    if (tab !== 'saved') return;
    setLoadingSaved(true);
    getSavedIds().then(getPostsByIds).then(setSaved).catch(() => setSaved([])).finally(() => setLoadingSaved(false));
  }, [tab]);

  const total = entries.length;
  const uniqueMeals = new Set(entries.map((e) => e.mealId)).size;

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <LinearGradient
        colors={theme.gradient.colors as readonly [string, string, ...string[]]}
        locations={
          theme.gradient.locations as
            | readonly [number, number, ...number[]]
            | undefined
        }
        start={theme.gradient.start}
        end={theme.gradient.end}
        style={StyleSheet.absoluteFill}
      />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => { tapLight(); onBack(); }}
          style={({ pressed }) => [
            styles.backBtn,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={[styles.backIcon, { color: theme.ink }]}>←</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.ink }]}>
          Дневник
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.jseg}>
          <Pressable onPress={() => { tapLight(); setTab('cooked'); }} style={[styles.jsegBtn, tab === 'cooked' && styles.jsegOn]}>
            <Text style={[styles.jsegTxt, { color: theme.ink }, tab === 'cooked' && styles.jsegTxtOn]}>🍳 Сготвено</Text>
          </Pressable>
          <Pressable onPress={() => { tapLight(); setTab('saved'); }} style={[styles.jsegBtn, tab === 'saved' && styles.jsegOn]}>
            <Text style={[styles.jsegTxt, { color: theme.ink }, tab === 'saved' && styles.jsegTxtOn]}>🔖 Запазени</Text>
          </Pressable>
        </View>

        {tab === 'saved' ? (
          <SavedList posts={saved} loading={loadingSaved} inkColor={theme.ink} onOpen={setDetail} />
        ) : (
        <>
        <PersonalityCard
          result={personalityResult}
          onShare={personalityResult.isReady ? sharePersonality : undefined}
        />

        {/* Stats card */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.ink }]}>{total}</Text>
            <Text style={[styles.statLabel, { color: theme.ink }]}>
              {total === 1 ? 'ястие' : 'ястия'}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.ink }]}>{uniqueMeals}</Text>
            <Text style={[styles.statLabel, { color: theme.ink }]}>
              {uniqueMeals === 1 ? 'различно' : 'различни'}
            </Text>
          </View>
        </View>

        {entries.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={[styles.emptyTitle, { color: theme.ink }]}>
              Дневникът ти е празен
            </Text>
            <Text style={[styles.emptyText, { color: theme.ink }]}>
              Когато получиш препоръка и я сготвиш,{'\n'}
              натисни „Готвих го!" за да я запишеш тук.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {entries.map((entry) => {
              const moodTheme = getTheme(entry.moodId);
              return (
                <Pressable
                  key={entry.id}
                  onPress={() => openById(entry.mealId)}
                  onLongPress={() => handleDelete(entry)}
                  style={({ pressed }) => [
                    styles.entryCard,
                    { opacity: pressed ? 0.85 : 1 },
                  ]}
                >
                  <View style={styles.entryEmoji}>
                    <EmojiImage emoji={entry.mealEmoji} size={42} />
                  </View>
                  <View style={styles.entryBody}>
                    <Text
                      style={[styles.entryName, { color: theme.ink }]}
                      numberOfLines={1}
                    >
                      {entry.mealName}
                    </Text>
                    <View style={styles.entryMeta}>
                      <View
                        style={[
                          styles.entryMoodPill,
                          { backgroundColor: moodTheme.color },
                        ]}
                      >
                        <Text style={styles.entryMoodText}>{moodTheme.name}</Text>
                      </View>
                      <Text style={[styles.entryDate, { color: theme.ink }]}>
                        {formatRelativeDate(entry.cookedAt)}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
            <Text style={[styles.hint, { color: theme.ink }]}>
              Задръж върху запис за да го изтриеш
            </Text>
          </View>
        )}
        </>
        )}
      </ScrollView>

      <View style={styles.offscreen} pointerEvents="none">
        <PersonalityShareCard ref={cardRef} result={personalityResult} />
      </View>

      {detail ? <RecipeDetail post={detail} onClose={() => setDetail(null)} /> : null}
    </View>
  );
}

function SavedList({ posts, loading, inkColor, onOpen }: { posts: FeedPost[]; loading: boolean; inkColor: string; onOpen: (p: FeedPost) => void }) {
  if (loading) {
    return <View style={{ paddingVertical: 50, alignItems: 'center' }}><ActivityIndicator color="#C2674A" /></View>;
  }
  if (!posts.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>🔖</Text>
        <Text style={[styles.emptyTitle, { color: inkColor }]}>Няма запазени</Text>
        <Text style={[styles.emptyText, { color: inkColor }]}>Докосни 🔖 на рецепта в „APPна",{'\n'}за да я запазиш тук.</Text>
      </View>
    );
  }
  return (
    <View style={styles.list}>
      {posts.map((p) => (
        <Pressable key={p.id} onPress={() => onOpen(p)} style={({ pressed }) => [styles.entryCard, { opacity: pressed ? 0.85 : 1 }]}>
          <View style={styles.entryEmoji}>
            {p.photo_urls?.[0] || p.photo_url
              ? <Image source={{ uri: p.photo_urls?.[0] ?? p.photo_url ?? undefined }} style={styles.savedThumb} resizeMode="cover" />
              : <Text style={{ fontSize: 30 }}>{p.kind === 'venue' ? '🍽️' : '🍲'}</Text>}
          </View>
          <View style={styles.entryBody}>
            <Text style={[styles.entryName, { color: inkColor }]} numberOfLines={1}>{p.dish_name}</Text>
            <Text style={[styles.entryDate, { color: inkColor }]} numberOfLines={1}>
              {p.kind === 'venue' ? (p.place_name || 'заведение') : `рецепта${p.prep_minutes ? ` · ${p.prep_minutes} мин` : ''}`}
            </Text>
          </View>
          <Text style={{ color: inkColor, fontSize: 20, opacity: 0.4 }}>›</Text>
        </Pressable>
      ))}
    </View>
  );
}

function RecipeDetail({ post, onClose }: { post: FeedPost; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const isVenue = post.kind === 'venue';
  const photos = post.photo_urls?.length ? post.photo_urls : (post.photo_url ? [post.photo_url] : []);
  const stars = (n: number | null | undefined) => '★'.repeat(n ?? 0) + '☆'.repeat(Math.max(0, 5 - (n ?? 0)));
  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View style={[styles.dRoot, { paddingTop: insets.top }]}>
        <View style={styles.dBar}>
          <Pressable onPress={onClose} hitSlop={10} style={styles.dBack}><Text style={styles.dBackTxt}>←</Text></Pressable>
          <Text style={styles.dTitle} numberOfLines={1}>{post.dish_name}</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
          {photos.length ? (
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
              {photos.map((u, i) => <Image key={i} source={{ uri: u }} style={styles.dPhoto} resizeMode="cover" />)}
            </ScrollView>
          ) : (
            <View style={styles.dNoPhoto}><Text style={{ fontSize: 64 }}>{isVenue ? '🍽️' : '🍲'}</Text></View>
          )}
          <View style={styles.dBody}>
            <Text style={styles.dName}>{post.dish_name}</Text>
            <Text style={styles.dAuthor}>от {post.author_nickname ?? 'Анонимен'}</Text>

            {isVenue ? (
              <View style={{ gap: 4, marginTop: 8 }}>
                {post.place_name ? <Text style={styles.dMeta}>📍 {post.place_name}{post.place_city ? ` · ${post.place_city}` : ''}</Text> : null}
                <Text style={styles.dMeta}>🍴 Ястие: <Text style={styles.dStars}>{stars(post.dish_rating)}</Text></Text>
                {post.place_rating ? <Text style={styles.dMeta}>🏠 Място: <Text style={styles.dStars}>{stars(post.place_rating)}</Text></Text> : null}
                {post.worth_it ? <Text style={styles.dMeta}>💰 Струваше си</Text> : null}
              </View>
            ) : (
              <View style={styles.dChips}>
                {post.prep_minutes ? <Text style={styles.dChip}>⏱️ {post.prep_minutes} мин</Text> : null}
                {post.servings ? <Text style={styles.dChip}>🍽️ {post.servings} порции</Text> : null}
                <Text style={styles.dChip}>🍴 {stars(post.dish_rating)}</Text>
              </View>
            )}

            {post.comment ? <Text style={styles.dComment}>„{post.comment}"</Text> : null}

            {!isVenue && post.ingredients ? (
              <>
                <Text style={styles.dSection}>🧂 Съставки</Text>
                <Text style={styles.dText}>{post.ingredients}</Text>
              </>
            ) : null}
            {!isVenue && post.steps ? (
              <>
                <Text style={styles.dSection}>📋 Приготвяне</Text>
                <Text style={styles.dText}>{post.steps}</Text>
              </>
            ) : null}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 56, overflow: 'hidden' },
  jseg: { flexDirection: 'row', gap: 6, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 999, padding: 4, marginBottom: 16 },
  jsegBtn: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 999 },
  jsegOn: { backgroundColor: '#C2674A' },
  jsegTxt: { fontFamily: 'Geist_600SemiBold', fontSize: 13.5, fontWeight: '600' },
  jsegTxtOn: { color: '#fff' },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 3,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 18 },
  headerTitle: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.01 * 17,
  },
  scroll: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 32 },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 18,
    paddingVertical: 16,
    marginBottom: 18,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: {
    fontFamily: 'Fraunces_500Medium',
    fontSize: 32,
    fontWeight: '500',
    lineHeight: 38,
  },
  statLabel: {
    fontFamily: 'GeistMono_400Regular',
    fontSize: 10,
    letterSpacing: 0.18 * 10,
    textTransform: 'uppercase',
    opacity: 0.55,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyEmoji: { fontSize: 56, marginBottom: 18 },
  emptyTitle: {
    fontFamily: 'Fraunces_500Medium',
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    lineHeight: 14 * 1.5,
    textAlign: 'center',
    opacity: 0.65,
  },
  list: { gap: 10 },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 14,
  },
  entryEmoji: {
    width: 52,
    height: 52,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryBody: { flex: 1, justifyContent: 'center' },
  entryName: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 15.5,
    fontWeight: '600',
    letterSpacing: -0.01 * 15.5,
    marginBottom: 6,
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  entryMoodPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  entryMoodText: {
    fontFamily: 'Geist_600SemiBold',
    color: '#fff',
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: -0.005 * 10.5,
  },
  entryDate: {
    fontFamily: 'Geist_400Regular',
    fontSize: 11.5,
    opacity: 0.55,
  },
  hint: {
    fontFamily: 'Geist_400Regular',
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.45,
    marginTop: 14,
    fontStyle: 'italic',
  },
  offscreen: {
    position: 'absolute',
    left: -10000,
    top: 0,
  },
  savedThumb: { width: 52, height: 52, borderRadius: 13 },
  // Детайл на рецепта
  dRoot: { flex: 1, backgroundColor: '#FBEEE3' },
  dBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 },
  dBack: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center' },
  dBackTxt: { fontSize: 20, color: '#3A2A20' },
  dTitle: { flex: 1, textAlign: 'center', fontFamily: 'Fraunces_500Medium', fontSize: 18, color: '#3A2A20' },
  dPhoto: { width: 360, height: 270, backgroundColor: '#EEDFD2' },
  dNoPhoto: { height: 200, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEDFD2' },
  dBody: { padding: 18 },
  dName: { fontFamily: 'Fraunces_500Medium', fontSize: 26, color: '#3A2A20', lineHeight: 32 },
  dAuthor: { fontFamily: 'Geist_600SemiBold', fontSize: 14, color: '#8A6A54', marginTop: 4 },
  dMeta: { fontFamily: 'Geist_400Regular', fontSize: 15, color: '#5A4636', lineHeight: 22 },
  dStars: { color: '#E0A72E' },
  dChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  dChip: { backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, fontSize: 13, color: '#5A4636', fontWeight: '600', overflow: 'hidden' },
  dComment: { fontFamily: 'Geist_400Regular', fontSize: 16, fontStyle: 'italic', color: '#3A2A20', lineHeight: 24, marginTop: 14 },
  dSection: { fontFamily: 'Geist_600SemiBold', fontSize: 16, color: '#3A2A20', marginTop: 22, marginBottom: 8 },
  dText: { fontFamily: 'Geist_400Regular', fontSize: 15, color: '#4A392C', lineHeight: 24 },
});
