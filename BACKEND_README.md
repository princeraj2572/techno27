# Backend README

This project does not use a separate Express or Nest backend. The server side is implemented inside the Next.js app through server actions, Mongoose models, middleware, and a small set of utility modules.

## Overview

The backend is responsible for a full set of event-management workflows:

- user authentication and session handling
- event discovery and event registration
- team creation, team membership, and invite lifecycle management
- payment capture and admin-side payment review
- accommodation submission and admin aggregation
- email notifications for onboarding and password reset flows

Most of the logic lives under `src/actions`, while persistence is handled through MongoDB with Mongoose models in `src/models`. The backend is not exposed as a REST API; instead, the app calls server actions directly from the Next.js UI.

## Technology Stack

- Next.js App Router
- React server actions
- MongoDB
- Mongoose
- JWT-based authentication
- Nodemailer for email delivery
- ExcelJS and XLSX for report generation

## Backend Structure

### Architecture

The backend follows a layered, action-driven architecture:

1. The UI triggers a server action from the App Router.
2. The action opens a MongoDB connection through `src/lib/mongodb.ts`.
3. The action reads or writes data through a Mongoose model in `src/models`.
4. Auth-sensitive actions resolve the current user with `src/actions/user-actions.ts`.
5. Middleware blocks protected routes early when a token is missing.
6. The action returns JSON-safe data back to the caller.

This gives the project a backend that is fully integrated with Next.js rather than split into a separate API service.

### High-Level Flow

```text
Browser / React component
	|
	v
Next.js server action in src/actions
	|
	v
MongoDB connection cache in src/lib/mongodb.ts
	|
	v
Mongoose model in src/models
	|
	v
Database read or write
	|
	v
JSON-safe response back to the UI
```

```mermaid
flowchart TD
	UI[React UI / App Router page] --> SA[Server action in src/actions]
	SA --> DB[Connection cache in src/lib/mongodb.ts]
	DB --> MM[Mongoose model in src/models]
	MM --> M[(MongoDB)]
	M --> MM
	MM --> SA
	SA --> UI
	MW[Middleware in src/middleware.ts] --> UI
	MW --> Login[/auth/login redirect/]
```

### Database Connection

The MongoDB connection is centralized in `src/lib/mongodb.ts`. It:

- reads the database URI and database name from environment variables
- validates that both values exist at startup
- caches the Mongoose connection to avoid reconnecting on every action

### Server Actions

The application uses server actions instead of traditional REST controllers. The main action groups are:

- `src/actions/user-actions.ts` for signup, login, password reset, and user lookup
- `src/actions/team-actions.ts` for team details and participation flows
- `src/actions/event-actions.ts` for event registration, event lookup, participant counts, and export helpers
- `src/actions/invite-actions.ts` for sending and handling team invites
- `src/actions/payment-actions.ts` for transaction storage and payment aggregation
- `src/actions/accomodation-actions.ts` for accommodation data
- `src/actions/mailer.ts` for welcome and reset-password emails

### What Each Backend Module Does

#### `src/actions/user-actions.ts`

This module handles the entire auth and user lifecycle:

- `userSignup(userData)` creates a new user, lowercases the email, blocks duplicate registration, and automatically marks `@opju.ac.in` users as non-outsiders.
- `userLogin(loginData)` verifies the password, signs a JWT token, and stores it in the `auth-token` cookie.
- `resetPassword(email, newPassword)` updates the stored password for an existing user.
- `getUserFromAuth(token)` validates a raw token and returns the matching user record.
- `getUser()` reads the cookie from the current request and resolves the active user.
- `getUsersByEmails(emails)` fetches users for a list of email addresses.
- `getOutsiderUsers()` returns users flagged as outsiders.
- `getUsersByEmailsPaginated(emails, page, limit)` returns the same email-based lookup with pagination metadata.

#### `src/actions/event-actions.ts`

This module drives event browsing, registration, reporting, and export utilities:

