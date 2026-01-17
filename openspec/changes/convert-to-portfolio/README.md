# Convert to Portfolio - Implementation Guide

## Overview
This change converts CineGrid from a multi-user app to a personal portfolio where only the admin can add/edit content, while visitors can view everything publicly.

## Database Migration Steps

### Step 1: Run the Migration SQL
1. Go to Supabase Dashboard → SQL Editor
2. Open `migration.sql` from this directory
3. Copy and paste the entire SQL script
4. Click "Run" to execute

### Step 2: Set Your Admin Email (REQUIRED)
After running the migration, you MUST insert your admin email into the database:

```sql
INSERT INTO admin_settings (admin_email) VALUES ('your-email@example.com');
```

Replace `'your-email@example.com'` with the actual email you use to sign in to Supabase.

**Important**: This must be the exact same email you use when signing up/logging into Supabase Auth.

### Step 3: Verify Setup
Run these queries to verify everything is set up correctly:

```sql
-- Check admin_settings table
SELECT * FROM admin_settings;

-- Check RLS policies
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'watched_movies';

-- Check if function exists
SELECT proname FROM pg_proc WHERE proname = 'is_admin_user';
```

## Environment Variables

Make sure your `.env.local` file has:
```
NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
TMDB_API_KEY=your_tmdb_api_key
```

## How Security Works

1. **Client-side check (UX)**: AuthButton checks email before allowing sign-in attempt
2. **App-level check (Early rejection)**: Database functions check admin status before operations
3. **Database-level check (Enforcement)**: RLS policies use `is_admin_user()` function to enforce at database level

This triple-layer approach ensures security even if someone bypasses the UI.
