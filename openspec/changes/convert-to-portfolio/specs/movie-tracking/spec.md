## MODIFIED Requirements

### Requirement: Watched Movies Data Model
The system SHALL store watched movie and series entries with the following attributes: unique ID, TMDB media ID, title, poster path, watched date, genre, optional custom category, and media type (movie/series). **BREAKING**: user_id is removed as this is a single-owner portfolio.

#### Scenario: Movie entry structure
- **WHEN** a movie is added to the watched list
- **THEN** it contains tmdb_id, title, poster_path, watched_date, genre, media_type='movie', and optional custom_category (no user_id)

#### Scenario: Series entry structure
- **WHEN** a series is added to the watched list
- **THEN** it contains tmdb_id, title, poster_path, watched_date, genre, media_type='series', and optional custom_category (no user_id)

### Requirement: Public Data Access
The system SHALL allow public (unauthenticated) users to view all watched movies and series.

#### Scenario: Public user can view all movies
- **WHEN** an unauthenticated user queries the watched_movies table
- **THEN** all movies and series are returned, ordered by watched_date descending

#### Scenario: Public user cannot add movies
- **WHEN** an unauthenticated user attempts to insert a movie entry
- **THEN** the operation is rejected with an authentication error

### Requirement: Admin-Only Write Access
The system SHALL restrict adding and deleting movies/series to authenticated admin users only.

#### Scenario: Admin can add movies
- **WHEN** an authenticated admin user adds a movie
- **THEN** the entry is inserted without user_id

#### Scenario: Admin can delete movies
- **WHEN** an authenticated admin user deletes a movie
- **THEN** the entry is removed from the database

#### Scenario: Non-admin cannot add movies
- **WHEN** a non-admin user attempts to add a movie
- **THEN** the operation is rejected

## REMOVED Requirements

### Requirement: User Data Isolation
**Reason**: Converting to single-owner portfolio model. All data is public for viewing, only admin can modify.
**Migration**: Remove user_id column and related RLS policies that filter by user_id.
