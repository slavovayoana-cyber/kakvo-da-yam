import React, { forwardRef } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { FeedPost } from '../lib/feedTypes';

const W = 540;
const H = 960;

// Редакторска картичка за споделяне — снимката е героят, текстът е върху нея.
export const FeedShareCard = forwardRef<View, { post: FeedPost }>(({ post }, ref) => {
  const isVenue = post.kind === 'venue';
  const photo = post.photo_urls?.[0] ?? post.photo_url ?? null;
  const rating = post.dish_rating ?? 0;
  const nameSize = (post.dish_name?.length ?? 0) > 22 ? 46 : 58;

  return (
    <View ref={ref} collapsable={false} style={styles.card}>
      {/* Снимка на цял екран */}
      {photo ? (
        <Image source={{ uri: photo }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <LinearGradient colors={['#C2674A', '#8A4A33']} style={StyleSheet.absoluteFill} />
      )}

      {/* Градиент за четимост (тъмно горе и долу) */}
      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.60)', 'rgba(0,0,0,0.90)']}
        locations={[0, 0.2, 0.45, 0.72, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Горе: малък воден знак с логото */}
      <View style={styles.top}>
        <Image source={require('../assets/icon.png')} style={styles.topLogo} />
        <Text style={styles.topBrand}>Какво да ям<Text style={{ color: '#FFB870' }}>?</Text></Text>
      </View>

      {/* Долу: цялото съдържание върху тъмната част */}
      <View style={styles.bottom}>
        <View style={styles.starsRow}>
          <Text style={styles.stars}>{'★'.repeat(rating)}<Text style={styles.starsOff}>{'★'.repeat(Math.max(0, 5 - rating))}</Text></Text>
          {isVenue && post.worth_it ? <Text style={styles.worth}>💰 струваше си</Text> : null}
        </View>

        <Text style={[styles.name, { fontSize: nameSize, lineHeight: nameSize * 1.08 }]} numberOfLines={2}>{post.dish_name}</Text>

        {isVenue && post.place_name ? (
          <Text style={styles.place} numberOfLines={1}>📍 {post.place_name}{post.place_city ? ` · ${post.place_city}` : ''}</Text>
        ) : (
          <Text style={styles.place}>🍲 Домашна рецепта{post.prep_minutes ? ` · ${post.prep_minutes} мин` : ''}</Text>
        )}

        {post.comment ? <Text style={styles.comment} numberOfLines={2}>„{post.comment}"</Text> : null}

        <View style={styles.ctaBar}>
          <Text style={styles.ctaTop}>Открий вкусните места и рецепти на другите</Text>
          <Text style={styles.ctaStores}>📲 Изтегли безплатно · App Store &amp; Google Play</Text>
        </View>
      </View>
    </View>
  );
});

FeedShareCard.displayName = 'FeedShareCard';

const SHADOW = { textShadowColor: 'rgba(0,0,0,0.55)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6 };

const styles = StyleSheet.create({
  card: { width: W, height: H, overflow: 'hidden', backgroundColor: '#1a120c' },

  top: { position: 'absolute', top: 40, left: 40, flexDirection: 'row', alignItems: 'center', gap: 11 },
  topLogo: { width: 40, height: 40, borderRadius: 10, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)' },
  topBrand: { fontFamily: 'Geist_600SemiBold', fontSize: 20, fontWeight: '700', color: '#fff', letterSpacing: 0.3, ...SHADOW },

  bottom: { position: 'absolute', left: 44, right: 44, bottom: 52 },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  stars: { fontSize: 30, color: '#FFC64B', letterSpacing: 3, ...SHADOW },
  starsOff: { color: 'rgba(255,255,255,0.4)' },
  worth: { fontFamily: 'Geist_600SemiBold', fontSize: 15, fontWeight: '700', color: '#fff', backgroundColor: 'rgba(93,168,110,0.9)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, overflow: 'hidden' },

  name: { fontFamily: 'Fraunces_500Medium', fontWeight: '700', color: '#fff', ...SHADOW },
  place: { fontFamily: 'Geist_600SemiBold', fontSize: 24, fontWeight: '700', color: '#FFE3CE', marginTop: 12, ...SHADOW },
  comment: { fontFamily: 'Geist_400Regular', fontSize: 21, fontStyle: 'italic', color: 'rgba(255,255,255,0.92)', lineHeight: 29, marginTop: 16, ...SHADOW },

  ctaBar: { marginTop: 26, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.25)', paddingTop: 18, alignItems: 'center' },
  ctaTop: { fontFamily: 'Geist_400Regular', fontSize: 16, color: 'rgba(255,255,255,0.85)', textAlign: 'center', ...SHADOW },
  ctaStores: { fontFamily: 'Geist_600SemiBold', fontSize: 17, fontWeight: '700', color: '#fff', textAlign: 'center', marginTop: 8, ...SHADOW },
});
