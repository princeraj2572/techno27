# Architecture and Issues Report

## Purpose

This project is a festival management platform for a techno-cultural event. The use case is broader than a simple landing page: it needs public marketing pages, authenticated participant workflows, team formation, event registration, invite handling, payment tracking, accommodation management, and admin reporting.

This document explains:

- how the system should ideally be designed for this use case
- what architecture and technology stack fit the problem
- how the frontend and backend should interact
- what the current implementation does well
- what is wrong in the current implementation
- what should be fixed first

## Use Case Requirements

For a festival platform like this, the system must support four user groups:

1. Public visitors who only browse information
2. Registered participants who sign up, join teams, and register for events
3. Event or team members who manage invites and participation
4. Admin users who review counts, payments, accommodation, and participation data

The platform must also support:

- mobile and desktop browsing
- event discovery
- sign up and login
- team formation and invites
- payment acknowledgement
- accommodation requests
- downloadable reports for admins
- route protection for authenticated pages

## What The System Should Have Been

If this project were designed from scratch for the current use case, it should have been built as a layered event-management system with clear separation between presentation, domain logic, and data access.

The best-fit architecture would look like this:

```text
Public pages and dashboards
        |
        v
UI components and route pages
        |
        v
Client forms and interaction state
        |
        v
Server actions or API layer
        |
        v
Application service layer
        |
        v
Domain rules and validation
        |
        v
Repository / model layer
        |
        v
MongoDB
```

This structure keeps presentation concerns away from business rules and keeps the rules away from database details.

## Recommended Technical Stack

The current stack is mostly appropriate, but a production-grade version of this system should use it more carefully.

### Frontend Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Radix UI for accessible primitives
- React Hook Form for forms
- Zod for validation
- Framer Motion for animations
- next/image for image optimization
- next/font for typography

### Backend Stack

- Next.js server actions or route handlers
- MongoDB
- Mongoose
- JWT for session tokens
- bcrypt or argon2 for password hashing
- Nodemailer for mail delivery
- ExcelJS or XLSX for exports

### Infrastructure Stack

- environment-based secrets management
- production logging
- deployment with HTTPS
- secure cookies
- rate limiting for auth endpoints
- input sanitization and validation
- file storage strategy for media assets if uploads are introduced later

## Ideal Architecture

### 1. Presentation Layer

This layer should contain only UI concerns:

- page layouts
- hero sections
- navigation
- forms
- dialogs
- tables
- cards
- animations
- responsive behavior

It should not contain direct business logic beyond simple interaction state.

### 2. Interaction Layer

This layer should manage user intent:

- login form submit
- signup flow
- event selection
- invite acceptance
- payment submission
- accommodation update
- dashboard filters and pagination

This layer should call backend actions and react to their responses.

### 3. Application Layer

This layer should contain the actual use-case logic:

- create user
- authenticate user
- create team
- send invite
- accept invite
- reject invite
- calculate payment
- generate admin reports
- enforce event limits

This is the core business layer.

### 4. Domain Layer

This layer should define the business rules:

- OPJU users are treated as insiders
- outsiders can only register up to the defined event limit
- only team leaders can invite or delete teams
- invite acceptance must enforce membership and event uniqueness
- transaction IDs must be unique
- admin-only reports should never be exposed to participants

### 5. Data Layer

This layer should handle persistence:

- users
- teams
- events
- invites
- transactions
- accommodation

Each collection should have schema validation, indexes, and clean referential rules.

## Current Frontend Architecture

The current frontend is visually strong and conceptually close to the correct shape.

### What It Does Well

- The landing page is cinematic and memorable.
- The site has a clear festival identity.
- The navigation is consistent on desktop.
- The event cards and faculty sections are visually polished.
- The app uses reusable components instead of duplicating everything.
- The UI already supports responsive layouts.
- Motion and media are used in a way that fits the brand.

### Current Frontend Problems

#### 1. Metadata is incomplete

The root layout still uses the default description text from the Next.js scaffold. That makes the app look unfinished from SEO and sharing perspectives.

#### 2. Mobile navigation is inconsistent

The desktop Events dropdown has proper submenu behavior, but the mobile Events item is just a link-style button. The same information architecture is not preserved on smaller screens.

#### 3. Some interactive elements are semantically weak

There are places where a `Link` wraps a `button`. That is not ideal for accessibility or interaction semantics.

#### 4. Dashboard code shows refactor residue

The dashboard page contains a lot of commented-out legacy code. That makes maintenance harder and suggests the page has not been fully cleaned up.

#### 5. Session state is handled with extra client fetching

The user dropdown fetches the user on route change. It works, but it can flicker and it is not the cleanest session design.

#### 6. The frontend lacks a dedicated design system document

The UI is visually intentional, but the design rules are not formally documented, so future additions may drift.

## Current Backend Architecture

The current backend is functionally broad and reasonably modular, but several business-critical concerns are implemented unsafely.

### What It Does Well

- It uses a consistent Mongoose model structure.
- The logic is grouped into action files by domain.
- The app has centralized database connection handling.
- Protected routes exist.
- Admin reporting and export functionality are present.
- The platform already supports the core festival workflows.

### Current Backend Problems

#### 1. Passwords are not hashed

Passwords are stored and compared in plaintext. This is the most serious issue in the entire repo.

#### 2. Auth cookies are not protected enough

