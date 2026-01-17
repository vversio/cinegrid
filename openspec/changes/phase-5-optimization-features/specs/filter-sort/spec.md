## MODIFIED Requirements

### Requirement: Filter and Sort State Management
The application SHALL maintain filter and sort state correctly across re-renders and page interactions.

#### Scenario: Filter persistence
- **WHEN** user applies filters
- **THEN** filter state persists across re-renders
- **AND** filter state is stored in URL search params
- **AND** filters are restored on page reload
- **AND** movies do not disappear when filters are cleared

#### Scenario: Sort persistence
- **WHEN** user sorts movies
- **THEN** sort order persists across re-renders
- **AND** sort state is stored in URL search params
- **AND** movies do not disappear when sort is reset to default
- **AND** sort is restored on page reload

### Requirement: Favorites Filtering and Sorting
The application SHALL apply filters and sort to the favorites carousel.

#### Scenario: Filter favorites
- **WHEN** user applies filters (genre, rating, media type)
- **THEN** favorites carousel displays only matching favorites
- **AND** filter state is shared between main grid and favorites
- **AND** empty state is shown when no favorites match filters

#### Scenario: Sort favorites
- **WHEN** user sorts movies
- **THEN** favorites carousel is sorted using the same sort order
- **AND** sort applies to both grid and carousel consistently
