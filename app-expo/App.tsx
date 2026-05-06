import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Share, StatusBar, Platform } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as NavigationBar from 'expo-navigation-bar';
import { useFonts } from 'expo-font';
import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  Geist_800ExtraBold,
} from '@expo-google-fonts/geist';
import {
  Fraunces_400Regular_Italic,
  Fraunces_500Medium,
} from '@expo-google-fonts/fraunces';
import {
  InstrumentSerif_400Regular,
} from '@expo-google-fonts/instrument-serif';
import { HomeScreen } from './screens/HomeScreen';
import { ResultScreen } from './screens/ResultScreen';
import { JournalScreen } from './screens/JournalScreen';
import { ShareCard } from './components/ShareCard';
import { pickMeal, formatShareText } from './lib/mealPicker';
import { getTheme } from './lib/moodSystem';
import {
  type JournalEntry,
  getJournal,
  addJournalEntry,
} from './lib/journal';
import { openMealNearby } from './lib/maps';
import type { MealsData, PickResult, Selection } from './lib/types';

import mealsJson from './data/meals.json';

const mealsData = mealsJson as unknown as MealsData;

export default function App() {
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    Geist_800ExtraBold,
    GeistMono_400Regular: Geist_400Regular,
    Fraunces_400Italic: Fraunces_400Regular_Italic,
    Fraunces_500Medium,
    InstrumentSerif_400Regular,
  });

  const [screen, setScreen] = useState<'home' | 'result' | 'journal'>('home');
  const [selectedMood, setSelectedMood] = useState<Selection>('all');
  const [result, setResult] = useState<PickResult | null>(null);
  const [rerollCount, setRerollCount] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [subtitleIdx, setSubtitleIdx] = useState(0);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [cookedThisSession, setCookedThisSession] = useState(false);
  const cardRef = useRef<View>(null);

  useEffect(() => {
    getJournal().then(setJournal).catch(() => setJournal([]));
  }, []);

  const refreshJournal = async () => {
    const next = await getJournal();
    setJournal(next);
  };

  const MAX_RECENT = 10;
  const trackPick = (id: string) => {
    setRecentIds((prev) => [...prev, id].slice(-MAX_RECENT));
  };

  const subtitleTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (screen !== 'home') {
      if (subtitleTimer.current) clearInterval(subtitleTimer.current);
      return;
    }
    subtitleTimer.current = setInterval(
      () => setSubtitleIdx((i) => i + 1),
      4500,
    );
    return () => {
      if (subtitleTimer.current) clearInterval(subtitleTimer.current);
    };
  }, [screen]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    NavigationBar.setBackgroundColorAsync('#00000000').catch(() => {});
    NavigationBar.setButtonStyleAsync('dark').catch(() => {});
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Зареждане…</Text>
      </View>
    );
  }

  const doPick = () => {
    const r = pickMeal(mealsData.meals, selectedMood, recentIds);
    setResult(r);
    trackPick(r.meal.id);
    setRerollCount(0);
    setAnimKey((k) => k + 1);
    setCookedThisSession(false);
    setScreen('result');
  };

  const doReroll = () => {
    if (!result) return;
    const r = pickMeal(mealsData.meals, selectedMood, recentIds);
    setResult(r);
    trackPick(r.meal.id);
    setRerollCount((c) => c + 1);
    setAnimKey((k) => k + 1);
    setCookedThisSession(false);
  };

  const doCooked = async () => {
    if (!result || cookedThisSession) return;
    setCookedThisSession(true);
    try {
      await addJournalEntry({
        mealId: result.meal.id,
        mealName: result.meal.name,
        mealEmoji: result.meal.emoji,
        moodId: result.moodId,
      });
      await refreshJournal();
    } catch {
      setCookedThisSession(false);
    }
  };

  const goHome = () => {
    setScreen('home');
  };

  const openJournal = () => {
    setScreen('journal');
  };

  const doFindNearby = () => {
    if (!result) return;
    openMealNearby(result.meal.name, result.meal.id).catch(() => {});
  };

  const doShare = async () => {
    if (!result) return;
    const theme = getTheme(result.moodId);
    const text = formatShareText(result.meal, result.reason, theme.emoji);

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
            dialogTitle: 'Какво да ям?',
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
          ? { message: text }
          : { message: text, title: 'Какво да ям?' },
      );
    } catch {
      // dismissed
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      {screen === 'home' && (
        <HomeScreen
          selectedMood={selectedMood}
          setSelectedMood={setSelectedMood}
          onPick={doPick}
          onOpenJournal={openJournal}
          journalCount={journal.length}
          subtitleIdx={subtitleIdx}
        />
      )}
      {screen === 'result' && result && (
        <ResultScreen
          result={result}
          rerollCount={rerollCount}
          animKey={animKey}
          onReroll={doReroll}
          onShare={doShare}
          onChangeMood={goHome}
          onHome={goHome}
          onCooked={doCooked}
          onFindNearby={doFindNearby}
          cookedThisSession={cookedThisSession}
        />
      )}
      {screen === 'journal' && (
        <JournalScreen
          entries={journal}
          onBack={goHome}
          onChange={refreshJournal}
        />
      )}

      {result && (
        <View style={styles.offscreen} pointerEvents="none">
          <ShareCard
            ref={cardRef}
            meal={result.meal}
            reason={result.reason}
            theme={getTheme(result.moodId)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FCEBDD' },
  loading: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FCEBDD',
  },
  loadingText: {
    color: '#a89881',
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  offscreen: {
    position: 'absolute',
    left: -10000,
    top: 0,
  },
});