The JWT cookie is readable by client-side JavaScript because `httpOnly` is disabled.

#### 3. JWT secret fallback is unsafe

The code falls back to a hard-coded secret when the environment variable is missing.

#### 4. Invite actions lack strict authorization checks

Invite cancel/accept/reject actions do not clearly enforce who is allowed to call them.

#### 5. Middleware checks presence, not validity

The route guard only checks whether a token exists, not whether it is valid or expired.

#### 6. Server-only configuration uses public prefixes

MongoDB and JWT settings are stored in variables with the `NEXT_PUBLIC_` prefix, which is not a good security practice for server-only settings.

#### 7. Payment reporting logic may not match the intended audience

The payment summary query and the comment around it do not line up cleanly, so the admin data set may be wrong or misleading.

## Functional Flow By Use Case

### Public Visitor Flow

1. User opens the landing page.
2. Hero section communicates the event brand.
3. User browses events, about, faculty, and sponsors.
4. User moves to auth pages or event detail pages.

This flow is mostly good.

### Signup Flow

1. User opens signup.
2. The app walks them through multi-step signup.
3. The backend creates the user record.
4. The system should then validate the session and guide them to login or dashboard.

The flow exists, but password handling makes it unsafe.

### Login Flow

1. User submits email and password.
2. Backend looks up the user.
3. Token is written.
4. User is redirected to dashboard or admin.

The flow works mechanically, but the credential storage model is weak.

### Event Registration Flow

1. User selects events.
2. Teams are created.
3. The user is attached to those teams.
4. Outsider limits are enforced.

This flow is close to the intended use case and is one of the better parts of the backend.

### Invite Flow

1. Team leader sends invite.
2. Recipient sees it.
3. Recipient accepts or rejects.
4. Team and user records are updated.

This flow exists, but it needs stronger authorization rules.

### Payment Flow

1. User submits transaction ID.
2. Transaction is stored.
3. Admin reviews and acknowledges.
4. Clearance is derived from acknowledged amount.

The flow is useful, but it needs stronger data consistency and clearer business rules.

### Accommodation Flow

1. User submits arrival, departure, and university details.
2. Record is created or updated.
3. Admin can view a consolidated list.

This flow is straightforward and mostly fine architecturally.

## Detailed Problem List

### Security Problems

- Plaintext passwords
- Weak JWT secret fallback
- Non-httpOnly auth cookie
- Missing token validation in middleware
- Weak authorization around invite mutations
- Publicly prefixed environment variables for server secrets

### Maintainability Problems

- commented-out legacy code in dashboard pages
- mixed patterns across auth and state handling
- some duplicated logic in payment calculations
- some actions manually join data rather than abstracting reusable helpers

### UX Problems

- inconsistent mobile navigation
- some semantic button/link issues
- default metadata description
- auth state may flicker during client fetches

### Domain Problems

- the payment and registration logic is tied closely to current implementation assumptions
- invite and team rules are not centralized into a single domain policy layer
- business rules are spread across multiple files

## What A Better Version Should Look Like

### Authentication

- passwords hashed with bcrypt or argon2
- tokens signed with a mandatory secret
- cookies marked `httpOnly`, `secure`, and `sameSite`
- token validation done both at route protection and request handling time
- optional refresh strategy if longer sessions are needed

### Authorization

- central helper for role checks
- leader checks for team mutations
- admin checks for admin dashboards and reports
- recipient-only checks for invite acceptance

### Validation

- Zod schemas for every form and action payload
- shared validators for email, password, team size, and payment fields
- consistent error formatting

### Data Modeling

- indexes on user email, team leader, invitee email, and transaction ID
- unique constraints where appropriate
- soft-delete strategy if auditability is needed
- cleaner references for cross-collection relations

### Frontend Design

- a formal design system document
- consistent responsive patterns
- accessible navigation and dropdowns
- route-specific loading and error states
- reusable page sections for cards, headers, and CTA blocks

### Admin Experience

- separate dashboards for counts, payments, and accommodation
- filtering, sorting, and export controls
- clear approval states
- audit trail for sensitive changes

## Recommended Tech Stack For Production

If this were rebuilt cleanly for the same use case, the recommended stack would be:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Radix UI
- React Hook Form
- Zod
- Mongoose
- MongoDB Atlas
- bcrypt or argon2
- JWT with secure cookie storage
- Nodemailer or a mail provider API
- ExcelJS for admin exports
- a logging solution such as Pino or Winston
- optional Redis for rate limiting and session-related helpers

## Priority Fix Order

1. Hash passwords immediately.
2. Make auth cookies httpOnly and secure.
3. Remove hard-coded JWT fallback secrets.
4. Add real authorization checks to invite and team mutation actions.
5. Validate middleware tokens instead of only checking cookie presence.
6. Replace public-prefixed server secrets with server-only env variables.
7. Clean up the frontend metadata and mobile navigation consistency.
8. Remove commented-out legacy dashboard code.
9. Normalize payment and admin reporting logic.

## Final Judgment

The project is a strong prototype for a festival platform, especially on the visual frontend side. The architecture matches the use case conceptually, but the implementation has serious backend security gaps and some frontend polish issues.

So the honest conclusion is:

- good idea and good scope
- decent frontend direction
- workable feature coverage
- not production-safe yet
- backend security and authorization need urgent fixes
