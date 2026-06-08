export type MoodId =
  | 'healthy_ish'
  | 'fancy'
  | 'honest'
  | 'comfort'
  | 'bulgarian';

export type Selection = MoodId | 'all' | null;

export type MealTime = 'breakfast' | 'lunch_dinner' | 'snack' | 'drink';

export type Meal = {
  id: string;
  emoji: string;
  name: string;
  moods: MoodId[];
  reasons: Partial<Record<MoodId, string[]>>;
  times?: MealTime[];
};

export type MealsData = {
  appName: string;
  version: string;
  moods: Array<{
    id: MoodId;
    emoji: string;
    name: string;
    tagline: string;
    color: string;
    isBonus?: boolean;
  }>;
  rerollMessages: (string | null)[];
  subtitleRotation?: string[];
  meals: Meal[];
};

export type PickResult = {
  meal: Meal;
  reason: string;
  moodId: MoodId;
};
