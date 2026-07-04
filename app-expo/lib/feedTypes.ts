// Типове за секцията „Какво APPна?" (социален feed за храна).

export type PostKind = 'venue' | 'home';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type FeedSort = 'recent' | 'top' | 'popular';

export interface FeedProfile {
  device_id: string;
  nickname: string;
  created_at: string;
}

export interface FeedPost {
  id: string;
  author_device_id: string;
  kind: PostKind;
  photo_url: string | null;
  dish_name: string;
  comment: string | null;
  dish_rating: number;

  // venue
  place_name?: string | null;
  place_city?: string | null;
  place_maps_url?: string | null;
  place_key?: string | null;
  place_rating?: number | null;
  worth_it?: boolean | null;
  cuisine?: string | null;
  place_type?: string | null;

  // home
  prep_minutes?: number | null;
  difficulty?: Difficulty | null;
  servings?: number | null;
  diet?: string[] | null;
  ingredients?: string | null;
  steps?: string | null;

  tags: string[];
  like_count: number;
  status: string;
  created_at: string;

  // попълва се от клиента
  liked_by_me?: boolean;
  author_nickname?: string | null;
}

export interface NewVenuePost {
  dishName: string;
  comment?: string;
  dishRating: number;
  photoUri?: string;      // локален uri (качва се), иначе празно
  placeName: string;
  placeCity?: string;
  placeMapsUrl?: string;
  placeRating?: number;
  worthIt?: boolean;
  cuisine?: string;
  placeType?: string;
  tags?: string[];
}

export interface NewHomePost {
  dishName: string;
  comment?: string;
  dishRating: number;
  photoUri?: string;
  prepMinutes?: number;
  difficulty?: Difficulty;
  servings?: number;
  diet?: string[];
  ingredients?: string;
  steps?: string;
  tags?: string[];
}

export interface VenueFilters {
  cuisine?: string;
  placeType?: string;
  city?: string;
  minDishRating?: number;
  worthIt?: boolean;
  sort?: FeedSort;
}

export interface HomeFilters {
  maxPrep?: number;
  difficulty?: Difficulty;
  diet?: string;
  sort?: FeedSort;
}

export interface PlaceStat {
  place_key: string;
  place_name: string;
  place_city: string | null;
  post_count: number;
  avg_place_rating: number | null;
  avg_dish_rating: number | null;
}
