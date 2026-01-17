## 1. Database Schema Changes
- [x] 1.1 Create migration SQL to remove user_id column from watched_movies
- [x] 1.2 Update RLS policies: Allow public SELECT, restrict INSERT/DELETE to admin email (database-level check)
- [x] 1.3 Add `media_type` column (movie/series) to support both
- [x] 1.4 Create admin_settings table and is_admin_user() function
- [x] 1.5 Run migration SQL in Supabase
- [x] 1.6 Insert admin email into admin_settings table

## 2. TypeScript Types
- [x] 2.1 Remove user_id from WatchedMovie interface
- [x] 2.2 Add MediaType enum (movie/series)
- [x] 2.3 Add TMDB series types and search response
- [x] 2.4 Update NewWatchedMovie to include media_type

## 3. Database Functions
- [x] 3.1 Update getWatchedMovies() to remove user_id check
- [x] 3.2 Update addWatchedMovie() to remove user_id, add media_type
- [x] 3.3 Update deleteWatchedMovie() to check admin email instead of user_id
- [x] 3.4 Add helper function to check if current user is admin

## 4. Admin Authentication
- [x] 4.1 Add ADMIN_EMAIL environment variable (NEXT_PUBLIC_ADMIN_EMAIL)
- [x] 4.2 Update AuthButton to only show for admin email
- [x] 4.3 Remove sign-up functionality
- [x] 4.4 Hide auth UI completely for non-admin visitors

## 5. TMDB Integration - Series Support
- [x] 5.1 Update TMDB API route to support /search/tv endpoint
- [x] 5.2 Add series search to MovieSearch component
- [x] 5.3 Update AddMovieModal to support selecting movie vs series
- [x] 5.4 Add series poster and metadata handling

## 6. UI Updates
- [x] 6.1 Update page.tsx to show movies/series publicly
- [x] 6.2 Conditionally show add/delete buttons only for admin
- [x] 6.3 Update MovieGrid to display media_type indicator
- [x] 6.4 Remove "Sign In" button for visitors

## 7. Testing & Migration
- [x] 7.1 Run migration SQL in Supabase
- [x] 7.2 Insert admin email: `INSERT INTO admin_settings (admin_email) VALUES ('your-email@example.com');`
- [ ] 7.3 Test public viewing (sign out, verify movies visible, no auth UI)
- [ ] 7.4 Test admin authentication with owner email
- [ ] 7.5 Test adding movies and series (verify database-level check works)
- [ ] 7.6 Test deleting movies/series (verify database-level check works)
- [ ] 7.7 Verify RLS policies block non-admin operations
