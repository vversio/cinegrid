## ADDED Requirements

### Requirement: Statistics Dashboard
The application SHALL display statistics about watched movies including total hours and top directors.

#### Scenario: Display statistics
- **WHEN** user views the analytics panel
- **THEN** statistics are displayed including:
  - Total hours watched (estimated from runtime)
  - Top directors (from TMDB data)
  - Additional metrics (total movies, total series, average rating)
- **AND** statistics are calculated client-side
- **AND** loading state is shown during calculation
- **AND** statistics update when movies are added or removed

#### Scenario: Statistics calculation
- **WHEN** statistics are calculated
- **THEN** total hours are estimated from movie/series runtime
- **AND** top directors are aggregated from TMDB data
- **AND** calculations are performed efficiently (memoized)
- **AND** errors in calculation are handled gracefully
