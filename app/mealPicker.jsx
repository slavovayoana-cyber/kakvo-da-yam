// Meal selection logic + share text formatting + reroll messages

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Picks a meal + reason for the selected mood (or random across the 4 main moods).
// avoidId: skip this meal id (so we don't repeat the last one).
function pickMeal(meals, moodId, avoidId) {
  let pool;
  let resolvedMood = moodId;

  if (moodId) {
    pool = meals.filter((m) => m.moods.includes(moodId));
  } else {
    // No mood: random across the 4 main moods (BG = bonus, only if explicitly chosen)
    const mainMoods = ['healthy_ish', 'fancy', 'honest', 'comfort'];
    pool = meals.filter((m) => m.moods.some((x) => mainMoods.includes(x)));
  }

  // Avoid repeat if possible
  let candidates = pool;
  if (avoidId && pool.length > 1) {
    candidates = pool.filter((m) => m.id !== avoidId);
  }

  const meal = pickRandom(candidates);

  // Decide which mood the reason should come from
  let reasonMood = moodId;
  if (!reasonMood) {
    // pick one of the meal's moods at random (excluding bulgarian unless that's all it has)
    const nonBg = meal.moods.filter((x) => x !== 'bulgarian');
    reasonMood = nonBg.length ? pickRandom(nonBg) : meal.moods[0];
  }
  // If meal doesn't have reasons for the chosen mood, fall back
  if (!meal.reasons[reasonMood]) {
    reasonMood = meal.moods[0];
  }
  const reason = pickRandom(meal.reasons[reasonMood]);

  return { meal, reason, moodId: reasonMood };
}

// Reroll sass — index = number of rerolls already performed
const REROLL_MESSAGES = [
  null,
  'Сериозно? Добре, още един опит...',
  'Не съм твоя майка. Реши се.',
  'Това е третият път, в който отказваш.',
  'Добре. Този път е финален.',
  'Просто яж нещо. Каквото и да е. Моля те.',
];
function getRerollMessage(count) {
  if (count <= 0) return null;
  return REROLL_MESSAGES[Math.min(count, REROLL_MESSAGES.length - 1)];
}

// Share text format from brief 6.3
function formatShareText(meal, reason, moodEmoji) {
  const e = moodEmoji || '🍽️';
  return `${e} Какво да ям? казва:\n\n${meal.emoji} ${meal.name}\n„${reason}"\n\n— приложението "Какво да ям?"\n#каквоиДаЯм`;
}

const SUBTITLES = [
  'Защото пак не знаеш',
  'Не съм диетолог, аз съм приятел',
  'Реши вместо теб',
  'Хладилникът няма да се отвори сам',
  'Стига си гледала телефона гладна',
];

Object.assign(window, {
  pickMeal, pickRandom, getRerollMessage, formatShareText, SUBTITLES, REROLL_MESSAGES,
});
