-- Migration: Convert to Portfolio Model
-- Run this in Supabase SQL Editor
-- This converts the database from multi-user to single-owner portfolio model

-- Step 1: Add media_type column to support both movies and series
ALTER TABLE watched_movies 
ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'movie' CHECK (media_type IN ('movie', 'series'));

-- Step 2: Update existing rows to have media_type='movie'
UPDATE watched_movies 
SET media_type = 'movie' 
WHERE media_type IS NULL;

-- Step 3: Make media_type NOT NULL (after updating existing rows)
ALTER TABLE watched_movies 
ALTER COLUMN media_type SET NOT NULL;

-- Step 4: Create admin_settings table to store admin email
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email TEXT NOT NULL UNIQUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on admin_settings
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can read admin_settings (for checking admin status)
CREATE POLICY "Authenticated can read admin settings"
ON admin_settings FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Step 5: Create helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM admin_settings 
    WHERE admin_email = (
      SELECT email 
      FROM auth.users 
      WHERE id = auth.uid()
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Drop existing user-scoped RLS policies
DROP POLICY IF EXISTS "Users can view their own data" ON watched_movies;
DROP POLICY IF EXISTS "Users can insert their own data" ON watched_movies;
DROP POLICY IF EXISTS "Users can delete their own movies" ON watched_movies;
DROP POLICY IF EXISTS "Public can view all movies" ON watched_movies;
DROP POLICY IF EXISTS "Authenticated users can insert" ON watched_movies;
DROP POLICY IF EXISTS "Authenticated users can delete" ON watched_movies;

-- Step 7: Create new portfolio model RLS policies with database-level admin check
-- Public read access (anyone can view all movies/series)
CREATE POLICY "Public can view all movies"
ON watched_movies FOR SELECT
USING (true);

-- Insert requires admin authentication (checked in database)
CREATE POLICY "Only admin can insert movies"
ON watched_movies FOR INSERT
WITH CHECK (is_admin_user() = true);

-- Delete requires admin authentication (checked in database)
CREATE POLICY "Only admin can delete movies"
ON watched_movies FOR DELETE
USING (is_admin_user() = true);

-- Step 8: Optional - Remove user_id column
-- WARNING: Only uncomment this if you're sure you want to delete the user_id column
-- This will permanently delete the column and all its data
-- ALTER TABLE watched_movies DROP COLUMN IF EXISTS user_id;

-- ============================================================================
-- USER ACTION REQUIRED: Insert your admin email
-- ============================================================================
-- After running this migration, you MUST run:
-- INSERT INTO admin_settings (admin_email) VALUES ('your-email@example.com');
-- Replace 'your-email@example.com' with your actual admin email address
-- ============================================================================

-- Verify changes:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'watched_movies' 
-- ORDER BY ordinal_position;
