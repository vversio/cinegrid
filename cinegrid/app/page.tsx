'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Plus } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import type { WatchedMovie } from '@/lib/types';
import type { User } from '@supabase/supabase-js';

import BackgroundEffect from '@/components/ui/BackgroundEffect';
import Header from '@/components/ui/Header';
import AnalyticsPanel from '@/components/ui/AnalyticsPanel';
import MobileAnalyticsDrawer, { AnalyticsFAB } from '@/components/ui/MobileAnalyticsDrawer';
import FilterControls from '@/components/ui/FilterControls';
import FavoritesCarousel from '@/components/FavoritesCarousel';
import MovieCard from '@/components/MovieCard';

// Lazy load heavy analytics components (recharts is ~50KB)
const GenreTrendChart = dynamic(() => import('@/components/GenreTrendChart'), {
  loading: () => <div className="h-[300px] shimmer rounded-lg" />,
  ssr: false,
});
const StatisticsPanel = dynamic(() => import('@/components/StatisticsPanel'), {
  loading: () => <div className="h-[150px] shimmer rounded-lg" />,
  ssr: false,
});
import { useFilters, applyFilters, getUniqueGenres } from '@/hooks/useFilters';
import { useMovies, useFavorites } from '@/hooks/useMovies';
import { useAddMovie, useDeleteMovie, useToggleFavorite, useUpdateRating } from '@/hooks/useMovieMutations';

// Lazy load modals for better initial page load
const AddMovieModal = dynamic(() => import('@/components/AddMovieModal'), {
  loading: () => null,
});
const MovieDetailsModal = dynamic(() => import('@/components/MovieDetailsModal'), {
  loading: () => null,
});

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || '';

