## Context

CineGrid is a personal movie/series tracking portfolio. The current UI uses basic Tailwind zinc colors and a tabbed layout separating analytics from the grid. The redesign consolidates both views into a single page with a distinctive "Cosmic Depth" aesthetic featuring a gravitational black hole motif.

**Stakeholders**: Single admin owner (portfolio site)
**Constraints**: Must maintain current functionality while adding new features

## Goals / Non-Goals

### Goals
- Create a visually distinctive, premium-feeling portfolio UI
- Implement side-by-side analytics + grid layout with resizable panel
- Add favorites and rating features for better content curation
- Improve performance by replacing Nivo with lighter Recharts
- Maintain responsive behavior across desktop, tablet, mobile

### Non-Goals
- Multi-user support (remains single-owner portfolio)
- Real-time collaboration features
- Complex analytics (keep it simple: genre trends over time)
- Custom theming beyond the Cosmic Depth palette
- Internationalization (English only)

## Decisions

### Decision 1: Replace Nivo with Recharts
**What**: Swap @nivo/heatmap for Recharts line/area chart
**Why**: 
- Nivo bundle size is significant (~200kb+)
- Recharts is ~50% smaller and more commonly used with Next.js
- Line chart showing genre trends over time is more intuitive than heatmap
**Alternatives considered**:
- Keep Nivo: Rejected due to bundle size and heatmap being less intuitive
- Chart.js: Similar to Recharts but less React-native
- Visx: Too low-level for our needs

**Data Structure**:
```typescript
// Analytics query
SELECT 
  genre, 
  DATE_TRUNC('month', watched_date) as month, 
  COUNT(*) as count
FROM watched_movies
WHERE watched_date >= $startDate
GROUP BY genre, month
ORDER BY month, count DESC

// Chart data shape
interface GenreTrendData {
  month: string; // "2025-01"
  [genre: string]: number | string; // e.g., { Action: 5, Drama: 3 }
}
```

**Chart Configuration**:
- Multiple lines (one per genre, max 7 top genres to avoid clutter)
- Area fill with violet gradient (20% opacity)
- Interactive tooltip showing exact counts

### Decision 2: Resizable Panel via react-resizable-panels
**What**: Use `react-resizable-panels` for analytics sidebar
**Why**:
- Mature library with good accessibility
- Handles persistence and constraints well
- Works smoothly with Framer Motion
**Alternatives considered**:
- Custom implementation: More work, less accessible
- CSS-only resize: Poor UX, limited control

### Decision 3: shadcn/ui Component Library
**What**: Install and use shadcn/ui for Select, Sheet, Card, Tooltip, Toggle components
**Why**:
- Unstyled primitives that we can customize to match Cosmic theme
- Built on Radix UI (accessible)
- Copy-paste model means no version lock-in
**Alternatives considered**:
- Radix UI directly: More setup, shadcn wraps it nicely
- Headless UI: Less complete component set
- Build from scratch: Too time-consuming

### Decision 4: Framer Motion for Animations
**What**: Use Framer Motion for page transitions, card hovers, stagger animations
**Why**:
- Industry standard for React animations
- Declarative API matches React patterns
- Supports reduced motion preferences

**Performance Safeguards**:
- Use `layout` prop sparingly (GPU-intensive)
- Disable animations when `prefers-reduced-motion: reduce` detected
- Lazy load motion components where possible
- Limit simultaneous animations: stagger grid items in batches of 12
- Target: 60fps during interactions

**Alternatives considered**:
- CSS animations only: Limited for complex sequences
- React Spring: Similar capability but less intuitive API
- GSAP: Overkill for our needs

### Decision 5: Database Schema for Favorites/Ratings
**What**: Add `is_favorite BOOLEAN DEFAULT false` and `user_rating INTEGER CHECK (rating >= 1 AND rating <= 5)` to `watched_movies` table
**Why**:
- Simple schema addition, no new tables needed
- Rating is nullable (not required)
- Favorite is boolean for simple toggle
- Partial index on favorites for efficient queries
**Alternatives considered**:
- Separate favorites table: Over-engineered for single user
- Tags system: More complex than needed for favorites

