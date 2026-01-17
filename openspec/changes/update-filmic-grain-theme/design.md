## Context
The current "Cosmic Depth" theme uses deep purple/neon colors that feel generic. The user has provided a detailed "Filmic Grain" color palette inspired by analog film photography, with specific contrast ratios and usage guidelines.

## Goals / Non-Goals
**Goals:**
- Replace all color variables with the Filmic Grain palette
- Maintain WCAG AA compliance (minimum 4.5:1 for normal text, 3:1 for large)
- Create a distinctive "indie film" aesthetic
- Support optional film grain texture overlay
- Ensure smooth transition with no functional regressions

**Non-Goals:**
- Adding new features or UI components
- Changing layout or component structure
- Adding light/dark mode toggle (single theme only)
- Custom fonts (using existing system fonts)

## Decisions

### Color Token Mapping
| Current Token | Filmic Grain | Hex | Usage |
|--------------|--------------|-----|-------|
| `--cosmic-black` | `--filmic-charcoal` | #222023 | Primary background |
| `--cosmic-black-light` | `--filmic-charcoal-light` | #2a282b | Elevated surfaces |
| `--cosmic-violet` | `--filmic-seduction` | #522A6F | Secondary headings, accents |
| `--cosmic-violet-light` | `--filmic-seduction-light` | #6a3d8a | Hover states |
| `--cosmic-purple` | `--filmic-lavender` | #DDAAFF | Links, CTAs, badges |
| `--cosmic-purple-light` | `--filmic-yellow` | #FBCF4F | Highlights, notifications |
| `--cosmic-white` | `--filmic-beige` | #FAEADD | Primary text on dark |
| `--cosmic-white-muted` | `--filmic-beige-muted` | #e8dcd0 | Secondary text |
| `--cosmic-gray-muted` | `--filmic-rose` | #F29CB7 | Captions, placeholders |
| `--neon-purple` | `--filmic-lavender` | #DDAAFF | Primary accent |
| `--neon-pink` | `--filmic-rose` | #F29CB7 | Secondary accent |
| `--neon-cyan` | `--filmic-yellow` | #FBCF4F | Tertiary accent |

### Contrast Pairings (WCAG AA+)
| Background | Foreground | Ratio | Usage |
|------------|------------|-------|-------|
| Wet Charcoal | Rosarian | 17.87:1 | Critical content, body text |
| Wet Charcoal | Testosterose | 11.26:1 | Links, CTAs |
| Wet Charcoal | Harmonious Rose | 10.21:1 | Captions, timestamps |
| Wet Charcoal | Solarized | 14.13:1 | Highlights, badges |
| Rosarian | Purple Seduction | 10.94:1 | Light backgrounds |
| Harmonious Rose | Wet Charcoal | 10.21:1 | Inverted cards |

### Film Grain Texture (Optional)
- CSS filter: `filter: grayscale(5%) contrast(102%)`
- Background overlay: `/film-grain.png` at 3-5% opacity
- Blend mode: `mix-blend-mode: multiply` for authentic analog feel
- Applied to content containers, not globally (performance)

### Alternatives Considered
1. **Gradual migration**: Update colors incrementally → Rejected: causes inconsistent UI during transition
2. **CSS variables only**: Keep Tailwind classes → Rejected: harder to maintain, duplicate definitions
3. **Dark/light mode**: Add theme toggle → Rejected: out of scope, adds complexity

## Risks / Trade-offs
| Risk | Mitigation |
|------|------------|
| Breaking visual appearance | Full component audit, screenshot comparisons |
| Missed color references | Grep for old color values, lint for hardcoded colors |
| Contrast issues in charts | Test Recharts with new palette, adjust if needed |
| Performance (grain texture) | Texture is optional, applied sparingly |

## Migration Plan
1. Update CSS variables in `globals.css`
2. Update Tailwind theme inline configuration
3. Search and replace old color class names
4. Update component-specific colors (toasts, charts, etc.)
5. Test all UI states (hover, focus, active, disabled)
6. Visual regression check with screenshots

## Open Questions
1. Should film grain texture be enabled by default or opt-in?
   - **Decision needed**: User preference required
2. Should we keep "cosmic" naming in code or rename to "filmic"?
   - **Recommendation**: Rename for clarity
