## MODIFIED Requirements

### Requirement: Movie Data Fetching
The application SHALL use React Query for fetching and caching movie data with proper loading states and error handling.

#### Scenario: Movies loaded with React Query
- **WHEN** the application loads
- **THEN** movies are fetched using React Query's `useQuery`
- **AND** loading state is managed automatically
- **AND** data is cached for 5 minutes
- **AND** stale data is refetched after 1 minute

#### Scenario: Optimistic updates
- **WHEN** a movie is added, deleted, or updated
- **THEN** the UI updates immediately (optimistic update)
- **AND** the mutation is sent to the server
- **AND** on success, the cache is invalidated and refetched
- **AND** on error, the optimistic update is reverted

#### Scenario: Cache invalidation
- **WHEN** a movie is added or deleted
- **THEN** the movies query cache is invalidated
- **AND** the favorites query cache is invalidated if applicable
- **AND** data is refetched automatically

## ADDED Requirements

### Requirement: TMDB API Rate Limiting
The application SHALL handle TMDB API rate limits gracefully to prevent request failures.

#### Scenario: Rate limit handling
- **WHEN** TMDB API requests exceed 40 requests per 10 seconds
- **THEN** requests are queued and throttled
- **AND** cached data is returned if available
- **AND** user is notified if rate limit is exceeded
- **AND** requests are retried after the rate limit window

#### Scenario: TMDB search caching
- **WHEN** a TMDB search is performed
- **THEN** results are cached for 1 hour
- **AND** subsequent identical searches return cached data
- **AND** cache is invalidated after 1 hour
