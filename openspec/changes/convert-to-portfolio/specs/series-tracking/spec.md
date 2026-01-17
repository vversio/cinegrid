## ADDED Requirements

### Requirement: TV Series Search
The system SHALL allow searching for TV series using the TMDB API.

#### Scenario: Search returns series results
- **WHEN** user searches for a TV series name
- **THEN** matching series from TMDB are displayed with poster and title

#### Scenario: Series selection pre-fills genre
- **WHEN** a series is selected from search results
- **THEN** the genre dropdown is pre-filled with the series' primary genre

### Requirement: Series Data Model
The system SHALL store TV series entries with the same structure as movies, distinguished by media_type='series'.

#### Scenario: Series entry stored
- **WHEN** a series is added to the watched list
- **THEN** it is stored with media_type='series' and all standard fields (tmdb_id, title, poster_path, watched_date, genre, custom_category)

### Requirement: Mixed Media Display
The system SHALL display both movies and series in the same grid, with visual indicators for media type.

#### Scenario: Grid shows movies and series
- **WHEN** viewing the movie grid
- **THEN** both movies and series are displayed together, sorted by watched_date

#### Scenario: Media type indicator
- **WHEN** viewing a series entry
- **THEN** a visual indicator (badge or icon) shows it is a series
