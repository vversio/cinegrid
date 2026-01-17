## ADDED Requirements

### Requirement: Star Rating System
The application SHALL allow the admin to rate movies and series on a 5-star scale.

#### Scenario: Set rating when adding
- **WHEN** admin is adding a new movie/series via the add modal
- **THEN** an optional 5-star rating input is available
- **AND** rating can be left unset (null)
- **AND** clicking a star sets that rating (1-5)
- **AND** stars animate with scale pulse on selection

#### Scenario: Update rating on card hover
- **WHEN** admin hovers over a movie/series card
- **THEN** the star rating becomes interactive
- **AND** clicking a star updates the rating in the database
- **AND** star icons animate with scale pulse (1.0 to 1.2 to 1.0 over 0.3s)

#### Scenario: Optimistic rating update
- **WHEN** admin clicks a star to update rating
- **THEN** the UI updates immediately (optimistic)
- **AND** if API call fails, the UI reverts to previous state
- **AND** a toast notification shows the error

#### Scenario: Display rating on card
- **WHEN** a movie/series card is rendered
- **AND** the item has a rating
- **THEN** the rating is displayed as filled star icons (Lucide Star)
- **AND** unrated stars are shown as outlines
- **AND** half-star display is NOT supported (integers only)

#### Scenario: Visitor view of ratings
- **WHEN** a non-admin visitor views the site
- **THEN** ratings are displayed as read-only filled/empty stars
- **AND** no hover interaction is available
- **AND** no click handlers are attached

### Requirement: Database Schema for Ratings
The `watched_movies` table SHALL include a `user_rating` column.

#### Scenario: Rating column structure
- **WHEN** the database schema is queried
- **THEN** `user_rating` column exists with type INTEGER
- **AND** value is constrained: `CHECK (user_rating >= 1 AND user_rating <= 5)`
- **AND** column is NULLABLE (rating is optional)

### Requirement: Sort by Rating
The application SHALL allow sorting the grid by rating.

#### Scenario: Sort high to low
- **WHEN** user selects "Rating High-Low" sort option
- **THEN** the grid displays items ordered by user_rating descending
- **AND** unrated items (NULL) appear at the end

### Requirement: Filter by Minimum Rating
The application SHALL allow filtering by minimum rating.

#### Scenario: Filter active
- **WHEN** user selects a minimum rating filter (e.g., "3+")
- **THEN** only items with user_rating >= 3 are shown
- **AND** unrated items are excluded from results
