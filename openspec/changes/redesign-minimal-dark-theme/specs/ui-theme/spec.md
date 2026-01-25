## MODIFIED Requirements

### Requirement: Dark Theme Color System
The application SHALL use a minimal dark theme color palette as the primary visual theme, consisting of neutral grays and whites with no color accents.

#### Scenario: Base colors applied
- **WHEN** the application loads
- **THEN** the background uses pure dark gray (#0f0f0f)
- **AND** elevated surfaces use secondary gray (#1a1a1a)
- **AND** tertiary surfaces use (#252525)
- **AND** primary text uses pure white (#ffffff)
- **AND** secondary text uses muted gray (#a0a0a0)
- **AND** muted text uses dimmed gray (#666666)

#### Scenario: Glass-morphism surfaces
- **WHEN** elevated UI elements are rendered (header, panels, cards)
- **THEN** they SHALL use backdrop-blur with neutral gray tinting (rgba(26,26,26,0.8))
- **AND** subtle white borders at 8% opacity
- **AND** hover states increase border opacity to 15%

### Requirement: Background Effect
The application SHALL display a subtle aurora blur effect as the background.

#### Scenario: Aurora background rendered
- **WHEN** the application loads
- **THEN** the background shows a solid dark gray (#0f0f0f)
- **AND** a centered radial gradient with subtle white glow (3% opacity)
- **AND** the gradient is blurred at 80px for soft appearance
- **AND** no animated GIF or video backgrounds are used

### Requirement: Typography System
The application SHALL use Poppins font family with bold weight emphasis.

#### Scenario: Font weights loaded
- **WHEN** the application loads
- **THEN** Poppins font is available in weights 400, 500, 600, 700, 800
- **AND** headings use weight 600-800 for bold appearance
- **AND** body text uses weight 400-500
- **AND** the Starlord font is used only for the logo

### Requirement: Chart Color Palette
The analytics charts SHALL use a grayscale color palette.

#### Scenario: Chart colors applied
- **WHEN** charts are rendered
- **THEN** data series use grayscale colors: #ffffff, #c0c0c0, #909090, #606060, #404040
- **AND** chart backgrounds are transparent
- **AND** grid lines use subtle white at 10% opacity
- **AND** axis labels use secondary text color (#a0a0a0)

## REMOVED Requirements

### Requirement: Neon Glow Effects
**Reason**: Neon glow effects conflict with minimal design aesthetic.
**Migration**: All `.neon-glow-*` and `.text-neon-glow` classes removed. Components using these classes updated to use subtle borders or no effects.

### Requirement: Filmic Color Palette
**Reason**: Vibrant neon colors replaced with neutral grays.
**Migration**: All `filmic-*` CSS variables and Tailwind classes replaced with neutral equivalents (`bg-primary`, `text-primary`, etc.).

### Requirement: GIF Background
**Reason**: Animated GIF background replaced with subtle aurora blur.
**Migration**: `BackgroundEffect.tsx` updated to render static gradient instead of `guardians.gif`.
