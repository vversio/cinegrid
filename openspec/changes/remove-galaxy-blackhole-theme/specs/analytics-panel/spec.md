## MODIFIED Requirements

### Requirement: Chart Styling
The chart SHALL match the dark theme visual style.

#### Scenario: Chart colors
- **WHEN** the chart is rendered
- **THEN** area fills use violet/purple gradients with transparency
- **AND** line strokes use white/light-purple (#b0a8c0)
- **AND** grid lines are minimal and low-opacity (10%)
- **AND** background is transparent (inherits panel background)
- **AND** axis labels use muted gray color (#b0a8c0)

### Requirement: Analytics Empty State
The analytics panel SHALL display an appropriate empty state when no data exists.

#### Scenario: No viewing data
- **WHEN** the user has no watched movies or series
- **THEN** a placeholder chart area is shown with subtle grid lines
- **AND** centered text reads "Start tracking movies to see trends"
- **AND** the empty state matches the dark theme (violet tint)
