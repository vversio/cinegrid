## Context
CineGrid currently uses a "Filmic Grain" theme with neon colors (fuchsia, cyan, purple) and a GIF background. The user requested a modernized, sleek design with:
- Minimal aesthetic (like Next.js default page)
- Neutral grays/whites only (no color accents)
- Bold Poppins typography
- Preserved glass/blur effects

## Goals
- Create ultra-minimal dark theme with neutral palette
- Replace GIF with subtle aurora/blur background effect
- Maintain glass-morphism aesthetic with neutral tints
- Improve readability with proper text hierarchy
- Keep all functionality unchanged (styling-only)

## Non-Goals
- Adding new features or functionality
- Changing component structure or behavior
- Supporting light mode (dark theme only)
- Custom user theming

## Decisions

### Color Palette
**Decision**: Pure grayscale palette with no accent colors

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0f0f0f` | Main background |
| `--bg-secondary` | `#1a1a1a` | Elevated surfaces, cards |
| `--bg-tertiary` | `#252525` | Higher elevation, hover states |
| `--text-primary` | `#ffffff` | Headings, important text |
| `--text-secondary` | `#a0a0a0` | Body text, labels |
| `--text-muted` | `#666666` | Captions, disabled states |
| `--border-subtle` | `rgba(255,255,255,0.08)` | Default borders |
| `--border-hover` | `rgba(255,255,255,0.15)` | Hover state borders |

**Rationale**: Ultra-minimal look requested, neutral grays provide professional appearance while maintaining readability.

### Background Effect
**Decision**: Subtle aurora/blur gradient replacing GIF

```css
background: radial-gradient(ellipse, rgba(255,255,255,0.03) 0%, transparent 70%);
filter: blur(80px);
```

**Rationale**: Matches the reference image (Next.js default page) with subtle light bloom in center.

### Typography
**Decision**: Bold Poppins with weights 400-800

**Rationale**: User requested "much more bold Poppins" - adding weight 800 for extra emphasis on headings.

### Glass Effects
**Decision**: Keep backdrop-blur with neutral tint

```css
--glass-bg: rgba(26, 26, 26, 0.8);
--glass-border: rgba(255, 255, 255, 0.08);
```

**Rationale**: Preserves the filmic/blurry transparent effects requested while removing color tints.

### Chart Colors
**Decision**: Grayscale palette

```ts
['#ffffff', '#c0c0c0', '#909090', '#606060', '#404040']
```

**Rationale**: Maintains visual distinction between data series while staying neutral.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Reduced visual interest | Aurora blur adds subtle depth |
| Charts harder to distinguish | Varying brightness levels provide contrast |
| Loss of brand identity | Keep Starlord font for logo |

## Migration Plan

1. Update CSS variables in `globals.css`
2. Update `BackgroundEffect.tsx` with aurora blur
3. Update typography weights in `layout.tsx`
4. Systematically update all 17 components
5. Update chart utilities
6. Visual review and adjustments

No database or API changes required. Changes can be reverted by restoring previous CSS.

## Open Questions
- None (all design decisions confirmed by user)
