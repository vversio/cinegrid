'use client';

import { useState, memo } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number | null;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 20,
};

/**
 * PERFORMANCE OPTIMIZED:
 * - Removed framer-motion (was creating 5 motion.button per card = 500+ for 100 movies)
 * - Uses CSS transitions instead
 * - Wrapped in React.memo
 */
const StarRating = memo(function StarRating({
  rating,
  onRatingChange,
  readOnly = false,
  size = 'md',
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const displayRating = hoverRating ?? rating ?? 0;
  const starSize = sizeMap[size];

  const handleClick = (starIndex: number) => {
    if (readOnly || !onRatingChange) return;
    onRatingChange(starIndex);
  };

  return (
    <div 
      className={cn('flex gap-0.5', className)}
      onMouseLeave={() => !readOnly && setHoverRating(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayRating;

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readOnly && setHoverRating(star)}
            className={cn(
              'transition-transform duration-150 focus:outline-none',
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            )}
          >
            <Star
              size={starSize}
              className={cn(
                'transition-colors duration-150',
                isFilled 
                  ? 'fill-white text-white' 
                  : 'fill-transparent text-text-muted'
              )}
            />
          </button>
        );
      })}
    </div>
  );
});

export default StarRating;
