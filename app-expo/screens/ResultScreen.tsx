import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, Animated, Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MoodDecoration } from '../components/MoodDecoration';
import { getTheme } from '../lib/moodSystem';
import { getRerollMessage } from '../lib/mealPicker';
import { tapLight } from '../lib/haptics';
import { EmojiImage } from '../components/EmojiImage';
import { RerollDice } from '../components/RerollDice';
import { getNearbyType, getNearbyButtonLabel, hasRecipe, isBarDrink } from '../lib/maps';
import type { PickResult } from '../lib/types';

type Props = {
  result: PickResult;
  rerollCount: number;
  animKey: number;
  onReroll: () => void;
  onShare: () => void;
  onChangeMood: () => void;
  onHome: () => void;
  onCooked: () => void;
  onFindNearby: () => void;
  onRecipe: () => void;
  cookedThisSession: boolean;
};

export function ResultScreen({
  result, rerollCount, animKey,
  onReroll, onShare, onChangeMood, onHome, onCooked, onFindNearby, onRecipe,
  cookedThisSession,
}: Props) {
  const insets = useSafeAreaInsets();
  const [displayed, setDisplayed] = useState<PickResult>(result);
  const { meal, reason, moodId } = displayed;
  const theme = getTheme(moodId);
  const rerollMsg = getRerollMessage(rerollCount);

  // Entry transforms (pop / rise) — separate from opacity
  const emojiEntry = useRef(new Animated.Value(0)).current;
  const nameEntry = useRef(new Animated.Value(0)).current;
  const reasonEntry = useRef(new Animated.Value(0)).current;
  // Presence (opacity) — drives crossfade in/out
  const emojiPresence = useRef(new Animated.Value(0)).current;
  const namePresence = useRef(new Animated.Value(0)).current;
  const reasonPresence = useRef(new Animated.Value(0)).current;

  const lastAnimKey = useRef<number>(-1);

  useEffect(() => {
    const enter = () => {
      Animated.parallel([
        Animated.timing(emojiPresence, {
          toValue: 1, duration: 380,
          easing: Easing.out(Easing.cubic), useNativeDriver: true,
        }),
        Animated.timing(emojiEntry, {
          toValue: 1, duration: 600,
          easing: Easing.bezier(0.34, 1.56, 0.64, 1),
          useNativeDriver: true,
        }),
        Animated.timing(namePresence, {
          toValue: 1, duration: 380, delay: 90,
          easing: Easing.out(Easing.cubic), useNativeDriver: true,
        }),
        Animated.timing(nameEntry, {
          toValue: 1, duration: 500, delay: 90,
          easing: Easing.out(Easing.cubic), useNativeDriver: true,
        }),
        Animated.timing(reasonPresence, {
          toValue: 1, duration: 380, delay: 170,
          easing: Easing.out(Easing.cubic), useNativeDriver: true,
        }),
        Animated.timing(reasonEntry, {
          toValue: 1, duration: 500, delay: 170,
          easing: Easing.out(Easing.cubic), useNativeDriver: true,
        }),
      ]).start();
    };

    if (lastAnimKey.current === -1) {
      // First mount — just play entry without fade-out
      lastAnimKey.current = animKey;
      setDisplayed(result);
      enter();
      return;
    }
    if (lastAnimKey.current === animKey) return;
    lastAnimKey.current = animKey;

    // Fade out current content, swap, then play entry
    Animated.parallel([
      Animated.timing(emojiPresence, {
        toValue: 0, duration: 240,
        easing: Easing.in(Easing.cubic), useNativeDriver: true,
      }),
      Animated.timing(namePresence, {
        toValue: 0, duration: 240,
        easing: Easing.in(Easing.cubic), useNativeDriver: true,
      }),
      Animated.timing(reasonPresence, {
        toValue: 0, duration: 240,
        easing: Easing.in(Easing.cubic), useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (!finished) return;
      setDisplayed(result);
      emojiEntry.setValue(0);
      nameEntry.setValue(0);
      reasonEntry.setValue(0);
      enter();
    });
  }, [animKey, result, emojiEntry, nameEntry, reasonEntry, emojiPresence, namePresence, reasonPresence]);

  const emojiTransform = {
    transform: [
      { scale: emojiEntry.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.6, 1.08, 1] }) },
      { rotate: emojiEntry.interpolate({ inputRange: [0, 0.6, 1], outputRange: ['-6deg', '2deg', '0deg'] }) },
    ],
    opacity: emojiPresence,
  };

  const len = meal.name.length;
  const nameSize = len > 26 ? 22 : len > 18 ? 26 : 32;

  const nameStyle = {
    fontFamily: theme.titleFontFamily,
    fontWeight: theme.nameFontWeight,
    fontStyle: theme.nameFontStyle ?? 'normal',
    letterSpacing: theme.nameLetterSpacing,
    textTransform: theme.nameTransform ?? 'none',
  } as any;

  return (
    <View style={[styles.root, { backgroundColor: theme.bg, paddingBottom: Math.max(insets.bottom, 24) }]}>
      <LinearGradient
        colors={theme.gradient.colors as readonly [string, string, ...string[]]}
        locations={theme.gradient.locations as readonly [number, number, ...number[]] | undefined}
        start={theme.gradient.start}
        end={theme.gradient.end}
        style={StyleSheet.absoluteFill}
      />
      <MoodDecoration theme={theme} scale={1.1} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={onHome}
          style={({ pressed }) => [
            styles.backBtn,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={[styles.backIcon, { color: theme.ink }]}>←</Text>
        </Pressable>
        <View style={[styles.moodPill, { backgroundColor: theme.color }]}>
          <EmojiImage emoji={theme.emoji} size={14} />
          <Text style={styles.moodPillText}>{theme.name}</Text>
        </View>
      </View>

      {/* Result body */}
      <View style={styles.body}>
        <Animated.View style={[styles.emojiBox, emojiTransform]}>
          <EmojiImage emoji={meal.emoji} size={130} />
        </Animated.View>
        <Animated.Text
          numberOfLines={3}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          style={[
            styles.name,
            {
              fontSize: nameSize,
              lineHeight: nameSize * 1.35,
              color: theme.ink,
            },
            nameStyle,
            {
              opacity: namePresence,
              transform: [
                {
                  translateY: nameEntry.interpolate({
                    inputRange: [0, 1], outputRange: [14, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {meal.name}
        </Animated.Text>
        <Animated.Text
          numberOfLines={5}
          style={[
            styles.reason,
            { color: theme.ink },
            {
              opacity: reasonPresence.interpolate({ inputRange: [0, 1], outputRange: [0, 0.78] }),
              transform: [
                {
                  translateY: reasonEntry.interpolate({
                    inputRange: [0, 1], outputRange: [14, 0],
                  }),
                },
              ],
            },
          ]}
        >
          „{reason}"
        </Animated.Text>
      </View>

      {/* Dice sits in its own fixed slot so it never shifts with meal length */}
      <View style={styles.diceSlot}>
        <RerollDice onRoll={onReroll} accent={theme.colorDeep} ink={theme.ink} />
      </View>

      {/* Action stack */}
      <View style={styles.actions}>
        {rerollMsg && (
          <Text
            key={'sass-' + rerollCount}
            style={[styles.sassMsg, { color: theme.colorDeep }]}
          >
            {rerollMsg}
          </Text>
        )}

        {(() => {
          const nearbyType = getNearbyType(meal.id);
          const showNearby = nearbyType !== 'none';
          const showRecipe = hasRecipe(meal.id);
          const topCount = (showRecipe ? 1 : 0) + (showNearby ? 1 : 0);
          if (topCount === 0) return null;
          const colStyle = topCount === 1 ? styles.topColSingle : styles.topCol;
          return (
            <View style={[styles.cookedRow, topCount === 1 && styles.cookedRowCenter]}>
              {showRecipe ? (
                <View style={colStyle}>
                  <Pressable
                    onPress={() => { tapLight(); onRecipe(); }}
                    style={({ pressed }) => [
                      styles.cookedBtn, styles.cookedBtnStretch,
                      { borderColor: theme.colorDeep + '33',
                        backgroundColor: pressed ? theme.color + '40' : 'rgba(255,255,255,0.45)' },
                    ]}
                  >
                    <Text style={[styles.cookedBtnText, { color: theme.ink }]} numberOfLines={1}>
                      🎬 Как се прави
                    </Text>
                  </Pressable>
                </View>
              ) : null}
              {showNearby ? (
                <View style={colStyle}>
                  <Pressable
                    onPress={() => { tapLight(); onFindNearby(); }}
                    style={({ pressed }) => [
                      styles.cookedBtn, styles.cookedBtnStretch,
                      { borderColor: theme.colorDeep + '33',
                        backgroundColor: pressed ? theme.color + '40' : 'rgba(255,255,255,0.45)' },
                    ]}
                  >
                    <Text style={[styles.cookedBtnText, { color: theme.ink }]} numberOfLines={1}>
                      {getNearbyButtonLabel(nearbyType)}
                    </Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          );
        })()}

        <View style={styles.cookedRow}>
          <View style={styles.topCol}>
            <Pressable
              onPress={() => { if (!cookedThisSession) { tapLight(); onCooked(); } }}
              disabled={cookedThisSession}
              style={({ pressed }) => [
                styles.cookedBtn, styles.cookedBtnStretch,
                {
                  borderColor: theme.colorDeep + (cookedThisSession ? '55' : '33'),
                  backgroundColor: cookedThisSession ? theme.colorDeep + '15' : 'rgba(255,255,255,0.45)',
                  opacity: pressed && !cookedThisSession ? 0.8 : 1,
                },
              ]}
            >
              <Text style={[styles.cookedBtnText, { color: theme.ink }]} numberOfLines={1}>
                {cookedThisSession ? '✓ Записано' : (isBarDrink(meal.id) ? '🍹 Приготвих го' : '👨‍🍳 Готвих го!')}
              </Text>
            </Pressable>
          </View>
          <View style={styles.topCol}>
            <Pressable
              onPress={() => { tapLight(); onShare(); }}
              style={({ pressed }) => [
                styles.cookedBtn, styles.cookedBtnStretch,
                { backgroundColor: theme.accent, borderColor: theme.accent, opacity: pressed ? 0.92 : 1 },
              ]}
            >
              <Text style={[styles.cookedBtnText, { color: '#fff' }]} numberOfLines={1}>
                ↗ Сподели
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable onPress={onChangeMood} style={styles.changeMoodBtn}>
          <Text style={[styles.changeMoodText, { color: theme.ink }]}>
            Промени настроението
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 56, paddingBottom: 24, overflow: 'hidden' },
  topBar: {
    paddingHorizontal: 20, paddingTop: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    zIndex: 3,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 18 },
  moodPill: {
    paddingVertical: 7, paddingHorizontal: 12,
    borderRadius: 999,
    flexDirection: 'row', alignItems: 'center', gap: 5,
  },
  moodPillText: {
    fontFamily: 'Geist_600SemiBold',
    color: '#fff', fontSize: 12, fontWeight: '600',
    letterSpacing: -0.005 * 12,
  },
  body: {
    flex: 1,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 28,
  },
  emojiBox: {
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    textAlign: 'center',
    marginBottom: 14,
    paddingTop: 6,
    paddingBottom: 6,
    paddingHorizontal: 4,
    alignSelf: 'stretch',
  },
  reason: {
    fontFamily: 'Geist_400Regular',
    fontSize: 16, lineHeight: 16 * 1.4,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 4,
    alignSelf: 'stretch',
  },
  diceSlot: { height: 150, alignItems: 'center', justifyContent: 'center', zIndex: 3 },
  actions: { paddingHorizontal: 20, zIndex: 3 },
  sassMsg: {
    textAlign: 'center', marginBottom: 12,
    fontFamily: 'Geist_500Medium',
    fontSize: 12.5, fontStyle: 'italic',
    fontWeight: '500',
  },
  btnRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 17, paddingHorizontal: 18,
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderWidth: 1.5,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 16, fontWeight: '600',
    letterSpacing: -0.015 * 16,
  },
  primaryBtn: {
    flex: 1.4,
    paddingVertical: 17, paddingHorizontal: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 5,
  },
  primaryBtnText: {
    fontFamily: 'Geist_600SemiBold',
    color: '#fff', fontSize: 16, fontWeight: '600',
    letterSpacing: -0.015 * 16,
  },
  cookedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cookedBtn: {
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cookedBtnFull: { alignSelf: 'stretch', flex: 1 },
  cookedBtnHalf: { flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0 },
  cookedBtnSingle: { flexGrow: 0, flexShrink: 0, minWidth: '62%', paddingHorizontal: 24 },
  cookedRowCenter: { justifyContent: 'center' },
  topCol: { width: '48.5%' },
  topColSingle: { width: '62%' },
  cookedBtnStretch: { alignSelf: 'stretch', width: '100%' },
  cookedBtnText: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.01 * 14,
  },
  changeMoodBtn: { alignSelf: 'center', padding: 8 },
  changeMoodText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 13, opacity: 0.55,
    textDecorationLine: 'underline',
  },
});
