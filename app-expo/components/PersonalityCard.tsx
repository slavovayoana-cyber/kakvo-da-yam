import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EmojiImage } from './EmojiImage';
import type { PersonalityResult } from '../lib/personality';

type Props = {
  result: PersonalityResult;
  onShare?: () => void;
};

export function PersonalityCard({ result, onShare }: Props) {
  const { personality: p, isReady, totalCooked } = result;

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={p.cardBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.label, { color: p.ink }]}>
            КУЛИНАРНА ЛИЧНОСТ
          </Text>
          {isReady && onShare ? (
            <Pressable
              onPress={onShare}
              hitSlop={10}
              style={({ pressed }) => [
                styles.shareBtn,
                { borderColor: p.accent + '55', opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.shareBtnText, { color: p.ink }]}>↗</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.titleRow}>
          <View style={styles.emojiBox}>
            <EmojiImage emoji={p.emoji} size={48} />
          </View>
          <View style={styles.titleBlock}>
            <Text style={[styles.title, { color: p.ink }]}>{p.title}</Text>
            <Text style={[styles.tagline, { color: p.ink }]}>
              „{p.tagline}"
            </Text>
          </View>
        </View>

        <Text style={[styles.description, { color: p.ink }]}>
          {p.description}
        </Text>

        {!isReady ? (
          <View style={[styles.progress, { borderColor: p.accent + '40' }]}>
            <Text style={[styles.progressText, { color: p.ink }]}>
              {totalCooked === 0
                ? 'Готви поне 3 ястия за да разберем коя си'
                : `Още ${3 - totalCooked} ${3 - totalCooked === 1 ? 'ястие' : 'ястия'} и личността ти ще се отключи`}
            </Text>
          </View>
        ) : null}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  card: {
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  label: {
    fontFamily: 'GeistMono_400Regular',
    fontSize: 9.5,
    letterSpacing: 0.22 * 9.5,
    opacity: 0.55,
  },
  shareBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnText: {
    fontSize: 13,
    fontFamily: 'Geist_600SemiBold',
    fontWeight: '600',
    lineHeight: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  emojiBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: { flex: 1 },
  title: {
    fontFamily: 'Fraunces_500Medium',
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 28,
    letterSpacing: -0.02 * 24,
    marginBottom: 3,
  },
  tagline: {
    fontFamily: 'Geist_400Regular',
    fontSize: 13,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  description: {
    fontFamily: 'Geist_400Regular',
    fontSize: 13.5,
    lineHeight: 13.5 * 1.5,
    opacity: 0.85,
  },
  progress: {
    marginTop: 12,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  progressText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.75,
  },
});
