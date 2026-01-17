export type MediaType = 'movie' | 'series';

export interface WatchedMovie {
  id: string;
  tmdb_id: number;
  title: string;
  poster_path: string;
  watched_date: string; // ISO date string YYYY-MM-DD
  genre: string;
  custom_category: string | null;
  media_type: MediaType;
  is_favorite: boolean;
  user_rating: number | null; // 1-5 scale, null if not rated
  created_at: string;
}

export interface NewWatchedMovie {
  tmdb_id: number;
  title: string;
  poster_path: string;
  watched_date: string;
  genre: string;
  custom_category?: string | null;
  media_type: MediaType;
  is_favorite?: boolean;
  user_rating?: number | null;
}

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  genre_ids: number[];
}

export interface TMDBSeries {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  overview: string;
  genre_ids: number[];
}

export interface TMDBSearchResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface TMDBSeriesSearchResponse {
  page: number;
  results: TMDBSeries[];
  total_pages: number;
  total_results: number;
}

// TMDB Genre mapping
export const TMDB_GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};
