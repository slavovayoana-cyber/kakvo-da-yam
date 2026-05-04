import React from 'react';
import { View, Text, ViewStyle, StyleSheet } from 'react-native';
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
 * Renders an emoji string as one or more Twemoji SVG glyphs side-by-side.
 * Works identically on iOS and Android, scales cleanly to any size, and
 * matches the iOS visual style closely (Twemoji has the same round
 * twitter-blue heritage as Apple Color Emoji).
 *
 * Falls back to plain Text rendering if a token isn't in the bundle.
 */
export function EmojiImage({ emoji, size, style }: Props) {
  const tokens = tokenizeEmoji(emoji);
  return (
    <View style={[styles.row, style]}>
      {tokens.map((tok, i) => {
        const xml = TWEMOJI_SVG[tok];
        if (!xml) {
          return (
            <Text key={i} style={{ fontSize: size, lineHeight: size * 1.15 }}>
              {/* Best-effort: render the original char(s) via system font */}
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
