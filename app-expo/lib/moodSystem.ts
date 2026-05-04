import type { MoodId } from './types';

export type MoodTheme = {
  id: MoodId | null;
  emoji: string;
  name: string;
  tagline: string;
  color: string;
  colorDeep: string;
  bg: string;
  gradient: { colors: [string, string, ...string[]]; locations?: number[]; start?: { x: number; y: number }; end?: { x: number; y: number } };
  chipBg: string;
  chipText: string;
  ink: string;
  accent: string;
  titleFontFamily: string;
  titleFontStyle?: 'normal' | 'italic';
  titleFontWeight: '400' | '500' | '600' | '700' | '800';
  titleLetterSpacing: number;
  titleTransform?: 'uppercase' | 'none';
  nameFontStyle?: 'normal' | 'italic';
  nameFontWeight: '400' | '500' | '600' | '700' | '800';
  nameLetterSpacing: number;
  nameTransform?: 'uppercase' | 'none';
  decoration: 'leaves' | 'sparkles' | 'underline' | 'soft-blob' | 'shevitsa' | 'dice' | 'none';
  voice?: string;
  isBonus?: boolean;
};

export const MOOD_THEMES: Record<MoodId, MoodTheme> = {
  healthy_ish: {
    id: 'healthy_ish',
    emoji: '🥗',
    name: 'Healthy-ish',
    tagline: 'Искам да се чувствам отговорна',
    color: '#9CAF88',
    colorDeep: '#6E8463',
    bg: '#EFF1E5',
    gradient: { colors: ['#DDE5C8', '#EFF1E5', '#E5EAD4'], locations: [0, 0.55, 1], start: { x: 0.2, y: 0 }, end: { x: 0.8, y: 1 } },
    chipBg: '#E2E9D0',
    chipText: '#3D4D33',
    ink: '#2F3A28',
    accent: '#6E8463',
    titleFontFamily: 'Fraunces_400Italic',
    titleFontStyle: 'italic',
    titleFontWeight: '400',
    titleLetterSpacing: -0.02 * 56,
    nameFontStyle: 'normal',
    nameFontWeight: '500',
    nameLetterSpacing: -0.03 * 32,
    decoration: 'leaves',
    voice: 'меко окуражителен',
  },
  fancy: {
    id: 'fancy',
    emoji: '💅',
    name: 'Fancy',
    tagline: 'Днес заслужавам нещо по-така',
    color: '#D4A5A5',
    colorDeep: '#A06A6A',
    bg: '#F5E8E5',
    gradient: { colors: ['#ECD3D0', '#F5E8E5', '#EBD5D0'], locations: [0, 0.6, 1], start: { x: 0.8, y: 0.1 }, end: { x: 0.2, y: 0.9 } },
    chipBg: '#EED6D2',
    chipText: '#5C3636',
    ink: '#3D2828',
    accent: '#A06A6A',
    titleFontFamily: 'InstrumentSerif_400Regular',
    titleFontWeight: '400',
    titleLetterSpacing: -0.01 * 56,
    nameFontStyle: 'italic',
    nameFontWeight: '400',
    nameLetterSpacing: -0.02 * 32,
    decoration: 'sparkles',
    voice: 'лек снобизъм',
  },
  honest: {
    id: 'honest',
    emoji: '😂',
    name: 'Honest',
    tagline: 'Кажи ми истината какво ми се яде',
    color: '#B8893D',
    colorDeep: '#8A6529',
    bg: '#F4E8D0',
    gradient: { colors: ['#F4E8D0', '#EBDAB6'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    chipBg: '#EBD8A8',
    chipText: '#4A3614',
    ink: '#2C1F0A',
    accent: '#8A6529',
    titleFontFamily: 'Geist_800ExtraBold',
    titleFontWeight: '800',
    titleLetterSpacing: -0.045 * 56,
    titleTransform: 'uppercase',
    nameFontWeight: '800',
    nameLetterSpacing: -0.04 * 32,
    nameTransform: 'uppercase',
    decoration: 'none',
    voice: 'без филтър',
  },
  comfort: {
    id: 'comfort',
    emoji: '🧸',
    name: 'Comfort',
    tagline: 'Искам нещо уютно и вкусно',
    color: '#B89B7A',
    colorDeep: '#85674A',
    bg: '#F1E6D5',
    gradient: { colors: ['#F5E8D0', '#EFE0CA', '#E6D5BB'], locations: [0, 0.6, 1], start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 1 } },
    chipBg: '#E8D6BC',
    chipText: '#4F3B25',
    ink: '#3A2C1B',
    accent: '#85674A',
    titleFontFamily: 'Fraunces_500Medium',
    titleFontWeight: '500',
    titleLetterSpacing: -0.025 * 56,
    nameFontWeight: '500',
    nameLetterSpacing: -0.025 * 32,
    decoration: 'soft-blob',
    voice: 'топъл и грижовен',
  },
  bulgarian: {
    id: 'bulgarian',
    emoji: '🇧🇬',
    name: 'Bulgarian',
    tagline: 'Дай ми нещо родно',
    color: '#A8453F',
    colorDeep: '#7A2E29',
    bg: '#F2DDD0',
    gradient: { colors: ['#F2DDD0', '#ECC9B6'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    chipBg: '#E8C6B5',
    chipText: '#5A2420',
    ink: '#3A1714',
    accent: '#7A2E29',
    titleFontFamily: 'Geist_700Bold',
    titleFontWeight: '700',
    titleLetterSpacing: -0.04 * 56,
    nameFontWeight: '700',
    nameLetterSpacing: -0.035 * 32,
    decoration: 'shevitsa',
    voice: 'нашенски',
    isBonus: true,
  },
};

export const NEUTRAL_THEME: MoodTheme = {
  id: null,
  emoji: '🍽️',
  name: 'Random',
  tagline: '',
  color: '#C8645A',
  colorDeep: '#9A4239',
  bg: '#FBF7F2',
  gradient: { colors: ['#FFFBF5', '#FBF7F2', '#F4EDE2'], locations: [0, 0.6, 1], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  chipBg: '#F1EAE0',
  chipText: '#3A3A3A',
  ink: '#2A2A2A',
  accent: '#C8645A',
  titleFontFamily: 'Geist_700Bold',
  titleFontWeight: '700',
  titleLetterSpacing: -0.045 * 56,
  nameFontWeight: '700',
  nameLetterSpacing: -0.035 * 32,
  decoration: 'none',
};

export const ALL_THEME: MoodTheme = {
  id: null,
  emoji: '🎲',
  name: 'Всички',
  tagline: 'Изненадай ме',
  color: '#D87A52',
  colorDeep: '#A85530',
  bg: '#FCEBDD',
  gradient: {
    colors: ['#FCEBDD', '#F8D7BE', '#F5C2A3'],
    locations: [0, 0.55, 1],
    start: { x: 0.2, y: 0 },
    end: { x: 0.8, y: 1 },
  },
  chipBg: '#F5D7C0',
  chipText: '#5C2E1A',
  ink: '#42201A',
  accent: '#C57247',
  titleFontFamily: 'Geist_700Bold',
  titleFontWeight: '700',
  titleLetterSpacing: -0.04 * 56,
  nameFontWeight: '700',
  nameLetterSpacing: -0.035 * 32,
  decoration: 'dice',
};

export function getTheme(moodId: MoodId | 'all' | null): MoodTheme {
  if (moodId === 'all') return ALL_THEME;
  if (!moodId) return NEUTRAL_THEME;
  return MOOD_THEMES[moodId] || NEUTRAL_THEME;
}
