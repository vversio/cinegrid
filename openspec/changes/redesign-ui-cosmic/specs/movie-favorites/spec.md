## ADDED Requirements

### Requirement: Favorite Toggle
The application SHALL allow the admin to mark movies and series as favorites.

#### Scenario: Toggle favorite on card hover
- **WHEN** admin hovers over a movie/series card
- **AND** clicks the favorite toggle button (heart or star icon)
- **THEN** the item's `is_favorite` status is toggled in the database
- **AND** the UI updates immediately (optimistic update)
- **AND** if newly favorited, the item appears in the favorites carousel

#### Scenario: Optimistic favorite toggle
- **WHEN** admin clicks the favorite toggle
- **THEN** the icon updates immediately
- **AND** if API call fails, the icon reverts to previous state
- **AND** a toast notification shows the error

#### Scenario: Toggle favorite in add modal
- **WHEN** admin is adding a new movie/series
- **THEN** a favorite toggle is available in the add modal
- **AND** the initial state is not favorited (unchecked)

#### Scenario: Visitor cannot toggle favorites
- **WHEN** a non-admin visitor views the site
- **THEN** the favorite toggle button is not displayed on cards
- **AND** favorites are view-only in the carousel

### Requirement: Favorites Display
The application SHALL display favorited items in a dedicated carousel.

#### Scenario: Favorites carousel content
- **WHEN** the page loads
- **THEN** all items where `is_favorite = true` are fetched
- **AND** displayed in the favorites carousel section
- **AND** sorted by `created_at` descending (most recently favorited first)

#### Scenario: Favorite card styling
- **WHEN** a favorite item is displayed in the carousel
- **THEN** the card uses elevated glass-morphic styling
- **AND** a subtle purple glow border distinguishes it from regular grid cards
- **AND** card size is larger than grid cards (240x360px on desktop)

#### Scenario: Favorites carousel empty state
- **WHEN** the user has no favorited items
- **THEN** the carousel area displays a placeholder card
- **AND** placeholder shows star icon and "Add your first favorite" text
- **AND** placeholder has glass-morphic styling with dashed border

#### Scenario: Favorites carousel loading
- **WHEN** favorites are being fetched
- **THEN** 3 skeleton cards are displayed with shimmer effect
- **AND** skeletons match the hero card dimensions

### Requirement: Database Schema for Favorites
The `watched_movies` table SHALL include an `is_favorite` column.

#### Scenario: Favorite column structure
- **WHEN** the database schema is queried
- **THEN** `is_favorite` column exists with type BOOLEAN
- **AND** default value is `false`
- **AND** column is NOT NULL

#### Scenario: Favorites index
- **WHEN** favorites are queried
- **THEN** a partial index `idx_watched_movies_favorite` optimizes the query
- **AND** index covers `WHERE is_favorite = true`
