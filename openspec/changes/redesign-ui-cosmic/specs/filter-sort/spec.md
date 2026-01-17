## ADDED Requirements

### Requirement: Sort Controls
The application SHALL provide sorting options for the movie/series grid.

#### Scenario: Available sort options
- **WHEN** user opens the sort dropdown in the header
- **THEN** the following options are available:
  - Recently Added (watched_date descending) - default
  - Title A-Z (title ascending)
  - Title Z-A (title descending)
  - Rating High-Low (user_rating descending, nulls last)
  - Release Date (newest first)

#### Scenario: Sort selection
- **WHEN** user selects a sort option
- **THEN** the grid re-orders immediately
- **AND** the sort selection is reflected in URL search params (`?sort=rating-desc`)
- **AND** the selection persists on page refresh

### Requirement: Filter Controls
The application SHALL provide filtering options for the movie/series grid.

#### Scenario: Media type filter
- **WHEN** user opens the filter dropdown
- **THEN** options include: All, Movies Only, Series Only
- **AND** selecting an option filters the grid to matching items
- **AND** filter is reflected in URL (`?filter=movies`)

#### Scenario: Genre filter (multi-select)
- **WHEN** user opens the genre filter dropdown
- **THEN** all genres present in the user's collection are listed as checkboxes
- **AND** user can select multiple genres
- **AND** grid shows items matching ANY selected genre
- **AND** selection is reflected in URL (`?genre=action,drama`)

#### Scenario: Minimum rating filter
- **WHEN** user opens the min rating dropdown
- **THEN** options include: Any, 1+, 2+, 3+, 4+, 5 only
- **AND** selecting an option filters to items with rating >= selected value
- **AND** unrated items are excluded when filter is active

#### Scenario: Filter URL persistence
- **WHEN** filters are applied
- **THEN** filter state is stored in URL search params
- **AND** sharing the URL preserves the filter state
- **AND** browser back/forward navigates filter history

#### Scenario: Clear filters
- **WHEN** any filter is active
- **THEN** a "Clear Filters" button appears
- **AND** clicking it resets all filters to default
- **AND** URL params are cleared

### Requirement: Filter/Sort UI Design
The filter and sort controls SHALL match the Cosmic Depth theme.

#### Scenario: Dropdown styling
- **WHEN** a dropdown is rendered
- **THEN** it uses shadcn/ui Select component
- **AND** styled with glass-morphic background (backdrop-blur)
- **AND** purple highlight on active/selected state
- **AND** violet border (10% opacity)

#### Scenario: Control positioning on desktop
- **WHEN** the header is rendered on desktop (1440px+)
- **THEN** filter/sort controls are positioned right side, before user avatar
- **AND** controls are horizontally arranged with 12px gap

#### Scenario: Control positioning on mobile
- **WHEN** viewport width is less than 768px
- **THEN** filter/sort controls are accessible via hamburger menu
- **AND** controls stack vertically in the mobile menu
