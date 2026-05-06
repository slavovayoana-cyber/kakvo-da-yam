import React from 'react';
import { View, Text, ViewStyle, StyleSheet, Platform } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { TWEMOJI_SVG, tokenizeEmoji } from '../lib/twemojiData';

type Props = {
  emoji: string;
  size: number;
  /** Container style — use to position; do NOT set width/height here, they
   * come from `size`. */
  style?: ViewStyle | ViewStyle[];
};

/**
 * Renders an emoji. On iOS uses the native Apple Color Emoji font via <Text>;
 * on Android renders Twemoji SVG glyphs so the look is consistent across
 * devices (Android's stock emojis vary by OEM/version).
 */
export function EmojiImage({ emoji, size, style }: Props) {
  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.row, style]}>
        <Text style={{ fontSize: size, lineHeight: size * 1.15 }}>{emoji}</Text>
      </View>
    );
  }

  const tokens = tokenizeEmoji(emoji);
  return (
    <View style={[styles.row, style]}>
      {tokens.map((tok, i) => {
        const xml = TWEMOJI_SVG[tok];
        if (!xml) {
          return (
            <Text key={i} style={{ fontSize: size, lineHeight: size * 1.15 }}>
              {[...emoji][i] ?? ''}
            </Text>
          );
        }
        return <SvgXml key={i} xml={xml} width={size} height={size} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
