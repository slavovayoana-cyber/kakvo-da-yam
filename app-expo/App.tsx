import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Share, StatusBar, Platform } from 'react-native';
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
import { pickMeal, formatShareText } from './lib/mealPicker';
import { getTheme } from './lib/moodSystem';
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

  const [screen, setScreen] = useState<'home' | 'result'>('home');
  const [selectedMood, setSelectedMood] = useState<Selection>(null);
  const [result, setResult] = useState<PickResult | null>(null);
  const [rerollCount, setRerollCount] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [subtitleIdx, setSubtitleIdx] = useState(0);

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

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Зареждане…</Text>
      </View>
    );
  }

  const doPick = () => {
    const r = pickMeal(mealsData.meals, selectedMood, null);
    setResult(r);
    setRerollCount(0);
    setAnimKey((k) => k + 1);
    setScreen('result');
  };

  const doReroll = () => {
    if (!result) return;
    const r = pickMeal(mealsData.meals, selectedMood, result.meal.id);
    setResult(r);
    setRerollCount((c) => c + 1);
    setAnimKey((k) => k + 1);
  };

  const goHome = () => {
    setScreen('home');
  };

  const doShare = async () => {
    if (!result) return;
    const theme = getTheme(result.moodId);
    const text = formatShareText(result.meal, result.reason, theme.emoji);
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
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FBF7F2' },
  loading: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FBF7F2',
  },
  loadingText: {
    color: '#a89881',
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
});
