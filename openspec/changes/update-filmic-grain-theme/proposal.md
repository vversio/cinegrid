## Why
The current "Cosmic Depth" dark purple/neon theme feels generic. The new "Filmic Grain" palette provides a warmer, more distinctive aesthetic inspired by analog film photography (Kodak Portra, Cinestill 800T) with better WCAG contrast ratios and an indie film/VHS vibe.

## What Changes
- **BREAKING**: Complete color palette replacement
  - Primary background: Wet Charcoal (#222023) instead of cosmic blacks
  - Text colors: Rosarian (#FAEADD) warm beige and Purple Seduction (#522A6F) violet
  - Accent colors: Testosterose (#DDAAFF) lavender, Solarized (#FBCF4F) warm yellow
  - Supporting: Harmonious Rose (#F29CB7) muted pink
- Update all CSS custom properties in `globals.css`
- Update Tailwind theme configuration with new color tokens
- Add optional film grain texture overlay support
- Update all component color references
- Improve accessibility with higher contrast pairings (17.87:1 max)

## Impact
- Affected specs: `ui-theme`, `analytics-panel`, `filter-sort`
- Affected code:
  - `cinegrid/app/globals.css` (complete color variable rewrite)
  - `cinegrid/components/ui/*.tsx` (color class updates)
  - `cinegrid/components/*.tsx` (color class updates)
  - `cinegrid/app/page.tsx` (toast/notification styling)

## Design Mood Reference
- **Film Stock Inspirations**:
  - Kodak Portra 400 (warm beige tones → Rosarian, Solarized)
  - Cinestill 800T (purple/magenta shifts → Purple Seduction, Testosterose)
  - Push-processed B&W (gritty contrast → Wet Charcoal + Harmonious Rose)
- **Vibe**: Late-night diner neon through rain-streaked windows, VHS pause-screen glitches, indie film title cards
