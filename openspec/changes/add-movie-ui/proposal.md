## Why
Create the core user interface for tracking movies - a clean grid display of watched movies and a modal for adding new entries. This enables users to visually browse their movie history and quickly add new movies with TMDB search integration.

## What Changes
- Implement movie search component with TMDB API integration
- Create "Add Movie" modal with date picker, genre selection, and custom category input
- Build responsive poster grid with hover interactions
- Add Supabase authentication flow for user login/signup

## Impact
- Affected specs: New capability `movie-ui` will be created
- Affected code:
  - `cinegrid/app/page.tsx` - main page with grid
  - `cinegrid/components/MovieGrid.tsx` - poster grid component
  - `cinegrid/components/AddMovieModal.tsx` - add movie form
  - `cinegrid/components/MovieSearch.tsx` - TMDB search
  - `cinegrid/components/AuthButton.tsx` - login/signup
  - `cinegrid/app/api/tmdb/route.ts` - TMDB API proxy
