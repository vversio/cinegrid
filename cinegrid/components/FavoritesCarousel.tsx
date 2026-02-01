'use client';

import { useRef, useEffect, useState, memo } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import type { WatchedMovie } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FavoritesCarouselProps {
  favorites: WatchedMovie[];
  isAdmin?: boolean;
  isLoading?: boolean;
  onToggleFavorite?: (id: string) => void;
  onRatingChange?: (id: string, rating: number) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (movie: WatchedMovie) => void;
}

/**
 * PERFORMANCE OPTIMIZED:
 * - Removed AnimatePresence (expensive layout calculations)
 * - Removed motion.div wrappers with animate props
 * - Uses CSS transitions instead
 * - Wrapped in React.memo
 */
const FavoritesCarousel = memo(function FavoritesCarousel({
  favorites,
  isAdmin = false,
  isLoading = false,
  onToggleFavorite,
  onRatingChange,
  onDelete,
  onViewDetails,
}: FavoritesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll carousel
  useEffect(() => {
    if (favorites.length <= 1 || isPaused) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % favorites.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [favorites.length, isPaused]);

  // Scroll to active item
  useEffect(() => {
    if (!scrollRef.current || favorites.length === 0) return;
    
    const container = scrollRef.current;
    const cardWidth = 160; // card width + gap
    const containerWidth = container.clientWidth;
    const scrollPosition = (activeIndex * cardWidth) - (containerWidth / 2) + (cardWidth / 2);
    
    container.scrollTo({
      left: Math.max(0, scrollPosition),
      behavior: 'smooth',
    });
  }, [activeIndex, favorites.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setActiveIndex((prev) => (prev - 1 + favorites.length) % favorites.length);
    } else {
      setActiveIndex((prev) => (prev + 1) % favorites.length);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Star size={14} className="text-text-primary" />
          <h2 className="text-sm font-semibold text-text-primary">Favorites</h2>
        </div>
        <div className="flex justify-center gap-3 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[140px] h-[210px] flex-shrink-0 shimmer rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (favorites.length === 0) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Star size={14} className="text-text-primary" />
          <h2 className="text-sm font-semibold text-text-primary">Favorites</h2>
        </div>
        <div className="w-[140px] h-[210px] mx-auto flex flex-col items-center justify-center glass rounded-lg border border-dashed border-border-subtle">
          <Star size={24} className="text-text-muted mb-2" />
          <p className="text-text-secondary text-xs text-center px-3">
            Add your first favorite
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="mb-6 relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-0 relative z-0 px-2">
        <div className="flex items-center gap-2">
          <Star size={14} className="text-text-primary" />
          <h2 className="text-sm font-semibold text-text-primary">Favorites</h2>
          <span className="text-xs text-text-secondary">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Scroll buttons */}
        {favorites.length > 1 && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-xl transition-colors duration-200 bg-white/5 hover:bg-white/10"
              aria-label="Previous"
            >
              <ChevronLeft size={16} className="text-text-primary" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-xl transition-colors duration-200 bg-white/5 hover:bg-white/10"
              aria-label="Next"
            >
              <ChevronRight size={16} className="text-text-primary" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel - CSS transitions instead of AnimatePresence */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto py-10 px-4 scrollbar-hide justify-center relative z-10"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        }}
      >
        {favorites.map((movie, index) => (
          <div
            key={movie.id}
            className={cn(
              "flex-shrink-0 cursor-pointer relative transition-all duration-300",
              index === activeIndex ? "scale-100 brightness-100 z-10" : "scale-90 brightness-75 z-0",
              "hover:scale-105 hover:brightness-100 hover:z-50"
            )}
            onClick={() => setActiveIndex(index)}
          >
            <MovieCard
              movie={movie}
              variant="hero"
              isAdmin={isAdmin}
              onToggleFavorite={onToggleFavorite}
              onRatingChange={onRatingChange}
              onDelete={onDelete}
              onViewDetails={onViewDetails}
              priority={index < 5}
            />
          </div>
        ))}
      </div>

      {/* Carousel indicators - CSS only */}
      {favorites.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {favorites.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 hover:bg-white/60",
                index === activeIndex ? "w-5 bg-white/90" : "w-1.5 bg-white/30"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default FavoritesCarousel;
