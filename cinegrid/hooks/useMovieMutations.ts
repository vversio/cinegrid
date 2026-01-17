import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addWatchedMovie, deleteWatchedMovie, toggleFavorite, updateRating } from '@/lib/database';
import type { NewWatchedMovie, WatchedMovie } from '@/lib/types';

export function useAddMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movie: NewWatchedMovie) => addWatchedMovie(movie),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useDeleteMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWatchedMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useUpdateRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rating }: { id: string; rating: number }) => updateRating(id, rating),
    onMutate: async ({ id, rating }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['movies'] });
      await queryClient.cancelQueries({ queryKey: ['favorites'] });

      // Snapshot previous values
      const previousMovies = queryClient.getQueryData<WatchedMovie[]>(['movies']);
      const previousFavorites = queryClient.getQueryData<WatchedMovie[]>(['favorites']);

      // Optimistically update
      if (previousMovies) {
        queryClient.setQueryData<WatchedMovie[]>(['movies'], (old) =>
          old?.map((m) => (m.id === id ? { ...m, user_rating: rating } : m))
        );
      }
      if (previousFavorites) {
        queryClient.setQueryData<WatchedMovie[]>(['favorites'], (old) =>
          old?.map((m) => (m.id === id ? { ...m, user_rating: rating } : m))
        );
      }

      return { previousMovies, previousFavorites };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousMovies) {
        queryClient.setQueryData(['movies'], context.previousMovies);
      }
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites'], context.previousFavorites);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}
