# CineGrid

A personal movie and series tracking application with analytics dashboard. Built with Next.js 16, Supabase, and the TMDB API.

## Features

- Track watched movies and TV series
- Rate and mark favorites
- Analytics dashboard with genre trends and statistics
- Search TMDB database to add new entries
- Filmic Grain themed UI with GIF background
- Responsive design with mobile support

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 4
- **State Management**: React Query (TanStack Query)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- Supabase account
- TMDB API key

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration (Required)
# Get these from: https://app.supabase.com/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Admin Configuration (Required)
# Email address for the admin user who can add/modify movies
NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com

# TMDB API Configuration (Required)
# Get your API key from: https://www.themoviedb.org/settings/api
# Server-side only (not exposed to browser)
TMDB_API_KEY=your-tmdb-api-key-here
```

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the following SQL to create the required table:

```sql
CREATE TABLE watched_movies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tmdb_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  poster_path TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  release_date TEXT,
  genres TEXT[] DEFAULT '{}',
  user_rating NUMERIC(3,1) CHECK (user_rating >= 0 AND user_rating <= 5),
  is_favorite BOOLEAN DEFAULT FALSE,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_watched_movies_tmdb_id ON watched_movies(tmdb_id);
CREATE INDEX idx_watched_movies_media_type ON watched_movies(media_type);
CREATE INDEX idx_watched_movies_is_favorite ON watched_movies(is_favorite);
```

3. Configure Row Level Security (RLS) as needed for your use case

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Add environment variables in Project Settings > Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_EMAIL`
   - `TMDB_API_KEY`
4. Deploy

Vercel will automatically:
- Detect Next.js configuration
- Create preview deployments for branches
- Create production deployments for `main` branch

### CI/CD Pipeline

This project includes GitHub Actions for continuous integration:

- **Lint**: Runs ESLint on all code
- **Type Check**: Validates TypeScript types
- **Build**: Ensures production build succeeds

The workflow runs on:
- Push to `main` branch
- Pull requests targeting `main`

### Other Platforms

For deployment to other platforms (Netlify, Railway, etc.):

1. Set the build command: `npm run build`
2. Set the output directory: `.next`
3. Configure all required environment variables
4. Ensure Node.js 20+ is available

## Project Structure

```
cinegrid/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── tmdb/          # TMDB proxy endpoints
│   ├── globals.css        # Global styles & theme
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── ui/               # UI primitives
│   └── providers/        # Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and types
└── public/               # Static assets
```

## API Rate Limiting

The application includes built-in rate limiting for TMDB API requests:
- Maximum 40 requests per 10 seconds
- Automatic request queuing when limit is reached

## License

MIT
