import React, { forwardRef } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { FeedPost } from '../lib/feedTypes';

const W = 540;
const H = 960;

// Картичка за споделяне на пост от „Какво APPна?" — снимка + детайли + бранд.
export const FeedShareCard = forwardRef<View, { post: FeedPost }>(({ post }, ref) => {
  const isVenue = post.kind === 'venue';
  const photo = post.photo_urls?.[0] ?? post.photo_url ?? null;
  const stars = '★'.repeat(post.dish_rating ?? 0) + '☆'.repeat(Math.max(0, 5 - (post.dish_rating ?? 0)));
  const nameSize = (post.dish_name?.length ?? 0) > 22 ? 42 : 52;

  return (
    <View ref={ref} collapsable={false} style={styles.card}>
      <View style={styles.photoWrap}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} resizeMode="cover" />
        ) : (
          <View style={[styles.photo, styles.noPhoto]}><Text style={{ fontSize: 120 }}>{isVenue ? '🍽️' : '🍲'}</Text></View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={[styles.name, { fontSize: nameSize, lineHeight: nameSize * 1.15 }]} numberOfLines={2}>{post.dish_name}</Text>

        <Text style={styles.stars}>{stars}</Text>

        {isVenue && post.place_name ? (
          <Text style={styles.place} numberOfLines={2}>📍 {post.place_name}{post.place_city ? ` · ${post.place_city}` : ''}</Text>
        ) : (
          <Text style={styles.place}>🍲 Домашна рецепта</Text>
        )}

        {post.comment ? <Text style={styles.comment} numberOfLines={3}>„{post.comment}"</Text> : null}
      </View>

      <View style={styles.footer}>
        <Text style={styles.cta}>{isVenue ? 'Открих го в „Какво да ям?" 🍽️' : 'Рецепта от „Какво да ям?" 🍽️'}</Text>
        <Text style={styles.sub}>Виж какво ядат другите — секция „Какво APPна?"</Text>
        <Text style={styles.brand}>какво да ям<Text style={{ color: '#C2674A' }}>?</Text></Text>
      </View>
    </View>
  );
});

FeedShareCard.displayName = 'FeedShareCard';

const styles = StyleSheet.create({
  card: { width: W, height: H, backgroundColor: '#FBEEE3', overflow: 'hidden' },
  photoWrap: { width: W, height: 560, backgroundColor: '#EEDFD2' },
  photo: { width: '100%', height: '100%' },
  noPhoto: { alignItems: 'center', justifyContent: 'center' },
  body: { paddingHorizontal: 44, paddingTop: 30, flex: 1 },
  name: { fontFamily: 'Fraunces_500Medium', fontWeight: '700', color: '#3A2A20' },
  stars: { fontSize: 34, color: '#E0A72E', marginTop: 14, letterSpacing: 2 },
  place: { fontFamily: 'Geist_600SemiBold', fontSize: 24, color: '#A94E33', marginTop: 16, fontWeight: '700' },
  comment: { fontFamily: 'Geist_400Regular', fontSize: 22, fontStyle: 'italic', color: '#5A4636', lineHeight: 30, marginTop: 18 },
  footer: { position: 'absolute', bottom: 46, left: 44, right: 44, alignItems: 'center', gap: 8 },
  cta: { fontFamily: 'Geist_600SemiBold', fontSize: 24, fontWeight: '700', color: '#3A2A20', textAlign: 'center' },
  sub: { fontFamily: 'Geist_400Regular', fontSize: 17, color: '#8A6A54', textAlign: 'center' },
  brand: { fontFamily: 'Geist_600SemiBold', fontSize: 20, letterSpacing: 3, textTransform: 'uppercase', color: '#3A2A20', marginTop: 6 },
});
