import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EmojiImage } from './EmojiImage';
import type { PersonalityResult } from '../lib/personality';

const CARD_WIDTH = 540;
const CARD_HEIGHT = 960;

type Props = {
  result: PersonalityResult;
};

export const PersonalityShareCard = forwardRef<View, Props>(
  ({ result }, ref) => {
    const { personality: p, totalCooked, uniqueMeals } = result;

    return (
      <View ref={ref} collapsable={false} style={styles.card}>
        <LinearGradient
          colors={p.cardBg}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.label}>
          <Text style={[styles.labelText, { color: p.ink }]}>
            КУЛИНАРНА ЛИЧНОСТ
          </Text>
        </View>

        <View style={styles.content}>
          <View
            style={[
              styles.emojiCircle,
              { backgroundColor: 'rgba(255,255,255,0.55)' },
            ]}
          >
            <EmojiImage emoji={p.emoji} size={170} />
          </View>

          <Text
            style={[
              styles.title,
              { color: p.ink },
            ]}
            numberOfLines={2}
          >
            {p.title}
          </Text>

          <Text style={[styles.tagline, { color: p.ink }]}>
            „{p.tagline}"
          </Text>

          <Text style={[styles.description, { color: p.ink }]}>
            {p.description}
          </Text>

          {totalCooked > 0 ? (
            <View style={styles.statsRow}>
              <View
                style={[
                  styles.statBox,
                  { borderColor: p.accent + '55' },
                ]}
              >
                <Text style={[styles.statValue, { color: p.ink }]}>
                  {totalCooked}
                </Text>
                <Text style={[styles.statLabel, { color: p.ink }]}>
                  {totalCooked === 1 ? 'ястие' : 'ястия'}
                </Text>
              </View>
              <View
                style={[
                  styles.statBox,
                  { borderColor: p.accent + '55' },
                ]}
              >
                <Text style={[styles.statValue, { color: p.ink }]}>
                  {uniqueMeals}
                </Text>
                <Text style={[styles.statLabel, { color: p.ink }]}>
                  {uniqueMeals === 1 ? 'различно' : 'различни'}
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.cta, { color: p.ink }]}>
            Открий своята кулинарна личност
          </Text>
          <Text style={[styles.watermark, { color: p.ink }]}>
            какво да ям
            <Text style={{ color: p.accent }}>?</Text>
          </Text>
          <Text style={[styles.url, { color: p.ink }]}>
            noomup.com/kakvo-da-yam
          </Text>
        </View>
      </View>
    );
  },
);

PersonalityShareCard.displayName = 'PersonalityShareCard';

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    overflow: 'hidden',
  },
  label: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  labelText: {
    fontFamily: 'GeistMono_400Regular',
    fontSize: 14,
    letterSpacing: 14 * 0.28,
    opacity: 0.55,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
    paddingTop: 60,
    paddingBottom: 200,
    zIndex: 2,
  },
  emojiCircle: {
    width: 220,
    height: 220,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  title: {
    fontFamily: 'Fraunces_500Medium',
    fontSize: 56,
    fontWeight: '500',
    lineHeight: 64,
    letterSpacing: -0.025 * 56,
    textAlign: 'center',
    marginBottom: 14,
    paddingTop: 4,
    paddingBottom: 4,
  },
  tagline: {
    fontFamily: 'Geist_400Regular',
    fontSize: 24,
    lineHeight: 24 * 1.4,
    fontStyle: 'italic',
    textAlign: 'center',
    opacity: 0.75,
    marginBottom: 26,
    maxWidth: CARD_WIDTH - 120,
  },
  description: {
    fontFamily: 'Geist_400Regular',
    fontSize: 19,
    lineHeight: 19 * 1.55,
    textAlign: 'center',
    opacity: 0.85,
    maxWidth: CARD_WIDTH - 100,
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  statBox: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    minWidth: 110,
  },
  statValue: {
    fontFamily: 'Fraunces_500Medium',
    fontSize: 32,
    fontWeight: '500',
    lineHeight: 36,
  },
  statLabel: {
    fontFamily: 'GeistMono_400Regular',
    fontSize: 11,
    letterSpacing: 11 * 0.18,
    textTransform: 'uppercase',
    opacity: 0.65,
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
    alignItems: 'center',
    zIndex: 2,
    gap: 12,
  },
  cta: {
    fontFamily: 'Geist_400Regular',
    fontSize: 19,
    lineHeight: 19 * 1.4,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.6,
    maxWidth: 440,
  },
  watermark: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 19,
    letterSpacing: 19 * 0.16,
    textTransform: 'uppercase',
    textAlign: 'center',
    opacity: 0.7,
  },
  url: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    letterSpacing: 14 * 0.05,
    textAlign: 'center',
    opacity: 0.5,
    marginTop: 6,
  },
});
