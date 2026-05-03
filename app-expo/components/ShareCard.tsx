import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MoodDecoration } from './MoodDecoration';
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
          <Text style={styles.emoji}>{meal.emoji}</Text>
          <Text
            style={[
              styles.name,
              {
                fontSize: nameSize,
                lineHeight: nameSize * 1.1,
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

        <Text style={[styles.watermark, { color: theme.ink }]}>
          какво да ям<Text style={{ color: theme.accent }}>?</Text>
        </Text>
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
    paddingTop: 80,
    paddingBottom: 110,
    zIndex: 2,
  },
  emoji: {
    fontSize: 220,
    lineHeight: 280,
    marginBottom: 30,
    textAlign: 'center',
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
  watermark: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Geist_500Medium',
    fontSize: 16,
    letterSpacing: 16 * 0.18,
    textTransform: 'uppercase',
    opacity: 0.55,
    zIndex: 2,
  },
});
