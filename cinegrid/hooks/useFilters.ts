'use client';

import { useCallback, useMemo, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { WatchedMovie } from '@/lib/types';

export type SortOption = 'recent' | 'title-asc' | 'title-desc' | 'rating-desc' | 'release-date';
export type MediaFilter = 'all' | 'movie' | 'series';

export interface FilterState {
  sort: SortOption;
  mediaType: MediaFilter;
  genres: string[];
  minRating: number | null;
  search: string;
}

export function useFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  // Parse current filter state from URL
  const filterState: FilterState = useMemo(() => {
    const sort = (searchParams.get('sort') as SortOption) || 'recent';
    const mediaType = (searchParams.get('filter') as MediaFilter) || 'all';
    const genresParam = searchParams.get('genre');
    const genres = genresParam ? genresParam.split(',').filter(Boolean) : [];
    const minRatingParam = searchParams.get('minRating');
    const minRating = minRatingParam ? parseInt(minRatingParam, 10) : null;
    const search = searchParams.get('q') || '';

    return { sort, mediaType, genres, minRating, search };
  }, [searchParams]);

  // Update URL with new filter values - use replace to avoid history spam
  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.sort !== undefined) {
      if (updates.sort === 'recent') {
        params.delete('sort');
      } else {
        params.set('sort', updates.sort);
      }
    }

    if (updates.mediaType !== undefined) {
      if (updates.mediaType === 'all') {
        params.delete('filter');
      } else {
        params.set('filter', updates.mediaType);
      }
    }

    if (updates.genres !== undefined) {
      if (updates.genres.length === 0) {
        params.delete('genre');
      } else {
        params.set('genre', updates.genres.join(','));
      }
    }

    if (updates.minRating !== undefined) {
      if (updates.minRating === null) {
        params.delete('minRating');
      } else {
        params.set('minRating', updates.minRating.toString());
      }
    }

    if (updates.search !== undefined) {
      if (updates.search === '') {
        params.delete('q');
      } else {
        params.set('q', updates.search);
      }
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    
    // Use startTransition to prevent Suspense from triggering
    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
  }, [searchParams, router, pathname, startTransition]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [router, pathname, startTransition]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filterState.sort !== 'recent' ||
      filterState.mediaType !== 'all' ||
      filterState.genres.length > 0 ||
      filterState.minRating !== null ||
      filterState.search !== ''
    );
  }, [filterState]);

  return {
    filterState,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  };
}

/**
 * Apply filters and sorting to movies array
 */
export function applyFilters(movies: WatchedMovie[], filterState: FilterState): WatchedMovie[] {
  let result = [...movies];

  // Filter by search query
  if (filterState.search) {
    const query = filterState.search.toLowerCase();
    result = result.filter(m => 
      m.title.toLowerCase().includes(query) ||
      m.genre.toLowerCase().includes(query) ||
      (m.custom_category && m.custom_category.toLowerCase().includes(query))
    );
  }

  // Filter by media type
  if (filterState.mediaType !== 'all') {
    result = result.filter(m => m.media_type === filterState.mediaType);
  }

  // Filter by genres
  if (filterState.genres.length > 0) {
    result = result.filter(m => filterState.genres.includes(m.genre));
  }

  // Filter by minimum rating
  if (filterState.minRating !== null) {
    result = result.filter(m => m.user_rating !== null && m.user_rating >= filterState.minRating!);
  }

  // Sort
  switch (filterState.sort) {
    case 'recent':
      result.sort((a, b) => new Date(b.watched_date).getTime() - new Date(a.watched_date).getTime());
      break;
    case 'title-asc':
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'title-desc':
      result.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'rating-desc':
      result.sort((a, b) => {
        // Nulls last
        if (a.user_rating === null && b.user_rating === null) return 0;
        if (a.user_rating === null) return 1;
        if (b.user_rating === null) return -1;
        return b.user_rating - a.user_rating;
      });
      break;
    case 'release-date':
      result.sort((a, b) => new Date(b.watched_date).getTime() - new Date(a.watched_date).getTime());
      break;
  }

  return result;
}

/**
 * Get unique genres from movies array
 */
export function getUniqueGenres(movies: WatchedMovie[]): string[] {
  const genres = new Set<string>();
  movies.forEach(m => genres.add(m.genre));
  return Array.from(genres).sort();
}
