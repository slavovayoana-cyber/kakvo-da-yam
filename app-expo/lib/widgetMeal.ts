import mealsJson from '../data/meals.json';

type RawMeal = {
  id: string;
  emoji: string;
  name: string;
  moods: string[];
  reasons: Record<string, string[]>;
  times?: string[];
};

const MEALS = (mealsJson as unknown as { meals: RawMeal[] }).meals;

// Mood → badge label + glow colour (mirrors the iOS widget so both platforms match).
const MOOD_INFO: Record<string, { badge: string; glow: [number, number, number] }> = {
  healthy_ish: { badge: '🥗 Healthy', glow: [0.30, 0.72, 0.32] },
  fancy: { badge: '💅 Fancy', glow: [0.85, 0.45, 0.55] },
  honest: { badge: '😂 Honest', glow: [0.85, 0.55, 0.15] },
  comfort: { badge: '🧸 Comfort', glow: [0.80, 0.55, 0.30] },
  bulgarian: { badge: '🇧🇬 BG', glow: [0.80, 0.25, 0.20] },
};

/** Which meal-time categories make sense for a given hour (matches the iOS widget). */
function timesFor(hour: number): string[] {
  if (hour >= 5 && hour < 11) return ['breakfast'];
  if (hour >= 11 && hour < 15) return ['lunch_dinner'];
  if (hour >= 15 && hour < 18) return ['snack', 'dessert'];
  if (hour >= 18 && hour < 23) return ['lunch_dinner', 'dessert', 'drink'];
  return ['snack', 'dessert'];
}

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rgba([r, g, b]: [number, number, number], a: number): `rgba(${number}, ${number}, ${number}, ${number})` {
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
}

export type WidgetPick = {
  emoji: string;
  name: string;
  reason: string;
  badge: string;
  glowSoft: `rgba(${number}, ${number}, ${number}, ${number})`;
};

/** Pick a random meal appropriate for the current hour, with a mood + reason. */
export function pickWidgetMeal(date: Date = new Date()): WidgetPick {
  const hour = date.getHours();
  const allowed = new Set(timesFor(hour));

  const hasUsableMood = (m: RawMeal) =>
    m.moods.some((id) => MOOD_INFO[id] && (m.reasons[id]?.length ?? 0) > 0);

  const pool = MEALS.filter(
    (m) => (m.times ?? []).some((t) => allowed.has(t)) && hasUsableMood(m),
  );
  const candidates = pool.length ? pool : MEALS.filter(hasUsableMood);
  const meal = rand(candidates.length ? candidates : MEALS);

  const moods = meal.moods.filter((id) => MOOD_INFO[id] && (meal.reasons[id]?.length ?? 0) > 0);
  const moodId = moods.length ? rand(moods) : meal.moods[0];
  const info = MOOD_INFO[moodId] ?? MOOD_INFO.comfort;
  const reasons = meal.reasons[moodId] ?? [];

  return {
    emoji: meal.emoji,
    name: meal.name,
    reason: reasons.length ? rand(reasons) : '',
    badge: info.badge,
    glowSoft: rgba(info.glow, 0.18),
  };
}
