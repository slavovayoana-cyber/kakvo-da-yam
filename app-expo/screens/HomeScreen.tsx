import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, ScrollView, Animated,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MoodDecoration } from '../components/MoodDecoration';
import { getTheme, MOOD_THEMES, MoodTheme, ALL_THEME } from '../lib/moodSystem';
import { SUBTITLES } from '../lib/mealPicker';
import { tapMedium, tapSelection } from '../lib/haptics';
import { EmojiImage } from '../components/EmojiImage';
import { SUMMER_MEAL_IDS, isSummerNow } from '../lib/seasonal';
import mealsJson from '../data/meals.json';
import type { MealTime, MoodId, Selection } from '../lib/types';

type SummerMeal = { id: string; emoji: string; name: string };
const SUMMER_MEALS: SummerMeal[] = SUMMER_MEAL_IDS
  .map((id) => (mealsJson as { meals: SummerMeal[] }).meals.find((m) => m.id === id))
  .filter((m): m is SummerMeal => !!m);

const TIME_CHIPS: { id: MealTime; emoji: string; label: string; color: string; colorDeep: string }[] = [
  { id: 'breakfast',    emoji: '🌅', label: 'Закуска',      color: '#F5B97A', colorDeep: '#d9975a' },
  { id: 'lunch_dinner', emoji: '🍽',  label: 'Обяд/Вечеря', color: '#7DB87D', colorDeep: '#5a9a5a' },
  { id: 'snack',        emoji: '🍎', label: 'Снак',         color: '#E8A87C', colorDeep: '#c8885c' },
  { id: 'dessert',      emoji: '🍰', label: 'Десерт',       color: '#D9A0C0', colorDeep: '#b87a9e' },
  { id: 'drink',        emoji: '☕', label: 'Напитка',      color: '#8AB4D4', colorDeep: '#6090b4' },
];

type Props = {
  selectedMood: Selection;
  setSelectedMood: (m: Selection) => void;
  selectedTime: MealTime | null;
  setSelectedTime: (t: MealTime | null) => void;
  onPick: () => void;
  onPickMeal: (mealId: string) => void;
  onOpenJournal: () => void;
  onOpenSettings: () => void;
  onOpenCouple: () => void;
  journalCount: number;
  subtitleIdx: number;
};

