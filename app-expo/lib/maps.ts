import { Linking, Platform } from 'react-native';

export type NearbyType =
  | 'restaurant'
  | 'fancy_restaurant'
  | 'grocery'
  | 'health_store'
  | 'bar'
  | 'none';

const NEARBY_OVERRIDES: Record<string, NearbyType> = {
  // Meta / abstract — hide button entirely
  nothing: 'none',
  everything: 'none',
  fridge_thing: 'none',
  whatever_at_home: 'none',
  just_a_little_sweet: 'none',

  // Fancy / fine dining
  expensive_thing: 'fancy_restaurant',
  unaffordable_restaurant: 'fancy_restaurant',
  lobster: 'fancy_restaurant',

  // Bars / drinks
  just_one_drink: 'bar',

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

  // Обикновен супермаркет
  chocolate: 'grocery',
  blueberries: 'grocery',
  garlic: 'grocery',
  banana: 'grocery',
  pickle_jar: 'grocery',
  turshiya: 'grocery',
  eggs: 'grocery',
  cheese_tomato: 'grocery',
};

export function getNearbyType(mealId: string): NearbyType {
  return NEARBY_OVERRIDES[mealId] ?? 'restaurant';
}

export function getNearbyButtonLabel(type: NearbyType): string {
  if (type === 'grocery') return '🛒 Магазин наблизо';
  if (type === 'health_store') return '🌱 Био магазин';
  if (type === 'bar') return '🍸 Бар наблизо';
  if (type === 'fancy_restaurant') return '💎 Fine dining';
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
  else queryStr = `${mealName} ресторант`;
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
