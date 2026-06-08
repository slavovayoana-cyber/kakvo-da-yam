import React, { useEffect, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, Switch, ScrollView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  type NotifSettings,
  loadSettings, saveSettings, scheduleAll,
} from '../lib/notifications';
import { tapLight, tapSelection } from '../lib/haptics';

type Props = { onBack: () => void };

const SLOTS = [
  {
    id: 'breakfast' as const,
    emoji: '🌅',
    label: 'Закуска',
    weekday: '08:30',
    weekend: '10:00',
  },
  {
    id: 'lunch' as const,
    emoji: '☀️',
    label: 'Обяд',
    weekday: '12:30',
    weekend: '13:30',
  },
  {
    id: 'dinner' as const,
    emoji: '🌙',
    label: 'Вечеря',
    weekday: '19:00',
    weekend: '19:00',
  },
] as const;

const PREVIEWS: Record<string, string[]> = {
  breakfast: [
    '„Добро утро. Хладилникът те чака."',
    '„Ако не закусиш сега, ще вземеш лоши решения по-късно."',
  ],
  lunch: [
    '„Стомахът ти изпрати напомняне. Ние го препредаваме."',
    '„Животът е кратък. Обядът — още по-кратък."',
    '„Обедното меню е единственото нещо в България, което все още е изгодно."',
  ],
  dinner: [
    '„Какво е за вечеря? Хладилникът не знае. Ние може би."',
    '„Ако не решиш сега, ще ядеш корнфлейкс пак."',
  ],
};

export function SettingsScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<NotifSettings>({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const toggle = async (slot: keyof NotifSettings) => {
    tapSelection();
    const next = { ...settings, [slot]: !settings[slot] };
    setSettings(next);
    await saveSettings(next);
    await scheduleAll(next);
  };

  return (
    <View style={[styles.root, { backgroundColor: '#FAF0E8' }]}>
      <LinearGradient
        colors={['#FAF0E8', '#F5DED2', '#EEC9B8']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => { tapLight(); onBack(); }}
            hitSlop={12}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text style={styles.backBtn}>‹</Text>
          </Pressable>
          <Text style={styles.title}>Настройки</Text>
        </View>

        {/* Section label */}
        <Text style={styles.sectionLabel}>НАПОМНИ МИ ДА ЯМ</Text>

        {SLOTS.map((slot) => (
          <View key={slot.id}>
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.slotEmoji}>{slot.emoji}</Text>
                <View style={styles.slotInfo}>
                  <Text style={styles.slotName}>{slot.label}</Text>
                  <Text style={styles.slotTime}>
                    Делник <Text style={styles.timeAccent}>{slot.weekday}</Text>
                    {slot.weekday !== slot.weekend && (
                      <> · Уикенд <Text style={styles.timeAccent}>{slot.weekend}</Text></>
                    )}
                  </Text>
                </View>
                <Switch
                  value={settings[slot.id]}
                  onValueChange={() => toggle(slot.id)}
                  trackColor={{ false: '#ddd', true: '#C8645A' }}
                  thumbColor={Platform.OS === 'android' ? '#fff' : undefined}
                />
              </View>
            </View>

            {/* Preview messages */}
            <View style={[styles.preview, !settings[slot.id] && styles.previewDim]}>
              <Text style={styles.previewLabel}>ПРИМЕРНИ СЪОБЩЕНИЯ</Text>
              {PREVIEWS[slot.id].map((msg, i) => (
                <Text key={i} style={styles.previewMsg}>{msg}</Text>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.footnote}>
          Нотификациите се изпращат локално — без сървъри, без проследяване.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },
  backBtn: {
    fontSize: 32,
    color: '#C8645A',
    lineHeight: 36,
    marginTop: -4,
  },
  title: {
    fontFamily: 'Geist_700Bold',
    fontSize: 22,
    color: '#3d2318',
    letterSpacing: -0.5,
  },
  sectionLabel: {
    fontFamily: 'GeistMono_400Regular',
    fontSize: 10,
    letterSpacing: 2.2,
    color: 'rgba(60,35,25,0.45)',
    marginBottom: 12,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(80,50,40,0.08)',
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  slotEmoji: { fontSize: 22, width: 30, textAlign: 'center' },
  slotInfo: { flex: 1 },
  slotName: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 15,
    color: '#3d2318',
    marginBottom: 2,
  },
  slotTime: {
    fontFamily: 'Geist_400Regular',
    fontSize: 12,
    color: 'rgba(60,35,25,0.5)',
  },
  timeAccent: {
    fontFamily: 'Geist_600SemiBold',
    color: '#C8645A',
  },
  preview: {
    backgroundColor: 'rgba(200,100,90,0.06)',
    borderRadius: 12,
    padding: 12,
    marginTop: 0,
    marginBottom: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  previewDim: { opacity: 0.4 },
  previewLabel: {
    fontFamily: 'GeistMono_400Regular',
    fontSize: 9,
    letterSpacing: 1.5,
    color: 'rgba(60,35,25,0.4)',
    marginBottom: 8,
  },
  previewMsg: {
    fontFamily: 'Geist_400Regular',
    fontSize: 12.5,
    color: '#4a2e26',
    lineHeight: 18,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  footnote: {
    fontFamily: 'Geist_400Regular',
    fontSize: 11.5,
    color: 'rgba(60,35,25,0.4)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 17,
  },
});
