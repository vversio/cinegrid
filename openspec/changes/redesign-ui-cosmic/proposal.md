## Why

The current CineGrid UI is functional but visually plain. The redesign introduces a distinctive "Cosmic Depth" design language with a gravitational black hole motif, replacing the generic Tailwind zinc palette. This creates a premium, immersive experience for a personal movie/series portfolio while adding requested features: favorites carousel, rating system, and improved analytics visualization.

## What Changes

### Visual Overhaul
- **New color system**: Deep space blacks (#0a0a0f), dark violets (#1a0f2e, #2d1b4e), purple highlights (#4a2d6d)
- **Black hole design element**: Fixed radial gradient in bottom-right with subtle rotation (360deg/120s)
- **Glass-morphism**: Backdrop-blur with violet tinting for elevated surfaces
- **Typography**: System font stack with defined scale (32px H1 to 12px labels)

### Layout Architecture
- **Resizable analytics panel**: Left sidebar (default 325px, resizable 280-450px)
- **Favorites carousel**: Horizontal scroll section above the grid for pinned movies/series
- **Redesigned header**: Glass-morphic bar with filter/sort controls and user avatar
- **Responsive behavior**: Drawer-based analytics on tablet/mobile

### New Features
- **Favorites system**: Star/pin movies and series, displayed in featured carousel
- **Rating system**: 5-star rating on movie cards (stored in database)
- **Filter/Sort controls**: By media type, genre, rating, date, title (URL-persisted)

### Technical Changes
- **BREAKING**: Replace Nivo heatmap with Recharts line/area chart (smaller bundle)
- **Add dependencies**: shadcn/ui, Framer Motion, Recharts, react-resizable-panels
- **Database schema**: Add `is_favorite` and `user_rating` columns to `watched_movies`

## Database Schema Changes

**Table**: `watched_movies`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `is_favorite` | BOOLEAN | NOT NULL | `false` |
| `user_rating` | INTEGER | CHECK (1-5), NULLABLE | `NULL` |

**Indexes**:
- `idx_watched_movies_favorite` on `is_favorite` WHERE `is_favorite = true`

**Migration SQL**:
```sql
-- Add favorites column
ALTER TABLE watched_movies 
ADD COLUMN is_favorite BOOLEAN NOT NULL DEFAULT false;

-- Add rating column (nullable, 1-5 scale)
ALTER TABLE watched_movies 
ADD COLUMN user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5);

-- Add partial index for favorites queries
CREATE INDEX idx_watched_movies_favorite 
ON watched_movies (is_favorite) 
WHERE is_favorite = true;

-- Backfill: All existing rows get is_favorite = false (handled by DEFAULT)
-- No rating backfill needed (nullable allows gradual input)
```

## Performance Budget

| Metric | Current | Target |
|--------|---------|--------|
| Bundle Size (gzipped) | ~180kB | <230kB (+50kB max) |
| LCP (3G throttled) | ~2.5s | <3s |
| INP | ~80ms | <100ms |
| Lighthouse Accessibility | 95 | 100 |

**Dependency sizes (tree-shaken)**:
- Recharts: ~15kB
- Framer Motion: ~30kB  
- shadcn/ui components: ~10kB
- react-resizable-panels: ~5kB

## Impact

- Affected specs: None (first formal specs)
- Affected code:
  - `cinegrid/app/page.tsx` - Complete rewrite for new layout
  - `cinegrid/app/globals.css` - New color system and CSS variables
  - `cinegrid/tailwind.config.ts` - Cosmic theme tokens (new file)
  - `cinegrid/components/AnalyticsDashboard.tsx` - Replace with Recharts implementation
  - `cinegrid/components/MovieGrid.tsx` - Add Framer Motion, rating, favorite toggle
  - `cinegrid/components/MovieCard.tsx` - New component for card design
  - `cinegrid/components/FavoritesCarousel.tsx` - New component
  - `cinegrid/components/Header.tsx` - New component
  - `cinegrid/components/AnalyticsPanel.tsx` - Resizable panel wrapper
  - `cinegrid/components/GenreTrendChart.tsx` - New Recharts component
  - `cinegrid/lib/types.ts` - Add user_rating and is_favorite fields
  - `cinegrid/lib/database.ts` - Add functions for favorites and ratings
  - `cinegrid/lib/analyticsUtils.ts` - New chart data transformation

## Stakeholder Decisions

| Question | Decision |
|----------|----------|
| Analytics toggle persistence | Yes, persist to localStorage |
| Favorites limit | No hard cap (carousel handles via horizontal scroll) |
| Rating visibility | Public (portfolio site, single owner) |
| Black hole animation | Subtle rotation (360deg over 120s, CSS animation) |
