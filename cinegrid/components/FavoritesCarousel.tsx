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
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-[140px] h-[210px] mx-auto flex flex-col items-center justify-center glass rounded-lg border border-dashed border-border-subtle"
        >
          <Star size={24} className="text-text-muted mb-2" />
          <p className="text-text-secondary text-xs text-center px-3">
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
      <div className="flex items-center justify-between mb-0 relative z-0 px-2">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Star size={14} className="text-text-primary" />
          <h2 className="text-sm font-semibold text-text-primary">Favorites</h2>
          <span className="text-xs text-text-secondary">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
          </span>
        </motion.div>

        {/* Scroll buttons */}
        {favorites.length > 1 && (
          <motion.div 
            className="flex gap-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.button
              onClick={() => scroll('left')}
              className="p-2 rounded-xl transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
              }}
              whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous"
            >
              <ChevronLeft size={16} className="text-text-primary" />
            </motion.button>
            <motion.button
              onClick={() => scroll('right')}
              className="p-2 rounded-xl transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
              }}
              whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next"
            >
              <ChevronRight size={16} className="text-text-primary" />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Carousel - centered, with generous padding to prevent shadow clipping */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-visible py-10 px-4 scrollbar-hide justify-center relative z-10"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          // Allow shadows to spill over (might conflict with scroll, but better for visual)
          maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        }}
      >
        <AnimatePresence mode="popLayout">
          {favorites.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ 
                opacity: 1, 
                // Lessen highlighting: reduced scale diff
                scale: index === activeIndex ? 1.0 : 0.9,
                y: index === activeIndex ? 0 : 5,
                // Lessen highlighting: reduced brightness diff
                filter: index === activeIndex ? 'brightness(1)' : 'brightness(0.6)',
                zIndex: index === activeIndex ? 10 : 0,
              }}
              whileHover={{ 
                zIndex: 50,
                scale: 1.05,
                filter: 'brightness(1)',
                transition: { duration: 0.2 }
              }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="flex-shrink-0 cursor-pointer relative"
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
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Carousel indicators with smooth animation */}
      {favorites.length > 1 && (
        <motion.div 
          className="flex justify-center gap-1.5 mt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {favorites.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveIndex(index)}
              className="h-1.5 rounded-full transition-all duration-300"
              animate={{
                width: index === activeIndex ? 20 : 6,
                backgroundColor: index === activeIndex ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)',
              }}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
