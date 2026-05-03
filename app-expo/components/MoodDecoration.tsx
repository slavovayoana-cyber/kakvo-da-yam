import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G, Circle, Ellipse, Rect } from 'react-native-svg';
import type { MoodTheme } from '../lib/moodSystem';

type DieProps = {
  size: number;
  rotate: number;
  opacity: number;
  color: string;
  dots: 1 | 2 | 3 | 4 | 5 | 6;
};

const DOT_LAYOUT: Record<DieProps['dots'], [number, number][]> = {
  1: [[20, 20]],
  2: [[12, 12], [28, 28]],
  3: [[12, 12], [20, 20], [28, 28]],
  4: [[12, 12], [28, 12], [12, 28], [28, 28]],
  5: [[12, 12], [28, 12], [20, 20], [12, 28], [28, 28]],
  6: [[12, 11], [28, 11], [12, 20], [28, 20], [12, 29], [28, 29]],
};

function OutlineDie({ size, rotate, opacity, color, dots }: DieProps) {
  return (
    <View
      pointerEvents="none"
      style={{
        opacity,
        transform: [{ rotate: `${rotate}deg` }],
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 40 40">
        <Rect
          x={3}
          y={3}
          width={34}
          height={34}
          rx={7}
          stroke={color}
          strokeWidth={1.6}
          fill="none"
        />
        {DOT_LAYOUT[dots].map(([x, y], i) => (
          <Circle key={i} cx={x} cy={y} r={1.6} fill={color} />
        ))}
      </Svg>
    </View>
  );
}

type Props = { theme: MoodTheme; scale?: number };

export function MoodDecoration({ theme, scale = 1 }: Props) {
  if (!theme || theme.decoration === 'none') return null;
  const c = theme.colorDeep;

  if (theme.decoration === 'leaves') {
    const w = 110 * scale;
    return (
      <View pointerEvents="none" style={[styles.abs, { top: 24, right: -10, width: w, height: w * (120 / 100), opacity: 0.18 }]}>
        <Svg width="100%" height="100%" viewBox="0 0 100 120">
          <Path d="M50 10 Q20 30 25 70 Q30 95 50 110 Q70 95 75 70 Q80 30 50 10 Z" fill="none" stroke={c} strokeWidth="1.2" />
          <Path d="M50 10 L50 110" stroke={c} strokeWidth="1" />
          <Path d="M50 35 Q35 40 30 55" stroke={c} strokeWidth="1" fill="none" />
          <Path d="M50 35 Q65 40 70 55" stroke={c} strokeWidth="1" fill="none" />
          <Path d="M50 60 Q35 65 30 80" stroke={c} strokeWidth="1" fill="none" />
          <Path d="M50 60 Q65 65 70 80" stroke={c} strokeWidth="1" fill="none" />
        </Svg>
      </View>
    );
  }

  if (theme.decoration === 'sparkles') {
    const w = 90 * scale;
    return (
      <View pointerEvents="none" style={[styles.abs, { top: 30, left: -10, width: w, height: w * (120 / 80), opacity: 0.35 }]}>
        <Svg width="100%" height="100%" viewBox="0 0 80 120">
          <G fill={c}>
            <Path d="M20 20 L22 28 L30 30 L22 32 L20 40 L18 32 L10 30 L18 28 Z" />
            <Path d="M55 60 L57 66 L63 68 L57 70 L55 76 L53 70 L47 68 L53 66 Z" opacity={0.7} />
            <Path d="M30 90 L31 95 L36 96 L31 97 L30 102 L29 97 L24 96 L29 95 Z" opacity={0.5} />
          </G>
        </Svg>
      </View>
    );
  }

  if (theme.decoration === 'underline') {
    const w = 180 * scale;
    return (
      <View pointerEvents="none" style={[styles.abs, { bottom: 80, left: 0, right: 0, alignItems: 'center', opacity: 0.4 }]}>
        <Svg width={w} height={w * (30 / 200)} viewBox="0 0 200 30">
          <Path d="M5 20 Q50 5 100 18 T195 15" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </Svg>
      </View>
    );
  }

  if (theme.decoration === 'soft-blob') {
    const w = 200 * scale;
    return (
      <View pointerEvents="none" style={[styles.abs, { top: 60, right: -40, width: w, height: w, opacity: 0.25 }]}>
        <Svg width="100%" height="100%" viewBox="0 0 200 200">
          <Ellipse cx="100" cy="100" rx="90" ry="75" fill={c} />
        </Svg>
      </View>
    );
  }

  if (theme.decoration === 'dice') {
    return (
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
        <View style={{ position: 'absolute', top: 60, left: 24 }}>
          <OutlineDie size={84 * scale} rotate={-14} opacity={0.28} color={c} dots={5} />
        </View>
        <View style={{ position: 'absolute', top: 180, right: -8 }}>
          <OutlineDie size={110 * scale} rotate={22} opacity={0.22} color={c} dots={3} />
        </View>
        <View style={{ position: 'absolute', top: 360, left: 70 }}>
          <OutlineDie size={60 * scale} rotate={38} opacity={0.3} color={c} dots={2} />
        </View>
        <View style={{ position: 'absolute', bottom: 220, right: 40 }}>
          <OutlineDie size={70 * scale} rotate={-26} opacity={0.24} color={c} dots={4} />
        </View>
        <View style={{ position: 'absolute', bottom: 320, left: -12 }}>
          <OutlineDie size={50 * scale} rotate={12} opacity={0.26} color={c} dots={1} />
        </View>
      </View>
    );
  }
  if (theme.decoration === 'shevitsa') {
    const count = 18;
    return (
      <View pointerEvents="none" style={[styles.abs, { top: 110, left: 0, right: 0, height: 28, opacity: 0.5 }]}>
        <Svg width="100%" height={28} viewBox="0 0 360 28" preserveAspectRatio="xMidYMid slice">
          <G fill={c}>
            {Array.from({ length: count }).map((_, i) => (
              <G key={i} x={i * 22 + 6} y={6}>
                <Path d="M8 0 L16 8 L8 16 L0 8 Z" />
                <Circle cx="8" cy="8" r="2" fill={theme.bg} />
              </G>
            ))}
          </G>
        </Svg>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  abs: { position: 'absolute' },
});
