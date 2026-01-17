## ADDED Requirements

### Requirement: Genre Trend Chart
The analytics panel SHALL display a line/area chart showing viewing trends by genre over time.

#### Scenario: Chart visualization
- **WHEN** the analytics panel is viewed
- **AND** user has watch history
- **THEN** a Recharts AreaChart displays genre viewing trends
- **AND** X-axis shows time periods (months)
- **AND** Y-axis shows watch count
- **AND** each genre is represented as a stacked area (max 7 top genres)
- **AND** areas use violet/purple gradient fills (20% opacity)

#### Scenario: Time range toggle
- **WHEN** the user clicks the time range toggle
- **THEN** they can switch between "All Time" and "This Year" views
- **AND** the toggle uses a minimal pill design positioned top-right of panel
- **AND** selection is persisted to localStorage

#### Scenario: Chart tooltip
- **WHEN** user hovers over a data point
- **THEN** a glass-styled tooltip appears
- **AND** shows genre name, time period (e.g., "January 2025"), and count

#### Scenario: Data aggregation
- **WHEN** chart data is loaded
- **THEN** data is aggregated by month and genre
- **AND** only top 7 genres by total count are displayed
- **AND** remaining genres are grouped as "Other" if needed

### Requirement: Chart Styling
The chart SHALL match the Cosmic Depth visual theme.

#### Scenario: Chart colors
- **WHEN** the chart is rendered
- **THEN** area fills use violet/purple gradients with transparency
- **AND** line strokes use white/light-purple (#b0a8c0)
- **AND** grid lines are minimal and low-opacity (10%)
- **AND** background is transparent (inherits panel background)
- **AND** axis labels use cosmic-gray-muted color (#b0a8c0)

### Requirement: Analytics Empty State
The analytics panel SHALL display an appropriate empty state when no data exists.

#### Scenario: No viewing data
- **WHEN** the user has no watched movies or series
- **THEN** a placeholder chart area is shown with subtle grid lines
- **AND** centered text reads "Start tracking movies to see trends"
- **AND** the empty state matches the Cosmic theme (violet tint)

### Requirement: Analytics Loading State
The analytics panel SHALL display a loading state while data is being fetched.

#### Scenario: Chart loading
- **WHEN** analytics data is being fetched
- **THEN** pulsing placeholder bars are shown in chart area
- **AND** bars have shimmer effect with purple tinting
- **AND** toggle is disabled during loading

### Requirement: Analytics Error State
The analytics panel SHALL handle errors gracefully.

#### Scenario: Data fetch failure
- **WHEN** analytics data fails to load
- **THEN** an error message is displayed in the panel
- **AND** a "Retry" button is shown
- **AND** clicking retry re-fetches the data

## REMOVED Requirements

### Requirement: Nivo Heatmap Visualization
**Reason**: Replaced with Recharts line/area chart for better performance (~50% smaller bundle) and clearer data presentation (trends over time more intuitive than genre x month matrix).
**Migration**: Data transformation utilities will be rewritten for new chart format. No user action required.
