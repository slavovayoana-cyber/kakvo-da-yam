import type { Meal, MoodId, PickResult } from './types';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const MAIN_MOODS: MoodId[] = ['healthy_ish', 'fancy', 'honest', 'comfort'];

export function pickMeal(
  meals: Meal[],
  moodId: MoodId | null,
  avoidId: string | null,
): PickResult {
  let pool: Meal[];
  if (moodId) {
    pool = meals.filter((m) => m.moods.includes(moodId));
  } else {
    pool = meals.filter((m) => m.moods.some((x) => MAIN_MOODS.includes(x)));
  }

  let candidates = pool;
  if (avoidId && pool.length > 1) {
    candidates = pool.filter((m) => m.id !== avoidId);
  }

  const meal = pickRandom(candidates);

  let reasonMood: MoodId = moodId ?? meal.moods[0];
  if (!moodId) {
    const nonBg = meal.moods.filter((x) => x !== 'bulgarian');
    reasonMood = nonBg.length ? pickRandom(nonBg) : meal.moods[0];
  }
  if (!meal.reasons[reasonMood]) {
    reasonMood = meal.moods[0];
  }
  const reason = pickRandom(meal.reasons[reasonMood]!);

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

export function formatShareText(
  meal: Meal,
  reason: string,
  moodEmoji: string,
): string {
  const e = moodEmoji || '🍽️';
  return `${e} Какво да ям? казва:\n\n${meal.emoji} ${meal.name}\n„${reason}"\n\n— приложението "Какво да ям?"\n#каквоиДаЯм`;
}

export const SUBTITLES = [
  'Защото пак не знаеш',
  'Не съм диетолог, аз съм приятел',
  'Реши вместо теб',
  'Хладилникът няма да се отвори сам',
  'Стига си гледала телефона гладна',
];
