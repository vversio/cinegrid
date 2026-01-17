## ADDED Requirements

### Requirement: Email-Based Admin Authentication
The system SHALL authenticate admin users based on a specific email address configured in environment variables.

#### Scenario: Admin email can sign in
- **WHEN** a user with the configured admin email signs in
- **THEN** they are authenticated as admin and can add/delete movies

#### Scenario: Non-admin email cannot sign in
- **WHEN** a user with a different email attempts to sign in
- **THEN** authentication is rejected

#### Scenario: Sign-up is disabled
- **WHEN** any user attempts to create a new account
- **THEN** sign-up functionality is not available

### Requirement: Hidden Authentication UI
The system SHALL hide all authentication UI elements for non-admin visitors.

#### Scenario: Visitor sees no sign-in button
- **WHEN** an unauthenticated visitor views the site
- **THEN** no sign-in button or authentication UI is displayed

#### Scenario: Admin sees sign-in button
- **WHEN** the admin email is not authenticated
- **THEN** a sign-in button is displayed (only accessible via direct URL or admin route)

#### Scenario: Authenticated admin sees sign-out
- **WHEN** admin is authenticated
- **THEN** admin email and sign-out button are displayed