- `getAllEventsAction()` returns the full event list.
- `getRegisteredEventsAction()` returns event IDs that the current user is already registered for through their teams.
- `getPendingInvitesAction()` returns event IDs represented by invitations waiting on the current user.
- `submitEventsAction({ eventIds })` creates one-person teams for the selected events, updates the current user’s team list, and blocks outsider users from registering for more than seven events.
- `getManagedEventsAction(eventIds)` fetches the event records for a list of managed event IDs.
- `getEventById(eventId)` returns one event record.
- `getTeamsByEventId(eventId)` returns the teams registered under a specific event.
- `getEventDetailsWithCounts()` calculates event-level totals, including team count, user count, insider count, and outsider count.
- `getRegistrationCount(eventName)` returns the registration total for a named event.
- `getParticipatingEventsCountAction(...)` is used internally to enforce event-count limits and determine whether a new event is included.
- `getEventDetailsWithCountsPaginated()` provides the event summary view in pages.
- `generateEventCountExcel()` exports event counts into a spreadsheet.
- `getTeamsByEventIdPaginated(...)` returns event teams in a paginated form.
- `generateEventParticipantsExcel(eventId)` exports participant data for a single event.

#### `src/actions/team-actions.ts`

This module manages team membership and team cleanup:

- `getTeamDetailsAction(teamId)` returns the team record, linked event, team members, and all related invitations.
- `getParticipatingTeams()` returns all teams the current user belongs to, including leader, event, and an `individualSchema` flag.
- `getInvitedTeams()` returns pending invite records for the current user, decorated with team, leader, and event data.
- `deleteTeamAction(teamId)` removes a team, removes that team from each member’s `teams` array, and deletes related invitations.

#### `src/actions/invite-actions.ts`

This module owns invite state transitions:

- `sendTeamInviteAction({ teamId, inviteeEmail })` validates the sender as the team leader, checks team capacity, creates a pending invite, and stores it on the team.
- `cancelInviteAction(inviteId)` marks an invite as canceled.
- `acceptInviteAction(inviteId)` adds the invitee to the team, adds the team to the invitee’s user record, and enforces outsider event limits.
- `rejectInviteAction(inviteId)` marks the invite as rejected.

#### `src/actions/payment-actions.ts`

This module handles all payment-related storage and admin summaries:

- `addTransactionIdAction(transactionId, userEmail, currentPayAmount)` creates a new transaction record for a user.
- `getTransactionsByUserEmail(userEmail)` returns all transactions for one user.
- `getPaymentData()` builds a payment dashboard dataset for admins, including event names, schema counts, transaction counts, acknowledged amounts, and clearance status.

#### `src/actions/accomodation-actions.ts`

This module handles accommodation submission and admin reporting:

- `getAccommodationDetailsAction()` fetches the current user’s accommodation record.
- `setAccommodationDetailsAction(details)` creates or updates the user’s accommodation entry.
- `getAllAccommodationsWithUsers()` returns all accommodation records with the related user record and a list of team leaders connected to that user.

#### `src/actions/mailer.ts`

This module contains email helpers used by the auth flows:

- `sendWelcomeEmail(...)` sends the onboarding message.
- `sendResetPasswordEmail(...)` sends reset-password instructions.

### `src/lib/mongodb.ts`

This module keeps the database layer stable by:

- loading `NEXT_PUBLIC_MONGODB_URI` and `NEXT_PUBLIC_MONGODB_DBNAME`
- failing fast when either value is missing
- caching the Mongoose connection on `global` so repeated server-action calls reuse the same connection

## Function Inventory

### User Functions

