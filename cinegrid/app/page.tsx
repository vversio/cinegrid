'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import type { WatchedMovie } from '@/lib/types';
import type { User } from '@supabase/supabase-js';

import BackgroundEffect from '@/components/ui/BackgroundEffect';
import Header from '@/components/ui/Header';
import AnalyticsPanel from '@/components/ui/AnalyticsPanel';
import MobileAnalyticsDrawer, { AnalyticsFAB } from '@/components/ui/MobileAnalyticsDrawer';
import FilterControls from '@/components/ui/FilterControls';
import GenreTrendChart from '@/components/GenreTrendChart';
import StatisticsPanel from '@/components/StatisticsPanel';
import FavoritesCarousel from '@/components/FavoritesCarousel';
import MovieCard from '@/components/MovieCard';
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

  // Mutation handlers
  const handleMovieAdded = async () => {
    setIsModalOpen(false);
    toast.success('Added to your collection');
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMovieMutation.mutateAsync(id);
      toast.success('Removed from collection');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      const result = await toggleFavoriteMutation.mutateAsync(id);
      toast.success(result ? 'Added to favorites' : 'Removed from favorites');
    } catch {
      toast.error('Failed to update favorite');
    }
  };

  const handleRatingChange = async (id: string, rating: number) => {
    try {
      await updateRatingMutation.mutateAsync({ id, rating });
      toast.success('Rating updated');
    } catch {
      toast.error('Failed to update rating');
    }
  };

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

  // Filter controls component - vertical layout for sidebar
  const filterControls = (
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
  );

  // Analytics content
  const analyticsContent = (
    <div className="space-y-6">
      <GenreTrendChart movies={movies} isLoading={isLoading} />
      <StatisticsPanel movies={movies} isLoading={isLoading} />
    </div>
  );

  // Main content (favorites + grid)
  const mainContent = (
    <div className="p-4 lg:p-6">
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
      <div>
        {/* Grid header with count */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="h2">
            {hasActiveFilters ? 'Filtered Results' : 'Recently Added'}
            <span className="text-xs text-filmic-rose ml-2 font-normal">
              {filteredMovies.length} {filteredMovies.length === 1 ? 'item' : 'items'}
            </span>
          </h2>
        </div>

        {/* Grid */}
        {moviesError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-red-400">Failed to load movies. Please refresh the page.</p>
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-6">
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                <MovieCard
                  movie={movie}
                  isAdmin={isAdminUser}
                  onDelete={isAdminUser ? handleDelete : undefined}
                  onToggleFavorite={isAdminUser ? handleToggleFavorite : undefined}
                  onRatingChange={isAdminUser ? handleRatingChange : undefined}
                  onViewDetails={setSelectedMovie}
                  priority={index < 6}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-filmic-seduction/20 flex items-center justify-center mb-4">
              <span className="text-2xl opacity-50">[ ]</span>
            </div>
            <p className="text-filmic-rose">
              {hasActiveFilters ? 'No movies match your filters' : 'No movies or series yet'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 text-sm text-filmic-lavender hover:text-filmic-beige transition-colors"
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
    <div className="min-h-screen text-filmic-beige relative">
      <BackgroundEffect />
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'rgba(10, 12, 18, 0.95)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            color: '#f0e6ff',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)',
          },
        }}
      />

      {/* Header */}
      <Header
        user={user}
        onAuthChange={handleAuthChange}
        onOpenAnalytics={() => setMobileAnalyticsOpen(true)}
        showAnalyticsButton={true}
      />

      {/* Main layout */}
      <main className="h-[calc(100vh-56px)] relative z-10">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-filmic-lavender border-t-transparent animate-spin" />
              <p className="text-filmic-rose">Loading your collection...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop: Side-by-side layout with analytics panel */}
            <div className="hidden lg:block h-full">
              <AnalyticsPanel mainContent={mainContent} filterControls={filterControls}>
                {analyticsContent}
              </AnalyticsPanel>
            </div>

            {/* Mobile/Tablet: Just main content, analytics in drawer */}
            <div className="lg:hidden h-full overflow-y-auto">
              {mainContent}
            </div>

            {/* Mobile Analytics Drawer */}
            <MobileAnalyticsDrawer
              open={mobileAnalyticsOpen}
              onOpenChange={setMobileAnalyticsOpen}
            >
              {analyticsContent}
            </MobileAnalyticsDrawer>

            {/* Mobile Analytics FAB */}
            <AnalyticsFAB onClick={() => setMobileAnalyticsOpen(true)} />
          </>
        )}
      </main>

      {/* Floating add button - only show for admin */}
      {isAdminUser && (
        <>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-8 right-8 w-14 h-14 rounded-full glass neon-glow-blue flex items-center justify-center z-30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Add movie or series"
          >
            <Plus size={24} className="text-filmic-lavender" />
          </motion.button>

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
      />
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-filmic-lavender border-t-transparent animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
