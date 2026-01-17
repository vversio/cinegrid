## ADDED Requirements

### Requirement: User Authentication
The system SHALL provide login and signup functionality via Supabase Auth.

#### Scenario: User can sign up
- **WHEN** user clicks sign up and provides email/password
- **THEN** a new account is created and user is logged in

#### Scenario: User can log in
- **WHEN** user provides valid credentials
- **THEN** user is authenticated and can access their movies

#### Scenario: User can log out
- **WHEN** user clicks logout
- **THEN** session is cleared and user is logged out

### Requirement: Movie Search
The system SHALL allow users to search for movies using the TMDB API.

#### Scenario: Search returns results
- **WHEN** user enters a search query
- **THEN** matching movies from TMDB are displayed with poster and title

#### Scenario: User selects a movie
- **WHEN** user clicks on a search result
- **THEN** the movie details are populated in the add form

### Requirement: Add Movie Form
The system SHALL provide a form to add a watched movie with date, genre, and custom category.

#### Scenario: Date defaults to today
- **WHEN** add movie modal opens
- **THEN** the date picker defaults to today's date

#### Scenario: Genre pre-filled from TMDB
- **WHEN** a movie is selected from search
- **THEN** the genre dropdown is pre-filled with the movie's primary genre

#### Scenario: Custom category is optional
- **WHEN** user submits the form without custom category
- **THEN** the movie is saved with null custom_category

### Requirement: Movie Grid Display
The system SHALL display watched movies in a responsive poster grid.

#### Scenario: Grid layout adapts to screen size
- **WHEN** viewing on different screen sizes
- **THEN** the grid adjusts columns to fit available space

#### Scenario: Hover reveals custom category
- **WHEN** user hovers over a movie poster
- **THEN** the custom category (if set) is displayed as an overlay

#### Scenario: User can delete a movie
- **WHEN** user clicks delete on a movie
- **THEN** the movie is removed from their watched list
