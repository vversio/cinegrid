'use client';

import { X } from 'lucide-react';
import ExpandingSelect from '@/components/ui/ExpandingSelect';
import SearchBar from '@/components/SearchBar';
import { cn } from '@/lib/utils';
import type { SortOption, MediaFilter, FilterState } from '@/hooks/useFilters';

interface FilterControlsProps {
  filterState: FilterState;
  availableGenres: string[];
  onSortChange: (sort: SortOption) => void;
  onMediaTypeChange: (mediaType: MediaFilter) => void;
  onGenreChange: (genres: string[]) => void;
  onMinRatingChange: (rating: number | null) => void;
  onSearchChange: (search: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

// Sentinel values for "clear" options
const ALL_GENRES = '__all_genres__';
const ANY_RATING = '__any_rating__';

export default function FilterControls({
  filterState,
  availableGenres,
  onSortChange,
  onMediaTypeChange,
  onGenreChange,
  onMinRatingChange,
  onSearchChange,
  onClearFilters,
  hasActiveFilters,
  className,
  layout = 'horizontal',
}: FilterControlsProps) {
  const containerClass = cn(
    layout === 'horizontal' ? 'flex items-center gap-2' : 'flex flex-col gap-2',
    className
  );

  // Convert genre filter value for Select component
  const genreValue = filterState.genres[0] || ALL_GENRES;
  
  // Convert rating filter value for Select component
  const ratingValue = filterState.minRating?.toString() || ANY_RATING;

  // Sort options
  const sortOptions = [
    { value: 'recent', label: 'Recent' },
    { value: 'title-asc', label: 'Title A-Z' },
    { value: 'title-desc', label: 'Title Z-A' },
    { value: 'rating-desc', label: 'Rating' },
    { value: 'release-date', label: 'Release Date' },
  ];

  // Media type options
  const mediaTypeOptions = [
    { value: 'all', label: 'All' },
    { value: 'movie', label: 'Movies' },
    { value: 'series', label: 'Series' },
  ];

  // Genre options
  const genreOptions = [
    { value: ALL_GENRES, label: 'All Genres' },
    ...availableGenres.map(genre => ({ value: genre, label: genre })),
  ];

  // Rating options
  const ratingOptions = [
    { value: ANY_RATING, label: 'Any' },
    { value: '1', label: '1+ Stars' },
    { value: '2', label: '2+ Stars' },
    { value: '3', label: '3+ Stars' },
    { value: '4', label: '4+ Stars' },
    { value: '5', label: '5 Stars' },
  ];

  return (
    <div className={containerClass}>
      {/* Search */}
      <SearchBar
        value={filterState.search}
        onChange={onSearchChange}
        placeholder="Search..."
        className={layout === 'vertical' ? 'w-full' : 'w-[120px]'}
      />

      {/* Sort */}
      <ExpandingSelect
        value={filterState.sort}
        onValueChange={(v) => onSortChange(v as SortOption)}
        options={sortOptions}
        placeholder="Sort"
        className={layout === 'vertical' ? 'w-full' : 'w-[90px]'}
      />

      {/* Media Type Filter */}
      <ExpandingSelect
        value={filterState.mediaType}
        onValueChange={(v) => onMediaTypeChange(v as MediaFilter)}
        options={mediaTypeOptions}
        placeholder="Type"
        className={layout === 'vertical' ? 'w-full' : 'w-[75px]'}
      />

      {/* Genre Filter */}
      {availableGenres.length > 0 && (
        <ExpandingSelect
          value={genreValue}
          onValueChange={(v) => onGenreChange(v === ALL_GENRES ? [] : [v])}
          options={genreOptions}
          placeholder="Genre"
          className={layout === 'vertical' ? 'w-full' : 'w-[90px]'}
        />
      )}

      {/* Min Rating Filter */}
      <ExpandingSelect
        value={ratingValue}
        onValueChange={(v) => onMinRatingChange(v === ANY_RATING ? null : parseInt(v, 10))}
        options={ratingOptions}
        placeholder="Rating"
        className={layout === 'vertical' ? 'w-full' : 'w-[70px]'}
      />

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className={cn(
            "flex items-center gap-1 px-2 py-1 text-xs text-filmic-rose hover:text-filmic-beige transition-colors",
            layout === 'vertical' && 'w-full justify-center'
          )}
        >
          <X size={12} />
          Clear
        </button>
      )}
    </div>
  );
}
