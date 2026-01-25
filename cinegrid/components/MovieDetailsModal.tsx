'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Clock, Calendar } from 'lucide-react';
import type { WatchedMovie, MediaType } from '@/lib/types';

interface TMDBDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  runtime: number | null;
  genres: string[];
  tagline: string | null;
}

interface MovieDetailsModalProps {
  movie: WatchedMovie | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MovieDetailsModal({ movie, isOpen, onClose }: MovieDetailsModalProps) {
  const [details, setDetails] = useState<TMDBDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !movie) {
      setDetails(null);
      setError(null);
      return;
    }

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const type: MediaType = movie.media_type || 'movie';
        const res = await fetch(`/api/tmdb/${movie.tmdb_id}?type=${type}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch details');
        }

        const data = await res.json();
        setDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, movie]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!movie) return null;

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full max-h-[90vh] overflow-y-auto rounded-xl glass border border-border-subtle z-50"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full glass hover:bg-bg-tertiary/50 transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-text-primary" />
            </button>

            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 rounded-full border-2 border-text-primary border-t-transparent animate-spin" />
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="p-8 text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg glass text-text-primary hover:bg-bg-tertiary/50 transition-colors"
                >
                  Close
                </button>
              </div>
            )}

            {/* Content */}
            {details && !isLoading && !error && (
              <div>
                {/* Backdrop image */}
                {details.backdrop_path && (
                  <div className="relative h-48 md:h-64 w-full">
                    <Image
                      src={`https://image.tmdb.org/t/p/w780${details.backdrop_path}`}
                      alt=""
                      fill
                      className="object-cover rounded-t-xl"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent" />
                  </div>
                )}

                {/* Details */}
                <div className={`p-6 ${details.backdrop_path ? '-mt-20 relative' : ''}`}>
                  <div className="flex gap-4">
                    {/* Poster (small) */}
                    {movie.poster_path && (
                      <div className="relative w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                          alt={movie.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Title and meta */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-text-primary mb-1 line-clamp-2">
                        {movie.title}
                      </h2>
                      
                      {details.tagline && (
                        <p className="text-sm text-text-secondary italic mb-2">
                          &ldquo;{details.tagline}&rdquo;
                        </p>
                      )}

                      {/* Meta info */}
                      <div className="flex flex-wrap gap-3 text-xs text-text-secondary">
                        {details.release_date && (
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(details.release_date).getFullYear()}
                          </span>
                        )}
                        {details.runtime && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatRuntime(details.runtime)}
                          </span>
                        )}
                        {details.vote_average > 0 && (
                          <span className="flex items-center gap-1">
                            <Star size={12} className="text-text-primary" />
                            {details.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>

                      {/* Genres */}
                      {details.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {details.genres.map((genre) => (
                            <span
                              key={genre}
                              className="px-2 py-0.5 text-xs rounded-full bg-bg-tertiary/50 text-text-primary"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Overview */}
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-text-primary mb-2">Overview</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {details.overview}
                    </p>
                  </div>

                  {/* Your watch info */}
                  <div className="mt-6 pt-4 border-t border-border-subtle">
                    <h3 className="text-xs font-medium text-text-muted uppercase mb-2">Your Watch</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-text-secondary">
                        Watched: {new Date(movie.watched_date).toLocaleDateString()}
                      </span>
                      {movie.user_rating && (
                        <span className="flex items-center gap-1 text-text-primary">
                          <Star size={14} className="fill-current" />
                          {movie.user_rating}/5
                        </span>
                      )}
                      {movie.custom_category && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-bg-tertiary/50 text-text-primary">
                          {movie.custom_category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
