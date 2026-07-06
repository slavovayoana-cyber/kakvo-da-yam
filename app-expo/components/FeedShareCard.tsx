import React, { forwardRef } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { FeedPost } from '../lib/feedTypes';

const W = 540;
const H = 960;

// Красива картичка за споделяне на пост от „Какво APPна?".
export const FeedShareCard = forwardRef<View, { post: FeedPost }>(({ post }, ref) => {
  const isVenue = post.kind === 'venue';
  const photo = post.photo_urls?.[0] ?? post.photo_url ?? null;
  const stars = '★'.repeat(post.dish_rating ?? 0) + '☆'.repeat(Math.max(0, 5 - (post.dish_rating ?? 0)));
  const nameSize = (post.dish_name?.length ?? 0) > 22 ? 44 : 54;

  return (
    <View ref={ref} collapsable={false} style={styles.card}>
      <LinearGradient
        colors={['#FCEFE2', '#F7E2D0', '#F1D6C0']}
        locations={[0, 0.6, 1]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Снимка */}
      <View style={styles.photoWrap}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} resizeMode="cover" />
        ) : (
          <View style={[styles.photo, styles.noPhoto]}><Text style={{ fontSize: 130 }}>{isVenue ? '🍽️' : '🍲'}</Text></View>
        )}
      </View>

      {/* Съдържание */}
      <View style={styles.body}>
        <Text style={[styles.name, { fontSize: nameSize, lineHeight: nameSize * 1.12 }]} numberOfLines={2}>{post.dish_name}</Text>
        <Text style={styles.stars}>{stars}</Text>
        {isVenue && post.place_name ? (
          <Text style={styles.place} numberOfLines={1}>📍 {post.place_name}{post.place_city ? ` · ${post.place_city}` : ''}</Text>
        ) : (
          <Text style={styles.place}>🍲 Домашна рецепта{post.prep_minutes ? ` · ${post.prep_minutes} мин` : ''}</Text>
        )}
        {post.comment ? <Text style={styles.comment} numberOfLines={2}>„{post.comment}"</Text> : null}
      </View>

      {/* Долен бранд + подкана за сваляне */}
      <View style={styles.footer}>
        <View style={styles.divider} />
        <View style={styles.brandRow}>
          <Image source={require('../assets/icon.png')} style={styles.logo} />
          <Text style={styles.brand}>Какво да ям<Text style={{ color: '#C2674A' }}>?</Text></Text>
        </View>
        <Text style={styles.tagline}>Виж какво ядат другите — секция „Какво APPна?" 🍽️</Text>
        <View style={styles.stores}>
          <Text style={styles.storeChip}> App Store</Text>
          <Text style={styles.storeChip}>🤖 Google Play</Text>
        </View>
        <Text style={styles.url}>noomup.com/kakvo-da-yam</Text>
      </View>
    </View>
  );
});

FeedShareCard.displayName = 'FeedShareCard';

const styles = StyleSheet.create({
  card: { width: W, height: H, overflow: 'hidden' },
  photoWrap: { width: W, height: 500, backgroundColor: '#EEDFD2' },
  photo: { width: '100%', height: '100%' },
  noPhoto: { alignItems: 'center', justifyContent: 'center' },

  body: { flex: 1, paddingHorizontal: 46, paddingTop: 34 },
  name: { fontFamily: 'Fraunces_500Medium', fontWeight: '700', color: '#3A2A20' },
  stars: { fontSize: 34, color: '#E0A72E', marginTop: 14, letterSpacing: 3 },
  place: { fontFamily: 'Geist_600SemiBold', fontSize: 25, color: '#A94E33', marginTop: 18, fontWeight: '700' },
  comment: { fontFamily: 'Geist_400Regular', fontSize: 23, fontStyle: 'italic', color: '#6A5341', lineHeight: 32, marginTop: 20 },

  footer: { paddingHorizontal: 46, paddingBottom: 48, alignItems: 'center' },
  divider: { width: 60, height: 3, borderRadius: 3, backgroundColor: 'rgba(58,42,32,0.2)', marginBottom: 20 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 46, height: 46, borderRadius: 11 },
  brand: { fontFamily: 'Fraunces_500Medium', fontSize: 30, fontWeight: '700', color: '#3A2A20' },
  tagline: { fontFamily: 'Geist_400Regular', fontSize: 18, color: '#8A6A54', textAlign: 'center', marginTop: 10 },
  stores: { flexDirection: 'row', gap: 10, marginTop: 16 },
  storeChip: { fontFamily: 'Geist_600SemiBold', fontSize: 17, fontWeight: '700', color: '#fff', backgroundColor: '#C2674A', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8, overflow: 'hidden' },
  url: { fontFamily: 'Geist_400Regular', fontSize: 15, color: '#A08974', marginTop: 16, letterSpacing: 0.5 },
});
