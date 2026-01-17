'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import type { WatchedMovie } from '@/lib/types';

interface FavoritesCarouselProps {
  favorites: WatchedMovie[];
  isAdmin?: boolean;
  isLoading?: boolean;
  onToggleFavorite?: (id: string) => void;
  onRatingChange?: (id: string, rating: number) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (movie: WatchedMovie) => void;
}

export default function FavoritesCarousel({
  favorites,
  isAdmin = false,
  isLoading = false,
  onToggleFavorite,
  onRatingChange,
  onDelete,
  onViewDetails,
}: FavoritesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 260; // card width + gap
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Star size={18} className="text-filmic-lavender" />
          <h2 className="h2">Favorites</h2>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[240px] h-[360px] flex-shrink-0 shimmer rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (favorites.length === 0) {
    return (
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Star size={18} className="text-filmic-lavender" />
          <h2 className="h2">Favorites</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-[240px] h-[360px] flex flex-col items-center justify-center glass rounded-lg border border-dashed border-filmic-seduction/20"
        >
          <Star size={32} className="text-filmic-lavender/50 mb-3" />
          <p className="text-filmic-rose text-sm text-center px-4">
            Add your first favorite
          </p>
          <p className="text-filmic-rose/60 text-xs text-center px-4 mt-1">
            Click the heart on any movie or series
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mb-10 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star size={18} className="text-filmic-lavender" />
          <h2 className="h2">Favorites</h2>
          <span className="text-xs text-filmic-rose ml-2">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Scroll buttons (desktop only) */}
        {favorites.length > 4 && (
          <div className="hidden lg:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full glass hover:bg-filmic-seduction/30 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} className="text-filmic-beige" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full glass hover:bg-filmic-seduction/30 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} className="text-filmic-beige" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {favorites.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="snap-start"
          >
            <MovieCard
              movie={movie}
              variant="hero"
              isAdmin={isAdmin}
              onToggleFavorite={onToggleFavorite}
              onRatingChange={onRatingChange}
              onDelete={onDelete}
              onViewDetails={onViewDetails}
              priority={index < 3}
            />
          </motion.div>
        ))}
      </div>

      {/* Fade edges for scroll indication */}
      <div className="absolute top-[52px] left-0 w-8 h-[360px] bg-gradient-to-r from-filmic-charcoal to-transparent pointer-events-none lg:hidden" />
      <div className="absolute top-[52px] right-0 w-8 h-[360px] bg-gradient-to-l from-filmic-charcoal to-transparent pointer-events-none lg:hidden" />
    </div>
  );
}
