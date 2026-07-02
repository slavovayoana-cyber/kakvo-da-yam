import type { Meal, MealTime, MoodId, PickResult, Selection } from './types';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const MAIN_MOODS: MoodId[] = ['healthy_ish', 'fancy', 'honest', 'comfort'];

/**
 * Per-pool shuffled deck. Each pool key (e.g. "all", "healthy_ish", "default")
 * keeps a queue of meal ids waiting to be drawn. When the queue empties we
 * reshuffle the full pool. This guarantees the user cycles through every
 * meal in a pool before any one repeats.
 */
const decks = new Map<string, string[]>();

function poolKey(selection: Selection, time: MealTime | null): string {
  const timeKey = time ? `:${time}` : '';
  if (selection === 'all') return `all${timeKey}`;
  if (selection) return `mood:${selection}${timeKey}`;
  return `default${timeKey}`;
}

function drawFromDeck(
  selection: Selection,
  time: MealTime | null,
  pool: Meal[],
  avoidIds: string[] = [],
): Meal {
  const key = poolKey(selection, time);
  let deck = decks.get(key) ?? [];
  // Drop ids no longer in the pool (e.g. if pool changes between renders)
  const poolIds = new Set(pool.map((m) => m.id));
  deck = deck.filter((id) => poolIds.has(id));
  // Reshuffle if empty
  if (deck.length === 0) {
    deck = shuffle(pool.map((m) => m.id));
    // Keep recently-shown meals from reappearing right after a reshuffle:
    // rotate the deck so the front card isn't one of the last few we showed.
    const avoid = new Set(avoidIds);
    let guard = 0;
    while (deck.length > 1 && avoid.has(deck[0]) && guard < deck.length) {
      deck.push(deck.shift()!);
      guard++;
    }
  }
  // Take from the front
  const drawnId = deck.shift()!;
  decks.set(key, deck);
  return pool.find((m) => m.id === drawnId) ?? pool[0];
}

export function pickMeal(
  meals: Meal[],
  selection: Selection,
  recentIds: string[],
  time: MealTime | null = null,
): PickResult {
  let pool: Meal[];
  if (selection === 'all') {
    pool = meals;
  } else if (selection) {
    pool = meals.filter((m) => m.moods.includes(selection));
  } else {
    pool = meals.filter((m) => m.moods.some((x) => MAIN_MOODS.includes(x)));
  }

  if (time) {
    const timeFiltered = pool.filter((m) => m.times?.includes(time));
    if (timeFiltered.length > 0) pool = timeFiltered;
  }

  // Avoid the last few shown meals reappearing right after a reshuffle. Cap at
  // pool size - 1 so a small pool can still always draw something.
  const avoidCount = Math.min(5, Math.max(0, pool.length - 1));
  const avoidIds = recentIds.slice(-avoidCount);
  const meal = drawFromDeck(selection, time, pool, avoidIds);

  let reasonMood: MoodId;
  if (selection === 'all') {
    reasonMood = pickRandom(meal.moods);
  } else if (selection) {
    reasonMood = selection;
  } else {
    const nonBg = meal.moods.filter((x) => x !== 'bulgarian');
    reasonMood = nonBg.length ? pickRandom(nonBg) : meal.moods[0];
  }
  if (!meal.reasons[reasonMood]) {
    reasonMood = meal.moods[0];
  }
  const reason = pickRandom(meal.reasons[reasonMood]!);

  return { meal, reason, moodId: reasonMood };
}

/** Build a result for one specific meal (used by the seasonal home section). */
export function pickMealById(meals: Meal[], id: string): PickResult | null {
  const meal = meals.find((m) => m.id === id);
  if (!meal) return null;
  const usable = meal.moods.filter((mid) => meal.reasons[mid]?.length);
  const reasonMood = pickRandom(usable.length ? usable : meal.moods);
  const reasons = meal.reasons[reasonMood] ?? [];
  const reason = reasons.length ? pickRandom(reasons) : '';
  return { meal, reason, moodId: reasonMood };
}

export const REROLL_MESSAGES: (string | null)[] = [
  null,
  'Сериозно? Добре, още един опит...',
  'Не съм твоя майка. Реши се.',
  'Това е третият път, в който отказваш.',
  'Добре. Този път е финален.',
  'Просто яж нещо. Каквото и да е. Моля те.',
];

export function getRerollMessage(count: number): string | null {
  if (count <= 0) return null;
  return REROLL_MESSAGES[Math.min(count, REROLL_MESSAGES.length - 1)];
}

export const APP_URL = 'https://noomup.com/kakvo-da-yam/';

export function formatShareText(
  meal: Meal,
  reason: string,
  moodEmoji: string,
): string {
  const e = moodEmoji || '🍽️';
  return `${e} Какво да ям? казва:\n\n${meal.emoji} ${meal.name}\n„${reason}"\n\n— приложението „Какво да ям?"\n📲 ${APP_URL}\n#каквоиДаЯм`;
}

export const SUBTITLES = [
  'Защото пак не знаеш',
  'Не съм диетолог, аз съм приятел',
  'Решавам вместо теб',
  'Хладилникът няма да се отвори сам',
  'Спри да гледаш телефона на празен стомах',
  'Ако се чудиш, значи трябва да хапнеш',
  'Колебанието е калории',
  'По-добре нещо, отколкото нищо',
];
