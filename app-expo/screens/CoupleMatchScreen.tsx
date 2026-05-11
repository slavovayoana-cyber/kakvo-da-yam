import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ALL_THEME, getTheme } from '../lib/moodSystem';
import { tapMedium, tapLight } from '../lib/haptics';
import { EmojiImage } from '../components/EmojiImage';
import { getNearbyType, getNearbyButtonLabel } from '../lib/maps';
import type { Meal } from '../lib/types';

type Props = {
  meal: Meal;
  onFindNearby: () => void;
  onCookTogether: () => void;
  onDone: () => void;
};

export function CoupleMatchScreen({
  meal,
  onFindNearby,
  onCookTogether,
  onDone,
}: Props) {
  const theme = ALL_THEME;
  const insets = useSafeAreaInsets();
  const moodTheme = getTheme(meal.moods?.[0] ?? 'comfort');

  const titleScale = useRef(new Animated.Value(0)).current;
  const emojiScale = useRef(new Animated.Value(0)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(titleScale, {
        toValue: 1,
        duration: 600,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(emojiScale, {
          toValue: 1,
          duration: 700,
          easing: Easing.bezier(0.34, 1.56, 0.64, 1),
          useNativeDriver: true,
        }),
        Animated.timing(nameOpacity, {
          toValue: 1,
          duration: 500,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [titleScale, emojiScale, nameOpacity]);

  const nearbyType = getNearbyType(meal.id);
  const showNearby = nearbyType !== 'none';

  return (
    <View style={[styles.root, { backgroundColor: moodTheme.bg, paddingBottom: Math.max(insets.bottom, 30) }]}>
      <LinearGradient
        colors={
          moodTheme.gradient.colors as readonly [string, string, ...string[]]
        }
        locations={
          moodTheme.gradient.locations as
            | readonly [number, number, ...number[]]
            | undefined
        }
        start={moodTheme.gradient.start}
        end={moodTheme.gradient.end}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <Animated.View
          style={{
            transform: [
              { scale: titleScale },
              {
                rotate: titleScale.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: ['-10deg', '6deg', '0deg'],
                }),
              },
            ],
          }}
        >
          <Text style={styles.celebration}>🎉</Text>
          <Text style={[styles.title, { color: moodTheme.ink }]}>
            ИМАТЕ MATCH!
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.emojiBox,
            { transform: [{ scale: emojiScale }] },
          ]}
        >
          <EmojiImage emoji={meal.emoji} size={150} />
        </Animated.View>

        <Animated.View style={{ opacity: nameOpacity, alignItems: 'center' }}>
          <Text style={[styles.mealName, { color: moodTheme.ink }]}>
            {meal.name}
          </Text>
          <Text style={[styles.subtitle, { color: moodTheme.ink }]}>
            И двамата казахте „да" на това
          </Text>
        </Animated.View>
      </View>

      <View style={styles.actions}>
        {showNearby ? (
          <Pressable
            onPress={() => { tapMedium(); onFindNearby(); }}
            style={({ pressed }) => [
              styles.primaryBtn,
              {
                backgroundColor: moodTheme.accent,
                shadowColor: moodTheme.accent,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Text style={styles.primaryBtnText}>
              {getNearbyButtonLabel(nearbyType)}
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          onPress={() => { tapLight(); onCookTogether(); }}
          style={({ pressed }) => [
            styles.secondaryBtn,
            {
              borderColor: moodTheme.colorDeep + '55',
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text style={[styles.secondaryBtnText, { color: moodTheme.ink }]}>
            🍳 Сгответе го заедно
          </Text>
        </Pressable>

        <Pressable
          onPress={() => { tapLight(); onDone(); }}
          style={styles.linkBtn}
        >
          <Text style={[styles.linkText, { color: moodTheme.ink }]}>
            Назад към началото
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 56, paddingBottom: 30 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  celebration: { fontSize: 72, textAlign: 'center', marginBottom: 8 },
  title: {
    fontFamily: 'Geist_800ExtraBold',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 36 * 0.04,
    textAlign: 'center',
    marginBottom: 36,
  },
  emojiBox: {
    width: 200,
    height: 200,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  mealName: {
    fontFamily: 'Fraunces_500Medium',
    fontSize: 38,
    fontWeight: '500',
    lineHeight: 46,
    textAlign: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    opacity: 0.65,
    fontStyle: 'italic',
  },
  actions: { paddingHorizontal: 20, gap: 10 },
  primaryBtn: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 5,
  },
  primaryBtnText: {
    fontFamily: 'Geist_600SemiBold',
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.015 * 17,
  },
  secondaryBtn: {
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1.5,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.015 * 16,
  },
  linkBtn: { alignSelf: 'center', padding: 8 },
  linkText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 13,
    opacity: 0.55,
    textDecorationLine: 'underline',
  },
});
