import React, { useEffect, useRef, useState } from 'react';
import { Pressable, View, Text, Image, StyleSheet, Animated, Easing, AppState } from 'react-native';
import Svg, { Ellipse, Defs, Filter, FeGaussianBlur } from 'react-native-svg';
import { EmojiImage } from './EmojiImage';
import { tapMedium } from '../lib/haptics';

const DICE_IMG = require('../assets/dice.png');
const PLATE_IMG = require('../assets/dice-plate.png');

const ROLL_FOODS = ['🍝', '🍕', '🍔', '🍣', '🥗', '🌮', '🍜', '🥞', '🌯', '🍲', '🥙', '🍛'];

// The tumble is fun the first few times each session, then it just slows people
// down — so the die spins for the first few rolls after every app open, then
// becomes an instant tap. The counter is per-session (resets each open).
const SPIN_LIMIT = 8;
let sessionRolls = 0;

// Reset the per-session counter whenever the app returns to the foreground, so
// "open the app" gives a fresh batch of spins. (Set up once, module-wide.)
let appStateHooked = false;
function hookAppState() {
  if (appStateHooked) return;
  appStateHooked = true;
  let last = AppState.currentState;
  AppState.addEventListener('change', (s) => {
    if (s === 'active' && last === 'background') sessionRolls = 0;
    last = s;
  });
}

type Props = {
  onRoll: () => void;
  accent: string;
  ink: string;
};

/**
 * The "throw the dice" reroll control. A small plate-faced die that gently
 * breathes while idle and tumbles (flashing food emojis) when tapped, calling
 * onRoll mid-tumble so the new meal animates in as the die settles.
 */
export function RerollDice({ onRoll, accent, ink }: Props) {
  // face === null → idle (plate + "?"); otherwise a flashing food emoji.
  const [face, setFace] = useState<string | null>(null);
  const rolling = useRef(false);

  const float = useRef(new Animated.Value(0)).current;
  const rot = useRef(new Animated.Value(0)).current;
  const hop = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(0)).current;

  useEffect(() => { hookAppState(); }, []);

  // Gentle idle breathing.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1, duration: 2400,
          easing: Easing.inOut(Easing.ease), useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0, duration: 2400,
          easing: Easing.inOut(Easing.ease), useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [float]);

  const onPress = () => {
    if (rolling.current) return;

    // Spin for the first few rolls of each session, then instant tap.
    const willAnimate = sessionRolls < SPIN_LIMIT;
    sessionRolls += 1;

    // After the novelty wears off: just a quick press, instant new meal.
    if (!willAnimate) {
      tapMedium();
      press.setValue(0);
      Animated.sequence([
        Animated.timing(press, { toValue: 1, duration: 70, useNativeDriver: true }),
        Animated.spring(press, { toValue: 0, friction: 5, tension: 140, useNativeDriver: true }),
      ]).start();
      onRoll();
      return;
    }

    rolling.current = true;
    tapMedium();

    setFace(ROLL_FOODS[0]);
    const iv = setInterval(() => {
      setFace(ROLL_FOODS[Math.floor(Math.random() * ROLL_FOODS.length)]);
    }, 175);

    rot.setValue(0);
    Animated.parallel([
      // one full turn → calmer, ends upright (no upside-down plate)
      Animated.timing(rot, {
        toValue: 1, duration: 850,
        easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(hop, {
          toValue: 1, duration: 280,
          easing: Easing.out(Easing.quad), useNativeDriver: true,
        }),
        Animated.timing(hop, {
          toValue: 0, duration: 470,
          easing: Easing.in(Easing.quad), useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(press, { toValue: 1, duration: 90, useNativeDriver: true }),
        Animated.spring(press, { toValue: 0, friction: 4, tension: 120, useNativeDriver: true }),
      ]),
    ]).start();

    // Swap the meal mid-tumble so it lands together with the settle.
    setTimeout(() => onRoll(), 340);
    setTimeout(() => {
      clearInterval(iv);
      setFace(null);
      rolling.current = false;
    }, 850);
  };

  const translateY = Animated.add(
    float.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }),
    hop.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }),
  );
  const rotate = rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const scale = press.interpolate({ inputRange: [0, 1], outputRange: [1, 0.9] });

  // shadow tightens & fades as the die lifts
  const shadowScale = hop.interpolate({ inputRange: [0, 1], outputRange: [1, 0.6] });
  const shadowOpacity = hop.interpolate({ inputRange: [0, 1], outputRange: [1, 0.45] });
  const floatShadowScale = float.interpolate({ inputRange: [0, 1], outputRange: [1, 0.9] });

  return (
    <Pressable onPress={onPress} style={styles.area} hitSlop={14}>
      <Animated.View
        style={[
          styles.dieWrap,
          { transform: [{ translateY }, { rotate }, { scale }] },
        ]}
      >
        <Image source={DICE_IMG} style={styles.die} />
        <View style={styles.faceCenter}>
          {face === null ? (
            <>
              <Image source={PLATE_IMG} style={styles.plateImg} />
              <Text style={[styles.q, { color: accent }]}>?</Text>
            </>
          ) : (
            <EmojiImage emoji={face} size={38} />
          )}
        </View>
      </Animated.View>
      <Animated.View
        style={[
          styles.shadowWrap,
          { opacity: shadowOpacity, transform: [{ scaleX: Animated.multiply(shadowScale, floatShadowScale) }] },
        ]}
      >
        <Svg width={88} height={26}>
          <Defs>
            <Filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
              <FeGaussianBlur stdDeviation="3.6" />
            </Filter>
          </Defs>
          <Ellipse cx={44} cy={13} rx={28} ry={6.5} fill="rgba(90,50,35,0.30)" filter="url(#softBlur)" />
        </Svg>
      </Animated.View>
      <Text style={[styles.caption, { color: ink }]}>Натисни ме</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  area: { alignItems: 'center' },
  dieWrap: { width: 68, height: 68 },
  die: { width: 68, height: 68 },
  faceCenter: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  plate: { fontSize: 38 },
  plateImg: { width: 44, height: 44 },
  q: {
    position: 'absolute', fontSize: 17, fontWeight: '900',
    transform: [{ translateY: 1 }],
    textShadowColor: 'rgba(255,255,255,0.85)', textShadowRadius: 2, textShadowOffset: { width: 0, height: 0 },
  },
  food: { fontSize: 38 },
  // Real Gaussian-blurred ground shadow via SVG (RN can't blur a plain View).
  shadowWrap: { marginTop: -1, height: 24, alignItems: 'center', justifyContent: 'center' },
  caption: { marginTop: 6, fontSize: 13, fontWeight: '700', opacity: 0.55, letterSpacing: 0.3 },
});
