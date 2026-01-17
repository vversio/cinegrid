-- Debug script to check admin setup
-- Run these queries in Supabase SQL Editor to troubleshoot admin issues

-- 1. Check if admin_settings table exists and has data
SELECT * FROM admin_settings;

-- 2. Check current authenticated user's email
-- (Run this while logged in)
SELECT email FROM auth.users WHERE id = auth.uid();

-- 3. Test the is_admin_user() function
SELECT is_admin_user();

-- 4. Check RLS policies on watched_movies
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'watched_movies';

-- 5. Check if function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'is_admin_user';

-- 6. Manually test admin check (replace with your email)
SELECT EXISTS (
  SELECT 1 
  FROM admin_settings 
  WHERE admin_email = 'your-email@example.com'
);

-- 7. Check if user_id column still exists (might cause issues)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'watched_movies' 
AND column_name = 'user_id';