export function HomeScreen({
  selectedMood, setSelectedMood, selectedTime, setSelectedTime,
  onPick, onPickMeal, onOpenJournal, onOpenSettings, onOpenCouple, journalCount, subtitleIdx,
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
  const insets = useSafeAreaInsets();

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
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, 24) },
        ]}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerMono, { color: theme.ink, opacity: 0.55 }]}>
            {'какво да ям'}<Text style={{ color: theme.accent }}>?</Text>
          </Text>
          <View style={styles.headerRight}>
            <Pressable
              onPress={() => { tapSelection(); onOpenJournal(); }}
              style={({ pressed }) => [
                styles.journalBtn,
                { borderColor: theme.colorDeep + '33', opacity: pressed ? 0.7 : 1 },
              ]}
              hitSlop={10}
            >
              <Text style={[styles.journalBtnText, { color: theme.ink }]}>
                📔 Дневник{journalCount > 0 ? ` · ${journalCount}` : ''}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => { tapSelection(); onOpenSettings(); }}
              style={({ pressed }) => [
                styles.settingsBtn,
                { borderColor: theme.colorDeep + '33', opacity: pressed ? 0.7 : 1 },
              ]}
              hitSlop={10}
            >
              <Text style={styles.settingsBtnText}>⚙️</Text>
            </Pressable>
          </View>
        </View>

        {/* Title block */}
        <View style={styles.titleBlock}>
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

        {/* Seasonal: summer suggestions (auto-shows in summer) */}
        {isSummerNow() && SUMMER_MEALS.length > 0 && (
          <View style={styles.summerSection}>
            <Text style={[styles.chipsLabel, { color: theme.ink, opacity: 0.5 }]}>
              🌞 ЛЕТНИ ПРЕДЛОЖЕНИЯ
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.summerScrollContent}
            >
              {SUMMER_MEALS.map((m) => (
                <Pressable
                  key={m.id}
                  onPress={() => { tapSelection(); onPickMeal(m.id); }}
                  style={({ pressed }) => [
                    styles.summerCard,
                    { borderColor: theme.colorDeep + '22', opacity: pressed ? 0.82 : 1 },
                  ]}
                >
                  <EmojiImage emoji={m.emoji} size={30} />
                  <Text style={[styles.summerCardText, { color: theme.ink }]} numberOfLines={2}>
                    {m.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Chips section */}
        <View style={styles.chipsSection}>

          {/* Time chips */}
          <Text style={[styles.chipsLabel, { color: theme.ink, opacity: 0.5 }]}>
            КОГА?
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.timeScroll}
            contentContainerStyle={styles.timeScrollContent}
          >
            {TIME_CHIPS.map((t) => {
              const active = selectedTime === t.id;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => { tapSelection(); setSelectedTime(active ? null : t.id); }}
                  style={({ pressed }) => [
                    styles.chip,
                    {
                      borderColor: active ? t.colorDeep : 'rgba(0,0,0,0.08)',
                      backgroundColor: active ? t.color : 'rgba(255,255,255,0.55)',
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <EmojiImage emoji={t.emoji} size={16} />
                  <Text style={[styles.chipText, { color: active ? '#fff' : theme.ink, fontWeight: active ? '600' : '500' }]}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={[styles.divider, { backgroundColor: theme.ink + '14' }]} />

          {/* Mood chips */}
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
                    onPress={() => { tapSelection(); setSelectedMood(active ? null : (m.id as MoodId)); }}
                    style={({ pressed }) => [
                      styles.chip,
                      {
                        borderColor: active ? m.colorDeep : 'rgba(0,0,0,0.08)',
                        backgroundColor: active ? m.color : 'rgba(255,255,255,0.55)',
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <EmojiImage emoji={m.emoji} size={18} />
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
                    onPress={() => { tapSelection(); setSelectedMood(active ? null : (m.id as MoodId)); }}
                    style={({ pressed }) => [
                      styles.chip,
                      {
                        borderColor: active ? m.colorDeep : 'rgba(0,0,0,0.08)',
                        backgroundColor: active ? m.color : 'rgba(255,255,255,0.55)',
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <EmojiImage emoji={m.emoji} size={18} />
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
                    onPress={() => { tapSelection(); setSelectedMood(active ? null : (m.id as MoodId)); }}
                    style={({ pressed }) => [
                      styles.chip,
                      {
                        borderColor: active ? m.colorDeep : 'rgba(0,0,0,0.08)',
                        backgroundColor: active ? m.color : 'rgba(255,255,255,0.55)',
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <EmojiImage emoji={m.emoji} size={18} />
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
                    onPress={() => { tapSelection(); setSelectedMood(active ? null : 'all'); }}
                    style={({ pressed }) => [
                      styles.chip,
                      {
                        borderColor: active ? ALL_THEME.colorDeep : 'rgba(0,0,0,0.08)',
                        backgroundColor: active ? ALL_THEME.accent : 'rgba(255,255,255,0.55)',
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <EmojiImage emoji="🎲" size={18} />
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
            onPress={() => { tapMedium(); onPick(); }}
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

          {/* Couples mode button */}
          <Pressable
            onPress={() => { tapMedium(); onOpenCouple(); }}
            style={({ pressed }) => [
              styles.coupleBtn,
              {
                borderColor: theme.colorDeep + '55',
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={[styles.coupleBtnText, { color: theme.ink }]}>
              👩‍❤️‍👨 Заедно решаваме
            </Text>
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
  scroll: { flexGrow: 1, paddingTop: 44, paddingBottom: 20 },
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  journalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 999,
    borderWidth: 1.2,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  journalBtnText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 11.5,
    fontWeight: '500',
    letterSpacing: -0.005 * 11.5,
  },
  settingsBtn: {
    width: 32,
    height: 32,
    borderRadius: 999,
    borderWidth: 1.2,
    backgroundColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsBtnText: {
    fontSize: 14,
  },
  titleBlock: {
    flex: 1,
    minHeight: 150,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
  title: {
    fontSize: 50,
    lineHeight: 62,
    marginBottom: -2,
    paddingTop: 6,
    paddingBottom: 6,
  },
  subtitle: {
    fontFamily: 'Geist_400Regular',
    fontSize: 15,
    lineHeight: 15 * 1.35,
    maxWidth: 260,
  },
  chipsSection: { paddingHorizontal: 20 },
  summerSection: { paddingHorizontal: 20, marginBottom: 20 },
  summerScrollContent: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 20,
    paddingLeft: 4,
    paddingBottom: 2,
  },
  summerCard: {
    width: 84,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 6,
  },
  summerCardText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
  },
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
  timeScroll: {
    marginHorizontal: -20,
    marginBottom: 16,
  },
  timeScrollContent: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
  },
  divider: {
    height: 1,
    marginBottom: 16,
    marginHorizontal: 4,
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
  coupleBtn: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  coupleBtnText: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.01 * 15,
  },
  tagline: {
    textAlign: 'center',
    marginTop: 14,
    fontFamily: 'Geist_400Regular',
    fontSize: 12.5,
    minHeight: 18,
  },
});
