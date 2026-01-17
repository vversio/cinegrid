'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Search, Loader2 } from 'lucide-react';
import type { TMDBMovie, TMDBSeries, TMDBSearchResponse, TMDBSeriesSearchResponse, MediaType } from '@/lib/types';

interface MovieSearchProps {
  onSelect: (item: TMDBMovie | TMDBSeries, mediaType: MediaType) => void;
  mediaType?: MediaType;
}

export default function MovieSearch({ onSelect, mediaType = 'movie' }: MovieSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(TMDBMovie | TMDBSeries)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchMedia = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/tmdb?query=${encodeURIComponent(query)}&type=${mediaType}`);
        if (mediaType === 'series') {
          const data: TMDBSeriesSearchResponse = await res.json();
          setResults(data.results?.slice(0, 8) || []);
        } else {
          const data: TMDBSearchResponse = await res.json();
          setResults(data.results?.slice(0, 8) || []);
        }
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchMedia, 300);
    return () => clearTimeout(debounce);
  }, [query, mediaType]);

  const handleSelect = (item: TMDBMovie | TMDBSeries) => {
    onSelect(item, mediaType);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-filmic-rose" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder={`Search for a ${mediaType}...`}
          className="w-full pl-10 pr-10 py-3 rounded-lg border border-glass-border bg-filmic-seduction/15 text-filmic-beige placeholder:text-filmic-rose/50 focus:outline-none focus:ring-2 focus:ring-filmic-lavender"
        />
        {isLoading && (
          <Loader2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-filmic-lavender animate-spin" />
        )}
      </div>
      
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-filmic-charcoal-light border border-glass-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((item) => {
            const title = 'title' in item ? item.title : item.name;
            const date = 'release_date' in item ? item.release_date : item.first_air_date;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full flex items-center gap-3 p-3 hover:bg-filmic-seduction/30 transition-colors text-left border-b border-glass-border/30 last:border-b-0"
              >
                {item.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                    alt={title}
                    width={46}
                    height={69}
                    className="rounded object-cover"
                  />
                ) : (
                  <div className="w-[46px] h-[69px] bg-filmic-seduction/20 rounded flex items-center justify-center text-xs text-filmic-rose">
                    No img
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-filmic-beige truncate">{title}</p>
                  <p className="text-sm text-filmic-rose">
                    {date ? date.split('-')[0] : 'Unknown year'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
