# Project Context

## Purpose
CineGrid is a minimalist movie tracking application that allows users to log watched movies and visualize their viewing patterns through a genre vs. time heatmap. The application follows a "minimalist scale" architecture philosophy, prioritizing simplicity and maintainability over premature optimization.

## Tech Stack
- **Frontend/Edge**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend/DB**: Supabase (PostgreSQL + Row Level Security for auth)
- **Data Source**: TMDB API (The Movie Database)
- **Visualization**: Nivo (@nivo/core, @nivo/heatmap)
- **CI/CD**: GitHub Actions (linting, type checking, build tests) + Vercel (deployment)
- **Local Dev**: Node.js on Pop!_OS (Linux)

## Project Conventions

### Code Style
- TypeScript strict mode enabled
- ESLint configured via Next.js defaults
- Tailwind CSS for styling (utility-first approach)
- Component naming: PascalCase for React components
- File naming: kebab-case for files, PascalCase for component files
- Prefer functional components with hooks
- Use async/await over promises where possible

### Architecture Patterns
- **Next.js App Router**: Use server components by default, client components only when needed
- **Minimalist Scale**: Start simple, add complexity only when proven necessary
- **Row Level Security (RLS)**: All database queries scoped to authenticated user via Supabase RLS policies
- **API Routes**: Use Next.js API routes for server-side logic when needed
- **Data Fetching**: Prefer server-side fetching, consider React Query/SWR for client-side caching in Phase 5

### Testing Strategy
- GitHub Actions CI pipeline validates: linting, type checking, build success
- Focus on integration tests for critical paths (data entry, visualization)
- Manual testing for UI/UX validation
- No unit tests in initial phases (per minimalist approach)

### Git Workflow
- Main branch: `main` (production-ready)
- Feature branches: Create for new features, merge via PR
- Commit messages: Use conventional commits (e.g., `feat:`, `fix:`, `chore:`)
- CI runs on: push to `main`, all pull requests
- CD: Vercel auto-deploys `main` to production, branches to preview

## Domain Context
- **Watched Movie**: A movie entry logged by a user with: TMDB ID, title, poster, watched date, genre, and optional custom category
- **Genre vs Time Heatmap**: X-axis represents time (months), Y-axis represents genres, color intensity shows viewing frequency
- **Custom Category**: User-defined tag (e.g., "Late Night Horror") for personal organization
- **TMDB Integration**: External API for movie search and metadata (poster paths, genres)

## Important Constraints
- **Minimalist Philosophy**: Avoid premature optimization; default to <100 lines of new code per feature
- **User Privacy**: All data scoped to authenticated user via Supabase RLS
- **API Rate Limits**: TMDB API has rate limits; implement caching in Phase 5 if needed
- **Vercel Limits**: Free tier constraints on function execution time and bandwidth
- **Code Freeze**: After Phase 4 (heatmap works), freeze features and focus on refactoring

## External Dependencies
- **Supabase**: PostgreSQL database with authentication and Row Level Security
  - Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **TMDB API**: The Movie Database API for movie search and metadata
  - Environment variable: `TMDB_API_KEY`
  - Base URL: `https://api.themoviedb.org/3`
  - Endpoint: `/search/movie` for movie search
- **Vercel**: Hosting and deployment platform
  - Automatic preview deployments for branches
  - Production deployment for `main` branch
- **GitHub Actions**: CI pipeline for code quality checks
