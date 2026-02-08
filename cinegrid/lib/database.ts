import { supabase } from './supabaseClient';
import type { WatchedMovie, NewWatchedMovie } from './types';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || '';

export async function isAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return false;
  return user.email === ADMIN_EMAIL;
}

export async function getWatchedMovies(): Promise<WatchedMovie[]> {
  const { data, error } = await supabase
    .from('watched_movies')
    .select('*')
    .order('watched_date', { ascending: false });

  if (error) {
    console.error('Error fetching watched movies:', error);
    throw error;
  }

  return data || [];
}

export async function addWatchedMovie(movie: NewWatchedMovie): Promise<WatchedMovie> {
  const admin = await isAdmin();
  
  if (!admin) {
    const { data: { user } } = await supabase.auth.getUser();
    throw new Error(`Only admin can add movies. Current user: ${user?.email || 'not authenticated'}`);
  }

  const { data, error } = await supabase
    .from('watched_movies')
    .insert({
      tmdb_id: movie.tmdb_id,
      title: movie.title,
      poster_path: movie.poster_path,
      watched_date: movie.watched_date,
      genre: movie.genre,
      custom_category: movie.custom_category || null,
      media_type: movie.media_type,
      is_favorite: movie.is_favorite || false,
      user_rating: movie.user_rating || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding watched movie:', error);
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    // More detailed error for debugging
    const errorMsg = error.message || 'Unknown error';
    const errorHint = error.hint || '';
    throw new Error(`Failed to add movie: ${errorMsg}${errorHint ? ` (${errorHint})` : ''}`);
  }

  return data;
}

export async function deleteWatchedMovie(id: string): Promise<void> {
  const admin = await isAdmin();
  
  if (!admin) {
    throw new Error('Only admin can delete movies');
  }

  const { error } = await supabase
    .from('watched_movies')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting watched movie:', error);
    throw error;
  }
}

export async function getFavorites(): Promise<WatchedMovie[]> {
  const { data, error } = await supabase
    .from('watched_movies')
    .select('*')
    .eq('is_favorite', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }

  return data || [];
}

export async function toggleFavorite(id: string): Promise<boolean> {
  const admin = await isAdmin();
  
  if (!admin) {
    throw new Error('Only admin can modify favorites');
  }

  // First get the current state
  const { data: current, error: fetchError } = await supabase
    .from('watched_movies')
    .select('is_favorite')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching movie:', fetchError);
    throw fetchError;
  }

  const newValue = !current.is_favorite;

  const { error } = await supabase
    .from('watched_movies')
    .update({ is_favorite: newValue })
    .eq('id', id);

  if (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }

  return newValue;
}

export async function updateRating(id: string, rating: number | null): Promise<void> {
  const admin = await isAdmin();
  
  if (!admin) {
    throw new Error('Only admin can modify ratings');
  }

  // Validate rating if provided
  if (rating !== null && (rating < 1 || rating > 5)) {
    throw new Error('Rating must be between 1 and 5');
  }

  // Use .select() to verify the update actually persisted.
  // Supabase silently returns success (no error) when RLS blocks an update,
  // but the returned data array will be empty.
  const { data, error } = await supabase
    .from('watched_movies')
    .update({ user_rating: rating })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating rating:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    console.error('Rating update returned no rows — possible RLS policy issue or row not found', { id, rating });
    throw new Error('Failed to update rating. The change was not saved. Check database permissions.');
  }
}
