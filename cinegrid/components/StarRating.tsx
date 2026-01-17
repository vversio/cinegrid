'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number | null;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 14,
  md: 18,
  lg: 22,
};

export default function StarRating({
  rating,
  onRatingChange,
  readOnly = false,
  size = 'md',
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [animatingStar, setAnimatingStar] = useState<number | null>(null);

  const displayRating = hoverRating ?? rating ?? 0;
  const starSize = sizeMap[size];

  const handleClick = (starIndex: number) => {
    if (readOnly || !onRatingChange) return;
    
    setAnimatingStar(starIndex);
    onRatingChange(starIndex);
    
    // Reset animation state after animation completes
    setTimeout(() => setAnimatingStar(null), 300);
  };

  return (
    <div 
      className={cn('flex gap-0.5', className)}
      onMouseLeave={() => !readOnly && setHoverRating(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayRating;
        const isAnimating = star === animatingStar;

        return (
          <motion.button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readOnly && setHoverRating(star)}
            className={cn(
              'transition-colors focus:outline-none',
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            )}
            animate={isAnimating ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Star
              size={starSize}
              className={cn(
                'transition-colors',
                isFilled 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'fill-transparent text-filmic-rose/50'
              )}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
