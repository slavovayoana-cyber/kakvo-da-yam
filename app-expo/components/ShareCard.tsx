import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MoodDecoration } from './MoodDecoration';
import { EmojiImage } from './EmojiImage';
import type { MoodTheme } from '../lib/moodSystem';

const CARD_WIDTH = 540;
const CARD_HEIGHT = 960;

type Props = {
  meal: { emoji: string; name: string };
  reason: string;
  theme: MoodTheme;
};

export const ShareCard = forwardRef<View, Props>(
  ({ meal, reason, theme }, ref) => {
    const nameSize = meal.name.length > 18 ? 52 : 64;
    return (
      <View ref={ref} collapsable={false} style={styles.card}>
        <LinearGradient
          colors={theme.gradient.colors as readonly [string, string, ...string[]]}
          locations={theme.gradient.locations as readonly [number, number, ...number[]] | undefined}
          start={theme.gradient.start}
          end={theme.gradient.end}
          style={StyleSheet.absoluteFill}
        />
        <MoodDecoration theme={theme} scale={3} />

        <View style={styles.content}>
          <View style={styles.emojiBox}>
            <EmojiImage emoji={meal.emoji} size={220} />
          </View>
          <Text
            style={[
              styles.name,
              {
                fontSize: nameSize,
                lineHeight: nameSize * 1.35,
                fontFamily: theme.titleFontFamily,
                fontWeight: theme.nameFontWeight,
                fontStyle: theme.nameFontStyle ?? 'normal',
                letterSpacing: theme.nameLetterSpacing * 2,
                textTransform: theme.nameTransform ?? 'none',
                color: theme.ink,
              } as any,
            ]}
          >
            {meal.name}
          </Text>
          <Text style={[styles.reason, { color: theme.ink }]}>
            „{reason}"
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.cta, { color: theme.ink }]}>
            Ако се чудиш какво да ядеш и искаш да се посмееш — пробвай това приложение
          </Text>
          <Text style={[styles.watermark, { color: theme.ink }]}>
            какво да ям<Text style={{ color: theme.accent }}>?</Text>
          </Text>
        </View>
      </View>
    );
  },
);

ShareCard.displayName = 'ShareCard';

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
    paddingTop: 60,
    paddingBottom: 180,
    zIndex: 2,
  },
  emojiBox: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    textAlign: 'center',
    marginBottom: 26,
    maxWidth: CARD_WIDTH - 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  reason: {
    fontFamily: 'Geist_400Regular',
    fontSize: 26,
    lineHeight: 26 * 1.4,
    fontStyle: 'italic',
    textAlign: 'center',
    opacity: 0.8,
    maxWidth: CARD_WIDTH - 120,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 50,
    right: 50,
    alignItems: 'center',
    zIndex: 2,
    gap: 12,
  },
  cta: {
    fontFamily: 'Geist_400Regular',
    fontSize: 18,
    lineHeight: 18 * 1.4,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.6,
    maxWidth: 440,
  },
  watermark: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 18,
    letterSpacing: 18 * 0.16,
    textTransform: 'uppercase',
    textAlign: 'center',
    opacity: 0.7,
  },
});