| Function | Purpose |
| --- | --- |
| `userSignup` | Creates a new account and normalizes the email address. |
| `userLogin` | Authenticates a user and stores the JWT cookie. |
| `resetPassword` | Updates a user’s password by email. |
| `getUserFromAuth` | Resolves a user from a raw JWT token. |
| `getUser` | Resolves the current user from the request cookie. |
| `getUsersByEmails` | Fetches users by a list of email addresses. |
| `getOutsiderUsers` | Returns users marked as outsiders. |
| `getUsersByEmailsPaginated` | Returns the same lookup with pagination metadata. |

### Event Functions

| Function | Purpose |
| --- | --- |
| `getAllEventsAction` | Returns every event in the database. |
| `getRegisteredEventsAction` | Returns event IDs the current user is already registered for. |
| `getPendingInvitesAction` | Returns event IDs represented by pending invites. |
| `submitEventsAction` | Creates teams for selected events and attaches them to the user. |
| `getManagedEventsAction` | Returns event records for a list of managed IDs. |
| `getEventById` | Fetches one event record by ID. |
| `getTeamsByEventId` | Returns teams for one event. |
| `getEventDetailsWithCounts` | Builds event-level participation counts. |
| `getRegistrationCount` | Returns the registration total for a named event. |
| `getParticipatingEventsCountAction` | Computes event participation totals and limit checks. |
| `getEventDetailsWithCountsPaginated` | Returns event counts in paginated form. |
| `generateEventCountExcel` | Exports event counts to Excel. |
| `getTeamsByEventIdPaginated` | Returns event teams in paginated form. |
| `generateEventParticipantsExcel` | Exports event participants to Excel. |

### Team Functions

| Function | Purpose |
| --- | --- |
| `getTeamDetailsAction` | Returns a team with event, members, and invites. |
| `getParticipatingTeams` | Returns all teams the current user belongs to. |
| `getInvitedTeams` | Returns invites received by the current user. |
| `deleteTeamAction` | Deletes a team and cleans up references. |

### Invite Functions

| Function | Purpose |
| --- | --- |
| `sendTeamInviteAction` | Creates a pending invite for a team member. |
| `cancelInviteAction` | Marks an invite as canceled. |
| `acceptInviteAction` | Accepts an invite and updates both team and user records. |
| `rejectInviteAction` | Marks an invite as rejected. |

### Payment Functions

| Function | Purpose |
| --- | --- |
| `addTransactionIdAction` | Creates a transaction record for a user. |
| `getTransactionsByUserEmail` | Fetches all transactions for one user. |
| `getPaymentData` | Builds the admin payment dashboard dataset. |

### Accommodation Functions

| Function | Purpose |
| --- | --- |
| `getAccommodationDetailsAction` | Fetches the current user’s accommodation record. |
| `setAccommodationDetailsAction` | Creates or updates the current user’s accommodation record. |
| `getAllAccommodationsWithUsers` | Returns all accommodations with related users and leaders. |

### Mail Functions

| Function | Purpose |
| --- | --- |
| `sendWelcomeEmail` | Sends the welcome email after signup. |
| `sendResetPasswordEmail` | Sends reset-password instructions. |

### How the Pieces Work Together

The architecture is intentionally simple:

- `src/app` renders the UI and calls backend actions when the user submits a form or opens a protected page.
- `src/middleware.ts` acts as the first gate for protected routes.
- `src/actions/user-actions.ts` is the main auth boundary because almost every other module needs the current user.
- `src/models` is the single source of truth for schema rules and persistence.
- `src/lib/mongodb.ts` keeps database connection management out of the business logic.

Because the app uses server actions, there is no dedicated controller or route-handler layer for most flows. The action itself is the controller, service, and use-case entry point in one place.

### Request Lifecycle Examples

#### Login Flow

1. The login form sends credentials to `userLogin`.
2. The action normalizes the email and checks the password.
3. A JWT token is created when the credentials match.
4. The token is written to the `auth-token` cookie.
5. The UI receives the authenticated user object and token.

#### Protected Page Flow

