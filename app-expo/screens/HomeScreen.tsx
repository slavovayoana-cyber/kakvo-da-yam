import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, ScrollView, Animated,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MoodDecoration } from '../components/MoodDecoration';
import { getTheme, MOOD_THEMES, MoodTheme, ALL_THEME } from '../lib/moodSystem';
import { SUBTITLES } from '../lib/mealPicker';
import type { MoodId, Selection } from '../lib/types';

type Props = {
  selectedMood: Selection;
  setSelectedMood: (m: Selection) => void;
  onPick: () => void;
  subtitleIdx: number;
};

export function HomeScreen({
  selectedMood, setSelectedMood, onPick, subtitleIdx,
}: Props) {
  const theme: MoodTheme = getTheme(selectedMood);
  const useMoodType = !!selectedMood && selectedMood !== 'all';

  const subtitleOpacity = useRef(new Animated.Value(0.6)).current;
  const [displayedSubtitle, setDisplayedSubtitle] = useState(
    SUBTITLES[subtitleIdx % SUBTITLES.length],
  );
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    Animated.timing(subtitleOpacity, {
      toValue: 0, duration: 280, useNativeDriver: true,
    }).start(() => {
      setDisplayedSubtitle(SUBTITLES[subtitleIdx % SUBTITLES.length]);
      Animated.timing(subtitleOpacity, {
        toValue: 0.6, duration: 380, useNativeDriver: true,
      }).start();
    });
  }, [subtitleIdx, subtitleOpacity]);
  const { height } = useWindowDimensions();

  const titleFont = useMoodType ? theme.titleFontFamily : 'Geist_700Bold';
  const titleStyle = useMoodType
    ? {
        fontFamily: titleFont,
        fontWeight: theme.titleFontWeight,
        fontStyle: theme.titleFontStyle ?? 'normal',
        letterSpacing: theme.titleLetterSpacing,
        textTransform: theme.titleTransform ?? 'none',
      }
    : {
        fontFamily: 'Geist_700Bold',
        fontWeight: '700' as const,
        letterSpacing: -0.045 * 56,
      };

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <LinearGradient
        colors={theme.gradient.colors as readonly [string, string, ...string[]]}
        locations={theme.gradient.locations as readonly [number, number, ...number[]] | undefined}
        start={theme.gradient.start}
        end={theme.gradient.end}
        style={StyleSheet.absoluteFill}
      />
      <MoodDecoration theme={theme} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerMono, { color: theme.ink, opacity: 0.55 }]}>
            {'какво да ям'}<Text style={{ color: theme.accent }}>?</Text>
          </Text>
          <Text style={[styles.headerMono, { color: theme.ink, opacity: 0.45 }]}>
            v1.0
          </Text>
        </View>

        {/* Title block */}
        <View style={[styles.titleBlock, { minHeight: height * 0.42 }]}>
          <Text
            style={[
              styles.title,
              titleStyle as any,
              { color: theme.ink },
            ]}
          >
            Какво{'\n'}да ям<Text style={{ color: theme.accent }}>?</Text>
          </Text>
          <Animated.Text
            style={[styles.subtitle, { color: theme.ink, opacity: subtitleOpacity }]}
          >
            {displayedSubtitle}
          </Animated.Text>
        </View>

        {/* Mood chips section */}
        <View style={styles.chipsSection}>
          <Text
            style={[
              styles.chipsLabel,
              { color: theme.ink, opacity: 0.5 },
            ]}
          >
            {selectedMood ? 'НАСТРОЕНИЕ' : 'ИЛИ ИЗБЕРИ НАСТРОЕНИЕ'}
          </Text>

          <View style={styles.chipsContainer}>
            <View style={styles.chipsRow}>
              {[MOOD_THEMES.healthy_ish, MOOD_THEMES.fancy, MOOD_THEMES.honest].map((m) => {
                const active = selectedMood === m.id;
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => setSelectedMood(active ? null : (m.id as MoodId))}
                    style={({ pressed }) => [
                      styles.chip,
                      {
                        borderColor: active ? m.colorDeep : 'rgba(0,0,0,0.08)',
                        backgroundColor: active ? m.color : 'rgba(255,255,255,0.55)',
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <Text style={styles.chipEmoji}>{m.emoji}</Text>
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: active ? '#fff' : theme.ink,
                          fontWeight: active ? '600' : '500',
                        },
                      ]}
                    >
                      {m.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.chipsRow}>
              {(() => {
                const m = MOOD_THEMES.comfort;
                const active = selectedMood === m.id;
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => setSelectedMood(active ? null : (m.id as MoodId))}
                    style={({ pressed }) => [
                      styles.chip,
                      {
                        borderColor: active ? m.colorDeep : 'rgba(0,0,0,0.08)',
                        backgroundColor: active ? m.color : 'rgba(255,255,255,0.55)',
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <Text style={styles.chipEmoji}>{m.emoji}</Text>
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: active ? '#fff' : theme.ink,
                          fontWeight: active ? '600' : '500',
                        },
                      ]}
                    >
                      {m.name}
                    </Text>
                  </Pressable>
                );
              })()}
              {(() => {
                const m = MOOD_THEMES.bulgarian;
                const active = selectedMood === m.id;
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => setSelectedMood(active ? null : (m.id as MoodId))}
                    style={({ pressed }) => [
                      styles.chip,
                      {
                        borderColor: active ? m.colorDeep : 'rgba(0,0,0,0.08)',
                        backgroundColor: active ? m.color : 'rgba(255,255,255,0.55)',
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <Text style={styles.chipEmoji}>{m.emoji}</Text>
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: active ? '#fff' : theme.ink,
                          fontWeight: active ? '600' : '500',
                        },
                      ]}
                    >
                      {m.name}
                    </Text>
                  </Pressable>
                );
              })()}
              {(() => {
                const active = selectedMood === 'all';
                return (
                  <Pressable
                    key="all"
                    onPress={() => setSelectedMood(active ? null : 'all')}
                    style={({ pressed }) => [
                      styles.chip,
                      {
                        borderColor: active ? ALL_THEME.colorDeep : 'rgba(0,0,0,0.08)',
                        backgroundColor: active ? ALL_THEME.accent : 'rgba(255,255,255,0.55)',
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <Text style={styles.chipEmoji}>🎲</Text>
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: active ? '#fff' : theme.ink,
                          fontWeight: active ? '600' : '500',
                        },
                      ]}
                    >
                      Всички
                    </Text>
                  </Pressable>
                );
              })()}
            </View>
          </View>

          {/* Main button */}
          <Pressable
            onPress={onPick}
            style={({ pressed }) => [
              styles.mainBtn,
              {
                backgroundColor: selectedMood ? theme.accent : '#C8645A',
                opacity: pressed ? 0.92 : 1,
                shadowColor: selectedMood ? theme.accent : '#C8645A',
              },
            ]}
          >
            <Text style={styles.mainBtnText}>Избери за мен →</Text>
          </Pressable>

          {/* Tagline */}
          <Text
            style={[
              styles.tagline,
              {
                color: theme.ink,
                opacity: 0.55,
                fontStyle: 'italic',
              },
            ]}
          >
            {selectedMood === 'all'
              ? 'миксирам всичките 5 настроения'
              : selectedMood
                ? `„${theme.tagline}"`
                : 'или random измежду всички 4'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, position: 'relative', overflow: 'hidden' },
  scroll: { flexGrow: 1, paddingTop: 56, paddingBottom: 24 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerMono: {
    fontFamily: 'GeistMono_400Regular',
    fontSize: 11,
    letterSpacing: 0.18 * 11,
    textTransform: 'uppercase',
  },
  titleBlock: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
  title: {
    fontSize: 56,
    lineHeight: 76,
    marginBottom: -4,
    paddingTop: 8,
    paddingBottom: 8,
  },
  subtitle: {
    fontFamily: 'Geist_400Regular',
    fontSize: 15,
    lineHeight: 15 * 1.35,
    maxWidth: 260,
  },
  chipsSection: { paddingHorizontal: 20 },
  chipsLabel: {
    fontFamily: 'GeistMono_400Regular',
    fontSize: 10,
    letterSpacing: 0.22 * 10,
    marginBottom: 12,
    paddingLeft: 4,
  },
  chipsContainer: {
    gap: 8,
    marginBottom: 22,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  chipEmoji: { fontSize: 15 },
  chipText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 13.5,
    letterSpacing: -0.01 * 13.5,
  },
  bgPill: {
    marginLeft: 2,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  bgPillText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.08 * 8,
    fontFamily: 'Geist_700Bold',
  },
  mainBtn: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBtnText: {
    color: '#fff',
    fontFamily: 'Geist_600SemiBold',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.02 * 18,
  },
  tagline: {
    textAlign: 'center',
    marginTop: 14,
    fontFamily: 'Geist_400Regular',
    fontSize: 12.5,
    minHeight: 18,
  },
});
