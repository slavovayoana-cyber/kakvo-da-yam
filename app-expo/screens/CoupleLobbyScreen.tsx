import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ALL_THEME } from '../lib/moodSystem';
import { tapLight, tapMedium } from '../lib/haptics';
import {
  type CoupleSession,
  type SessionRole,
  createSession,
  findSessionByCode,
  getSession,
  joinSession,
  subscribeToSession,
} from '../lib/couples';

type Props = {
  allMealIds: string[];
  onBack: () => void;
  onStart: (session: CoupleSession, role: SessionRole) => void;
};

type Mode = 'pick' | 'creating' | 'joining';

export function CoupleLobbyScreen({ allMealIds, onBack, onStart }: Props) {
  const theme = ALL_THEME;
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>('pick');
  const [session, setSession] = useState<CoupleSession | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subRef = useRef<{ unsubscribe?: () => void } | null>(null);

  useEffect(() => {
    return () => {
      subRef.current?.unsubscribe?.();
    };
  }, []);

  const handleCreate = async () => {
    setBusy(true);
    setError(null);
    try {
      tapMedium();
      const { session: s, role } = await createSession(allMealIds);
      setSession(s);
      setMode('creating');

      let started = false;
      const startIfReady = (candidate: CoupleSession) => {
        if (started) return;
        if (candidate.partner_device_id && candidate.status === 'active') {
          started = true;
          channel.unsubscribe();
          clearInterval(poll);
          onStart(candidate, role);
        }
      };

      // Realtime subscription
      const channel = subscribeToSession(s.id, startIfReady);

      // Polling fallback every 1.5s for the few seconds it takes a partner to join
      const poll = setInterval(async () => {
        try {
          const fresh = await getSession(s.id);
          if (fresh) startIfReady(fresh);
        } catch {
          // ignore
        }
      }, 1500);

      subRef.current = {
        unsubscribe: () => {
          channel.unsubscribe();
          clearInterval(poll);
        },
      };
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Нещо се обърка');
    } finally {
      setBusy(false);
    }
  };

  const handleJoin = async () => {
    if (code.length !== 4) return;
    Keyboard.dismiss();
    setBusy(true);
    setError(null);
    try {
      tapMedium();
      const found = await findSessionByCode(code);
      if (!found) {
        setError('Няма сесия с този код. Изтекла или грешна?');
        setBusy(false);
        return;
      }
      if (found.partner_device_id) {
        setError('Тази сесия вече има партньор. Поискай нов код.');
        setBusy(false);
        return;
      }
      const { session: joined, role } = await joinSession(found.id);
      onStart(joined, role);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Нещо се обърка');
    } finally {
      setBusy(false);
    }
  };

  const handleCancelCreate = () => {
    subRef.current?.unsubscribe?.();
    setSession(null);
    setMode('pick');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.bg, paddingBottom: 24 + insets.bottom }]}>
      <LinearGradient
        colors={theme.gradient.colors as readonly [string, string, ...string[]]}
        locations={
          theme.gradient.locations as
            | readonly [number, number, ...number[]]
            | undefined
        }
        start={theme.gradient.start}
        end={theme.gradient.end}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.topBar}>
        <Pressable
          onPress={() => { tapLight(); onBack(); }}
          style={({ pressed }) => [
            styles.backBtn,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={[styles.backIcon, { color: theme.ink }]}>←</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.ink }]}>
          Заедно решаваме
        </Text>
        <View style={styles.backBtn} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={20}
      >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
      {mode === 'pick' && (
        <View style={styles.body}>
          <Text style={[styles.bigEmoji]}>👩‍❤️‍👨</Text>
          <Text style={[styles.title, { color: theme.ink }]}>
            Заедно решавате какво ядете
          </Text>

          <View
            style={[
              styles.rulesCard,
              { borderColor: theme.colorDeep + '33' },
            ]}
          >
            <View style={styles.ruleRow}>
              <Text style={styles.ruleEmoji}>💑</Text>
              <Text style={[styles.ruleText, { color: theme.ink }]}>
                Ако се скарате, не вините приложението
              </Text>
            </View>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleEmoji}>🚨</Text>
              <Text style={[styles.ruleText, { color: theme.ink }]}>
                „Каквото искаш ти" не е валиден отговор
              </Text>
            </View>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleEmoji}>💀</Text>
              <Text style={[styles.ruleText, { color: theme.ink }]}>
                Гладният партньор е опасен партньор
              </Text>
            </View>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleEmoji}>🚀</Text>
              <Text style={[styles.ruleText, { color: theme.ink }]}>
                Swipe-вайте независимо. Като съвпаднете — match
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleCreate}
            disabled={busy}
            style={({ pressed }) => [
              styles.primaryBtn,
              {
                backgroundColor: theme.accent,
                shadowColor: theme.accent,
                opacity: pressed || busy ? 0.85 : 1,
              },
            ]}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Създай нова сесия</Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => { tapLight(); setMode('joining'); }}
            disabled={busy}
            style={({ pressed }) => [
              styles.secondaryBtn,
              {
                borderColor: theme.colorDeep + '55',
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text style={[styles.secondaryBtnText, { color: theme.ink }]}>
              Имам код
            </Text>
          </Pressable>

          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : null}
        </View>
      )}

      {mode === 'joining' && (
        <View style={styles.body}>
          <Text style={[styles.bigEmoji]}>🔢</Text>
          <Text style={[styles.title, { color: theme.ink }]}>
            Въведи кода
          </Text>
          <Text style={[styles.subtitle, { color: theme.ink }]}>
            Партньорът ти трябва да го е създал на своя телефон.
          </Text>

          <TextInput
            value={code}
            onChangeText={(v) => setCode(v.replace(/[^0-9]/g, '').slice(0, 4))}
            keyboardType="number-pad"
            placeholder="1234"
            maxLength={4}
            autoFocus
            style={[styles.codeInput, { color: theme.ink }]}
            placeholderTextColor={theme.ink + '40'}
          />

          <Pressable
            onPress={handleJoin}
            disabled={busy || code.length !== 4}
            style={({ pressed }) => [
              styles.primaryBtn,
              {
                backgroundColor: theme.accent,
                shadowColor: theme.accent,
                opacity: pressed || busy || code.length !== 4 ? 0.55 : 1,
              },
            ]}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Свържи ни</Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => { tapLight(); setMode('pick'); setError(null); }}
            style={styles.linkBtn}
          >
            <Text style={[styles.linkText, { color: theme.ink }]}>
              ← Назад
            </Text>
          </Pressable>

          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : null}
        </View>
      )}

      {mode === 'creating' && session ? (
        <View style={styles.body}>
          <Text style={[styles.label, { color: theme.ink }]}>
            ВАШИЯТ КОД
          </Text>
          <Text style={[styles.codeBig, { color: theme.ink }]}>
            {session.code}
          </Text>
          <View style={styles.waitingRow}>
            <ActivityIndicator color={theme.colorDeep} />
            <Text style={[styles.waitingText, { color: theme.ink }]}>
              Чакаме партньора…
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: theme.ink }]}>
            Дай му/й кода. Когато го въведе, и двамата ще започнете да swipe-вате.
          </Text>

          <Pressable
            onPress={handleCancelCreate}
            style={styles.linkBtn}
          >
            <Text style={[styles.linkText, { color: theme.ink }]}>
              Откажи
            </Text>
          </Pressable>
        </View>
      ) : null}
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 56, paddingBottom: 24, overflow: 'hidden' },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 3,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 18 },
  headerTitle: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.01 * 17,
  },
  body: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 18,
    alignItems: 'center',
    gap: 12,
  },
  bigEmoji: { fontSize: 56, marginBottom: 2 },
  title: {
    fontFamily: 'Fraunces_500Medium',
    fontSize: 26,
    fontWeight: '500',
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    lineHeight: 14 * 1.5,
    textAlign: 'center',
    opacity: 0.65,
    marginBottom: 22,
    maxWidth: 320,
  },
  rulesCard: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1.2,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 22,
    gap: 10,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ruleEmoji: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  ruleText: {
    flex: 1,
    fontFamily: 'Geist_500Medium',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 13 * 1.4,
    opacity: 0.85,
    letterSpacing: -0.005 * 13,
  },
  primaryBtn: {
    alignSelf: 'stretch',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 5,
  },
  primaryBtnText: {
    fontFamily: 'Geist_600SemiBold',
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.015 * 17,
  },
  secondaryBtn: {
    alignSelf: 'stretch',
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1.5,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.015 * 16,
  },
  linkBtn: { alignSelf: 'center', padding: 8, marginTop: 4 },
  linkText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 13,
    opacity: 0.55,
    textDecorationLine: 'underline',
  },
  label: {
    fontFamily: 'GeistMono_400Regular',
    fontSize: 11,
    letterSpacing: 11 * 0.22,
    opacity: 0.55,
    marginBottom: 6,
  },
  codeBig: {
    fontFamily: 'Fraunces_500Medium',
    fontSize: 96,
    fontWeight: '500',
    lineHeight: 110,
    letterSpacing: 96 * 0.05,
    textAlign: 'center',
    marginBottom: 18,
  },
  waitingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  waitingText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.75,
  },
  codeInput: {
    fontFamily: 'Fraunces_500Medium',
    fontSize: 64,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 64 * 0.1,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: 240,
    marginBottom: 18,
  },
  error: {
    fontFamily: 'Geist_500Medium',
    fontSize: 13,
    fontWeight: '500',
    color: '#B23333',
    textAlign: 'center',
    marginTop: 4,
  },
});
