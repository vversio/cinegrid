'use client';

import { useEffect, useState, useRef, memo } from 'react';
import { Star } from 'lucide-react';
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

/**
 * 3D Coverflow Carousel
 * - Cards spread horizontally with perspective tilt (like the original coverflow)
 * - Continuous rotation model for smooth dragging & auto-scroll
 * - Draggable via pointer events with snap-to-item on release
 * - Click any visible card to bring it to front
 * - Auto-rotates every 2.5s, pauses on hover
 * - No indicators
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
  // Continuous rotation angle (degrees) drives the whole carousel
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [containerWidth, setContainerWidth] = useState(900);

  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const hasDragged = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const count = favorites.length;
  const angleStep = count > 0 ? 360 / count : 0;

  // Fractional "which item is at front" derived from the continuous rotation
  const effectiveIndex = count > 0 ? -rotation / angleStep : 0;

  // Measure container so cards can fill the available width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Auto-rotate ────────────────────────────────────────────────
  useEffect(() => {
    if (count <= 1 || isPaused || isDragging) return;

    const interval = setInterval(() => {
      setRotation((prev) => prev - angleStep);
    }, 2500);

    return () => clearInterval(interval);
  }, [count, isPaused, isDragging, angleStep]);

  // ── Pointer / drag handlers ────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartRotation.current = rotation;
    hasDragged.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX.current;
    if (Math.abs(deltaX) > 5) hasDragged.current = true;
    setRotation(dragStartRotation.current + deltaX * 0.3);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Snap to nearest card position
    if (angleStep > 0) {
      setRotation((prev) => Math.round(prev / angleStep) * angleStep);
    }
  };

  // Click a side card to bring it to front (shortest-path rotation)
  const handleCardClick = (index: number) => {
    if (hasDragged.current) return;
    const targetRot = -index * angleStep;
    const diff = targetRot - rotation;
    // Normalise to [-180, 180] so the drum takes the short way round
    const normalised = ((diff % 360) + 540) % 360 - 180;
    setRotation(rotation + normalised);
  };

  // ── Loading skeleton ───────────────────────────────────────────
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

  // ── Empty state ────────────────────────────────────────────────
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

  // ── Main render ────────────────────────────────────────────────
  return (
    <div
      className="mb-6 relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-0 px-2">
        <Star size={14} className="text-text-primary" />
        <h2 className="text-sm font-semibold text-text-primary">Favorites</h2>
        <span className="text-xs text-text-secondary">
          {count} {count === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* 3D Coverflow — spread layout with perspective tilt */}
      <div
        ref={containerRef}
        className="relative overflow-hidden select-none"
        style={{
          perspective: '1000px',
          perspectiveOrigin: '50% 50%',
          height: '340px',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
        // Eat click events that follow a drag so MovieCard doesn't open details
        onClickCapture={(e) => {
          if (hasDragged.current) {
            e.stopPropagation();
            e.preventDefault();
            hasDragged.current = false;
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {(() => {
          // ── Row-aware layout ──
          // Figure out how many full card slots fit, then space them evenly.
          const cardWidth = 190;                           // hero variant width
          const gap = 24;                                  // min gap between cards
          const slotWidth = cardWidth + gap;
          const totalSlots = Math.max(1, Math.floor(containerWidth / slotWidth));
          // Always odd so there is a centred highlight card
          const visibleCount = totalSlots % 2 === 0 ? totalSlots - 1 : totalSlots;
          const maxVisible = Math.floor(visibleCount / 2);
          // Centre-to-centre distance between adjacent cards
          const spacing = containerWidth / (visibleCount || 1);

          return favorites.map((movie, index) => {
            // Offset from the "front" position (fractional while dragging)
            let offset = index - effectiveIndex;
            // Wrap to shortest-path range [-count/2, count/2)
            if (count > 1) {
              offset = ((offset % count) + count + count / 2) % count - count / 2;
            }

            const absOffset = Math.abs(offset);
            const visible = absOffset <= maxVisible + 0.5;

            // ── Geometry ──
            const tiltY = offset * 35;                                     // outward-right tilt
            const translateX = offset * spacing;                           // even row spread
            const translateZ = -absOffset * 30;                            // subtle depth
            const scale = Math.max(0.88, 1 - absOffset * 0.04);           // nearly uniform size
            const opacity = visible ? Math.max(0.35, 1 - absOffset * 0.2) : 0;
            const zIndex = 100 - Math.round(absOffset);

            return (
              <div
                key={movie.id}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translateX(calc(-50% + ${translateX}px)) translateY(-50%) rotateY(${tiltY}deg) translateZ(${translateZ}px) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: isDragging
                    ? 'none'
                    : 'transform 0.4s ease-out, opacity 0.4s ease-out',
                  pointerEvents: visible ? 'auto' : 'none',
                }}
                onClick={() => handleCardClick(index)}
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
            );
          });
        })()}
      </div>
    </div>
  );
});

export default FavoritesCarousel;
