// Curated seasonal picks shown in the "🌊 Летни предложения" home section.
// Light, cold or refreshing meals — easy to edit and ship over-the-air.
export const SUMMER_MEAL_IDS: string[] = [
  'watermelon',
  'watermelon_cheese',
  'tarator',
  'shopska',
  'tomatoes_oil',
  'tzatziki',
  'mishmash',
  'menemen',
  'fried_zucchini',
  'grilled_corn',
  'tsatsa',
  'shrimp_pan',
  'poke_bowl',
  'gyros',
  'ice_cream_dinner',
  'melba',
  'ice_cream_cone',
  'lemonade',
  'smoothie',
  'fresh_juice',
  'fredo_cappuccino',
  'frappe',
  'mojito',
  'aperol_spritz',
  'calamari',
  'grilled_fish',
  'greek_salad',
  'peaches',
  'gazpacho',
  'melon_prosciutto',
  'kyopoolu',
  'caprese',
  'fruit_salad',
  'ceviche',
  'smoothie_bowl',
  'sangria',
];

/** True during the summer months (Jun–Sep) — the section auto-shows/hides. */
export function isSummerNow(date: Date = new Date()): boolean {
  const month = date.getMonth(); // 0 = Jan
  return month >= 5 && month <= 8; // June (5) … September (8)
}
