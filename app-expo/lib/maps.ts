import { Linking, Platform } from 'react-native';
import { getLocales } from 'expo-localization';

/**
 * True when the device region is Bulgaria. Used to decide the language of the
 * fallback Maps query: Bulgarian dish names only return good results inside
 * Bulgaria, so abroad we fall back to a universal English search instead.
 */
function isInBulgaria(): boolean {
  try {
    return getLocales().some((l) => l.regionCode === 'BG');
  } catch {
    return false;
  }
}

export type NearbyType =
  | 'restaurant'
  | 'fancy_restaurant'
  | 'grocery'
  | 'health_store'
  | 'bar'
  | 'cafe'
  | 'bakery'
  | 'cinema'
  | 'none';

const NEARBY_OVERRIDES: Record<string, NearbyType> = {
  // Abstract / undecided — send them to a store so there's always a nearby
  // option (every meal keeps a top button row; no result shows only two buttons)
  nothing: 'grocery',
  everything: 'grocery',
  fridge_thing: 'grocery',
  whatever_at_home: 'grocery',
  just_a_little_sweet: 'grocery',
  moms_food: 'grocery',

  // Fancy / fine dining
  expensive_thing: 'fancy_restaurant',
  unaffordable_restaurant: 'fancy_restaurant',
  lobster: 'fancy_restaurant',
  truffle_fries: 'fancy_restaurant',
  ribeye_steak: 'fancy_restaurant',
  sommelier_wine: 'fancy_restaurant',
  wagyu: 'fancy_restaurant',
  truffle_pasta: 'fancy_restaurant',

  // Bars / cocktails
  just_one_drink: 'bar',
  ouzo: 'bar',
  rakia: 'bar',
  wine: 'bar',
  prosecco: 'bar',
  mojito: 'bar',
  gin_tonic: 'bar',
  tequila: 'bar',

  // Пекарна
  kifla: 'bakery',
  kozunak: 'bakery',
  pogacha: 'bakery',
  zelnik: 'bakery',
  tikvenik: 'bakery',
  banitsa_ayran: 'bakery',
  pain_au_chocolat: 'bakery',
  muffin: 'bakery',

  // Закуски → кафе
  granola_yogurt: 'cafe',
  overnight_oats: 'cafe',
  omelette: 'cafe',
  bacon_eggs: 'cafe',

  // Кафенета
  espresso: 'cafe',
  cappuccino: 'cafe',
  frappe: 'cafe',
  fredo_cappuccino: 'cafe',
  tea: 'cafe',
  lemonade: 'cafe',
  bubble_tea: 'cafe',
  boza: 'cafe',

  // Кино
  cinema_popcorn: 'cinema',

  // Био / здравословни магазини
  alkaline_water: 'health_store',
  kale_chips: 'health_store',
  protein_cookies: 'health_store',
  oat_milk: 'health_store',
  coconut_water: 'health_store',
  collagen_powder: 'health_store',
  bone_broth: 'health_store',
  ghee: 'health_store',
  tahan: 'health_store',
  edamame: 'health_store',
  free_range_eggs: 'health_store',
  dark_chocolate_85: 'health_store',
  sourdough: 'health_store',
  cottage_cheese: 'health_store',
  dubai_chocolate: 'health_store',
  muesli: 'health_store',

  // Обикновен супермаркет
  chocolate: 'grocery',
  blueberries: 'grocery',
  garlic: 'grocery',
  banana: 'grocery',
  pickle_jar: 'grocery',
  turshiya: 'grocery',
  eggs: 'grocery',
  cheese_tomato: 'grocery',
  cornflakes: 'grocery',
  lokum: 'grocery',
  ice_cream_dinner: 'grocery',

  // Summer picks
  watermelon: 'grocery',
  watermelon_cheese: 'grocery',
  grilled_corn: 'grocery',
  tomatoes_oil: 'grocery',
  melba: 'cafe',
  aperol_spritz: 'bar',
  peaches: 'grocery',
  fresh_juice: 'cafe',
  ice_cream_cone: 'cafe',
};

export function getNearbyType(mealId: string): NearbyType {
  return NEARBY_OVERRIDES[mealId] ?? 'restaurant';
}

/**
 * Per-meal custom search query for the restaurant tier — used when the
 * meal's name would confuse Google Maps (e.g. "Бъфало крилца" matching
 * places literally named "Бъфало"). No "near me" suffix — Maps already
 * uses the user's location automatically and that phrase has been
 * causing Google Maps to error out intermittently.
 */
