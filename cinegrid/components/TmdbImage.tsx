'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Film, Tv } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTmdbImageUrl, type TmdbImageSize } from '@/lib/tmdb';

type TmdbImageVariant = 'thumbnail' | 'poster' | 'backdrop';

const VARIANT_SIZE: Record<TmdbImageVariant, TmdbImageSize> = {
  thumbnail: 'w92',
  poster: 'w342',
  backdrop: 'w780',
};

const DEFAULT_SIZES: Record<TmdbImageVariant, string> = {
  thumbnail: '46px',
  poster: '(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 14vw',
  backdrop: '100vw',
};

export interface TmdbImageProps {
  /** TMDB path (e.g. "/abc.jpg"). Null/empty renders fallback only. */
  path: string | null | undefined;
  alt: string;
  variant?: TmdbImageVariant;
  /** Override sizes for responsive srcset. */
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  /** For poster variant, show Film icon when no path or on error. */
  mediaType?: 'movie' | 'series';
  /** Custom fallback when path is missing or image fails (no extra GET to "check"). */
  fallback?: React.ReactNode;
}

/**
 * Renders a TMDB image with client-side load/error handling. No separate GET or HEAD
 * is used to "check" availability; the single image request either succeeds (onLoad)
 * or fails (onError), and we show placeholder/fallback accordingly.
 */
export default function TmdbImage({
  path,
  alt,
  variant = 'poster',
  sizes,
  priority = false,
  fill = false,
  width,
  height,
  className,
  mediaType = 'movie',
  fallback,
}: TmdbImageProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const src = getTmdbImageUrl(path, VARIANT_SIZE[variant]);

  const showFallback = !src || status === 'error';
  const defaultFallback = (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-bg-tertiary/50 text-text-muted',
        className
      )}
      aria-hidden
    >
      {mediaType === 'series' ? (
        <Tv size={variant === 'thumbnail' ? 20 : 28} className="opacity-50 mb-1" />
      ) : (
        <Film size={variant === 'thumbnail' ? 20 : 28} className="opacity-50 mb-1" />
      )}
      <span className={cn('text-center line-clamp-2', variant === 'thumbnail' ? 'text-[10px]' : 'text-xs')}>
        {alt || 'No image'}
      </span>
    </div>
  );

  if (showFallback) {
    const wrapperStyle = !fill && width != null && height != null ? { width, height } : undefined;
    return (
      <div
        className={cn('relative overflow-hidden', fill && 'absolute inset-0', className)}
        style={wrapperStyle}
      >
        {fallback ?? defaultFallback}
      </div>
    );
  }

  const resolvedSizes = sizes ?? DEFAULT_SIZES[variant];

  const isLoading = status === 'idle';

  return (
    <div className={cn('relative overflow-hidden', fill && 'absolute inset-0', isLoading && 'shimmer')}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={resolvedSizes}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        className={cn('object-cover', className)}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
    </div>
  );
}