function HomeContent() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileAnalyticsOpen, setMobileAnalyticsOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<WatchedMovie | null>(null);

  const { filterState, updateFilters, clearFilters, hasActiveFilters } = useFilters();

  // React Query hooks
  const { data: movies = [], isLoading: moviesLoading, error: moviesError } = useMovies();
  const { data: favorites = [], isLoading: favoritesLoading } = useFavorites();
  const addMovieMutation = useAddMovie();
  const deleteMovieMutation = useDeleteMovie();
  const toggleFavoriteMutation = useToggleFavorite();
  const updateRatingMutation = useUpdateRating();

  const isLoading = moviesLoading || favoritesLoading;

  // User management
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsAdminUser(user?.email === ADMIN_EMAIL);
    };
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null;
      setUser(user);
      setIsAdminUser(user?.email === ADMIN_EMAIL);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthChange = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setIsAdminUser(user?.email === ADMIN_EMAIL);
  };

  // Mutation handlers - memoized to prevent child re-renders
  const handleMovieAdded = useCallback(() => {
    setIsModalOpen(false);
    toast.success('Added to your collection');
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteMovieMutation.mutateAsync(id);
      toast.success('Removed from collection');
    } catch {
      toast.error('Failed to delete');
    }
  }, [deleteMovieMutation]);

  const handleToggleFavorite = useCallback(async (id: string) => {
    try {
      const result = await toggleFavoriteMutation.mutateAsync(id);
      toast.success(result ? 'Added to favorites' : 'Removed from favorites');
    } catch {
      toast.error('Failed to update favorite');
    }
  }, [toggleFavoriteMutation]);

  const handleRatingChange = useCallback(async (id: string, rating: number) => {
    try {
      await updateRatingMutation.mutateAsync({ id, rating });
      toast.success('Rating updated');
    } catch {
      toast.error('Failed to update rating');
    }
  }, [updateRatingMutation]);

  // Apply filters and sorting - also to favorites
  const filteredMovies = useMemo(() => {
    return applyFilters(movies, filterState);
  }, [movies, filterState]);

  const filteredFavorites = useMemo(() => {
    return applyFilters(favorites, filterState);
  }, [favorites, filterState]);

  const availableGenres = useMemo(() => {
    return getUniqueGenres(movies);
  }, [movies]);

  // Filter controls - memoized to prevent re-creation on every render
  const navbarFilterControls = useMemo(() => (
    <FilterControls
      filterState={filterState}
      availableGenres={availableGenres}
      onSortChange={(sort) => updateFilters({ sort })}
      onMediaTypeChange={(mediaType) => updateFilters({ mediaType })}
      onGenreChange={(genres) => updateFilters({ genres })}
      onMinRatingChange={(minRating) => updateFilters({ minRating })}
      onSearchChange={(search) => updateFilters({ search })}
      onClearFilters={clearFilters}
      hasActiveFilters={hasActiveFilters}
      layout="horizontal"
    />
  ), [filterState, availableGenres, updateFilters, clearFilters, hasActiveFilters]);

  const mobileFilterControls = useMemo(() => (
    <FilterControls
      filterState={filterState}
      availableGenres={availableGenres}
      onSortChange={(sort) => updateFilters({ sort })}
      onMediaTypeChange={(mediaType) => updateFilters({ mediaType })}
      onGenreChange={(genres) => updateFilters({ genres })}
      onMinRatingChange={(minRating) => updateFilters({ minRating })}
      onSearchChange={(search) => updateFilters({ search })}
      onClearFilters={clearFilters}
      hasActiveFilters={hasActiveFilters}
      layout="vertical"
    />
  ), [filterState, availableGenres, updateFilters, clearFilters, hasActiveFilters]);

  // Analytics content for sidebar
  const analyticsContent = (
    <div className="space-y-4">
      <StatisticsPanel movies={movies} isLoading={isLoading} />
      <GenreTrendChart movies={movies} isLoading={isLoading} />
    </div>
  );

  // Main content (favorites + grid)
  const mainContent = (
    <div className="p-3 lg:p-4">
      {/* Favorites Carousel - now with filters applied */}
      <FavoritesCarousel
        favorites={filteredFavorites}
        isAdmin={isAdminUser}
        isLoading={isLoading}
        onToggleFavorite={isAdminUser ? handleToggleFavorite : undefined}
        onRatingChange={isAdminUser ? handleRatingChange : undefined}
        onDelete={isAdminUser ? handleDelete : undefined}
        onViewDetails={setSelectedMovie}
      />

      {/* Movie Grid */}
        <div 
          className="rounded-xl p-4"
          style={{
            background: 'rgba(20, 20, 20, 0.35)',
          }}
        >
        {/* Grid header with count */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-text-primary">
            {hasActiveFilters ? 'Filtered Results' : 'Recently Added'}
            <span className="text-xs text-text-secondary ml-2 font-normal">
              {filteredMovies.length} {filteredMovies.length === 1 ? 'item' : 'items'}
            </span>
          </h2>
        </div>

        {/* Grid */}
        {moviesError ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-red-400 text-sm">Failed to load movies. Please refresh the page.</p>
          </div>
        ) : filteredMovies.length > 0 ? (
          /* PERF: Removed staggered motion.div wrappers - they caused 100+ concurrent animations */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {filteredMovies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isAdmin={isAdminUser}
                onDelete={isAdminUser ? handleDelete : undefined}
                onToggleFavorite={isAdminUser ? handleToggleFavorite : undefined}
                onRatingChange={isAdminUser ? handleRatingChange : undefined}
                onViewDetails={setSelectedMovie}
                priority={index < 8}
                variant="compact"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-bg-tertiary/50 flex items-center justify-center mb-3">
              <span className="text-lg opacity-50">[ ]</span>
            </div>
            <p className="text-text-secondary text-sm">
              {hasActiveFilters ? 'No movies match your filters' : 'No movies or series yet'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-3 px-3 py-1.5 text-xs text-text-primary hover:text-text-primary transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col text-text-primary relative overflow-hidden">
      <BackgroundEffect />
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#1a1a1a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
          },
        }}
      />

      {/* Header - top of the encapsulated frame */}
      <Header
        user={user}
        onAuthChange={handleAuthChange}
        onOpenAnalytics={() => setMobileAnalyticsOpen(true)}
        showAnalyticsButton={true}
        filterControls={mobileFilterControls}
        navbarFilterControls={navbarFilterControls}
      />

      {/* Main layout with analytics sidebar */}
      <main className="flex-1 relative z-10 overflow-hidden">
        {isLoading ? (
          <div className="h-full px-3 pb-3">
            <div 
              className="h-full rounded-b-2xl flex items-center justify-center"
              style={{ background: 'rgba(20, 20, 20, 0.7)' }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-text-primary/30 border-t-text-primary animate-spin" />
                <p className="text-text-secondary text-sm">Loading your collection...</p>
              </div>
            </div>
          </div>
        ) : (
          <AnalyticsPanel
            mainContent={mainContent}
          >
            {analyticsContent}
          </AnalyticsPanel>
        )}

        {/* Mobile Analytics Drawer */}
        <MobileAnalyticsDrawer
          open={mobileAnalyticsOpen}
          onOpenChange={setMobileAnalyticsOpen}
        >
          {analyticsContent}
        </MobileAnalyticsDrawer>

        {/* Mobile Analytics FAB - only on smaller screens */}
        <div className="lg:hidden">
          <AnalyticsFAB onClick={() => setMobileAnalyticsOpen(true)} />
        </div>
      </main>

      {/* Floating add button - only show for admin */}
      {isAdminUser && (
        <>
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full glass border border-border-subtle flex items-center justify-center z-30 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
            aria-label="Add movie or series"
          >
            <Plus size={20} className="text-text-primary" />
          </button>

          <AddMovieModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onMovieAdded={handleMovieAdded}
            mutation={addMovieMutation}
          />
        </>
      )}

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
        isAdmin={isAdminUser}
        onRatingChange={isAdminUser ? handleRatingChange : undefined}
      />
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-text-primary border-t-transparent animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
