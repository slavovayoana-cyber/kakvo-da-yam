import type { MoodId } from './types';
import type { JournalEntry } from './journal';

export type Personality = {
  id: string;
  emoji: string;
  title: string;
  tagline: string;
  description: string;
  cardBg: [string, string];
  ink: string;
  accent: string;
};

const PERSONALITIES: Record<string, Personality> = {
  comfort: {
    id: 'comfort',
    emoji: '🥔',
    title: 'Comfort шампион',
    tagline: 'хладилникът ти е терапевт',
    description:
      'Когато ти е тежко, отиваш в кухнята. Без поза, без планове, само мусака и одеяло. Никой не те съди — нито аз.',
    cardBg: ['#F4D7C4', '#E8B89E'],
    ink: '#5A3422',
    accent: '#B86847',
  },
  healthy_ish: {
    id: 'healthy_ish',
    emoji: '🥗',
    title: 'Healthy-ish икона',
    tagline: 'салата след баница, баланс е',
    description:
      'Поръчваш кейл смути, ама с двойна филаделфия. Авокадото ти е приоритет, но не и в неделя. Това се нарича баланс.',
    cardBg: ['#DDE5C8', '#C5D4A8'],
    ink: '#2F3A28',
    accent: '#6E8463',
  },
  fancy: {
    id: 'fancy',
    emoji: '💅',
    title: 'Fancy Fancy',
    tagline: 'нямаш план, но имаш естетика',
    description:
      'Слагаш парсли на всичко. Снимаш чинията преди да хапнеш. Дори и тостерът ти има vibe. Бабите не разбират, но ние те виждаме.',
    cardBg: ['#F0CDD2', '#D9A4AC'],
    ink: '#3F1F26',
    accent: '#A06A6A',
  },
  honest: {
    id: 'honest',
    emoji: '🍳',
    title: 'Honest до мозък на костите',
    tagline: 'два пъти яйца на ден, край',
    description:
      'Не се преструваш. Знаеш какво харесваш и не се извиняваш за това. Кулинарната ти философия е „да ям нещо, преди да припадна".',
    cardBg: ['#EAE6E0', '#CFC8BF'],
    ink: '#2F2A26',
    accent: '#7A6E62',
  },
  bulgarian: {
    id: 'bulgarian',
    emoji: '🇧🇬',
    title: 'Българско сърце',
    tagline: 'баба ти би се гордяла',
    description:
      'Сарми, мусака, баница. Това са трите стълба на твоя свят. Ферментираш зеле, познаваш разликата между сирена и кашкавали. Пенсионерската тайна общност те иска за член.',
    cardBg: ['#F5DCC4', '#E5BD9E'],
    ink: '#4A2B1A',
    accent: '#A6582E',
  },
  indecisive: {
    id: 'indecisive',
    emoji: '🎲',
    title: 'Indecisive икона',
    tagline: 'всичко звучи добре, нищо не звучи добре',
    description:
      'Менюто ти е като плейлист от различни жанрове. Един ден шопска, следващия суши, после кускус. Категория не те описва — ти си всичко наведнъж.',
    cardBg: ['#E8DBF0', '#C9B4D6'],
    ink: '#2E1F3A',
    accent: '#7B5C9C',
  },
  loyal: {
    id: 'loyal',
    emoji: '🔁',
    title: 'Постоянен фен',
    tagline: 'едно ястие, една любов',
    description:
      'Намери ястието и не търсиш по-далеч. Защо да рискуваш? Ефикасност, постоянство, спокойствие. Малко скучно, но работи.',
    cardBg: ['#E0D5C0', '#C4B294'],
    ink: '#3A2E1F',
    accent: '#8A6F4A',
  },
  beginner: {
    id: 'beginner',
    emoji: '🌱',
    title: 'Тепърва започваш',
    tagline: 'още няколко ястия и ще те разбера',
    description:
      'Готви още малко и ще видим коя си кулинарно. Засега — мистерия. Което е и intriguing, не казвам че е лошо.',
    cardBg: ['#E8E3DA', '#CDC6BA'],
    ink: '#2F2A26',
    accent: '#7A6E62',
  },
};

const MIN_ENTRIES_FOR_PERSONALITY = 3;
const MOOD_DOMINANCE_THRESHOLD = 0.45;
const MEAL_LOYALTY_THRESHOLD = 0.4;

export type PersonalityResult = {
  personality: Personality;
  totalCooked: number;
  topMoodId: MoodId | null;
  topMoodCount: number;
  topMealName: string | null;
  topMealCount: number;
  uniqueMeals: number;
  isReady: boolean;
};

export function computePersonality(entries: JournalEntry[]): PersonalityResult {
  const totalCooked = entries.length;

  if (totalCooked < MIN_ENTRIES_FOR_PERSONALITY) {
    return {
      personality: PERSONALITIES.beginner,
      totalCooked,
      topMoodId: null,
      topMoodCount: 0,
      topMealName: null,
      topMealCount: 0,
      uniqueMeals: new Set(entries.map((e) => e.mealId)).size,
      isReady: false,
    };
  }

  const moodCounts = new Map<MoodId, number>();
  const mealCounts = new Map<string, { count: number; name: string }>();

  for (const e of entries) {
    moodCounts.set(e.moodId, (moodCounts.get(e.moodId) ?? 0) + 1);
    const cur = mealCounts.get(e.mealId);
    mealCounts.set(e.mealId, {
      count: (cur?.count ?? 0) + 1,
      name: e.mealName,
    });
  }

  let topMoodId: MoodId | null = null;
  let topMoodCount = 0;
  for (const [mood, count] of moodCounts) {
    if (count > topMoodCount) {
      topMoodCount = count;
      topMoodId = mood;
    }
  }

  let topMealName: string | null = null;
  let topMealCount = 0;
  for (const meal of mealCounts.values()) {
    if (meal.count > topMealCount) {
      topMealCount = meal.count;
      topMealName = meal.name;
    }
  }

  const moodShare = topMoodCount / totalCooked;
  const mealShare = topMealCount / totalCooked;
  const uniqueMeals = mealCounts.size;

  let chosen: Personality;
  if (mealShare >= MEAL_LOYALTY_THRESHOLD && totalCooked >= 5) {
    chosen = PERSONALITIES.loyal;
  } else if (moodShare >= MOOD_DOMINANCE_THRESHOLD && topMoodId) {
    chosen = PERSONALITIES[topMoodId] ?? PERSONALITIES.indecisive;
  } else {
    chosen = PERSONALITIES.indecisive;
  }

  return {
    personality: chosen,
    totalCooked,
    topMoodId,
    topMoodCount,
    topMealName,
    topMealCount,
    uniqueMeals,
    isReady: true,
  };
}