### Decision 6: Filter/Sort with URL Persistence
**What**: Store filter and sort state in URL search params
**Why**:
- Shareable links with applied filters
- Browser back/forward works naturally
- No localStorage complexity for filters
**URL Format**: `?filter=movies&genre=action,drama&sort=rating-desc&minRating=3`

## Tailwind Configuration

**File**: `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          black: '#0a0a0f',
          'black-light': '#13131a',
          violet: '#1a0f2e',
          'violet-light': '#2d1b4e',
          purple: '#4a2d6d',
          'purple-light': '#6b4fa0',
          white: '#ffffff',
          'white-muted': '#f5f5f7',
          'gray-muted': '#b0a8c0',
          'gray-light': '#e5e5e7',
        }
      },
      boxShadow: {
        'cosmic-glow': '0 0 20px rgba(106, 79, 160, 0.3)',
        'cosmic-lift': '0 20px 40px rgba(106, 79, 160, 0.3)',
      },
      backdropBlur: {
        cosmic: '12px',
      },
      animation: {
        'black-hole': 'rotate 120s linear infinite',
      },
      keyframes: {
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
```

**CSS Variables** (`globals.css`):
```css
:root {
  --cosmic-gradient: radial-gradient(
    circle at bottom right, 
    #1a0f2e 0%, 
    #0a0a0f 40%, 
    transparent 70%
  );
  --glass-bg: rgba(26, 15, 46, 0.6);
  --glass-border: rgba(106, 79, 160, 0.2);
}
```

## Error Handling & Edge Cases

### Favorites Carousel
| State | UI |
|-------|-----|
| No favorites | Placeholder with "Add your first favorite" CTA + star icon |
| Loading | 3 skeleton cards with shimmer effect |
| Single favorite | Show card without scroll indicators |

### Analytics Panel
| State | UI |
|-------|-----|
| No watch history | Empty state with chart placeholder + "Start tracking movies" |
| API failure | Retry button + toast notification |
| Loading | Pulsing placeholder bars in chart area |

### Movie Grid
| State | UI |
|-------|-----|
| Empty (no movies) | Large CTA to add first movie |
| TMDB API failure | Cached poster fallback + warning banner |
| Poster 404 | Gradient fallback with Lucide `Film` or `Tv` icon |
| Loading | Card-shaped skeletons in grid pattern |

### Rating System
| State | Behavior |
|-------|----------|
| Optimistic update | Show star fill immediately, rollback on API failure |
| Conflict | Server value takes precedence |
| API error | Toast notification, revert UI state |

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Recharts learning curve | Well-documented, similar API to Nivo |
| Bundle size increase from Framer Motion | Tree-shake, lazy load motion components |
| Complexity of resizable panel | Use established library, not custom |
| Breaking change (Nivo removal) | One-time migration, no external dependencies |
| Animation performance | Stagger limits, reduced motion check, 60fps target |

## Migration Plan

1. **Phase 1: Foundation** (can be done incrementally)
   - Install dependencies (shadcn/ui, Framer Motion, Recharts, react-resizable-panels)
   - Set up Tailwind config with Cosmic palette
   - Update globals.css with CSS variables

2. **Phase 2: Database**
   - Run migration SQL in Supabase
   - Update TypeScript types
   - Add database functions

3. **Phase 3: Layout Structure**
   - Create new layout components (Header, AnalyticsPanel, FavoritesCarousel)
   - Implement resizable panel
   - Update page.tsx with new structure

4. **Phase 4: Component Migration**
   - Create new MovieCard with Framer Motion
   - Replace AnalyticsDashboard with Recharts implementation
   - Add filter/sort controls

5. **Phase 5: New Features**
   - Implement favorites toggle and display
   - Implement rating system
   - Wire up filter/sort to URL params

6. **Phase 6: Polish**
   - Add page load animations
   - Implement skeleton loading states
   - Test responsive breakpoints
   - Accessibility audit

**Rollback**: Git revert if needed; no external service dependencies

## Open Questions

All resolved:
1. ~~Analytics toggle persistence~~ - Yes, localStorage
2. ~~Favorites limit~~ - No hard cap
3. ~~Rating visibility~~ - Public (portfolio site)
4. ~~Black hole animation~~ - Subtle rotation (360deg/120s)
