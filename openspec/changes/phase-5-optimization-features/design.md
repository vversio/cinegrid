## Context
Phase 5 addresses performance, stability, and essential features. Current issues include:
- Movies require 2 refreshes to add (state management issue)
- Filter/sort state not persisting correctly
- No caching layer (repeated API calls)
- No error boundaries (crashes affect entire app)
- Missing features: movie details, search, statistics

## Goals / Non-Goals
**Goals:**
- Fix all reported bugs
- Implement React Query for data management
- Add TMDB rate limiting
- Improve accessibility
- Add error boundaries
- Implement requested features (details, search, stats)

**Non-Goals:**
- Complete UI redesign
- Adding new major features beyond requested ones
- Database schema changes
- Breaking existing functionality

## Decisions

### React Query Implementation
- **Why**: Solves caching, loading states, and data synchronization issues
- **Pattern**: Use `useQuery` for reads, `useMutation` for writes
- **Cache Time**: 5 minutes for movies list, 1 hour for TMDB data
- **Stale Time**: 1 minute for movies, 5 minutes for TMDB

### TMDB Rate Limiting
- **Strategy**: In-memory request queue with 40 requests per 10 seconds (TMDB limit)
- **Implementation**: Middleware in `/api/tmdb/route.ts`
- **Fallback**: Return cached data if rate limit exceeded

### Error Boundaries
- **Levels**: 
  - Page-level (catches all errors)
  - Component-level (catches specific component errors)
- **Fallback UI**: Simple error message with retry button

### Filter/Sort Persistence
- **Issue**: State lost on re-render
- **Solution**: Use React Query's state management + URL params
- **Favorites**: Apply same filter logic to favorites carousel

### Code Splitting
- **Targets**: 
  - Analytics panel (lazy load)
  - Movie details modal (lazy load)
  - Statistics panel (lazy load)

## Risks / Trade-offs
| Risk | Mitigation |
|------|------------|
| React Query learning curve | Use simple patterns, document well |
| Bundle size increase | Code splitting offsets React Query size |
| Breaking existing code | Incremental migration, test thoroughly |
| Rate limiting complexity | Start simple, add retry logic later |

## Migration Plan
1. Install React Query
2. Create query hooks for movies/favorites
3. Migrate page.tsx to use React Query
4. Fix filter/sort bugs
5. Add error boundaries
6. Implement new features
7. Add accessibility improvements
8. Performance testing

## Open Questions
1. Should we use React Query DevTools in production?
   - **Decision**: No, only in development
2. How to handle offline state?
   - **Decision**: Show cached data, disable mutations
3. Statistics calculation: client-side or server-side?
   - **Decision**: Client-side for now (small dataset)
