'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import MovieSearch from './MovieSearch';
import StarRating from './StarRating';
import type { TMDBMovie, TMDBSeries, NewWatchedMovie, MediaType, WatchedMovie } from '@/lib/types';
import { TMDB_GENRES } from '@/lib/types';
import type { UseMutationResult } from '@tanstack/react-query';

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMovieAdded: () => void;
  mutation: UseMutationResult<WatchedMovie, Error, NewWatchedMovie, unknown>;
}

export default function AddMovieModal({ isOpen, onClose, onMovieAdded, mutation }: AddMovieModalProps) {
  const [mediaType, setMediaType] = useState<MediaType>('movie');
  const [selectedItem, setSelectedItem] = useState<TMDBMovie | TMDBSeries | null>(null);
  const [watchedDate, setWatchedDate] = useState(new Date().toISOString().split('T')[0]);
  const [genre, setGenre] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState('');

  const isSubmitting = mutation.isPending;

  const handleItemSelect = (item: TMDBMovie | TMDBSeries, type: MediaType) => {
    setSelectedItem(item);
    setMediaType(type);
    // Pre-fill genre from TMDB
    if (item.genre_ids && item.genre_ids.length > 0) {
      const primaryGenre = TMDB_GENRES[item.genre_ids[0]] || '';
      setGenre(primaryGenre);
    }
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) {
      setError(`Please select a ${mediaType}`);
      return;
    }
    if (!genre) {
      setError('Please select a genre');
      return;
    }

    setError('');

    const title = 'title' in selectedItem ? selectedItem.title : selectedItem.name;
    const movieData: NewWatchedMovie = {
      tmdb_id: selectedItem.id,
      title: title,
      poster_path: selectedItem.poster_path || '',
      watched_date: watchedDate,
      genre: genre,
      custom_category: customCategory || null,
      media_type: mediaType,
      is_favorite: isFavorite,
      user_rating: rating,
    };

    try {
      await mutation.mutateAsync(movieData);
      
      // Reset form
      setSelectedItem(null);
      setMediaType('movie');
      setWatchedDate(new Date().toISOString().split('T')[0]);
      setGenre('');
      setCustomCategory('');
      setRating(null);
      setIsFavorite(false);
      
      onMovieAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    }
  };

  const handleClose = () => {
    setSelectedItem(null);
    setMediaType('movie');
    setWatchedDate(new Date().toISOString().split('T')[0]);
    setGenre('');
    setCustomCategory('');
    setRating(null);
    setIsFavorite(false);
    setError('');
    onClose();
  };

  const genreOptions = Object.values(TMDB_GENRES).sort();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md glass large-panel rounded-xl shadow-2xl border border-glass-border max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-glass-border">
              <h2 className="text-lg font-semibold text-filmic-beige">
                Add Watched {mediaType === 'movie' ? 'Movie' : 'Series'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-filmic-seduction/30 transition-colors"
              >
                <X size={20} className="text-filmic-rose" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Media Type Toggle */}
              <div>
                <label className="block text-sm font-medium mb-2 text-filmic-beige">Media Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMediaType('movie');
                      setSelectedItem(null);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      mediaType === 'movie'
                        ? 'bg-filmic-lavender text-white'
                        : 'bg-filmic-seduction/20 text-filmic-rose hover:bg-filmic-seduction/40'
                    }`}
                  >
                    Movie
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaType('series');
                      setSelectedItem(null);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      mediaType === 'series'
                        ? 'bg-filmic-lavender text-white'
                        : 'bg-filmic-seduction/20 text-filmic-rose hover:bg-filmic-seduction/40'
                    }`}
                  >
                    Series
                  </button>
                </div>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium mb-2 text-filmic-beige">
                  Search {mediaType === 'movie' ? 'Movie' : 'Series'}
                </label>
                <MovieSearch onSelect={handleItemSelect} mediaType={mediaType} />
              </div>

              {/* Selected Item Preview */}
              {selectedItem && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 bg-filmic-seduction/15 rounded-lg border border-filmic-seduction/15"
                >
                  {selectedItem.poster_path && (
                    <div className="relative w-12 h-18 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={`https://image.tmdb.org/t/p/w92${selectedItem.poster_path}`}
                        alt={'title' in selectedItem ? selectedItem.title : selectedItem.name}
                        width={48}
                        height={72}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-filmic-beige truncate">
                      {'title' in selectedItem ? selectedItem.title : selectedItem.name}
                    </p>
                    <p className="text-sm text-filmic-rose">
                      {('release_date' in selectedItem ? selectedItem.release_date : selectedItem.first_air_date)?.split('-')[0] || 'Unknown year'}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Date Watched */}
              <div>
                <label className="block text-sm font-medium mb-2 text-filmic-beige">Date Watched</label>
                <input
                  type="date"
                  value={watchedDate}
                  onChange={(e) => setWatchedDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-glass-border bg-filmic-seduction/15 text-filmic-beige focus:outline-none focus:ring-2 focus:ring-filmic-lavender"
                />
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium mb-2 text-filmic-beige">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-glass-border bg-filmic-seduction/15 text-filmic-beige focus:outline-none focus:ring-2 focus:ring-filmic-lavender"
                >
                  <option value="" className="bg-filmic-charcoal">Select genre...</option>
                  {genreOptions.map((g) => (
                    <option key={g} value={g} className="bg-filmic-charcoal">{g}</option>
                  ))}
                </select>
              </div>

              {/* Rating (Optional) */}
              <div>
                <label className="block text-sm font-medium mb-2 text-filmic-beige">
                  Rating <span className="text-filmic-rose">(optional)</span>
                </label>
                <div className="flex items-center gap-2">
                  <StarRating
                    rating={rating}
                    onRatingChange={setRating}
                    size="md"
                  />
                  {rating && (
                    <button
                      type="button"
                      onClick={() => setRating(null)}
                      className="text-xs text-filmic-rose hover:text-filmic-beige transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Favorite Toggle */}
              <div>
                <label className="block text-sm font-medium mb-2 text-filmic-beige">
                  Add to Favorites <span className="text-filmic-rose">(optional)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isFavorite
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-filmic-seduction/15 text-filmic-rose border border-glass-border hover:bg-filmic-seduction/20'
                  }`}
                >
                  <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                  {isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
                </button>
              </div>

              {/* Custom Category */}
              <div>
                <label className="block text-sm font-medium mb-2 text-filmic-beige">
                  Custom Category <span className="text-filmic-rose">(optional)</span>
                </label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="e.g., Late Night Horror, Comfort Movies"
                  className="w-full px-3 py-2 rounded-lg border border-glass-border bg-filmic-seduction/15 text-filmic-beige placeholder:text-filmic-rose/50 focus:outline-none focus:ring-2 focus:ring-filmic-lavender"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !selectedItem}
                className="w-full py-3 rounded-lg bg-filmic-lavender text-white font-medium hover:bg-filmic-seduction transition-colors disabled:opacity-50 disabled:cursor-not-allowed filmic-glow"
              >
                {isSubmitting ? 'Adding...' : `Add ${mediaType === 'movie' ? 'Movie' : 'Series'}`}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
