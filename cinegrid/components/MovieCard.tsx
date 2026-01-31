'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import TmdbImage from '@/components/TmdbImage';
import { Heart, Trash2 } from 'lucide-react';
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
  variant?: 'grid' | 'hero' | 'compact';
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
  const isCompact = variant === 'compact';
  const cardClasses = cn(
    'group relative rounded-xl overflow-hidden',
    isHero 
      ? 'w-[190px] h-[285px] flex-shrink-0' 
      : isCompact
        ? 'w-[150px] h-[225px] flex-shrink-0'
        : 'aspect-[2/3]'
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
      whileHover={isCompact ? { y: -5, scale: 1.02 } : { y: -8, scale: 1.02 }}
      transition={{ 
        duration: 0.35, 
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{
        boxShadow: isHovered 
          ? '0 15px 30px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 255, 255, 0.03)' 
          : '0 4px 12px rgba(0, 0, 0, 0.2)',
        background: 'rgba(26, 26, 26, 0.6)',
        backdropFilter: 'blur(8px)',
      }}
      tabIndex={onViewDetails ? 0 : undefined}
      role={onViewDetails ? 'button' : undefined}
      aria-label={`${movie.title}${movie.media_type === 'series' ? ' (Series)' : ''}, ${movie.genre}${movie.user_rating ? `, rated ${movie.user_rating} stars` : ''}`}
    >
      {/* Poster Image: single request, onLoad/onError handle state; no separate GET to check */}
      <TmdbImage
        path={movie.poster_path}
        alt={movie.title}
        variant="poster"
        fill
        className="object-cover"
        sizes={isHero ? '180px' : isCompact ? '140px' : '(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 14vw'}
        priority={priority}
        mediaType={movie.media_type === 'series' ? 'series' : 'movie'}
      />

      {/* Media type badge */}
      {movie.media_type === 'series' && (
        <div className={cn(
          "absolute top-1.5 left-1.5 px-1.5 py-0.5 font-medium glass rounded text-text-primary",
          isCompact ? "text-[10px]" : "text-xs"
        )}>
          Series
        </div>
      )}

      {/* Favorite indicator (always visible if favorited) */}
      {movie.is_favorite && !isHovered && (
        <div className="absolute top-1.5 right-1.5">
          <Heart size={isCompact ? 12 : 16} className="fill-white text-white" />
        </div>
      )}

      {/* Hover overlay with glassmorphism */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.6) 40%, rgba(0, 0, 0, 0.2) 70%, transparent 100%)',
          backdropFilter: isHovered ? 'blur(2px)' : 'none',
        }}
      >
        {/* Content at bottom */}
        <div className={cn("absolute bottom-0 left-0 right-0", isCompact ? "p-2" : "p-3")}>
          {/* Custom category badge */}
          {movie.custom_category && !isCompact && (
            <span className="inline-block px-2 py-0.5 mb-1 text-[10px] font-medium glass-subtle rounded-full text-text-primary">
              {movie.custom_category}
            </span>
          )}
          
          {/* Title */}
          <p className={cn("text-white font-medium truncate", isCompact ? "text-xs" : "text-sm")}>{movie.title}</p>
          
          {/* Genre & Date */}
          <p className={cn("text-white/70", isCompact ? "text-[10px]" : "text-xs")}>{movie.genre}</p>
          {!isCompact && <p className="text-white/50 text-xs">{movie.watched_date}</p>}

          {/* Rating */}
          <div className={isCompact ? "mt-1" : "mt-2"}>
            <StarRating
              rating={movie.user_rating}
              onRatingChange={isAdmin ? handleRatingChange : undefined}
              readOnly={!isAdmin}
              size={isCompact ? "xs" : "sm"}
            />
          </div>
        </div>

        {/* Action buttons (top right) - only for admin */}
        {isAdmin && (
          <div className="absolute top-1.5 right-1.5 flex gap-0.5">
            {/* Favorite toggle */}
            <button
              onClick={handleToggleFavorite}
              disabled={isFavoriting}
              className={cn(
                'p-1.5 rounded-full glass transition-colors disabled:opacity-50',
                movie.is_favorite 
                  ? 'text-white hover:bg-white/20' 
                  : 'text-white/80 hover:text-white'
              )}
              aria-label={movie.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart 
                size={isCompact ? 12 : 14} 
                className={movie.is_favorite ? 'fill-current' : ''} 
              />
            </button>

            {/* Delete button */}
            {onDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1.5 rounded-full glass text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                aria-label="Delete"
              >
                <Trash2 size={isCompact ? 12 : 14} />
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
