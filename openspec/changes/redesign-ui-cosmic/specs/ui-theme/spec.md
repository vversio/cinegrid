## ADDED Requirements

### Requirement: Cosmic Depth Color System
The application SHALL use the "Cosmic Depth" color palette as the primary visual theme, consisting of deep space blacks, dark violets, and purple highlights.

#### Scenario: Base colors applied
- **WHEN** the application loads
- **THEN** the background uses deep space black (#0a0a0f, #13131a)
- **AND** accent colors use dark violet (#1a0f2e, #2d1b4e) with 60-80% opacity
- **AND** highlight/interactive states use purple tones (#4a2d6d, #6b4fa0)
- **AND** text uses crisp whites (#ffffff, #f5f5f7)

#### Scenario: Glass-morphism surfaces
- **WHEN** elevated UI elements are rendered (header, panels, cards)
- **THEN** they SHALL use backdrop-blur with 5-10% white/violet tinting
- **AND** subtle borders with violet opacity (8-20%)

### Requirement: Black Hole Background Element
The application SHALL display a fixed radial gradient element in the bottom-right corner creating the "gravitational pull" visual anchor.

#### Scenario: Background gradient positioning
- **WHEN** the page is rendered
- **THEN** a radial gradient is positioned at `bottom: -150px, right: -150px`
- **AND** the gradient radiates from #1a0f2e (center) to #0a0a0f (40%) to transparent (70%)
- **AND** the element has `filter: blur(100px)` applied
- **AND** the element is behind all content (z-index: -1)

### Requirement: Typography System
The application SHALL use a consistent typography scale with system fonts.

#### Scenario: Font scale application
- **WHEN** text is rendered
- **THEN** H1 (page titles) use 32px, weight 700, letter-spacing -0.02em
- **AND** H2 (section headers) use 24px, weight 600
- **AND** Body text uses 16px, weight 400, line-height 1.6
- **AND** Captions use 14px, weight 500
- **AND** Labels use 12px, weight 600, uppercase, letter-spacing 0.05em

#### Scenario: Text colors
- **WHEN** text is rendered
- **THEN** headings use white (#ffffff)
- **AND** body text uses light gray (#e5e5e7)
- **AND** muted text uses purple-tinted gray (#b0a8c0)
