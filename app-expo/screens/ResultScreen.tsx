import React, { useEffect, useRef } from 'react';
import {
  View, Text, Pressable, StyleSheet, Animated, Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MoodDecoration } from '../components/MoodDecoration';
import { getTheme } from '../lib/moodSystem';
import { getRerollMessage } from '../lib/mealPicker';
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
  const { meal, reason, moodId } = result;
  const theme = getTheme(moodId);
  const rerollMsg = getRerollMessage(rerollCount);

  const emojiAnim = useRef(new Animated.Value(0)).current;
  const nameAnim = useRef(new Animated.Value(0)).current;
  const reasonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    emojiAnim.setValue(0);
    nameAnim.setValue(0);
    reasonAnim.setValue(0);
    Animated.sequence([
      Animated.timing(emojiAnim, {
        toValue: 1, duration: 600,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
        useNativeDriver: true,
      }),
    ]).start();
    Animated.timing(nameAnim, {
      toValue: 1, duration: 500, delay: 100,
      easing: Easing.out(Easing.cubic), useNativeDriver: true,
    }).start();
    Animated.timing(reasonAnim, {
      toValue: 1, duration: 500, delay: 200,
      easing: Easing.out(Easing.cubic), useNativeDriver: true,
    }).start();
  }, [animKey, emojiAnim, nameAnim, reasonAnim]);

  const emojiTransform = {
    transform: [
      { scale: emojiAnim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.4, 1.1, 1] }) },
      { rotate: emojiAnim.interpolate({ inputRange: [0, 0.6, 1], outputRange: ['-8deg', '2deg', '0deg'] }) },
    ],
    opacity: emojiAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 1] }),
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
              opacity: nameAnim,
              transform: [
                {
                  translateY: nameAnim.interpolate({
                    inputRange: [0, 1], outputRange: [12, 0],
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
            { color: theme.ink, opacity: 0.78 },
            {
              opacity: reasonAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.78] }),
              transform: [
                {
                  translateY: reasonAnim.interpolate({
                    inputRange: [0, 1], outputRange: [12, 0],
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
            onPress={onReroll}
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
            onPress={onShare}
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
