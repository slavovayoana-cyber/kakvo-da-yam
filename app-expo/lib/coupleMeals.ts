import type { Meal } from './types';

/**
 * Extra meals shown ONLY in couples mode swipe pool.
 * These don't have moods/reasons because the swipe card only renders
 * emoji + name. Keeping them out of meals.json prevents them from
 * polluting the home screen's mood-based random picker.
 */
export const COUPLE_EXTRA_MEALS: Meal[] = [
  // Българско ежедневие — пилешко
  { id: 'couple_chicken_rice', emoji: '🍗', name: 'Пиле с ориз', moods: [], reasons: {} },
  { id: 'couple_chicken_rice_veg', emoji: '🍗', name: 'Пиле с ориз и зеленчуци', moods: [], reasons: {} },
  { id: 'couple_chicken_mushrooms', emoji: '🍗', name: 'Пиле с гъби', moods: [], reasons: {} },
  { id: 'couple_chicken_drumsticks', emoji: '🍗', name: 'Пилешки бутчета на фурна', moods: [], reasons: {} },
  { id: 'couple_chicken_breast', emoji: '🍗', name: 'Пилешко филе на тиган', moods: [], reasons: {} },
  { id: 'couple_chicken_potato', emoji: '🍗', name: 'Печено пиле с картофи', moods: [], reasons: {} },

  // Свинско
  { id: 'couple_pork_potato', emoji: '🥩', name: 'Свинско с картофи', moods: [], reasons: {} },
  { id: 'couple_pork_mushrooms', emoji: '🥩', name: 'Свинско с гъби', moods: [], reasons: {} },
  { id: 'couple_pork_ribs', emoji: '🥩', name: 'Свински ребра', moods: [], reasons: {} },
  { id: 'couple_schnitzel', emoji: '🥩', name: 'Шницел', moods: [], reasons: {} },
  { id: 'couple_pork_roast', emoji: '🥩', name: 'Свинско печено с лук', moods: [], reasons: {} },
  { id: 'couple_meatballs_pan', emoji: '🥩', name: 'Кюфтета на тиган', moods: [], reasons: {} },

  // Зеленчуково / супи
  { id: 'couple_sarmi', emoji: '🥬', name: 'Сарми', moods: [], reasons: {} },
  { id: 'couple_lentils', emoji: '🍲', name: 'Леща', moods: [], reasons: {} },
  { id: 'couple_pea_soup', emoji: '🍲', name: 'Грахова супа', moods: [], reasons: {} },
  { id: 'couple_tomato_soup', emoji: '🍅', name: 'Доматена супа', moods: [], reasons: {} },

  // Тестено / паста
  { id: 'couple_lasagna', emoji: '🍝', name: 'Лазаня', moods: [], reasons: {} },
  { id: 'couple_macaroni_meat', emoji: '🍝', name: 'Макарони с кайма', moods: [], reasons: {} },
  { id: 'couple_penne_chicken', emoji: '🍝', name: 'Пенне с пилешко', moods: [], reasons: {} },
  { id: 'couple_carbonara', emoji: '🍝', name: 'Карбонара', moods: [], reasons: {} },

  // Яйца
  { id: 'couple_omelet_ham', emoji: '🍳', name: 'Омлет с шунка и сирене', moods: [], reasons: {} },
  { id: 'couple_scrambled', emoji: '🍳', name: 'Бъркани яйца с лук', moods: [], reasons: {} },
  { id: 'couple_eye_eggs', emoji: '🥚', name: 'Яйца на очи', moods: [], reasons: {} },

  // Риба
  { id: 'couple_baked_fish', emoji: '🐟', name: 'Печена риба', moods: [], reasons: {} },
  { id: 'couple_mackerel', emoji: '🐟', name: 'Скумрия на тиган', moods: [], reasons: {} },
  { id: 'couple_tuna', emoji: '🐟', name: 'Тон риба', moods: [], reasons: {} },

  // Бързи / закуски
  { id: 'couple_sausages_pan', emoji: '🌭', name: 'Кренвирши на тиган', moods: [], reasons: {} },
  { id: 'couple_princess', emoji: '🥪', name: 'Принцеса с кашкавал', moods: [], reasons: {} },
  { id: 'couple_hotdog', emoji: '🌭', name: 'Хот дог', moods: [], reasons: {} },
  { id: 'couple_tomato_salad', emoji: '🥗', name: 'Доматена салата', moods: [], reasons: {} },

  // Сладко
  { id: 'couple_icecream_simple', emoji: '🍦', name: 'Сладолед', moods: [], reasons: {} },
  { id: 'couple_yogurt_honey', emoji: '🥛', name: 'Кисело мляко с мед', moods: [], reasons: {} },
  { id: 'couple_cheesecake', emoji: '🍰', name: 'Чийзкейк', moods: [], reasons: {} },
  { id: 'couple_apple_pie', emoji: '🥧', name: 'Ябълков пай', moods: [], reasons: {} },
  { id: 'couple_strawberries_cream', emoji: '🍓', name: 'Ягоди със сметана', moods: [], reasons: {} },

  // Различни кухни
  { id: 'couple_bibimbap', emoji: '🍱', name: 'Бибимбап', moods: [], reasons: {} },
  { id: 'couple_greek_salad', emoji: '🥗', name: 'Гръцка салата', moods: [], reasons: {} },
  { id: 'couple_shakshuka', emoji: '🍳', name: 'Шакшука', moods: [], reasons: {} },
  { id: 'couple_quesadilla', emoji: '🌮', name: 'Кесадиля с пиле', moods: [], reasons: {} },
  { id: 'couple_guacamole', emoji: '🥑', name: 'Гуакамоле с чипс', moods: [], reasons: {} },
  { id: 'couple_gyoza', emoji: '🥟', name: 'Гьоза с пиле', moods: [], reasons: {} },
  { id: 'couple_sashimi', emoji: '🍣', name: 'Сашими микс', moods: [], reasons: {} },
  { id: 'couple_padthai', emoji: '🍜', name: 'Падтай с скариди', moods: [], reasons: {} },
  { id: 'couple_tomyam', emoji: '🍲', name: 'Том ям с пиле', moods: [], reasons: {} },
  { id: 'couple_banh_mi', emoji: '🥪', name: 'Бан ми', moods: [], reasons: {} },
  { id: 'couple_pesto_pasta', emoji: '🍝', name: 'Песто паста с пиле', moods: [], reasons: {} },
  { id: 'couple_chili_con_carne', emoji: '🌶', name: 'Чили кон карне', moods: [], reasons: {} },
  { id: 'couple_udon_chicken', emoji: '🍝', name: 'Удон с пиле', moods: [], reasons: {} },
  { id: 'couple_ravioli_ricotta', emoji: '🥟', name: 'Равиоли с рикота', moods: [], reasons: {} },
  { id: 'couple_benedict_avocado', emoji: '🍳', name: 'Бенедикт с авокадо', moods: [], reasons: {} },
];
