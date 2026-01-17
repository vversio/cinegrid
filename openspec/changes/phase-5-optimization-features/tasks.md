## 1. Setup & Dependencies

- [x] 1.1 Install `@tanstack/react-query` and `@tanstack/react-query-devtools`
- [x] 1.2 Create React Query provider wrapper component
- [x] 1.3 Configure query client with default options
- [x] 1.4 Add React Query DevTools (development only)

## 2. React Query Migration

- [x] 2.1 Create `hooks/useMovies.ts` - useQuery for movies list
- [x] 2.2 Create `hooks/useFavorites.ts` - useQuery for favorites
- [x] 2.3 Create `hooks/useMovieMutations.ts` - useMutation for add/delete/update
- [x] 2.4 Migrate `page.tsx` to use React Query hooks
- [x] 2.5 Remove manual useState/useEffect for data fetching
- [x] 2.6 Add optimistic updates for mutations

## 3. TMDB Rate Limiting

- [x] 3.1 Create rate limiter utility (`lib/tmdbRateLimiter.ts`)
- [x] 3.2 Implement request queue (40 req/10s)
- [x] 3.3 Add rate limit handling to `/api/tmdb/route.ts`
- [x] 3.4 Add error handling for rate limit exceeded
- [x] 3.5 Add Next.js caching for TMDB searches (5 min for search, 1 hour for details)

## 4. Bug Fixes - Loading States

- [x] 4.1 Fix movie addition refresh issue (use React Query invalidation)
- [x] 4.2 Add proper loading states during mutations
- [x] 4.3 Fix optimistic update race conditions
- [ ] 4.4 Test adding multiple movies in succession (USER ACTION)

## 5. Bug Fixes - Filter/Sort

- [x] 5.1 Fix filter state persistence (use React Query + URL params + startTransition)
- [x] 5.2 Fix movies disappearing after unsorting (use router.replace instead of push)
- [x] 5.3 Apply filters/sort to favorites carousel
- [ ] 5.4 Test all filter combinations (USER ACTION)
- [ ] 5.5 Test sort persistence across page navigation (USER ACTION)

## 6. Error Boundaries

- [x] 6.1 Create `components/ErrorBoundary.tsx`
- [x] 6.2 Add inline error component for API failures
- [ ] 6.3 Add component-level error boundary for analytics (future)
- [ ] 6.4 Add error boundary for movie grid (future)
- [ ] 6.5 Test error scenarios (network failures, API errors) (USER ACTION)

## 7. Movie Details Modal

- [x] 7.1 Create `components/MovieDetailsModal.tsx`
- [x] 7.2 Add TMDB API endpoint for movie details (`/api/tmdb/[id]`)
- [x] 7.3 Fetch and display overview from TMDB
- [x] 7.4 Add click handler to MovieCard to open modal
- [x] 7.5 Style modal with Filmic Grain theme
- [x] 7.6 Add loading state for details fetch

## 8. Search Within Watched Movies

- [x] 8.1 Create `components/SearchBar.tsx` component
- [x] 8.2 Add search input to filter panel
- [x] 8.3 Implement client-side search (title, genre, custom category)
- [x] 8.4 Integrate with existing filter system (URL params)
- [x] 8.5 Add debouncing for search input (300ms)
- [ ] 8.6 Highlight search results (future enhancement)

## 9. Statistics Dashboard

- [x] 9.1 Create `components/StatisticsPanel.tsx`
- [x] 9.2 Calculate total hours watched (estimate from runtime)
- [ ] 9.3 Calculate top directors (from TMDB data) - requires additional API calls
- [x] 9.4 Add statistics to analytics panel
- [x] 9.5 Style statistics cards with Filmic Grain theme
- [x] 9.6 Add loading states for statistics calculation

## 10. Code Splitting & Bundle Optimization

- [ ] 10.1 Lazy load AnalyticsPanel component (deferred - small component)
- [x] 10.2 Lazy load MovieDetailsModal
- [x] 10.3 Lazy load AddMovieModal
- [ ] 10.4 Analyze bundle size (webpack-bundle-analyzer) (USER ACTION)
- [ ] 10.5 Remove unused dependencies (future cleanup)
- [x] 10.6 Optimize image loading (Next.js Image component with priority prop)

## 11. Accessibility Improvements

- [x] 11.1 Add ARIA labels to interactive elements (MovieCard)
- [x] 11.2 Ensure keyboard navigation works (Tab, Enter for MovieCard)
- [x] 11.3 Add focus indicators (focus state on MovieCard)
- [ ] 11.4 Add screen reader text for icons (future)
- [ ] 11.5 Test with keyboard-only navigation (USER ACTION)
- [ ] 11.6 Test with screen reader (if available) (USER ACTION)

## 12. Performance Monitoring

- [ ] 12.1 Add Web Vitals tracking (Next.js built-in) (USER ACTION)
- [ ] 12.2 Add performance markers for key operations (future)
- [ ] 12.3 Monitor React Query cache hit rates (use DevTools)
- [ ] 12.4 Add console logging for slow operations (dev only) (future)

## 13. Code Cleanup & Refactoring

- [ ] 13.1 Remove unused imports and variables (future cleanup)
- [ ] 13.2 Consolidate duplicate code (future)
- [ ] 13.3 Extract common patterns into hooks/utilities (future)
- [ ] 13.4 Update TypeScript types for consistency (future)
- [ ] 13.5 Add JSDoc comments to complex functions (future)
- [ ] 13.6 Run ESLint and fix all warnings (USER ACTION)

## 14. Testing & Validation

- [ ] 14.1 Test all bug fixes (loading states, filters) (USER ACTION)
- [ ] 14.2 Test new features (details, search, stats) (USER ACTION)
- [ ] 14.3 Test error boundaries with simulated errors (USER ACTION)
- [ ] 14.4 Test performance (Lighthouse audit) (USER ACTION)
- [ ] 14.5 Test accessibility (a11y audit) (USER ACTION)
- [ ] 14.6 Test on mobile devices (USER ACTION)
- [ ] 14.7 Verify React Query DevTools works (USER ACTION)
