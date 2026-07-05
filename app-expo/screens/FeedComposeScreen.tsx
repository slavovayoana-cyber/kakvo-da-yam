import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView, TextInput,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMyProfile, setNickname, createVenuePost, createHomePost } from '../lib/feed';
import type { PostKind, Difficulty } from '../lib/feedTypes';

const C = {
  bg: '#FBEFE6', card: '#FFFDFB', ink: '#3B2A22', inkSoft: '#8A7264',
  accent: '#C2674A', accentDeep: '#A94E33', star: '#E3A233',
  starOff: 'rgba(59,42,34,0.20)', line: 'rgba(59,42,34,0.14)',
  chip: 'rgba(255,255,255,0.65)', seg: 'rgba(59,42,34,0.06)',
};

const CUISINES = ['Скара', 'Българска', 'Fast food', 'Пица', 'Италианска', 'Азиатска', 'Морска', 'Кафене'];
const PLACE_TYPES: { key: string; label: string }[] = [
  { key: 'restaurant', label: '🍽️ Ресторант' }, { key: 'cafe', label: '☕ Кафене' },
  { key: 'bar', label: '🍸 Бар' }, { key: 'patisserie', label: '🧁 Сладкарница' },
  { key: 'street', label: '🌭 Street food' },
];
const DIFFS: { key: Difficulty; label: string }[] = [
  { key: 'easy', label: 'Лесно' }, { key: 'medium', label: 'Средно' }, { key: 'hard', label: 'Трудно' },
];

