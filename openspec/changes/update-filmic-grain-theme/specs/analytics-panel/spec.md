## MODIFIED Requirements

### Requirement: Analytics Panel Visual Style
The analytics panel SHALL use Filmic Grain theme colors for all visual elements.

#### Scenario: Panel background styling
- **WHEN** the analytics panel is rendered
- **THEN** it uses Wet Charcoal (#222023) as base background
- **AND** glass effect with Purple Seduction border tint
- **AND** text uses Rosarian (#FAEADD) for headings
- **AND** muted text uses Harmonious Rose (#F29CB7)

#### Scenario: Chart color palette
- **WHEN** charts/graphs are rendered in the analytics panel
- **THEN** chart colors use Filmic Grain accent palette:
  - Primary: Testosterose (#DDAAFF)
  - Secondary: Harmonious Rose (#F29CB7)
  - Tertiary: Solarized (#FBCF4F)
  - Quaternary: Purple Seduction (#522A6F)
- **AND** gradients fade from accent color to Wet Charcoal

#### Scenario: Quick stats styling
- **WHEN** quick stats cards are rendered
- **THEN** they use slightly elevated Wet Charcoal background
- **AND** stat values use Rosarian (#FAEADD)
- **AND** stat labels use Harmonious Rose (#F29CB7)
