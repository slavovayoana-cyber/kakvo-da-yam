import { useEffect, useRef, useState } from 'react';
import { Animated, AccessibilityInfo, Platform } from 'react-native';
import { DeviceMotion } from 'expo-sensors';

const MAX_TRANSLATE = 22;
const MAX_ROTATE_Z_DEG = 8;
const SMOOTHING_ALPHA = 0.12;
const UPDATE_INTERVAL_MS = 16;

const DIE1_INTENSITY = { translate: 1.0, rotate: 1.0, sign: 1 };
const DIE2_INTENSITY = { translate: 0.65, rotate: 0.55, sign: -1 };

export type DieMotionStyle = {
  translateX: Animated.Value;
  translateY: Animated.Value;
  rotateZ: Animated.AnimatedInterpolation<string>;
};

export type DiceGyroMotion = {
  die1: DieMotionStyle;
  die2: DieMotionStyle;
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function useDiceGyroMotion(enabled = true): DiceGyroMotion {
  const die1X = useRef(new Animated.Value(0)).current;
  const die1Y = useRef(new Animated.Value(0)).current;
  const die1RotRaw = useRef(new Animated.Value(0)).current;
  const die2X = useRef(new Animated.Value(0)).current;
  const die2Y = useRef(new Animated.Value(0)).current;
  const die2RotRaw = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!enabled) return;
    if (Platform.OS === 'web') return;

    let cancelled = false;
    let subscription: { remove: () => void } | null = null;
    const smoothed = { x: 0, y: 0 };

    (async () => {
      try {
        const reduced = await AccessibilityInfo.isReduceMotionEnabled();
        if (reduced) return;
      } catch {
        // continue if we can't determine
      }
      if (cancelled) return;

      try {
        const available = await DeviceMotion.isAvailableAsync();
        if (!available) return;
      } catch {
        return;
      }
      if (cancelled) return;

      try {
        const perm = await DeviceMotion.requestPermissionsAsync();
        if (!perm.granted) return;
      } catch {
        // some platforms don't gate on permission — proceed
      }
      if (cancelled) return;

      DeviceMotion.setUpdateInterval(UPDATE_INTERVAL_MS);
      subscription = DeviceMotion.addListener((data) => {
        const rot = data.rotation;
        if (!rot) return;
        const tx = clamp(rot.gamma, -1, 1);
        const ty = clamp(rot.beta - 0.4, -1, 1);
        smoothed.x += (tx - smoothed.x) * SMOOTHING_ALPHA;
        smoothed.y += (ty - smoothed.y) * SMOOTHING_ALPHA;

        const sx = smoothed.x;
        const sy = smoothed.y;
        die1X.setValue(sx * MAX_TRANSLATE * DIE1_INTENSITY.translate * DIE1_INTENSITY.sign);
        die1Y.setValue(sy * MAX_TRANSLATE * DIE1_INTENSITY.translate * DIE1_INTENSITY.sign);
        die1RotRaw.setValue(sx * MAX_ROTATE_Z_DEG * DIE1_INTENSITY.rotate * DIE1_INTENSITY.sign);
        die2X.setValue(sx * MAX_TRANSLATE * DIE2_INTENSITY.translate * DIE2_INTENSITY.sign);
        die2Y.setValue(sy * MAX_TRANSLATE * DIE2_INTENSITY.translate * DIE2_INTENSITY.sign);
        die2RotRaw.setValue(sx * MAX_ROTATE_Z_DEG * DIE2_INTENSITY.rotate * DIE2_INTENSITY.sign);
      });
    })();

    return () => {
      cancelled = true;
      subscription?.remove();
      die1X.setValue(0); die1Y.setValue(0); die1RotRaw.setValue(0);
      die2X.setValue(0); die2Y.setValue(0); die2RotRaw.setValue(0);
    };
  }, [enabled, die1X, die1Y, die1RotRaw, die2X, die2Y, die2RotRaw]);

  const die1Rotate = die1RotRaw.interpolate({
    inputRange: [-MAX_ROTATE_Z_DEG, MAX_ROTATE_Z_DEG],
    outputRange: [`-${MAX_ROTATE_Z_DEG}deg`, `${MAX_ROTATE_Z_DEG}deg`],
    extrapolate: 'clamp',
  });
  const die2Rotate = die2RotRaw.interpolate({
    inputRange: [-MAX_ROTATE_Z_DEG, MAX_ROTATE_Z_DEG],
    outputRange: [`-${MAX_ROTATE_Z_DEG}deg`, `${MAX_ROTATE_Z_DEG}deg`],
    extrapolate: 'clamp',
  });

  return {
    die1: { translateX: die1X, translateY: die1Y, rotateZ: die1Rotate },
    die2: { translateX: die2X, translateY: die2Y, rotateZ: die2Rotate },
  };
}
