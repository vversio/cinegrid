## Why
Phase 4 is complete with analytics, favorites, and ratings. Phase 5 focuses on optimization, bug fixes, and essential features to make the application production-ready. This includes performance improvements, fixing loading state issues, adding error boundaries, and implementing requested features like movie details modal and search.

## What Changes
- **Performance & Caching**:
  - Implement React Query for client-side data caching and state management
  - Add TMDB API rate limit handling with request throttling
  - Optimize bundle size (code splitting, lazy loading)
- **Bug Fixes**:
  - Fix loading states when adding movies (refresh issue)
  - Fix filter/sort persistence (movies disappearing after unsorting)
  - Apply filters/sort to favorites carousel
- **New Features**:
  - Movie details modal (TMDB overview only)
  - Search within watched movies
  - Statistics dashboard (total hours, top directors, etc.)
- **Production Readiness**:
  - Error boundaries for graceful error handling
  - Performance monitoring setup
  - Code cleanup and refactoring
  - Accessibility improvements (ARIA labels, keyboard navigation)

## Impact
- Affected specs: `movie-tracking`, `movie-ui`, `analytics`, `filter-sort`
- Affected code:
  - `cinegrid/app/page.tsx` - React Query integration, error boundaries
  - `cinegrid/lib/database.ts` - Caching layer
  - `cinegrid/app/api/tmdb/route.ts` - Rate limiting
  - `cinegrid/components/*` - Error boundaries, accessibility
  - `cinegrid/hooks/useFilters.ts` - Fix filter persistence
  - New: `cinegrid/components/MovieDetailsModal.tsx`
  - New: `cinegrid/components/SearchBar.tsx`
  - New: `cinegrid/components/StatisticsPanel.tsx`
- Dependencies: `@tanstack/react-query` (new)

## Design Decisions
- Use React Query for all data fetching (replaces manual useState/useEffect)
- Implement optimistic updates for better UX
- Add request debouncing for TMDB API calls
- Use Next.js dynamic imports for code splitting
- Error boundaries at page and component levels
