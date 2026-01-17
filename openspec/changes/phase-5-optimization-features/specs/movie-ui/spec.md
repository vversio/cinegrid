## MODIFIED Requirements

### Requirement: Movie Grid Display
The application SHALL display movies with proper loading states and error handling.

#### Scenario: Loading state during mutations
- **WHEN** a movie is being added
- **THEN** a loading indicator is shown
- **AND** the add button is disabled
- **AND** the modal cannot be closed during the operation
- **AND** on completion, the grid updates without requiring a refresh

#### Scenario: Error handling
- **WHEN** a movie operation fails
- **THEN** an error message is displayed
- **AND** the UI state is reverted if optimistic update was applied
- **AND** the user can retry the operation

## ADDED Requirements

### Requirement: Movie Details Modal
The application SHALL display movie details including TMDB overview in a modal.

#### Scenario: Open movie details
- **WHEN** user clicks on a movie card
- **THEN** a modal opens displaying the movie overview from TMDB
- **AND** the modal shows loading state while fetching details
- **AND** the modal can be closed with Escape key or close button
- **AND** the modal is styled with Filmic Grain theme

#### Scenario: Movie details fetch
- **WHEN** movie details are requested
- **THEN** TMDB API is called for movie/series details
- **AND** only the overview field is displayed
- **AND** errors are handled gracefully with fallback message

### Requirement: Search Within Watched Movies
The application SHALL provide search functionality to filter watched movies by title, genre, or custom category.

#### Scenario: Search movies
- **WHEN** user types in the search bar
- **THEN** movies are filtered in real-time (debounced)
- **AND** search matches title, genre, and custom category
- **AND** search results are highlighted
- **AND** search integrates with existing filter system
- **AND** empty state is shown when no results match

#### Scenario: Search debouncing
- **WHEN** user types in search input
- **THEN** search is debounced by 300ms
- **AND** previous search requests are cancelled if new input arrives
- **AND** search only executes after user stops typing
