## MODIFIED Requirements

### Requirement: Dark Theme Color System
The application SHALL use a dark theme color palette as the primary visual theme, consisting of deep blacks, dark violets, and purple highlights.

#### Scenario: Base colors applied
- **WHEN** the application loads
- **THEN** the background uses deep black (#0a0a0f, #13131a)
- **AND** accent colors use dark violet (#1a0f2e, #2d1b4e) with 60-80% opacity
- **AND** highlight/interactive states use purple tones (#4a2d6d, #6b4fa0)
- **AND** text uses crisp whites (#ffffff, #f5f5f7)

#### Scenario: Glass-morphism surfaces
- **WHEN** elevated UI elements are rendered (header, panels, cards)
- **THEN** they SHALL use backdrop-blur with 5-10% white/violet tinting
- **AND** subtle borders with violet opacity (8-20%)

## REMOVED Requirements

### Requirement: Black Hole Background Element
**Reason**: The black hole/galaxy motif is no longer desired as a design concept.
**Migration**: BackgroundEffect component structure remains in code but currently returns null. No visual changes to UI.
