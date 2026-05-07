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
/**
 * Splits an emoji string into individual rendered glyph strings, preserving
 * variation selectors so each glyph still renders as the intended emoji.
 * Country flag pairs (regional indicators) are kept together as one glyph.
 */
function splitEmojiGlyphs(s: string): string[] {
  const out: string[] = [];
  const chars = [...s];
  let i = 0;
  while (i < chars.length) {
    const ch = chars[i];
    const cp = ch.codePointAt(0)!;
    // Regional indicator pair → flag, keep together
    if (cp >= 0x1f1e6 && cp <= 0x1f1ff && i + 1 < chars.length) {
      const cp2 = chars[i + 1].codePointAt(0)!;
      if (cp2 >= 0x1f1e6 && cp2 <= 0x1f1ff) {
        out.push(ch + chars[i + 1]);
        i += 2;
        continue;
      }
    }
    let glyph = ch;
    let j = i + 1;
    // Absorb variation selectors (FE0F) and ZWJ sequences as part of the glyph
    while (j < chars.length) {
      const ncp = chars[j].codePointAt(0)!;
      if (ncp === 0xfe0f) {
        glyph += chars[j];
        j++;
      } else if (ncp === 0x200d) {
        // ZWJ — joins next char into the same glyph (e.g. 👩‍❤️‍👨)
        glyph += chars[j];
        j++;
        if (j < chars.length) {
          glyph += chars[j];
          j++;
        }
      } else {
        break;
      }
    }
    out.push(glyph);
    i = j;
  }
  return out;
}

export function EmojiImage({ emoji, size, style }: Props) {
  const glyphs = splitEmojiGlyphs(emoji);
  // When there are multiple glyphs, scale each down a bit so the row fits.
  const perGlyphSize = glyphs.length > 1 ? Math.round(size * 0.78) : size;

  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.row, style]}>
        {glyphs.map((g, i) => (
          <Text
            key={i}
            style={{
              fontSize: perGlyphSize,
              lineHeight: perGlyphSize * 1.15,
            }}
          >
            {g}
          </Text>
        ))}
      </View>
    );
  }

  // Android: use Twemoji SVG via hex tokens for consistent rendering
  const tokens = tokenizeEmoji(emoji);
  return (
    <View style={[styles.row, style]}>
      {tokens.map((tok, i) => {
        const xml = TWEMOJI_SVG[tok];
        if (!xml) {
          return (
            <Text
              key={i}
              style={{
                fontSize: perGlyphSize,
                lineHeight: perGlyphSize * 1.15,
              }}
            >
              {glyphs[i] ?? ''}
            </Text>
          );
        }
        return (
          <SvgXml
            key={i}
            xml={xml}
            width={perGlyphSize}
            height={perGlyphSize}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
