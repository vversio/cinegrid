'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { deleteWatchedMovie } from '@/lib/database';
import type { WatchedMovie } from '@/lib/types';

interface MovieGridProps {
  movies: WatchedMovie[];
  onMovieDeleted?: () => void;
}

export default function MovieGrid({ movies, onMovieDeleted }: MovieGridProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!onMovieDeleted) return; // Only allow delete if callback provided (admin)
    if (!confirm('Remove this from your watched list?')) return;
    
    setDeletingId(id);
    try {
      await deleteWatchedMovie(id);
      onMovieDeleted();
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4 opacity-20">[ ]</div>
        <p className="text-zinc-500 dark:text-zinc-400">No movies or series yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800"
        >
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm p-2 text-center">
              {movie.title}
            </div>
          )}
          
          {/* Media type badge */}
          {movie.media_type === 'series' && (
            <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-blue-500/90 backdrop-blur-sm rounded text-white">
              Series
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              {movie.custom_category && (
                <span className="inline-block px-2 py-1 mb-2 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full text-white">
                  {movie.custom_category}
                </span>
              )}
              <p className="text-white text-sm font-medium truncate">{movie.title}</p>
              <p className="text-white/70 text-xs">{movie.genre}</p>
              <p className="text-white/50 text-xs">{movie.watched_date}</p>
            </div>
            
            {/* Delete button - only show if onDelete provided (admin) */}
            {onMovieDeleted && (
              <button
                onClick={() => handleDelete(movie.id)}
                disabled={deletingId === movie.id}
                className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white/80 hover:text-red-400 hover:bg-black/70 transition-colors disabled:opacity-50"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
