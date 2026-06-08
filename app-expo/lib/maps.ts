import { Linking, Platform } from 'react-native';

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
  // Meta / abstract — hide button entirely
  nothing: 'none',
  everything: 'none',
  fridge_thing: 'none',
  whatever_at_home: 'none',
  just_a_little_sweet: 'none',
  moms_food: 'none',

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
};

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
  else queryStr = SEARCH_OVERRIDES[mealId] ?? `${mealName} ресторант`;
  const query = encodeURIComponent(queryStr);

  // Always use the universal Google Maps URL. On iOS this opens directly
  // in the Google Maps app via Universal Links when installed; the previous
  // comgooglemaps:// deep-link path was triggering Maps' generic
  // "Something went wrong" error on some devices/iOS builds.
  const webUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  await Linking.openURL(webUrl);
}