1. A user opens a protected route like `/dashboard`.
2. Middleware checks whether `auth-token` exists.
3. If the cookie is missing, the request is redirected to `/auth/login`.
4. If the cookie exists, the page continues loading.
5. The page or action later validates the token again when it needs user data.

#### Registration Flow

1. The user selects one or more events.
2. `submitEventsAction` checks the current user and their existing teams.
3. New team documents are created for the selected events.
4. The teams are attached to the user record.
5. The action returns success so the UI can refresh the registration state.

#### Invite Flow

1. A team leader sends an invite.
2. `sendTeamInviteAction` creates an invitation record and links it to the team.
3. The invited user sees the invite through `getInvitedTeams()`.
4. Accepting the invite updates the team members and the user’s team list.
5. Rejecting or canceling the invite updates only the invitation state.

### Design Principles

The backend architecture follows a few practical rules:

- Keep database access close to the use case that needs it.
- Reuse the same `getUser()` auth lookup everywhere possible.
- Return serialized data from actions so React can consume it safely.
- Keep admin reporting separate from user-facing registration logic.
- Cache the MongoDB connection to reduce startup overhead during development.

### Middleware

Protected routes are guarded in `src/middleware.ts`. Requests to dashboard, admin, event-selection, and team-details routes are redirected to login when the `auth-token` cookie is missing.

## Data Models

The backend uses Mongoose models in `src/models`:

- `user.model.ts` stores user identity, login credentials, admin flags, permissions, and team references.
- `team.model.ts` stores team leader, member emails, event reference, size, and invite references.
- `event.model.ts` stores event metadata and registration-related information.
- `invitation.model.ts` stores invite lifecycle data and invite statuses such as pending, accepted, rejected, and canceled.
- `transaction.model.ts` stores payment transaction details and admin acknowledgement state.
- `accomodation.model.ts` stores accommodation records.

## Authentication Flow

### Signup

`userSignup` performs the following:

- normalizes the email address
- marks OPJU domain users as non-outsiders
- checks for duplicate email addresses
- creates the user record in MongoDB
- returns the newly created user document in JSON-safe form

### Login

`userLogin`:

- normalizes the email address
- validates the password against the stored user
- signs a JWT token with the configured secret
- writes the token to the `auth-token` cookie
- returns both the user record and the token to the caller

### Password Reset

`resetPassword` updates the password for a known email address. It fails when the user does not exist and wraps any storage or lookup error with a more specific reset-password message.

### Current User Lookup

`getUser` and `getUserFromAuth` resolve the active user from the cookie or a raw token, then fetch the matching MongoDB record.

`getUser()` is the normal app path for authenticated UI requests, while `getUserFromAuth(token)` is useful when a component or server action already has a token string.

## Workflow Details

### Event Registration

Event registration is team-based, even when the user is registering alone:

1. The user selects events in the UI.
2. `submitEventsAction` creates a team for each event.
3. The current user is stored as both leader and first member.
4. The new team ID is appended to the user’s `teams` array.
5. Outsider users are prevented from exceeding the seven-event limit.

This means a single registered event always produces at least one team record.

### Team Invites

Team invites are a staged workflow:

1. `sendTeamInviteAction` creates a pending invitation.
2. The invite is linked back to the team.
3. `getInvitedTeams()` surfaces pending invites to the recipient.
4. The recipient can accept or reject the invite.
5. Accepting the invite updates both the team and the user document.

The invite flow also re-checks outsider event limits before allowing acceptance.

### Team Deletion

`deleteTeamAction` is a cleanup-heavy operation:

- it verifies the current user is the team leader
- it removes the team from every member’s `teams` array
- it deletes related invitations
- it removes the team record itself

### Payment Processing

Payment handling is split into two layers:

- users store transaction IDs through `addTransactionIdAction`
- admins review results through `getPaymentData()`

`getPaymentData()` is particularly important because it computes the payable amount from registered teams, separates individual and team schemas, counts acknowledged transactions, and decides whether clearance is complete.

### Accommodation