const SEARCH_OVERRIDES: Record<string, string> = {
  // English category queries
  buffalo_wings: 'wings restaurant',
  hawaii_pizza: 'pizza',
  caesar_salad: 'caesar salad',
  poke_bowl: 'poke bowl',
  thai_curry: 'thai food',
  chinese_takeout: 'chinese food',
  ramen: 'ramen',
  dumplings: 'asian food',
  bruschetta: 'italian restaurant',
  pasta: 'italian restaurant',
  spaghetti_bolognese: 'italian restaurant',
  risotto: 'italian restaurant',
  macaron: 'patisserie',
  croissant: 'bakery',
  baklava: 'baklava',
  gyros: 'gyros',
  pleskavica: 'balkan food',
  sushi: 'sushi',
  supermarket_sushi: 'supermarket',
  tacos: 'mexican food',
  burrito: 'mexican food',
  eggs_benedict: 'brunch',
  brunch: 'brunch',
  boozy_brunch: 'brunch',
  avocado_toast: 'brunch',
  avocado_bagel: 'brunch',
  matcha_latte: 'cafe',
  smoothie: 'smoothie bar',
  green_juice: 'juice bar',
  coffee_mimosa: 'brunch',
  pizza: 'pizza',
  neighborhood_pizza: 'pizza',
  frozen_pizza: 'supermarket',
  burger: 'burger',

  // Search overrides for breakfasts
  kifla: 'bakery',
  kozunak: 'bakery',
  pogacha: 'bakery',
  zelnik: 'bakery',
  tikvenik: 'bakery',
  banitsa_ayran: 'bakery',
  pain_au_chocolat: 'patisserie',
  bacon_eggs: 'breakfast restaurant',
  omelette: 'cafe',
  granola_yogurt: 'cafe',
  muffin: 'cafe',
  overnight_oats: 'cafe',

  // Drinks
  espresso: 'cafe',
  cappuccino: 'cafe',
  frappe: 'cafe',
  fredo_cappuccino: 'greek cafe',
  melba: 'gelato',
  aperol_spritz: 'cocktail bar',
  ice_cream_cone: 'gelato',
  fresh_juice: 'juice bar',
  calamari: 'seafood restaurant',
  grilled_fish: 'seafood restaurant',
  greek_salad: 'greek restaurant',
  gazpacho: 'spanish restaurant',
  tea: 'tea house',
  lemonade: 'cafe',
  bubble_tea: 'bubble tea',
  boza: 'cafe',
  wine: 'wine bar',
  prosecco: 'wine bar',
  mojito: 'cocktail bar',
  gin_tonic: 'cocktail bar',
  tequila: 'bar',

  // New international meals
  sashimi: 'japanese restaurant',
  peking_duck: 'chinese restaurant',
  lahmacun: 'turkish restaurant',
  bibimbap: 'korean restaurant',
  bbq_wings: 'bbq restaurant',
  pumpkin_soup: 'vegetarian restaurant',
  sweet_sour_chicken: 'chinese restaurant',
  butter_chicken: 'indian restaurant',
  fried_zucchini: 'mediterranean restaurant',
  hummus_veggies: 'vegetarian restaurant',
  tiramisu: 'italian restaurant',
  quinoa_salad: 'vegetarian restaurant',

  // Bulgarian category queries (English for international Maps compatibility)
  dyuner: 'kebab',
  banitsa: 'bakery',
  shopska: 'bulgarian food',
  musaka: 'bulgarian food',
  shkembe_chorba: 'bulgarian food',
  bob_chorba: 'bulgarian food',
  chicken_noodle_soup: 'bulgarian food',
  stuffed_peppers: 'bulgarian food',
  kebapcheta_fries: 'grill restaurant',
  kebap_kyufte: 'grill restaurant',
  skara: 'grill restaurant',
  cheverme: 'grill restaurant',
  sach: 'bulgarian food',
  gyuvech: 'bulgarian food',
  tarator: 'bulgarian food',
  popara: 'bulgarian food',
  mekici: 'breakfast cafe',
  french_toast_bg: 'breakfast cafe',

  // Meals with a clear international equivalent — so they stay specific abroad
  salmon: 'seafood restaurant',
  shrimp_pan: 'seafood restaurant',
  chicken_curry: 'indian restaurant',
  lamb_leg: 'grill restaurant',
  tzatziki: 'greek restaurant',
  menemen: 'turkish restaurant',
  waffle: 'waffle',
  banana_cake: 'bakery',
  tsatsa: 'seafood restaurant',
  tulumbas: 'dessert',
  creme_caramel: 'dessert',
  gevrek: 'bakery',
  oatmeal: 'breakfast cafe',
  palachinki: 'creperie',
  gas_station_hot_dog: 'hot dog',
  soup: 'soup',
  salad: 'salad',
  roasted_veg: 'vegetarian restaurant',
  sandwich: 'sandwich',
  warm_sandwich: 'sandwich',
  lutenitsa_sandwich: 'sandwich',
  chushki_byurek: 'balkan food',
};

