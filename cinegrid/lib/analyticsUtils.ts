import type { WatchedMovie } from './types';

export interface GenreTrendDataPoint {
  month: string; // "2025-01"
  monthLabel: string; // "Jan 2025"
  [genre: string]: string | number;
}

export interface GenreCount {
  genre: string;
  count: number;
}

/**
 * Aggregate movies by genre and month for trend visualization
 */
export function aggregateByGenreAndMonth(
  movies: WatchedMovie[],
  startDate?: Date
): GenreTrendDataPoint[] {
  if (movies.length === 0) return [];

  // Filter by start date if provided
  const filtered = startDate
    ? movies.filter(m => new Date(m.watched_date) >= startDate)
    : movies;

  // Create a map of month -> genre -> count
  const monthGenreMap = new Map<string, Map<string, number>>();
  
  filtered.forEach(movie => {
    const date = new Date(movie.watched_date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthGenreMap.has(monthKey)) {
      monthGenreMap.set(monthKey, new Map());
    }
    
    const genreMap = monthGenreMap.get(monthKey)!;
    const currentCount = genreMap.get(movie.genre) || 0;
    genreMap.set(movie.genre, currentCount + 1);
  });

  // Convert to array sorted by month
  const sortedMonths = Array.from(monthGenreMap.keys()).sort();
  
  return sortedMonths.map(month => {
    const genreMap = monthGenreMap.get(month)!;
    const [year, monthNum] = month.split('-');
    const monthLabel = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

    const dataPoint: GenreTrendDataPoint = {
      month,
      monthLabel,
    };

    genreMap.forEach((count, genre) => {
      dataPoint[genre] = count;
    });

    return dataPoint;
  });
}

/**
 * Get the top N genres by total count
 */
export function getTopGenres(movies: WatchedMovie[], limit: number = 7): string[] {
  const genreCounts = new Map<string, number>();
  
  movies.forEach(movie => {
    const currentCount = genreCounts.get(movie.genre) || 0;
    genreCounts.set(movie.genre, currentCount + 1);
  });

  return Array.from(genreCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([genre]) => genre);
}

/**
 * Get genre statistics
 */
export function getGenreStats(movies: WatchedMovie[]): GenreCount[] {
  const genreCounts = new Map<string, number>();
  
  movies.forEach(movie => {
    const currentCount = genreCounts.get(movie.genre) || 0;
    genreCounts.set(movie.genre, currentCount + 1);
  });

  return Array.from(genreCounts.entries())
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get quick stats for the analytics panel
 */
export function getQuickStats(movies: WatchedMovie[]) {
  const totalMovies = movies.filter(m => m.media_type === 'movie').length;
  const totalSeries = movies.filter(m => m.media_type === 'series').length;
  const ratedMovies = movies.filter(m => m.user_rating !== null);
  const avgRating = ratedMovies.length > 0
    ? ratedMovies.reduce((sum, m) => sum + (m.user_rating || 0), 0) / ratedMovies.length
    : null;
  const favoriteCount = movies.filter(m => m.is_favorite).length;

  return {
    totalMovies,
    totalSeries,
    totalItems: movies.length,
    avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
    favoriteCount,
  };
}

/**
 * Get start date for "This Year" filter
 */
export function getThisYearStartDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), 0, 1);
}

/**
 * Chart color palette - Blue neon spectrum
 */
export const CHART_COLORS = [
  '#60a5fa', // Bright blue
  '#22d3ee', // Cyan
  '#fbbf24', // Amber gold
  '#8b5cf6', // Purple
  '#3b82f6', // Blue
  '#e0e7ff', // Light blue-white
  '#1e3a5f', // Deep blue
];

export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}
