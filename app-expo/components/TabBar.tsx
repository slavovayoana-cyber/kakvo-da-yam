import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const C = {
  bar: '#FBEEE3', line: 'rgba(59,42,34,0.08)',
  ink: '#3B2A22', inkSoft: '#9a8578', accent: '#C2674A', accentDeep: '#A94E33',
};

export type MainTab = 'home' | 'feed' | 'couple' | 'journal';

type Props = {
  active: MainTab;
  onHome: () => void;
  onFeed: () => void;
  onCompose: () => void;
  onCouple: () => void;
  onJournal: () => void;
};

function Tab({ icon, label, on, onPress }: { icon: string; label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.tab} hitSlop={6}>
      <Text style={[styles.icon, { opacity: on ? 1 : 0.55 }]}>{icon}</Text>
      <Text style={[styles.label, on && styles.labelOn]}>{label}</Text>
    </Pressable>
  );
}

export function TabBar({ active, onHome, onFeed, onCompose, onCouple, onJournal }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <Tab icon="🎲" label="Избери" on={active === 'home'} onPress={onHome} />
      <Tab icon="🍴" label="Feed" on={active === 'feed'} onPress={onFeed} />
      <Pressable onPress={onCompose} style={styles.fab} hitSlop={6}>
        <Text style={styles.fabTxt}>＋</Text>
      </Pressable>
      <Tab icon="👩‍❤️‍👨" label="Двойки" on={active === 'couple'} onPress={onCouple} />
      <Tab icon="📖" label="Дневник" on={active === 'journal'} onPress={onJournal} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    paddingTop: 8, paddingHorizontal: 8,
    backgroundColor: C.bar, borderTopWidth: 1, borderTopColor: C.line,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 2 },
  icon: { fontSize: 20 },
  label: { fontSize: 10, fontWeight: '600', color: C.inkSoft },
  labelOn: { color: C.accent },
  fab: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: C.accent,
    alignItems: 'center', justifyContent: 'center', marginTop: -18,
    shadowColor: C.accentDeep, shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6,
    borderWidth: 3, borderColor: '#fff',
  },
  fabTxt: { color: '#fff', fontSize: 28, marginTop: -2 },
});