// Meal types you can actually cook / make at home — these get a "Как се прави"
// recipe button (cocktails included, per request). Buy-only items are excluded.
const RECIPE_TYPES: NearbyType[] = ['restaurant', 'fancy_restaurant', 'bakery', 'bar'];
const NO_RECIPE = new Set<string>([
  // Buy-only / no real recipe
  'supermarket_sushi', 'frozen_pizza', 'gas_station_hot_dog', 'hotel_buffet',
  // Joke / abstract "meals" — there's nothing to cook
  'healthy_ish', 'fancy', 'honest', 'comfort', 'bulgarian',
  'expensive_thing', 'unaffordable_restaurant', 'something_light',
  // Drinks you buy, not make (cocktails like mojito/gin-tonic keep a recipe)
  'wine', 'rakia', 'prosecco', 'ouzo', 'just_one_drink', 'sommelier_wine', 'rakia_salad',
]);

export function hasRecipe(mealId: string): boolean {
  if (NO_RECIPE.has(mealId)) return false;
  return RECIPE_TYPES.includes(getNearbyType(mealId));
}

/** Cocktails / bar drinks show "Приготвих го" instead of "Готвих го". */
export function isBarDrink(mealId: string): boolean {
  return getNearbyType(mealId) === 'bar';
}

/** Opens a YouTube search for the dish's recipe, in Bulgarian. */
export async function openMealRecipe(mealName: string): Promise<void> {
  const query = encodeURIComponent(`рецепта ${mealName}`);
  await Linking.openURL(`https://www.youtube.com/results?search_query=${query}`);
}

export function getNearbyButtonLabel(type: NearbyType): string {
  if (type === 'grocery') return '🛒 Магазин наблизо';
  if (type === 'health_store') return '🌱 Био магазин';
  if (type === 'bar') return '🍸 Бар наблизо';
  if (type === 'cafe') return '☕ Кафе наблизо';
  if (type === 'bakery') return '🥐 Пекарна наблизо';
  if (type === 'fancy_restaurant') return '💎 Fine dining';
  if (type === 'cinema') return '🎬 Кино наблизо';
  return '🗺 Къде наблизо';
}

export async function openMealNearby(
  mealName: string,
  mealId: string,
): Promise<void> {
  const type = getNearbyType(mealId);
  if (type === 'none') return;

  let queryStr: string;
  if (type === 'grocery') queryStr = 'supermarket';
  else if (type === 'health_store') queryStr = 'organic health store';
  else if (type === 'bar') queryStr = SEARCH_OVERRIDES[mealId] ?? 'cocktail bar';
  else if (type === 'cafe') queryStr = SEARCH_OVERRIDES[mealId] ?? 'cafe';
  else if (type === 'bakery') queryStr = SEARCH_OVERRIDES[mealId] ?? 'bakery';
  else if (type === 'fancy_restaurant') queryStr = 'fine dining';
  else if (type === 'cinema') queryStr = 'cinema';
  else if (SEARCH_OVERRIDES[mealId]) queryStr = SEARCH_OVERRIDES[mealId];
  // No English override for this meal. Inside Bulgaria search by the dish name;
  // abroad that returns nothing useful, so fall back to a generic restaurant.
  else queryStr = isInBulgaria() ? `${mealName} ресторант` : 'restaurant';
  const query = encodeURIComponent(queryStr);

  // Always use the universal Google Maps URL. On iOS this opens directly
  // in the Google Maps app via Universal Links when installed; the previous
  // comgooglemaps:// deep-link path was triggering Maps' generic
  // "Something went wrong" error on some devices/iOS builds.
  const webUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  await Linking.openURL(webUrl);
}
