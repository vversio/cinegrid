## MODIFIED Requirements

### Requirement: Filter Controls Visual Style
The filter and sort controls SHALL use Filmic Grain theme colors for consistent styling.

#### Scenario: Dropdown trigger styling
- **WHEN** filter dropdown triggers are rendered
- **THEN** they use Wet Charcoal (#222023) background
- **AND** border uses Purple Seduction (#522A6F) at low opacity
- **AND** text uses Rosarian (#FAEADD)
- **AND** icon/chevron uses Harmonious Rose (#F29CB7)

#### Scenario: Dropdown hover state
- **WHEN** user hovers over a filter dropdown
- **THEN** background lightens slightly toward Purple Seduction
- **AND** subtle glow effect using Testosterose (#DDAAFF) at low opacity
- **AND** text remains Rosarian (#FAEADD)

#### Scenario: Dropdown expanded state
- **WHEN** a filter dropdown is expanded
- **THEN** the options container uses elevated Wet Charcoal
- **AND** selected option highlighted with Purple Seduction background
- **AND** hover state uses Testosterose (#DDAAFF) tint
- **AND** checkmark icon uses Solarized (#FBCF4F)

#### Scenario: Clear filters button
- **WHEN** active filters exist
- **THEN** clear button text uses Harmonious Rose (#F29CB7)
- **AND** hover state transitions to Rosarian (#FAEADD)