type Props = { onBack: () => void; onPosted: () => void };

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} onPress={() => onChange(n)} hitSlop={6}>
          <Text style={{ fontSize: 30, color: n <= value ? C.star : C.starOff }}>★</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function FeedComposeScreen({ onBack, onPosted }: Props) {
  const insets = useSafeAreaInsets();
  const [needNickname, setNeedNickname] = useState(false);
  const [nickname, setNick] = useState('');
  const [kind, setKind] = useState<PostKind>('venue');
  const [saving, setSaving] = useState(false);

  // common
  const [dishName, setDishName] = useState('');
  const [dishRating, setDishRating] = useState(0);
  const [comment, setComment] = useState('');

  // venue
  const [placeName, setPlaceName] = useState('');
  const [placeCity, setPlaceCity] = useState('');
  const [placeRating, setPlaceRating] = useState(0);
  const [worthIt, setWorthIt] = useState<boolean | null>(null);
  const [cuisine, setCuisine] = useState<string | null>(null);
  const [placeType, setPlaceType] = useState<string | null>(null);

  // home
  const [prep, setPrep] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [servings, setServings] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');

  useEffect(() => {
    getMyProfile().then((p) => setNeedNickname(!p)).catch(() => setNeedNickname(true));
  }, []);

  const submit = async () => {
    if (needNickname && nickname.trim().length < 2) {
      Alert.alert('Прякор', 'Избери си прякор (поне 2 букви), за да публикуваш.');
      return;
    }
    if (!dishName.trim()) { Alert.alert('Ястие', 'Напиши какво яде.'); return; }
    if (dishRating < 1) { Alert.alert('Оценка', 'Дай оценка на ястието (звезди).'); return; }
    if (kind === 'venue' && !placeName.trim()) { Alert.alert('Заведение', 'Напиши името на заведението.'); return; }

    setSaving(true);
    try {
      if (needNickname) await setNickname(nickname.trim());
      if (kind === 'venue') {
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${placeName} ${placeCity}`.trim())}`;
        await createVenuePost({
          dishName, dishRating, comment,
          placeName, placeCity: placeCity || undefined, placeMapsUrl: mapsUrl,
          placeRating: placeRating || undefined,
          worthIt: worthIt ?? undefined,
          cuisine: cuisine || undefined, placeType: placeType || undefined,
        });
      } else {
        await createHomePost({
          dishName, dishRating, comment,
          prepMinutes: prep ? parseInt(prep, 10) : undefined,
          difficulty: difficulty || undefined,
          servings: servings ? parseInt(servings, 10) : undefined,
          ingredients: ingredients || undefined, steps: steps || undefined,
        });
      }
      onPosted();
    } catch (e: any) {
      Alert.alert('Проблем', 'Публикуването не успя. Опитай пак.');
      setSaving(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.appbar}>
        <Pressable onPress={onBack} hitSlop={10} style={styles.iconbtn}><Text style={styles.iconTxt}>✕</Text></Pressable>
        <Text style={styles.title}>Добави хапване</Text>
        <View style={{ width: 34 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: insets.bottom + 100, gap: 16 }} keyboardShouldPersistTaps="handled">

          {needNickname ? (
            <View style={styles.group}>
              <Text style={styles.lbl}>Твоят прякор</Text>
              <TextInput value={nickname} onChangeText={setNick} placeholder="напр. Мария" placeholderTextColor={C.inkSoft}
                style={styles.input} maxLength={30} />
              <Text style={styles.sub}>Показва се под постовете ти.</Text>
            </View>
          ) : null}

          {/* Kind */}
          <View style={styles.seg}>
            {(['venue', 'home'] as PostKind[]).map((k) => (
              <Pressable key={k} onPress={() => setKind(k)} style={[styles.segBtn, kind === k && styles.segBtnOn]}>
                <Text style={[styles.segTxt, kind === k && styles.segTxtOn]}>{k === 'venue' ? '🍴 Заведение' : '🍲 Вкъщи'}</Text>
              </Pressable>
            ))}
          </View>

          {/* Photo placeholder (Phase 3) */}
          <View style={styles.photoStub}>
            <Text style={{ fontSize: 30 }}>📷</Text>
            <Text style={styles.photoStubTxt}>Снимки — идват скоро</Text>
          </View>

          <View style={styles.group}>
            <Text style={styles.lbl}>Какво яде?</Text>
            <TextInput value={dishName} onChangeText={setDishName} placeholder="напр. Кебапчета" placeholderTextColor={C.inkSoft} style={styles.input} maxLength={80} />
          </View>

          <View style={styles.group}>
            <Text style={styles.lbl}>Оценка на ястието</Text>
            <StarPicker value={dishRating} onChange={setDishRating} />
          </View>

          {kind === 'venue' ? (
            <>
              <View style={styles.group}>
                <Text style={styles.lbl}>Заведение</Text>
                <TextInput value={placeName} onChangeText={setPlaceName} placeholder="Име на заведението" placeholderTextColor={C.inkSoft} style={styles.input} />
                <TextInput value={placeCity} onChangeText={setPlaceCity} placeholder="Град (по избор)" placeholderTextColor={C.inkSoft} style={[styles.input, { marginTop: 8 }]} />
              </View>
              <View style={styles.group}>
                <Text style={styles.lbl}>Оценка на заведението (по избор)</Text>
                <StarPicker value={placeRating} onChange={setPlaceRating} />
              </View>
              <View style={styles.group}>
                <Text style={styles.lbl}>Струваше ли си?</Text>
                <View style={styles.rowChips}>
                  <Pressable onPress={() => setWorthIt(true)} style={[styles.chip, worthIt === true && styles.chipOn]}><Text style={[styles.chipTxt, worthIt === true && styles.chipTxtOn]}>💰 Да</Text></Pressable>
                  <Pressable onPress={() => setWorthIt(false)} style={[styles.chip, worthIt === false && styles.chipOn]}><Text style={[styles.chipTxt, worthIt === false && styles.chipTxtOn]}>👎 Не</Text></Pressable>
                </View>
              </View>
              <View style={styles.group}>
                <Text style={styles.lbl}>Тип място</Text>
                <View style={styles.rowChips}>
                  {PLACE_TYPES.map((t) => (
                    <Pressable key={t.key} onPress={() => setPlaceType(placeType === t.key ? null : t.key)} style={[styles.chip, placeType === t.key && styles.chipOn]}>
                      <Text style={[styles.chipTxt, placeType === t.key && styles.chipTxtOn]}>{t.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View style={styles.group}>
                <Text style={styles.lbl}>Кухня</Text>
                <View style={styles.rowChips}>
                  {CUISINES.map((c) => (
                    <Pressable key={c} onPress={() => setCuisine(cuisine === c ? null : c)} style={[styles.chip, cuisine === c && styles.chipOn]}>
                      <Text style={[styles.chipTxt, cuisine === c && styles.chipTxtOn]}>{c}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={styles.group}>
                <Text style={styles.lbl}>Време и порции</Text>
                <View style={styles.rowChips}>
                  <TextInput value={prep} onChangeText={setPrep} placeholder="мин" placeholderTextColor={C.inkSoft} keyboardType="number-pad" style={[styles.input, styles.small]} />
                  <TextInput value={servings} onChangeText={setServings} placeholder="порции" placeholderTextColor={C.inkSoft} keyboardType="number-pad" style={[styles.input, styles.small]} />
                </View>
              </View>
              <View style={styles.group}>
                <Text style={styles.lbl}>Трудност</Text>
                <View style={styles.rowChips}>
                  {DIFFS.map((d) => (
                    <Pressable key={d.key} onPress={() => setDifficulty(difficulty === d.key ? null : d.key)} style={[styles.chip, difficulty === d.key && styles.chipOn]}>
                      <Text style={[styles.chipTxt, difficulty === d.key && styles.chipTxtOn]}>{d.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View style={styles.group}>
                <Text style={styles.lbl}>Съставки</Text>
                <TextInput value={ingredients} onChangeText={setIngredients} placeholder="Изброй съставките…" placeholderTextColor={C.inkSoft} style={[styles.input, styles.multi]} multiline />
              </View>
              <View style={styles.group}>
                <Text style={styles.lbl}>Приготвяне</Text>
                <TextInput value={steps} onChangeText={setSteps} placeholder="Опиши стъпките…" placeholderTextColor={C.inkSoft} style={[styles.input, styles.multi]} multiline />
              </View>
            </>
          )}

          <View style={styles.group}>
            <Text style={styles.lbl}>Кажи нещо (по избор)</Text>
            <TextInput value={comment} onChangeText={setComment} placeholder="Струваше ли си? Какво да поръчат другите?" placeholderTextColor={C.inkSoft} style={[styles.input, styles.multi]} multiline maxLength={500} />
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <Pressable onPress={submit} disabled={saving} style={[styles.publish, saving && { opacity: 0.7 }]}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.publishTxt}>Публикувай</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  appbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 8 },
  iconbtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: C.chip },
  iconTxt: { fontSize: 18, color: C.ink },
  title: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 22, color: C.ink },

  group: { gap: 8 },
  lbl: { fontSize: 12, fontWeight: '700', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.6 },
  sub: { fontSize: 11.5, color: C.inkSoft },
  input: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: C.ink },
  small: { flex: 1 },
  multi: { minHeight: 72, textAlignVertical: 'top' },

  seg: { flexDirection: 'row', backgroundColor: C.seg, borderRadius: 999, padding: 4, gap: 4 },
  segBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 999 },
  segBtnOn: { backgroundColor: C.accent },
  segTxt: { fontSize: 14, fontWeight: '700', color: C.inkSoft },
  segTxtOn: { color: '#fff' },

  photoStub: { height: 96, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: C.line, alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: C.chip },
  photoStubTxt: { fontSize: 12.5, color: C.inkSoft, fontWeight: '600' },

  rowChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 999, backgroundColor: C.chip, borderWidth: 1, borderColor: C.line },
  chipOn: { backgroundColor: C.accent, borderColor: C.accentDeep },
  chipTxt: { fontSize: 13, fontWeight: '600', color: C.ink },
  chipTxtOn: { color: '#fff' },

  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 18, paddingTop: 10, backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.line },
  publish: { backgroundColor: C.accent, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  publishTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
