import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ALL_THEME, getTheme } from '../lib/moodSystem';
import { tapLight, tapMedium, tapSelection } from '../lib/haptics';
import { EmojiImage } from '../components/EmojiImage';
import {
  type CoupleSession,
  type SessionRole,
  type CoupleSwipe,
  detectMatch,
  getSwipes,
  recordSwipe,
  markSessionMatched,
  subscribeToSwipes,
} from '../lib/couples';
import type { Meal } from '../lib/types';

const SCREEN_W = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_W * 0.28;

type Props = {
  session: CoupleSession;
  role: SessionRole;
  allMeals: Meal[];
  onMatch: (meal: Meal) => void;
  onExit: () => void;
  onExhaust: () => void;
};

export function CoupleSwipeScreen({
  session,
  role,
  allMeals,
  onMatch,
  onExit,
  onExhaust,
}: Props) {
  const theme = ALL_THEME;
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [partnerSwipeCount, setPartnerSwipeCount] = useState(0);
  const swipesRef = useRef<CoupleSwipe[]>([]);
  const matchedRef = useRef(false);

  const myDeviceIdRef = useRef<string | null>(null);
  useEffect(() => {
    myDeviceIdRef.current =
      role === 'creator' ? session.creator_device_id : session.partner_device_id;
  }, [role, session]);

  // Build the ordered list of meals from the session pool
  const pool = useMemo<Meal[]>(() => {
    const byId = new Map(allMeals.map((m) => [m.id, m]));
    return session.meal_pool
      .map((id) => byId.get(id))
      .filter((m): m is Meal => Boolean(m));
  }, [session.meal_pool, allMeals]);

  // Animated values for the top card
  const pos = useRef(new Animated.ValueXY()).current;

  const checkMatch = (allSwipes: CoupleSwipe[]) => {
    if (matchedRef.current) return;
    const mealId = detectMatch(
      allSwipes,
      session.creator_device_id,
      session.partner_device_id,
    );
    if (mealId) {
      const meal = allMeals.find((m) => m.id === mealId);
      if (meal) {
        matchedRef.current = true;
        markSessionMatched(session.id, mealId).catch(() => {});
        onMatch(meal);
      }
    }
  };

  // Subscribe to swipes from other player (and ours, for completeness)
  // Plus polling fallback every 2s in case realtime is unreliable.
  useEffect(() => {
    let mounted = true;

    const sync = async () => {
      try {
        const fresh = await getSwipes(session.id);
        if (!mounted) return;
        // Merge: keep optimistic locals (they have id starting "local-") if no
        // matching server record yet
        const serverIds = new Set(fresh.map((s) => s.id));
        const localOnly = swipesRef.current.filter(
          (s) =>
            s.id.startsWith('local-') &&
            !fresh.some(
              (f) =>
                f.device_id === s.device_id &&
                f.meal_id === s.meal_id &&
                f.direction === s.direction,
            ),
        );
        swipesRef.current = [...fresh, ...localOnly];
        const partner = fresh.filter(
          (s) => s.device_id !== myDeviceIdRef.current,
        ).length;
        setPartnerSwipeCount(partner);
        checkMatch(swipesRef.current);
      } catch {
        // ignore — will retry next tick
      }
    };

    // Initial sync
    sync();

    // Realtime
    const channel = subscribeToSwipes(session.id, (swipe) => {
      if (!mounted) return;
      if (swipesRef.current.some((s) => s.id === swipe.id)) return;
      swipesRef.current = [...swipesRef.current, swipe];
      if (swipe.device_id !== myDeviceIdRef.current) {
        setPartnerSwipeCount((c) => c + 1);
      }
      checkMatch(swipesRef.current);
    });

    // Polling fallback every 2s
    const poll = setInterval(sync, 2000);

    return () => {
      mounted = false;
      clearInterval(poll);
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.id]);

  const advance = (direction: 'left' | 'right') => {
    const meal = pool[index];
    if (!meal) return;

    // Optimistically add to local swipes
    const optimistic: CoupleSwipe = {
      id: `local-${Date.now()}`,
      session_id: session.id,
      device_id: myDeviceIdRef.current ?? '',
      meal_id: meal.id,
      direction,
      created_at: new Date().toISOString(),
    };
    swipesRef.current = [...swipesRef.current, optimistic];
    checkMatch(swipesRef.current);

    recordSwipe(session.id, meal.id, direction).catch((e) => {
      Alert.alert(
        'Swipe не се запази',
        e instanceof Error ? e.message : String(e),
      );
    });

    setIndex((i) => i + 1);
    pos.setValue({ x: 0, y: 0 });

    if (index + 1 >= pool.length && !matchedRef.current) {
      // Slight delay so the user sees the last card animate out
      setTimeout(() => {
        if (!matchedRef.current) onExhaust();
      }, 300);
    }
  };

  const swipeOff = (direction: 'left' | 'right') => {
    tapMedium();
    Animated.timing(pos, {
      toValue: {
        x: direction === 'right' ? SCREEN_W * 1.5 : -SCREEN_W * 1.5,
        y: 60,
      },
      duration: 280,
      useNativeDriver: false,
    }).start(() => advance(direction));
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 4 || Math.abs(g.dy) > 4,
      onPanResponderMove: Animated.event(
        [null, { dx: pos.x, dy: pos.y }],
        { useNativeDriver: false },
      ),
      onPanResponderRelease: (_, g) => {
        if (g.dx > SWIPE_THRESHOLD) {
          swipeOff('right');
        } else if (g.dx < -SWIPE_THRESHOLD) {
          swipeOff('left');
        } else {
          Animated.spring(pos, {
            toValue: { x: 0, y: 0 },
            friction: 6,
            tension: 60,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  const rotate = pos.x.interpolate({
    inputRange: [-SCREEN_W, 0, SCREEN_W],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  const yesOpacity = pos.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD * 0.4, SWIPE_THRESHOLD],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });
  const noOpacity = pos.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.4, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const current = pool[index];
  const next = pool[index + 1];

  const myMood = current?.moods?.[0] ?? 'comfort';
  const cardTheme = current ? getTheme(myMood) : theme;

  if (!current) {
    return (
      <View style={[styles.root, { backgroundColor: theme.bg, paddingBottom: 30 + insets.bottom }]}>
        <View style={styles.center}>
          <ActivityIndicator color={theme.colorDeep} />
        </View>
      </View>
    );
  }

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

      <View style={styles.topBar}>
        <Pressable
          onPress={() => { tapLight(); onExit(); }}
          style={({ pressed }) => [
            styles.backBtn,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={[styles.backIcon, { color: theme.ink }]}>×</Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.ink }]}>
          {index + 1} / {pool.length}
        </Text>
        <View
          style={[
            styles.partnerPill,
            { backgroundColor: theme.color + 'AA' },
          ]}
        >
          <Text style={styles.partnerPillText}>
            👥 {partnerSwipeCount}
          </Text>
        </View>
      </View>

      <View style={styles.cardArea}>
        {next ? (
          <View style={[styles.card, styles.cardBehind]} pointerEvents="none">
            <CardContent meal={next} themeColor={getTheme(next.moods?.[0] ?? 'comfort').color} />
          </View>
        ) : null}

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              transform: [
                { translateX: pos.x },
                { translateY: pos.y },
                { rotate },
              ],
            },
          ]}
        >
          <CardContent meal={current} themeColor={cardTheme.color} />

          <Animated.View
            style={[
              styles.stamp,
              styles.stampYes,
              { opacity: yesOpacity },
            ]}
          >
            <Text style={styles.stampYesText}>ДА!</Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.stamp,
              styles.stampNo,
              { opacity: noOpacity },
            ]}
          >
            <Text style={styles.stampNoText}>НЕ</Text>
          </Animated.View>
        </Animated.View>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => swipeOff('left')}
          style={({ pressed }) => [
            styles.actionBtn,
            styles.actionNo,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={styles.actionIcon}>✕</Text>
        </Pressable>

        <Pressable
          onPress={() => { tapSelection(); }}
          style={[styles.actionBtn, styles.actionMid]}
          disabled
        >
          <Text style={styles.midText}>swipe</Text>
        </Pressable>

        <Pressable
          onPress={() => swipeOff('right')}
          style={({ pressed }) => [
            styles.actionBtn,
            styles.actionYes,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={styles.actionIcon}>♥</Text>
        </Pressable>
      </View>
    </View>
  );
}

function CardContent({
  meal,
  themeColor,
}: {
  meal: Meal;
  themeColor: string;
}) {
  const len = meal.name.length;
  const nameSize = len > 22 ? 24 : len > 14 ? 30 : 36;
  return (
    <View style={[styles.cardInner, { backgroundColor: themeColor + 'CC' }]}>
      <View style={styles.cardEmojiBox}>
        <EmojiImage emoji={meal.emoji} size={120} />
      </View>
      <Text
        style={[
          styles.cardName,
          { fontSize: nameSize, lineHeight: nameSize * 1.22 },
        ]}
        numberOfLines={3}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {meal.name}
      </Text>
    </View>
  );
}

const CARD_W = SCREEN_W * 0.85;
const CARD_H = CARD_W * 1.25;

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 56, paddingBottom: 30, overflow: 'hidden' },
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
  backIcon: { fontSize: 22, fontWeight: '600' },
  title: {
    fontFamily: 'GeistMono_400Regular',
    fontSize: 12,
    letterSpacing: 12 * 0.18,
    opacity: 0.65,
  },
  partnerPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  partnerPillText: {
    fontFamily: 'Geist_600SemiBold',
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: -0.005 * 11,
  },
  hintBanner: {
    marginTop: 10,
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: 'center',
    zIndex: 5,
  },
  hintText: {
    fontFamily: 'Geist_500Medium',
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: -0.005 * 13,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    position: 'absolute',
    width: CARD_W,
    height: CARD_H,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
    elevation: 8,
    backgroundColor: '#fff',
  },
  cardBehind: {
    transform: [{ scale: 0.94 }, { translateY: 14 }],
    opacity: 0.85,
  },
  cardInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  cardEmojiBox: { marginBottom: 22 },
  cardName: {
    fontFamily: 'Geist_800ExtraBold',
    fontWeight: '800',
    color: '#2A1A12',
    textAlign: 'center',
    paddingHorizontal: 8,
    letterSpacing: -0.02 * 36,
  },
  stamp: {
    position: 'absolute',
    top: 36,
    paddingVertical: 6,
    paddingHorizontal: 22,
    borderRadius: 12,
    borderWidth: 4,
  },
  stampYes: {
    right: 28,
    borderColor: '#2D8B4E',
    transform: [{ rotate: '-12deg' }],
  },
  stampYesText: {
    fontFamily: 'Geist_800ExtraBold',
    color: '#2D8B4E',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 32 * 0.05,
  },
  stampNo: {
    left: 28,
    borderColor: '#B23333',
    transform: [{ rotate: '12deg' }],
  },
  stampNoText: {
    fontFamily: 'Geist_800ExtraBold',
    color: '#B23333',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 32 * 0.05,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
    paddingBottom: 8,
  },
  actionBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  actionNo: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#E8B5B5' },
  actionYes: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#9CD2A8',
  },
  actionMid: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  midText: {
    fontFamily: 'GeistMono_400Regular',
    fontSize: 9,
    letterSpacing: 9 * 0.22,
    opacity: 0.4,
    textTransform: 'uppercase',
  },
  actionIcon: {
    fontSize: 28,
    fontWeight: '700',
  },
});
