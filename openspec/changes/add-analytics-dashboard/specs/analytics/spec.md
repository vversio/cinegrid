## ADDED Requirements

### Requirement: Genre vs Time Heatmap Visualization
The system SHALL display a heatmap visualization showing viewing patterns by genre over time.

#### Scenario: Heatmap displays genres on Y-axis
- **WHEN** analytics dashboard is viewed
- **THEN** each unique genre from watched movies/series appears as a row on the Y-axis

#### Scenario: Heatmap displays months on X-axis
- **WHEN** analytics dashboard is viewed
- **THEN** each month (YYYY-MM format) with watched content appears as a column on the X-axis

#### Scenario: Color intensity represents viewing frequency
- **WHEN** viewing the heatmap
- **THEN** each cell's color intensity corresponds to the number of movies/series watched in that genre/month combination

#### Scenario: Heatmap includes all genres
- **WHEN** movies/series have different genres
- **THEN** all unique genres are displayed as rows

#### Scenario: Heatmap includes all months with data
- **WHEN** movies/series span multiple months
- **THEN** all months containing watched content are displayed as columns

### Requirement: Data Transformation
The system SHALL transform raw movie/series data into Nivo heatmap format.

#### Scenario: Data is aggregated by genre and month
- **WHEN** transforming watched movies/series data
- **THEN** counts are aggregated for each unique genre/month combination

#### Scenario: Empty months are handled
- **WHEN** a genre has no movies in a particular month
- **THEN** that cell shows zero (lightest color)

### Requirement: Analytics Dashboard Navigation
The system SHALL provide a way to switch between grid view and analytics view.

#### Scenario: User can switch to analytics view
- **WHEN** user clicks on analytics tab/view
- **THEN** the heatmap visualization is displayed

#### Scenario: User can switch back to grid view
- **WHEN** user clicks on grid tab/view
- **THEN** the movie/series grid is displayed

### Requirement: Heatmap Styling
The system SHALL use a monochromatic color scale matching the minimalist aesthetic.

#### Scenario: Color scale is monochromatic
- **WHEN** viewing the heatmap
- **THEN** colors range from light blue (low frequency) to dark blue (high frequency)

#### Scenario: Tooltip shows details
- **WHEN** hovering over a heatmap cell
- **THEN** tooltip displays genre, month, and count
