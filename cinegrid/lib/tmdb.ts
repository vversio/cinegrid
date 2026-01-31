/** TMDB CDN base and size suffixes. No runtime GET/HEAD to "check" images; rely on img onLoad/onError. */
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export type TmdbImageSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';

export function getTmdbImageUrl(path: string | null | undefined, size: TmdbImageSize = 'w342'): string | null {
  if (!path || typeof path !== 'string') return null;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${TMDB_IMAGE_BASE}/${size}${clean}`;
}

export const TMDB_IMAGE_SIZES = {
  thumbnail: 'w92' as TmdbImageSize,
  poster: 'w342' as TmdbImageSize,
  backdrop: 'w780' as TmdbImageSize,
};
