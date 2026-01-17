'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Trash2, Film, Tv } from 'lucide-react';
import { cn } from '@/lib/utils';
import StarRating from '@/components/StarRating';
import type { WatchedMovie } from '@/lib/types';

interface MovieCardProps {
  movie: WatchedMovie;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onRatingChange?: (id: string, rating: number) => void;
  onViewDetails?: (movie: WatchedMovie) => void;
  variant?: 'grid' | 'hero';
  priority?: boolean; // For LCP optimization - set true for above-the-fold images
}

export default function MovieCard({
  movie,
  isAdmin = false,
  onDelete,
  onToggleFavorite,
  onRatingChange,
  onViewDetails,
  variant = 'grid',
  priority = false,
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return;
    if (!confirm('Remove this from your watched list?')) return;
    
    setIsDeleting(true);
    try {
      await onDelete(movie.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!onToggleFavorite || isFavoriting) return;
    
    setIsFavoriting(true);
    try {
      await onToggleFavorite(movie.id);
    } finally {
      setIsFavoriting(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    if (onRatingChange) {
      onRatingChange(movie.id, rating);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on action buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    
    onViewDetails?.(movie);
  };

  const isHero = variant === 'hero';
  const cardClasses = cn(
    'group relative rounded-lg overflow-hidden',
    isHero 
      ? 'w-[240px] h-[360px] flex-shrink-0 glass filmic-glow border border-filmic-seduction/10' 
      : 'aspect-[2/3] bg-filmic-charcoal-light'
  );

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onViewDetails?.(movie);
    }
  };

  return (
    <motion.div
      className={`${cardClasses} ${onViewDetails ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        boxShadow: isHovered ? '0 20px 40px rgba(82, 42, 111, 0.3)' : 'none',
      }}
      tabIndex={onViewDetails ? 0 : undefined}
      role={onViewDetails ? 'button' : undefined}
      aria-label={`${movie.title}${movie.media_type === 'series' ? ' (Series)' : ''}, ${movie.genre}${movie.user_rating ? `, rated ${movie.user_rating} stars` : ''}`}
    >
      {/* Poster Image */}
      {movie.poster_path ? (
        <Image
          src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
          alt={movie.title}
          fill
          className="object-cover"
          sizes={isHero ? '240px' : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw'}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-filmic-seduction to-filmic-charcoal text-filmic-rose p-4">
          {movie.media_type === 'series' ? (
            <Tv size={32} className="mb-2 opacity-50" />
          ) : (
            <Film size={32} className="mb-2 opacity-50" />
          )}
          <span className="text-sm text-center line-clamp-3">{movie.title}</span>
        </div>
      )}

      {/* Media type badge */}
      {movie.media_type === 'series' && (
        <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium glass rounded text-filmic-beige">
          Series
        </div>
      )}

      {/* Favorite indicator (always visible if favorited) */}
      {movie.is_favorite && !isHovered && (
        <div className="absolute top-2 right-2">
          <Heart size={18} className="fill-red-500 text-red-500" />
        </div>
      )}

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Content at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          {/* Custom category badge */}
          {movie.custom_category && (
            <span className="inline-block px-2 py-1 mb-2 text-xs font-medium glass-subtle rounded-full text-filmic-beige">
              {movie.custom_category}
            </span>
          )}
          
          {/* Title */}
          <p className="text-white text-sm font-medium truncate">{movie.title}</p>
          
          {/* Genre & Date */}
          <p className="text-white/70 text-xs">{movie.genre}</p>
          <p className="text-white/50 text-xs">{movie.watched_date}</p>

          {/* Rating */}
          <div className="mt-2">
            <StarRating
              rating={movie.user_rating}
              onRatingChange={isAdmin ? handleRatingChange : undefined}
              readOnly={!isAdmin}
              size="sm"
            />
          </div>
        </div>

        {/* Action buttons (top right) - only for admin */}
        {isAdmin && (
          <div className="absolute top-2 right-2 flex gap-1">
            {/* Favorite toggle */}
            <button
              onClick={handleToggleFavorite}
              disabled={isFavoriting}
              className={cn(
                'p-2 rounded-full glass transition-colors disabled:opacity-50',
                movie.is_favorite 
                  ? 'text-red-500 hover:bg-red-500/20' 
                  : 'text-white/80 hover:text-red-400'
              )}
              aria-label={movie.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart 
                size={16} 
                className={movie.is_favorite ? 'fill-current' : ''} 
              />
            </button>

            {/* Delete button */}
            {onDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 rounded-full glass text-white/80 hover:text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                aria-label="Delete"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