Accommodation data is user-owned:

- the current user can create or update a personal accommodation entry
- admins can view all accommodation entries joined to user records and team leaders

### Reporting and Export

The backend includes reporting functions for admin dashboards and spreadsheet exports:

- event summaries and counts
- paginated event/team listings
- participant spreadsheets per event
- event count exports

These are designed for administrative review rather than end-user interaction.

## Backend Responsibilities By Area

### Users

The user actions provide:

- signup
- login
- password reset
- fetching the current user
- querying users by email
- listing outsider users
- paginated email-based lookup

### Events and Teams

Event and team actions cover:

- listing all events
- fetching registered events
- fetching pending invites
- submitting selected event registrations
- fetching managed events
- getting event details by ID
- fetching teams by event ID
- generating event reports and participant spreadsheets

### Invitations

Invite actions cover:

- sending team invites
- cancelling invites
- accepting invites
- rejecting invites

### Payments

Payment actions cover:

- storing transaction IDs submitted by users
- fetching transactions for a user
- building payment summary data for admins

The payment summary logic groups teams into individual and team-based schemas and calculates whether a user has cleared the required amount.

### Accommodation

Accommodation actions manage fetching and updating accommodation-related records and listing users tied to accommodation entries.

### Email

The mailer module contains the email utilities used by signup and reset-password workflows.

## Environment Variables

The backend expects the following environment variables:

```env
NEXT_PUBLIC_MONGODB_URI=
NEXT_PUBLIC_MONGODB_DBNAME=
NEXT_PUBLIC_JWT_SECRET=
NODE_ENV=
```

Notes:

- `NEXT_PUBLIC_MONGODB_URI` is the MongoDB connection string
- `NEXT_PUBLIC_MONGODB_DBNAME` is the database name used by Mongoose
- `NEXT_PUBLIC_JWT_SECRET` signs and verifies auth tokens
- `NODE_ENV=production` enables secure cookies in production

Example `.env.local`:

```env
NEXT_PUBLIC_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
NEXT_PUBLIC_MONGODB_DBNAME=technorollix
NEXT_PUBLIC_JWT_SECRET=replace_with_a_long_random_secret
NODE_ENV=development
```

## Route Protection

The middleware protects these route groups:

- `/dashboard/*`
- `/admin/*`
- `/events-selection/*`
- `/team-details/*`

If the `auth-token` cookie is missing, the request is redirected to `/auth/login`. Token verification itself still happens in the server actions that read the current user.

## Local Development

1. Install dependencies.
2. Create a `.env.local` file with the values above.
3. Start the app with `npm run dev`.
4. Verify signup and login flows.
5. Confirm protected routes redirect correctly when `auth-token` is missing.
6. Test event registration, invite acceptance, payment entry, and accommodation save flows with a real MongoDB instance.
7. Verify the admin dashboards load the counts and summary data as expected.

## Available Scripts

- `npm run dev` starts the Next.js development server
- `npm run build` creates a production build
- `npm run start` starts the production server on port 8080
- `npm run export:outsiders` runs the outsider export script in `src/scripts/exportOutsiders.js`
- `npm run build-no-checks` builds while skipping ESLint and type checks

## Operational Notes

- The backend uses server actions, so the code that mutates data is often called directly from UI components instead of through API endpoints.
- Cookie-based auth is used for route protection, but token verification still happens on the server when user data is actually loaded.
- Mongoose connection caching is important in dev mode because Next.js can reload modules frequently.
- Several actions intentionally return JSON-stringified data so the results are safe to pass through the React server-action boundary.
- Some admin/reporting functions perform manual joins instead of Mongoose population so they can shape the response exactly for dashboard use.

## Suggested Improvements

If you continue evolving the backend, the next useful upgrades would be:

- move shared validation rules into dedicated validator modules
- centralize auth and permission helpers
- formalize email transport and template handling
- document the event, team, invite, and payment data shapes with examples
