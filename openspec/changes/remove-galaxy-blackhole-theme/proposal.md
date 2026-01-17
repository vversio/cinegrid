## Why

The current documentation references a "Cosmic Depth" theme with "galaxy" and "black hole" motifs, but these conceptual references are no longer desired. The UI implementation (colors, styling, layout) should remain unchanged, but documentation should use more generic theme naming without space/galaxy/blackhole terminology.

## What Changes

### Documentation Updates
- **Remove "Cosmic Depth" theme name**: Replace with generic "dark theme" or "portfolio theme" references
- **Remove "black hole" references**: Remove mentions of gravitational pull, black hole design elements, and related space motifs
- **Remove "galaxy" references**: Remove any galaxy-related terminology
- **Update color descriptions**: Keep color values unchanged but describe them generically (e.g., "dark purple palette" instead of "cosmic violet")
- **Update proposal.md**: Remove black hole animation references and space-themed descriptions
- **Update design.md**: Remove cosmic/galaxy/blackhole context and reasoning
- **Update spec deltas**: Remove "Black Hole Background Element" requirement and update "Cosmic Depth" references to generic theme naming

### UI Implementation
- **NO CHANGES**: All colors, styling, CSS variables, and visual design remain exactly as implemented
- Color values stay the same (e.g., `--cosmic-black`, `--cosmic-violet` remain in code)
- CSS classes and utility names remain unchanged
- BackgroundEffect component remains (currently returns null, but structure stays)

## Impact

- **Affected specs**: `redesign-ui-cosmic/specs/ui-theme/spec.md` (MODIFIED - remove black hole requirement, rename cosmic depth)
- **Affected documentation**:
  - `openspec/changes/redesign-ui-cosmic/proposal.md` - Remove black hole/galaxy references
  - `openspec/changes/redesign-ui-cosmic/design.md` - Remove cosmic/galaxy context
  - `openspec/changes/redesign-ui-cosmic/specs/ui-theme/spec.md` - Update theme naming
  - `openspec/changes/redesign-ui-cosmic/specs/analytics-panel/spec.md` - Update cosmic theme references
  - `openspec/changes/redesign-ui-cosmic/specs/filter-sort/spec.md` - Update cosmic theme references
- **Affected code**: None (documentation-only change)

## Stakeholder Decisions

| Question | Decision |
|----------|----------|
| Keep color variable names in code? | Yes, keep `--cosmic-*` variable names in CSS (implementation unchanged) |
| Replace theme name in documentation? | Yes, use generic "dark theme" or "portfolio theme" |
| Remove BackgroundEffect component? | No, keep component structure (currently returns null) |
| Update CSS class names? | No, keep existing class names (e.g., `.glass`, `.cosmic-glow`) |
