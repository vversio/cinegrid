## Why
Establish the data persistence layer to store user's watched movies. This enables the core functionality of tracking movies over time with genres and custom categories for visualization.

## What Changes
- Define `watched_movies` table schema in Supabase
- Enable Row Level Security (RLS) with user-scoped policies
- Create TypeScript types for the data model
- Implement data access functions for CRUD operations

## Impact
- Affected specs: New capability `movie-tracking` will be created
- Affected code:
  - `cinegrid/lib/supabaseClient.ts` - already initialized
  - `cinegrid/lib/types.ts` - new TypeScript types
  - `cinegrid/lib/database.ts` - data access functions
- Dependencies: Supabase project with auth enabled
