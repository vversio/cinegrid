## ADDED Requirements

### Requirement: Header Bar
The application SHALL display a fixed header bar at the top of the page containing navigation and controls.

#### Scenario: Header structure
- **WHEN** the page loads
- **THEN** a header bar (80px height) is displayed at the top
- **AND** the logo/wordmark is positioned on the left (40px height)
- **AND** filter/sort controls and user avatar are positioned on the right
- **AND** the header uses glass-morphic styling with 1px bottom border (violet 10% opacity)

#### Scenario: Header responsiveness
- **WHEN** viewport width is less than 768px
- **THEN** the header condenses to show logo and hamburger menu
- **AND** filter controls move into the mobile menu

### Requirement: Resizable Analytics Panel
The application SHALL display a resizable left sidebar containing analytics visualization.

#### Scenario: Panel default state
- **WHEN** the page loads on desktop
- **THEN** the analytics panel is displayed on the left with default width 325px
- **AND** the panel is resizable between 280px and 450px via drag handle
- **AND** the drag handle shows purple glow on hover

#### Scenario: Panel width persistence
- **WHEN** the user resizes the analytics panel
- **THEN** the new width is persisted to localStorage
- **AND** the width is restored on subsequent page loads

#### Scenario: Panel mobile behavior
- **WHEN** viewport width is less than 1440px
- **THEN** the analytics panel collapses to a drawer (shadcn Sheet)
- **AND** a floating action button (bottom-right) opens the drawer

### Requirement: Favorites Carousel Section
The application SHALL display a horizontal scrolling carousel of favorited movies and series above the main grid.

#### Scenario: Favorites display on desktop
- **WHEN** the user has favorited movies or series
- **AND** viewport width is 1440px or greater
- **THEN** a favorites carousel is displayed above the main grid
- **AND** cards are sized at 240x360px with hero styling
- **AND** 4-5 cards are visible with horizontal scroll and snap points

#### Scenario: Favorites display on tablet
- **WHEN** viewport width is between 768px and 1439px
- **THEN** favorites cards are sized at 200x300px
- **AND** 2-3 cards are visible with horizontal scroll

#### Scenario: Favorites display on mobile
- **WHEN** viewport width is less than 768px
- **THEN** favorites cards are sized at 160x240px
- **AND** 1.5 cards are visible (peek next card)
- **AND** snap scroll is enabled

#### Scenario: No favorites
- **WHEN** the user has no favorited items
- **THEN** the favorites section displays a placeholder
- **AND** placeholder shows star icon and "Add your first favorite" text
- **AND** placeholder uses glass-morphic card styling

### Requirement: Movie/Series Grid Layout
The application SHALL display watched movies and series in a responsive grid layout.

#### Scenario: Desktop grid
- **WHEN** viewport width is 1920px or greater
- **THEN** the grid displays 5-6 columns
- **AND** gap between cards is 24px

#### Scenario: Tablet grid
- **WHEN** viewport width is between 768px and 1439px
- **THEN** the grid displays 3-4 columns
- **AND** gap between cards is 16px

#### Scenario: Mobile grid
- **WHEN** viewport width is less than 768px
- **THEN** the grid displays 2 columns
- **AND** gap between cards is 16px

#### Scenario: Empty grid
- **WHEN** user has no watched movies or series
- **THEN** a large empty state is displayed
- **AND** empty state includes illustration and CTA to add first movie

### Requirement: Visual Separation
The application SHALL visually separate major layout sections.

#### Scenario: Analytics to grid separation
- **WHEN** analytics panel and grid are both visible
- **THEN** a 20px gap with subtle shadow separates them

#### Scenario: Favorites to grid separation
- **WHEN** favorites carousel and grid are both visible
- **THEN** 40px vertical spacing separates them
- **AND** an optional subtle horizontal separator (1px, 5% white opacity) may be shown
