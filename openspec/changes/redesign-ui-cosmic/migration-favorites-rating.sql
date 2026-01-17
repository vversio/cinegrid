-- Migration: Add Favorites and Rating columns
-- Run this in Supabase SQL Editor

-- Step 1: Add is_favorite column
ALTER TABLE watched_movies 
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN NOT NULL DEFAULT false;

-- Step 2: Add user_rating column (nullable, 1-5 scale)
ALTER TABLE watched_movies 
ADD COLUMN IF NOT EXISTS user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5);

-- Step 3: Create partial index for efficient favorites queries
CREATE INDEX IF NOT EXISTS idx_watched_movies_favorite 
ON watched_movies (is_favorite) 
WHERE is_favorite = true;

-- Step 4: Create index for rating-based sorting
CREATE INDEX IF NOT EXISTS idx_watched_movies_rating 
ON watched_movies (user_rating DESC NULLS LAST);

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'watched_movies'
ORDER BY ordinal_position;
