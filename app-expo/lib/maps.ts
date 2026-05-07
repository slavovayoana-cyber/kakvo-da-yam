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
};

export function getNearbyType(mealId: string): NearbyType {
  return NEARBY_OVERRIDES[mealId] ?? 'restaurant';
}

/**
 * Per-meal custom search query for the restaurant tier — used when the
 * meal's name confuses Google Maps (e.g. "Бъфало крилца" matches places
 * literally named "Бъфало"). The query is used verbatim with no extra
 * "ресторант" suffix.
 */
const SEARCH_OVERRIDES: Record<string, string> = {
  buffalo_wings: 'wings near me',
  hawaii_pizza: 'pizza near me',
  caesar_salad: 'caesar salad near me',
  poke_bowl: 'poke bowl near me',
  thai_curry: 'thai food near me',
  chinese_takeout: 'chinese food near me',
  ramen: 'ramen near me',
  dumplings: 'asian food near me',
  bruschetta: 'italian restaurant near me',
  pasta: 'italian restaurant near me',
  spaghetti_bolognese: 'italian restaurant near me',
  risotto: 'italian restaurant near me',
  macaron: 'patisserie near me',
  croissant: 'bakery near me',
  baklava: 'baklava near me',
  gyros: 'gyros near me',
  pleskavica: 'balkan food near me',
  sushi: 'sushi near me',
  supermarket_sushi: 'супермаркет',
  tacos: 'mexican food near me',
  burrito: 'mexican food near me',
  eggs_benedict: 'brunch near me',
  brunch: 'brunch near me',
  boozy_brunch: 'brunch near me',
  avocado_toast: 'brunch near me',
  avocado_bagel: 'brunch near me',
  matcha_latte: 'cafe near me',
  smoothie: 'smoothie bar near me',
  green_juice: 'juice bar near me',
  coffee_mimosa: 'brunch near me',
  pizza: 'pizza near me',
  neighborhood_pizza: 'pizza near me',
  frozen_pizza: 'супермаркет',
  burger: 'burger near me',
  dyuner: 'dyuner near me',
  banitsa: 'banitsa near me',
  shopska: 'българска кухня near me',
  musaka: 'българска кухня near me',
  shkembe_chorba: 'българска кухня near me',
  bob_chorba: 'българска кухня near me',
  chicken_noodle_soup: 'българска кухня near me',
  stuffed_peppers: 'българска кухня near me',
  kebapcheta_fries: 'скара near me',
  kebap_kyufte: 'скара near me',
  skara: 'скара near me',
  cheverme: 'скара near me',
  sach: 'българска кухня near me',
  gyuvech: 'българска кухня near me',
  tarator: 'българска кухня near me',
  popara: 'българска кухня near me',
  mekici: 'мекичарница near me',
  french_toast_bg: 'мекичарница near me',
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
  else if (type === 'fancy_restaurant') queryStr = 'fine dining ресторант';
  else if (type === 'cinema') queryStr = 'кино';
  else queryStr = SEARCH_OVERRIDES[mealId] ?? `${mealName} ресторант`;
  const query = encodeURIComponent(queryStr);

  if (Platform.OS === 'ios') {
    const googleAppUrl = `comgooglemaps://?q=${query}`;
    try {
      const canOpen = await Linking.canOpenURL(googleAppUrl);
      if (canOpen) {
        await Linking.openURL(googleAppUrl);
        return;
      }
    } catch {
      // fall through to web
    }
  }

  const webUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  await Linking.openURL(webUrl);
}
