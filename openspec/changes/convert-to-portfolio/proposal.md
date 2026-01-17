## Why
Convert CineGrid from a multi-user movie tracking app to a personal portfolio website where only the owner can add/edit movies and series, while visitors can view the collection publicly. This transforms the app into a showcase of personal viewing history rather than a social platform.

## What Changes
- **BREAKING**: Remove user_id from database schema (single-owner model)
- **BREAKING**: Remove public sign-up functionality
- Add email-based admin authentication (only owner's email can sign in)
- Hide authentication UI for visitors (public viewing)
- Add TV series tracking support via TMDB
- Update RLS policies to allow public reads, restrict writes to admin
- Simplify database functions to remove user_id dependency
- Update UI to conditionally show add/delete buttons only for admin

## Impact
- Affected specs: 
  - `movie-tracking` - Modified (remove user_id, add public read access)
  - New capability `admin-auth` - Added (email-based admin authentication)
  - New capability `series-tracking` - Added (TV series support)
- Affected code:
  - Database schema: Remove user_id column, update RLS policies
  - `lib/database.ts` - Remove user_id from queries
  - `lib/types.ts` - Add series types, remove user_id
  - `components/AuthButton.tsx` - Hide for visitors, email-based auth
  - `app/page.tsx` - Public viewing, conditional admin UI
  - `components/AddMovieModal.tsx` - Support both movies and series
  - `components/MovieSearch.tsx` - Add series search
  - New: `app/api/tmdb/route.ts` - Add series search endpoint
- Migration: Existing data will need user_id removed (or migration script)
