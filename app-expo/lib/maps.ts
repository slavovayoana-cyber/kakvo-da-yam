import { Linking, Platform } from 'react-native';

export type NearbyType =
  | 'restaurant'
  | 'fancy_restaurant'
  | 'grocery'
  | 'health_store'
  | 'bar'
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

  // Bars / drinks
  just_one_drink: 'bar',
  ouzo: 'bar',
  rakia: 'bar',

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
  supermarket_sushi: 'супермаркет',
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
  frozen_pizza: 'супермаркет',
  burger: 'burger',

  // Bulgarian category queries
  dyuner: 'дюнер',
  banitsa: 'баница',
  shopska: 'българска кухня',
  musaka: 'българска кухня',
  shkembe_chorba: 'българска кухня',
  bob_chorba: 'българска кухня',
  chicken_noodle_soup: 'българска кухня',
  stuffed_peppers: 'българска кухня',
  kebapcheta_fries: 'скара',
  kebap_kyufte: 'скара',
  skara: 'скара',
  cheverme: 'скара',
  sach: 'българска кухня',
  gyuvech: 'българска кухня',
  tarator: 'българска кухня',
  popara: 'българска кухня',
  mekici: 'закуски',
  french_toast_bg: 'закуски',
};

export function getNearbyButtonLabel(type: NearbyType): string {
  if (type === 'grocery') return '🛒 Магазин наблизо';
  if (type === 'health_store') return '🌱 Био магазин';
  if (type === 'bar') return '🍸 Бар наблизо';
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
  if (type === 'grocery') queryStr = 'супермаркет';
  else if (type === 'health_store') queryStr = 'био магазин';
  else if (type === 'bar') queryStr = 'бар';
  else if (type === 'fancy_restaurant') queryStr = 'fine dining';
  else if (type === 'cinema') queryStr = 'кино';
  else queryStr = SEARCH_OVERRIDES[mealId] ?? `${mealName} ресторант`;
  const query = encodeURIComponent(queryStr);

  // Always use the universal Google Maps URL. On iOS this opens directly
  // in the Google Maps app via Universal Links when installed; the previous
  // comgooglemaps:// deep-link path was triggering Maps' generic
  // "Something went wrong" error on some devices/iOS builds.
  const webUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  await Linking.openURL(webUrl);
}
