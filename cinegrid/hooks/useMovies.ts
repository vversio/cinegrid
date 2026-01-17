import { useQuery } from '@tanstack/react-query';
import { getWatchedMovies, getFavorites } from '@/lib/database';
import type { WatchedMovie } from '@/lib/types';

export function useMovies() {
  return useQuery<WatchedMovie[]>({
    queryKey: ['movies'],
    queryFn: getWatchedMovies,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useFavorites() {
  return useQuery<WatchedMovie[]>({
    queryKey: ['favorites'],
    queryFn: getFavorites,
    staleTime: 60 * 1000, // 1 minute
  });
}
