import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { MoodTheme } from '../lib/moodSystem';

type Props = { theme: MoodTheme; style?: ViewStyle; children?: React.ReactNode };

export function MoodGradient({ theme, style, children }: Props) {
  const g = theme.gradient;
  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      <LinearGradient
        colors={g.colors as readonly [string, string, ...string[]]}
        locations={g.locations as readonly [number, number, ...number[]] | undefined}
        start={g.start}
        end={g.end}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}
