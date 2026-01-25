## Why
Transform CineGrid from a neon-heavy dark theme to a minimal, ultra-clean dark theme. The current design uses vibrant neon colors (fuchsia, cyan, purple) with a GIF background which feels busy. The new design aims for a sleek, modern aesthetic with neutral grays/whites, subtle aurora blur effects, and bold typography while preserving the glass/blur aesthetic.

## What Changes
- Replace entire color system with neutral gray/white palette (no color accents)
- Replace `guardians.gif` background with subtle aurora/blur effect
- Update typography to emphasize bold Poppins weights
- Convert all `filmic-*` and `neon-*` color classes to neutral equivalents
- Remove neon glow effects, keep glass/blur effects with neutral tints
- Update chart colors to grayscale palette

## Impact
- Affected specs: `ui-theme` (MODIFIED)
- Affected code:
  - `cinegrid/app/globals.css` - Complete color system replacement
  - `cinegrid/app/layout.tsx` - Typography weight updates
  - `cinegrid/components/ui/BackgroundEffect.tsx` - Aurora blur background
  - `cinegrid/components/ui/Header.tsx` - Neutral styling
  - `cinegrid/components/MovieCard.tsx` - Neutral card styling
  - `cinegrid/components/FavoritesCarousel.tsx` - Neutral carousel
  - `cinegrid/components/ui/FilterControls.tsx` - Neutral controls
  - `cinegrid/components/ui/ExpandingSelect.tsx` - Neutral dropdowns
  - `cinegrid/components/SearchBar.tsx` - Neutral search
  - `cinegrid/components/AddMovieModal.tsx` - Neutral modal
  - `cinegrid/components/MovieDetailsModal.tsx` - Neutral modal
  - `cinegrid/components/GenreTrendChart.tsx` - Grayscale chart
  - `cinegrid/components/StatisticsPanel.tsx` - Neutral stats
  - `cinegrid/components/AuthButton.tsx` - Neutral auth
  - `cinegrid/components/StarRating.tsx` - Neutral stars
  - `cinegrid/components/ui/MobileAnalyticsDrawer.tsx` - Neutral drawer
  - `cinegrid/components/ui/AnalyticsPanel.tsx` - Neutral panel
  - `cinegrid/components/ErrorBoundary.tsx` - Neutral errors
  - `cinegrid/lib/analyticsUtils.ts` - Grayscale chart colors
  - `cinegrid/app/page.tsx` - Neutral toast styling
- Dependencies: None (styling-only changes)
