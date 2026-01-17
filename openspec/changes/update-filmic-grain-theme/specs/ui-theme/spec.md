## MODIFIED Requirements

### Requirement: Filmic Grain Color System
The application SHALL use the "Filmic Grain" color palette as the primary visual theme, inspired by analog film photography with warm beige, violet, and yellow accents.

#### Scenario: Base colors applied
- **WHEN** the application loads
- **THEN** the background uses Wet Charcoal (#222023)
- **AND** elevated surfaces use slightly lighter charcoal (#2a282b)
- **AND** primary text uses Rosarian warm beige (#FAEADD)
- **AND** secondary text uses Harmonious Rose (#F29CB7)
- **AND** accent/interactive states use Testosterose lavender (#DDAAFF)
- **AND** highlights/notifications use Solarized warm yellow (#FBCF4F)

#### Scenario: Glass-morphism surfaces
- **WHEN** elevated UI elements are rendered (header, panels, cards)
- **THEN** they SHALL use backdrop-blur with 5-10% Wet Charcoal tinting
- **AND** subtle borders with Purple Seduction opacity (8-20%)
- **AND** optional film grain texture overlay at 3-5% opacity

#### Scenario: Text contrast compliance
- **WHEN** text is rendered on dark backgrounds
- **THEN** Rosarian (#FAEADD) on Wet Charcoal (#222023) provides 17.87:1 contrast
- **AND** Testosterose (#DDAAFF) on Wet Charcoal provides 11.26:1 contrast
- **AND** Harmonious Rose (#F29CB7) on Wet Charcoal provides 10.21:1 contrast
- **AND** all text pairings meet WCAG AA minimum (4.5:1 normal, 3:1 large)

### Requirement: Typography System
The application SHALL use a consistent typography scale with appropriate Filmic Grain colors.

#### Scenario: Font scale application
- **WHEN** text is rendered
- **THEN** H1 (page titles) use 32px, weight 700, letter-spacing -0.02em
- **AND** H2 (section headers) use 24px, weight 600
- **AND** Body text uses 16px, weight 400, line-height 1.6
- **AND** Captions use 14px, weight 500
- **AND** Labels use 12px, weight 600, uppercase, letter-spacing 0.05em

#### Scenario: Text colors by context
- **WHEN** text is rendered
- **THEN** headings use Rosarian (#FAEADD) or Purple Seduction (#522A6F)
- **AND** body text on dark uses Rosarian (#FAEADD)
- **AND** body text on light uses Wet Charcoal (#222023)
- **AND** links use Testosterose (#DDAAFF) with Solarized (#FBCF4F) hover
- **AND** captions/placeholders use Harmonious Rose (#F29CB7) at 85% opacity

## ADDED Requirements

### Requirement: Film Grain Texture Effect
The application SHALL support an optional film grain texture overlay to create authentic analog aesthetics when enabled.

#### Scenario: Grain texture applied to content
- **WHEN** film grain effect is enabled
- **THEN** a grayscale filter (5%) and contrast boost (102%) is applied
- **AND** an optional background texture image at 3-5% opacity
- **AND** mix-blend-mode: multiply for authentic film look
- **AND** the effect does NOT apply to interactive elements (buttons, inputs)
- **AND** prefers-reduced-motion disables animated grain

#### Scenario: Performance optimization
- **WHEN** film grain is rendered
- **THEN** it applies only to static content containers
- **AND** does NOT affect scrolling performance
- **AND** does NOT interfere with backdrop-blur effects
