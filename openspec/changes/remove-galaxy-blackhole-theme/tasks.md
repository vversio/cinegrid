## 1. Update Proposal Documentation

- [ ] 1.1 Update `redesign-ui-cosmic/proposal.md`:
  - Remove "Cosmic Depth" theme name, replace with "dark theme" or "portfolio theme"
  - Remove "black hole design element" bullet point
  - Remove "gravitational black hole motif" from Why section
  - Remove black hole animation from Stakeholder Decisions table
  - Update color descriptions to be generic (keep values unchanged)

- [ ] 1.2 Update `redesign-ui-cosmic/design.md`:
  - Remove "Cosmic Depth aesthetic featuring a gravitational black hole motif" from Context
  - Remove "Custom theming beyond the Cosmic Depth palette" from Non-Goals
  - Update "Cosmic theme" references to "dark theme" or "portfolio theme"
  - Remove black hole animation from Open Questions section
  - Keep all technical decisions and color values unchanged

## 2. Update Spec Deltas

- [ ] 2.1 Update `redesign-ui-cosmic/specs/ui-theme/spec.md`:
  - RENAME "Cosmic Depth Color System" to "Dark Theme Color System"
  - REMOVE "Black Hole Background Element" requirement entirely
  - Update scenario descriptions to remove "cosmic" terminology where it refers to theme concept
  - Keep all color values and technical details unchanged

- [ ] 2.2 Update `redesign-ui-cosmic/specs/analytics-panel/spec.md`:
  - Replace "Cosmic Depth visual theme" with "dark theme"
  - Replace "cosmic-gray-muted" with generic description (keep color value)
  - Replace "Cosmic theme" with "dark theme"

- [ ] 2.3 Update `redesign-ui-cosmic/specs/filter-sort/spec.md`:
  - Replace "Cosmic Depth theme" with "dark theme"

## 3. Validation

- [ ] 3.1 Run `openspec validate remove-galaxy-blackhole-theme --strict`
- [ ] 3.2 Run `openspec validate redesign-ui-cosmic --strict` to ensure no breaking changes
- [ ] 3.3 Verify all color values and CSS variables remain unchanged in documentation
- [ ] 3.4 Confirm no references to "galaxy", "black hole", "cosmic depth" (as theme name) remain in proposal/design docs
