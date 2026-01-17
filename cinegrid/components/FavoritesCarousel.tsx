'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
          <Star size={14} className="text-filmic-lavender" />
          <h2 className="text-sm font-semibold text-filmic-beige">Favorites</h2>
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
          <Star size={14} className="text-filmic-lavender" />
          <h2 className="text-sm font-semibold text-filmic-beige">Favorites</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-[140px] h-[210px] mx-auto flex flex-col items-center justify-center glass rounded-lg border border-dashed border-filmic-seduction/20"
        >
          <Star size={24} className="text-filmic-lavender/50 mb-2" />
          <p className="text-filmic-rose text-xs text-center px-3">
            Add your first favorite
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="mb-6 relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header - lower z-index so hovered cards appear on top */}
      <div className="flex items-center justify-between mb-3 relative z-0">
        <div className="flex items-center gap-2">
          <Star size={14} className="text-filmic-lavender" />
          <h2 className="text-sm font-semibold text-filmic-beige">Favorites</h2>
          <span className="text-xs text-filmic-rose">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Scroll buttons */}
        {favorites.length > 1 && (
          <div className="flex gap-1">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-full glass hover:bg-filmic-seduction/30 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={14} className="text-filmic-beige" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-full glass hover:bg-filmic-seduction/30 transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={14} className="text-filmic-beige" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel - centered, higher z-index for hover effects */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide justify-center relative z-10"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <AnimatePresence mode="popLayout">
          {favorites.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: index === activeIndex ? 1.05 : 0.95,
                filter: index === activeIndex ? 'brightness(1)' : 'brightness(0.7)',
                zIndex: index === activeIndex ? 20 : 1,
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 cursor-pointer"
              onClick={() => setActiveIndex(index)}
            >
              <MovieCard
                movie={movie}
                variant="compact"
                isAdmin={isAdmin}
                onToggleFavorite={onToggleFavorite}
                onRatingChange={onRatingChange}
                onDelete={onDelete}
                onViewDetails={onViewDetails}
                priority={index < 5}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Carousel indicators */}
      {favorites.length > 1 && (
        <div className="flex justify-center gap-1 mt-2">
          {favorites.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === activeIndex 
                  ? 'bg-filmic-lavender w-4' 
                  : 'bg-filmic-seduction/50 hover:bg-filmic-seduction'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
