import React, { useRef } from 'react';
import {
  View, Text, Pressable, StyleSheet, ScrollView, Alert, Share, Platform,
} from 'react-native';
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
  const personalityResult = computePersonality(entries);
  const cardRef = useRef<View>(null);

  const sharePersonality = async () => {
    tapLight();
    const p = personalityResult.personality;
    const fallbackMessage = `Кулинарната ми личност: ${p.emoji} ${p.title}\n„${p.tagline}"\n\n— от приложението „Какво да ям?"`;

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
      `Сигурна ли си че искаш да премахнеш "${entry.mealName}" от дневника?`,
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
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
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
              Още нищо не си готвила
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
      </ScrollView>

      <View style={styles.offscreen} pointerEvents="none">
        <PersonalityShareCard ref={cardRef} result={personalityResult} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 56, paddingBottom: 24, overflow: 'hidden' },
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
});
