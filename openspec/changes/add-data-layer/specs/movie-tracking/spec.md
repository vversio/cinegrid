## ADDED Requirements

### Requirement: Watched Movies Data Model
The system SHALL store watched movie entries with the following attributes: unique ID, user ID, TMDB movie ID, title, poster path, watched date, genre, and optional custom category.

#### Scenario: Movie entry structure
- **WHEN** a movie is added to the watched list
- **THEN** it contains tmdb_id, title, poster_path, watched_date, genre, and optional custom_category

### Requirement: User Data Isolation
The system SHALL enforce Row Level Security to ensure users can only access their own movie entries.

#### Scenario: User can only read own movies
- **WHEN** a user queries the watched_movies table
- **THEN** only movies where user_id matches the authenticated user are returned

#### Scenario: User can only insert own movies
- **WHEN** a user inserts a movie entry
- **THEN** the user_id must match the authenticated user

#### Scenario: User can only delete own movies
- **WHEN** a user deletes a movie entry
- **THEN** only movies where user_id matches the authenticated user can be deleted

### Requirement: Data Access Functions
The system SHALL provide TypeScript functions for creating, reading, and deleting watched movie entries.

#### Scenario: Fetch all watched movies
- **WHEN** getWatchedMovies() is called
- **THEN** returns all movies for the authenticated user ordered by watched_date descending

#### Scenario: Add a new watched movie
- **WHEN** addWatchedMovie() is called with movie data
- **THEN** inserts a new entry and returns the created movie

#### Scenario: Delete a watched movie
- **WHEN** deleteWatchedMovie() is called with a movie ID
- **THEN** removes the entry from the database
