## 1. Foundation - CSS Variables

- [x] 1.1 Update `:root` color variables in `globals.css` with Filmic Grain palette
  - Replace cosmic-* with filmic-* naming
  - Add new colors: Wet Charcoal, Rosarian, Purple Seduction, Testosterose, Solarized, Harmonious Rose
- [x] 1.2 Update `@theme inline` block with new Tailwind color mappings
- [x] 1.3 Update shadcn/ui CSS variable overrides (--background, --foreground, --primary, etc.)
- [x] 1.4 Update glass effect variables (--glass-bg, --glass-border, --glass-border-glow)
- [x] 1.5 Update chart colors (--chart-1 through --chart-5)

## 2. Utility Classes

- [x] 2.1 Update `.glass` class to use Filmic Grain colors
- [x] 2.2 Update `.glass-solid` and `.glass-subtle` variants
- [x] 2.3 Update `.cosmic-glow` to `.filmic-glow` with new accent colors
- [x] 2.4 Update `.neon-glow-*` classes with Filmic Grain accents
- [x] 2.5 Update text utility classes (`.text-cosmic-*` → `.text-filmic-*`)
- [x] 2.6 Update border utility classes
- [x] 2.7 Update shimmer animation colors

## 3. Typography

- [x] 3.1 Update `.h1`, `.h2` heading colors
- [x] 3.2 Update `.body`, `.caption`, `.label` colors
- [x] 3.3 Update text shadow/glow effects for Filmic palette

## 4. Component Updates

- [x] 4.1 Update `Header.tsx` color classes
- [x] 4.2 Update `AnalyticsPanel.tsx` color classes
- [x] 4.3 Update `FilterControls.tsx` color classes
- [x] 4.4 Update `ExpandingSelect.tsx` color classes
- [x] 4.5 Update `MovieCard.tsx` color classes
- [x] 4.6 Update `FavoritesCarousel.tsx` color classes
- [x] 4.7 Update `AddMovieModal.tsx` color classes
- [x] 4.8 Update `MovieSearch.tsx` color classes
- [x] 4.9 Update `AuthButton.tsx` color classes
- [x] 4.10 Update `StarRating.tsx` color classes
- [x] 4.11 Update `GenreTrendChart.tsx` chart colors and tooltip styling

## 5. Page-Level Updates

- [x] 5.1 Update `page.tsx` toast styling (Sonner)
- [x] 5.2 Update loading spinner colors
- [x] 5.3 Update empty state styling
- [x] 5.4 Update floating action button styling

## 6. Background GIF

- [x] 6.1 Update `BackgroundEffect.tsx` to use guardians.gif
- [x] 6.2 Add dark overlay gradient for readability
- [x] 6.3 Add subtle purple accent gradient

## 7. Validation

- [x] 7.1 TypeScript compilation check (`npx tsc --noEmit`)
- [ ] 7.2 Visual review of all pages/components (USER ACTION)
- [ ] 7.3 Test hover/focus/active states (USER ACTION)
- [ ] 7.4 Test responsive layouts (mobile, tablet, desktop) (USER ACTION)
- [ ] 7.5 Verify chart colors in GenreTrendChart (USER ACTION)
- [ ] 7.6 Verify toast notifications styling (USER ACTION)
- [ ] 7.7 Check accessibility (contrast ratios, focus indicators) (USER ACTION)
