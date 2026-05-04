import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, Animated, Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MoodDecoration } from '../components/MoodDecoration';
import { getTheme } from '../lib/moodSystem';
import { getRerollMessage } from '../lib/mealPicker';
import { tapMedium, tapLight } from '../lib/haptics';
import type { PickResult } from '../lib/types';

type Props = {
  result: PickResult;
  rerollCount: number;
  animKey: number;
  onReroll: () => void;
  onShare: () => void;
  onChangeMood: () => void;
  onHome: () => void;
};

export function ResultScreen({
  result, rerollCount, animKey,
  onReroll, onShare, onChangeMood, onHome,
}: Props) {
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

  const nameSize = meal.name.length > 18 ? 26 : 32;

  const nameStyle = {
    fontFamily: theme.titleFontFamily,
    fontWeight: theme.nameFontWeight,
    fontStyle: theme.nameFontStyle ?? 'normal',
    letterSpacing: theme.nameLetterSpacing,
    textTransform: theme.nameTransform ?? 'none',
  } as any;

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
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
          <Text style={styles.moodPillEmoji}>{theme.emoji}</Text>
          <Text style={styles.moodPillText}>{theme.name}</Text>
        </View>
      </View>

      {/* Result body */}
      <View style={styles.body}>
        <Animated.Text style={[styles.emoji, emojiTransform]}>
          {meal.emoji}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.name,
            { fontSize: nameSize, color: theme.ink },
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

        <View style={styles.btnRow}>
          <Pressable
            onPress={() => { tapMedium(); onReroll(); }}
            style={({ pressed }) => [
              styles.secondaryBtn,
              {
                borderColor: theme.colorDeep + '33',
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={[styles.secondaryBtnText, { color: theme.ink }]}>↻ Друго</Text>
          </Pressable>
          <Pressable
            onPress={() => { tapLight(); onShare(); }}
            style={({ pressed }) => [
              styles.primaryBtn,
              {
                backgroundColor: theme.accent,
                shadowColor: theme.accent,
                opacity: pressed ? 0.92 : 1,
              },
            ]}
          >
            <Text style={styles.primaryBtnText}>↗ Сподели</Text>
          </Pressable>
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
  moodPillEmoji: { fontSize: 12 },
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
  emoji: {
    fontSize: 130,
    lineHeight: 170,
    marginBottom: 18,
    paddingTop: 12,
    textAlign: 'center',
    includeFontPadding: false,
  },
  name: {
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 32 * 1.05,
    maxWidth: 280,
  },
  reason: {
    fontFamily: 'Geist_400Regular',
    fontSize: 16, lineHeight: 16 * 1.4,
    fontStyle: 'italic',
    textAlign: 'center',
    maxWidth: 280,
  },
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
  changeMoodBtn: { alignSelf: 'center', padding: 8 },
  changeMoodText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 13, opacity: 0.55,
    textDecorationLine: 'underline',
  },
});
