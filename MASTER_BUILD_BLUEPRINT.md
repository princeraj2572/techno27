        # Master Build Blueprint

        This document is the single reference for building the festival platform correctly. It combines the architecture, system design, frontend structure, backend logic, user flows, participation rules, and implementation priorities needed to complete the product cleanly.

        ## 1. Product Goal

        The platform is a festival management system for a techno-cultural event. It must support:

        - public marketing and event discovery
        - authenticated signup and login
        - event registration and team formation
        - invite-based participation
        - payment tracking and clearance
        - accommodation requests
        - admin reporting and exports
        - responsive frontend experiences for desktop and mobile

        The system should feel like a polished event product, but internally it must behave like a reliable data system.

        ## 2. Product Principles

        Build the app with these rules in mind:

        - public pages should inspire and convert users into registrants
        - protected pages should be safe, predictable, and session-aware
        - every action that changes data must validate identity and role
        - every business rule should be centralized rather than copied
        - every form should validate before it writes
        - every admin report should be derived from trusted data
        - every mobile flow should be usable without losing meaning from desktop

        ## 3. Recommended System Design

        The correct design for this use case is a layered web application with a clear separation of concerns.

        ```text
        Browser / Mobile UI
                |
                v
        Route page in Next.js App Router
                |
                v
        Reusable UI components and forms
                |
                v
        Client interaction state
                |
                v
        Server action or backend use-case handler
                |
                v
        Validation and business rules
                |
                v
        Model / repository layer
                |
                v
        MongoDB
        ```

        ```mermaid
        flowchart TD
                A[Public Visitor] --> B[Landing Page]
                B --> C[Auth Pages]
                C --> D[User Session]
                D --> E[Dashboard]
                D --> F[Event Selection]
                F --> G[Team Creation]
                G --> H[Invite Flow]
                G --> I[Payment Submission]
                G --> J[Accommodation]
                E --> K[Admin Reports]
                K --> L[Counts / Payments / Accommodation]
                B --> M[Event Detail Pages]
                M --> F
        ```

        ### Why this works

        - the route layer handles rendering and page composition
        - the component layer handles UI interactions
        - the action layer handles business use cases
        - the model layer handles persistence rules
        - the database stores the source of truth

        This keeps the app maintainable even as the number of events, teams, users, and reports grows.

        ## 4. Technology Stack

        ### Frontend

        - Next.js App Router
        - React
        - TypeScript
        - Tailwind CSS
        - Radix UI primitives
        - React Hook Form
        - Zod validation
        - Framer Motion
        - lucide-react and react-icons
        - next/image
        - next/font

        ### Backend

        - Next.js server actions
        - MongoDB
        - Mongoose
        - JWT authentication
        - bcrypt or argon2 for passwords
        - Nodemailer for mail flows
        - ExcelJS or XLSX for admin exports

        ### Operational Support

        - secure cookies
        - environment-based secrets
        - role-based access control helpers
        - request validation helpers
        - logging for important actions
        - rate limiting for auth and invite flows

        ## 5. Core Architecture

        ### 5.1 Presentation Layer

        This layer includes:

        - landing page
        - event pages
        - about, schedule, gallery, sponsors, team, contacts
        - auth pages
        - dashboard and admin pages
        - layouts and shared headers/footers

        It should focus on structure, layout, and visual identity.

        ### 5.2 Interaction Layer

        This layer includes:

        - menus and dropdowns
        - sliders and carousels
        - dialogs and modals
        - forms and step flows
        - buttons and call-to-action actions
        - route transitions and redirects

        It should manage only local interaction state.

        ### 5.3 Application Layer

        This layer includes the real use cases:

        - signup
        - login
        - password reset
        - fetch current user
        - select events
        - create teams
        - send invites
        - accept invites
        - reject invites
        - delete teams
        - add transaction IDs
        - calculate payables
        - save accommodation
        - build admin reports

        ### 5.4 Domain Layer

        This layer should hold the rules of the festival:

        - OPJU domain users are insiders
        - outsiders have special participation limits
        - users can only join events through valid team flows
        - team leaders control team invites and team deletion
        - invite recipients control invite acceptance or rejection
        - payment clearance depends on acknowledged amount
        - admin reports should only show admin-authorized data

        ### 5.5 Data Layer

        This layer should persist:

        - users
        - teams
        - events
        - invitations
        - transactions
        - accommodation records

        It should enforce uniqueness and indexing where needed.

        ## 6. Frontend Architecture

        ### 6.1 Frontend Structure

        The frontend should be divided into:

        - route pages in `src/app`
        - reusable domain components in `src/components`
        - design system primitives in `src/components/ui`
        - client hooks in `src/hooks`
        - shared helpers in `src/lib`

        ### 6.2 Frontend Goals

        The frontend should:

        - present a strong festival identity
        - remain responsive on mobile and desktop
        - keep navigation clear
        - make registration easy to understand
        - make dashboard actions easy to complete
        - avoid visual clutter in protected flows

        ### 6.3 Visual Direction

        Use a consistent look:

        - dark festival backgrounds
        - gold and sky-blue accents
        - glassmorphism panels
        - high-contrast headers
        - lively motion in hero and event areas
        - clear empty states and error states

        ### 6.4 Accessibility Expectations

        Every interactive element should:

        - have a visible focus state
        - work with keyboard navigation
        - use semantic HTML where possible
        - avoid nested interactive controls
        - support screen readers through proper labels and alt text

        ## 7. Backend Architecture

        ### 7.1 Backend Structure

        The backend should be organized by use case:

        - user actions
        - event actions
        - team actions
        - invite actions
        - payment actions
        - accommodation actions
        - mail actions

        ### 7.2 Backend Responsibilities

        The backend should:

        - validate all mutation payloads
        - normalize incoming data
        - enforce business rules
        - guard protected actions
        - write consistent records
        - calculate derived values only on trusted data
        - return JSON-safe payloads

        ### 7.3 Database Connection Rules

        The database connection module should:

        - fail fast if required env vars are missing
        - cache the Mongoose connection
        - avoid reconnecting on every request
        - remain server-only

        ## 8. Domain Models

        ### 8.1 User

        The user model should store:

        - full name
        - email
        - password hash
        - university or college name
        - department
        - branch
        - year of study
        - gender
        - enrollment number
        - mobile number
        - address
        - outsider flag
        - admin flag
        - permissions and managed events
        - team references

        Optional but useful profile fields:

        - city or home location
        - emergency contact number
        - profile photo or avatar reference
        - participation tag if the platform later expands beyond participants and admins

        ### 8.2 Team

        The team model should store:

        - leader email
        - member emails
        - event reference
        - team size
        - invite references

        ### 8.3 Event

        The event model should store:

        - name
        - slug or identifier
        - category
        - team size
        - participation rules
        - display data
        - counts and registration metadata

        ### 8.4 Invitation

        The invitation model should store:

        - team ID
        - inviter email
        - invitee email
        - status
        - timestamps

        ### 8.5 Transaction

        The transaction model should store:

        - transaction ID
        - user email
        - current payable amount
        - amount acknowledged by admin
        - acknowledgement status
        - clearance status

        ### 8.6 Accommodation

        The accommodation model should store:

        - user ID
        - arrival time
        - departure time
        - university name
        - gender
        - department
        - branch
        - year of study
        - additional details

        Optional accommodation fields if logistics require them later:

        - travel mode
        - emergency contact
        - accessibility notes
        - guest count

        ## 9. User Roles

        ### Public Visitor

        Can:

        - browse marketing pages
        - view events
        - explore faculty, sponsors, gallery, and schedule
        - navigate to signup or login

        Cannot:

        - register for events
        - access protected dashboards
        - mutate teams or payment data

        ### Participant

        Can:

        - sign up and log in
        - register for events
        - manage teams through invite flows
        - submit payment transaction IDs
        - submit accommodation details
        - view dashboard data

        Cannot:

        - access admin-only reports
        - bypass registration limits
        - mutate invites they do not own

        ### Team Leader

        Can:

        - send invites
        - cancel invites
        - manage team membership
        - delete the team

        ### Dev Admin

        Can:

        - manage technical settings and platform maintenance data
        - view system health and audit logs
        - manage users, permissions, and safe overrides
        - troubleshoot reports and data issues
        - access development-only tools and debugging views

        Cannot:

        - operate as the event management authority by default
        - override festival policy without explicit permission
        - bypass audit tracking

        Dev admin list:

        Show this as the Dev Admin quick-access list:

        1. system settings
        2. audit logs
        3. user permissions
        4. debugging tools
        5. safe overrides

        ### Management Admin

        Can:

        - view payment reports
        - view accommodation reports
        - view event counts
        - export spreadsheets
        - manage event-level participation data
        - review approvals and pending operational actions

        Cannot:

        - change core platform settings meant only for dev admins
        - bypass role checks for sensitive system operations
        - edit technical maintenance data without permission

        Management admin list:

        1. payment reports
        2. accommodation reports
        3. event counts
        4. spreadsheet exports
        5. event-level participation review
        6. approval queue handling

        ### Admin Hierarchy

        - dev admin is the highest technical role
        - management admin handles festival operations and reporting
        - both roles should be explicit in the user model and session claims
        - the UI should show the correct role badge and hide unavailable actions
        - authorization checks should verify the exact role, not just a generic admin flag
        - the dev dashboard should only be accessible to the development team
        - management admins should not see development-only dashboard tools

        ## 10. User Flow Rules

        ### 10.1 Landing Page Flow

        1. User lands on the homepage.
        2. Hero and event visuals introduce the fest.
        3. User sees the register call to action.
        4. User navigates to auth or event pages.

        ### 10.2 Signup Flow

        1. User opens signup.
        2. Email is entered.
        3. OTP or verification step runs if required.
        4. Account details are submitted.
        5. User is created.
        6. User is redirected to login or dashboard.

        ### 10.2.1 Signup Processor

        The signup processor should be treated as a small pipeline, not a single form submit.

        #### Inputs

        - email
        - password
        - full name
        - university or college name
        - department
        - branch
        - year of study
        - gender
        - enrollment number
        - mobile number
        - address
        - outsider flag or derived insider status

        Optional inputs if the signup flow needs a fuller participant profile:

        - city or home location
        - emergency contact number
        - profile photo reference
        - participation tag if the platform later supports volunteers or special roles

        #### Outsider-Specific Inputs

        If the user is an outsider, the signup flow should collect a few extra details so the profile is usable for registration, payment, and accommodation:

        - institution or college name
        - institution city and state
        - course or program name
        - department, branch, and year of study if applicable
        - host or referral name if the user is linked through an internal participant
        - accommodation requirement flag
        - travel mode or arrival plan
        - emergency contact number
        - optional ID proof reference if the event team wants verification

        #### Intended Processing Steps

        1. Normalize the email.
        2. Validate the payload against schema rules.
        3. Normalize text fields such as university, department, branch, and gender.
        4. Check whether the user already exists.
        5. Derive insider or outsider status from the email domain.
        6. Hash the password before storage.
        7. Create the user record.
        8. Optionally send a welcome email.
        9. Return a safe response without the raw password.
        10. Guide the user to the next UI step or login screen.

        #### Frontend Processor Flow

        The current signup UI should be treated as a 3-step processor:

        - Step 1: enter and verify email
        - Step 2: verify OTP or email ownership
        - Step 3: collect profile and password details

        Recommended field grouping for Step 3:

        - personal identity: full name and gender
        - academic identity: university or college, department, branch, year of study, enrollment number
        - contact identity: mobile number, address, optional city, optional emergency contact
        - security identity: password and confirmation

        Each step should only advance after the previous step passes validation.

        #### Backend Processor Flow

        The backend signup action should:

        - enforce email uniqueness
        - enforce password rules
        - derive `isOutsider` from the domain rules
        - store a hashed credential
        - create the participant record
        - prepare the session or redirect state if needed

        #### Business Rules

        - OPJU email addresses should be treated as insiders
        - outsider status should never be trusted blindly from the client
        - outsider profiles should always capture institution and contact details before event registration
        - outsiders may need an extra verification step before final approval
        - duplicate accounts must be rejected
        - raw passwords must never be persisted
        - the returned payload must not expose the password field
        - university, department, branch, year, and gender should be normalized before storage
        - required academic fields should be enforced consistently across frontend and backend
        - optional fields should be optional everywhere, not only in the UI

        #### Current Problems In This Processor

        - password is stored directly instead of being hashed
        - `isOutsider` can still be influenced by the client payload before domain logic corrects it
        - no OTP or verification hardening is visible in the backend action
        - there is no explicit welcome-email handoff in the current signup action
        - the action returns the raw saved user object structure after JSON serialization, so the safe response contract is not clearly defined

        #### What A Correct Signup Processor Should Output

        - a sanitized user payload
        - an explicit success status
        - a clear next-step instruction for the UI
        - a consistent error message for duplicate email or invalid input

        #### What Should Be Added For Production

        - password hashing helper
        - OTP verification or email verification hardening
        - rate limiting for signup attempts
        - welcome email call after successful registration
        - audit logging for signup events
        - stronger schema validation for every input field
        - profile completeness checks for the new academic fields
        - client-side and server-side confirmation that the required form sections are filled in the same order

        ### 10.3 Login Flow

        1. User enters credentials.
        2. Email and password are validated.
        3. Auth token is created.
        4. Session cookie is written securely.
        5. User is redirected based on role.

        ### 10.4 Event Registration Flow

        1. User selects events.
        2. System checks current participation.
        3. System checks outsider limit rules.
        4. Team records are created.
        5. User record is updated.
        6. Dashboard reflects registration state.

        ### 10.5 Invite Flow

        1. Leader sends an invite.
        2. Invitation record is created.
        3. Invite appears in recipient dashboard.
        4. Recipient accepts or rejects.
        5. Team and user records are updated.

        ### 10.6 Payment Flow

        1. User pays through the payment provider.
        2. User submits transaction ID.
        3. Transaction is stored.
        4. Admin reviews and acknowledges.
        5. Clearance is derived from acknowledged amount.

        ### 10.7 Accommodation Flow

        1. User opens accommodation form.
        2. User enters arrival, departure, university, gender, department, branch, year, and any special assistance info.
        3. Record is created or updated.
        4. Admin can later review the submission.

        The accommodation form should also capture any extra details needed for logistics, such as:

        - travel mode or arrival transport
        - special accessibility needs
        - emergency contact
        - number of accompanying guests if the event allows it

        ## 11. Participation Rules

        These rules should be explicit in the implementation.

        - OPJU students are treated as insiders.
        - outsider users may have a maximum event limit.
        - users cannot register for the same event twice.
        - team size must match event rules.
        - a team cannot exceed its capacity.
        - a leader must exist for every team.
        - invite acceptance should fail if the event is already joined.
        - invite acceptance should fail if the user exceeds outsider limits.
        - invite status should move through a controlled lifecycle only.
        - payment clearance should depend on acknowledged amounts, not only submitted transactions.
        - event registration should be openable and closable by authorized admins only.
        - admins should be able to add a user to an event only when team and capacity rules allow it.
        - admins should be able to remove a user from an event only with an audit trail and clear reason.
        - admins should be able to lock an event temporarily during moderation or maintenance.
        - any admin-driven membership change should keep counts and team records in sync.

        ## 12. Security Rules

        The following security rules are mandatory:

        - hash passwords before saving
        - compare passwords with a secure hashing function
        - keep auth cookies httpOnly and secure
        - avoid hard-coded JWT secrets
        - validate tokens at the route and action level
        - enforce admin authorization on admin routes
        - enforce role checks on team and invite mutations
        - do not expose server secrets through public env names
        - validate all incoming payloads with schemas

        ## 13. Validation Rules

        Use validation for:

        - email format
        - password policy
        - mobile number format
        - team size constraints
        - event identifiers
        - transaction IDs
        - accommodation fields
        - role-sensitive operations

        Validation should happen before database writes, not after.

        ## 14. State Management Rules

        ### Client State

        Use client state only for:

        - menu open/close state
        - form inputs
        - modal visibility
        - loading indicators
        - tabs and local view filters

        ### Server State

        Use server state for:

        - logged-in user
        - teams
        - invites
        - events
        - payment data
        - accommodation data

        ### Fetching Rules

        - fetch on mount only when necessary
        - do not overfetch auth state
        - refresh data after mutation success
        - provide loading and error states for every request

        ## 15. Data Rules

        ### User Data

        - email should be normalized to lowercase
        - passwords should never be returned
        - outsider and admin status must be explicit
        - team references must stay synchronized

        ### Team Data

        - leader email must exist
        - members must be valid users
        - event ID must exist
        - invites must be cleaned up when team is deleted

        ### Invite Data

        - pending, accepted, rejected, canceled should be the only states
        - accepted/rejected/canceled invites should not be mutable without reason
        - only the correct actor should change invite status

        ### Payment Data

        - transaction IDs should be unique
        - acknowledged amount should be admin-controlled
        - clearance state should be derived, not guessed

        ### Accommodation Data

        - one active record per user unless business rules say otherwise
        - updates should preserve ownership

        ## 16. Frontend Page Map

        ### Public Pages

        - home
        - about
        - events
        - event details
        - gallery
        - sponsors
        - schedule
        - team
        - contacts
        - junoon
        - accommodation

        ### Auth Pages

        - signup
        - login
        - forgot password

        ### Protected Pages

        - dashboard
        - events selection
        - team details
        - admin dashboard
        - admin count data
        - admin payment data
        - admin accommodation data
        - admin event data

        ### Dashboard Structure

        The dashboard should be split into user and admin views.

        #### User Dashboard

        The user dashboard should include:

        - profile summary
        - event registration button
        - accommodation form button
        - participating teams list
        - team invitation list
        - payment section for paid participants
        - invite accept/reject dialog
        - delete team confirmation for team leaders

        The user dashboard should also show:

        - joined event count
        - outsider or insider registration status
        - registration limit warnings when applicable
        - payment guidance for non-OPJU users
        - profile completion status
        - editable personal and academic details
        - payment status and transaction history
        - accommodation submission status
        - invite history for sent and received invites
        - notifications for approvals, deadlines, and errors
        - support links for help, FAQ, rules, and logout
        - outsider verification status and extra restrictions when applicable
        - quick stats for joined events, pending invites, paid amount, and accommodation status
        - upcoming deadlines for payment, registration, and accommodation
        - recent activity for invites, payments, and team changes
        - profile completion percentage and missing-field reminders
        - action shortcuts for edit profile, pay now, manage team, and submit accommodation
        - status badges for registered, pending, cleared, rejected, and outsider states
        - admin notices for rule violations, pending payments, and team overflow warnings

        #### Admin Dashboard

        The admin dashboard should include:

        - admin profile summary
        - managed events list
        - event search filter
        - navigation to event-wise data pages
        - accommodation data access
        - payment data access
        - count data access
        - quick stats for total participants, teams, payments, accommodations, and pending actions
        - approvals queue for payments, accommodations, and event data reviews
        - export actions for spreadsheets and reports
        - filters for event, category, status, and outsider counts
        - recent administrative activity and audit trail summary
        - alert cards for unpaid users, pending accommodations, and team limit issues
        - permission-aware views for manager versus full admin
        - direct links to user, team, payment, and accommodation detail pages
        - event registration control actions such as open registration, close registration, and extend deadline
        - user management actions such as add user to event, remove user from event, and move user between teams when allowed
        - event lockdown actions for temporarily freezing edits during review or maintenance
        - bulk moderation actions for approved, pending, and restricted participants

        #### Admin Event Controls

        The admin event-controls area should support:

        - freeze event registration without fully closing the event
        - reopen registration with a modified or smaller capacity limit
        - force transfer a user from one team to another when rules allow it
        - remove a user from an event and immediately update counts
        - block a user from a specific event
        - override a payment check with a required reason and audit log
        - add an audit note for every manual admin action
        - notify the user when they are added, removed, blocked, or moved
        - show history of who changed what and when
        - restore a previous admin action if an accidental change needs reversal

        These controls should always:

        - respect authorization and role checks
        - keep team counts and event counts in sync
        - write an audit record for every action
        - notify affected users when appropriate
        - prevent silent changes without a reason

        #### Admin Safety Rules

        - required reason for add/remove/block/transfer
        - confirmation modals before close/open/remove/transfer
        - undo window for accidental admin changes
        - permission matrix for dev admin versus management admin
        - audit log view with actor, action, reason, and time
        - user notifications whenever admin changes impact them
        - capacity checks before adding users to events or teams
        - soft close for registration so existing teams stay intact
        - protect all irreversible actions with an extra confirmation step

        #### Dev Dashboard

        The dev dashboard should be a separate restricted area for the development team only.

        The dev dashboard should include:

        - system health overview
        - database connection status
        - user and role management tools
        - audit and error logs
        - feature flag or maintenance controls
        - debug and troubleshooting utilities
        - safe override tools for development-only fixes

        The dev dashboard should also show:

        - development team access only
        - technical warnings and service alerts
        - deployment or maintenance notes
        - hidden or disabled management-only tools
        - environment and configuration summaries

        The dev dashboard should always:

        - be blocked from management admins unless explicitly allowed
        - verify role access on the server, not only in the UI
        - keep debugging tools separate from festival operations
        - avoid exposing sensitive production secrets in the UI

        The admin dashboard should also show:

        - role badge for dev admin or management admin
        - only the events the manager can control when permissions are limited
        - clean loading and empty states for reports
        - report completeness indicators
        - count summaries for insiders, outsiders, teams, and invitations
        - stale-data warnings when a report has not been refreshed
        - whether each event is open, closed, or locked
        - which users were recently added or removed by admins
        - pending change requests that need management approval

        #### Dashboard Behavior Rules

        - user dashboard data should refresh after invites, teams, and payment actions
        - admin dashboard data should reflect the current database state
        - protected dashboard routes must require a valid session
        - user actions must respect outsider limits and team ownership
        - admin actions must respect role and permission checks

        ## 17. Component Rules

        ### Layout Components

        - nav should remain fixed and responsive
        - footer should contain essential links and social connections
        - layout should set typography and global wrappers

        ### Content Components

        - about section should explain the festival clearly
        - events section should help users discover event categories
        - faculty section should present organizers with hierarchy
        - FAQ should answer common participation questions

        ### Functional Components

        - user dropdown should always reflect auth state
        - payments component should show balance and transaction history
        - accommodation modal should clearly guide the user

        ## 18. Responsive Design Rules

        - desktop should show fuller navigation and richer layouts
        - mobile should preserve meaning, not just shrink the UI
        - menus should remain usable with one hand
        - cards should stack cleanly on smaller screens
        - typography should remain readable at every breakpoint
        - image and video assets should not break layout flow

        ## 19. Motion and Visual Rules

        The site should use motion intentionally:

        - hero entrance should feel dramatic
        - cards can scale or slide subtly
        - carousels should move smoothly
        - overlays should not block usability
        - motion should support the brand, not distract from content

        ## 20. Error Handling Rules

        - show a clear message when login fails
        - show a clear message when signup fails
        - show a clear message when invite actions fail
        - show a clear message when payment submission fails
        - show a clear message when protected routes reject access
        - use consistent toast or inline error formatting

        ## 21. Reporting Rules

        Admin reports should include:

        - event counts
        - team counts
        - user participation counts
        - outsider counts
        - payment status
        - payment acknowledgements
        - accommodation lists
        - export support

        Reports should be derived from the database in a deterministic way.

        ## 22. Implementation Order

        If building this properly, follow this order:

        1. secure authentication
        2. fix authorization checks
        3. standardize validation
        4. ensure data integrity and indexes
        5. clean up frontend metadata and navigation
        6. stabilize dashboard and admin pages
        7. refactor repeated business logic into helpers
        8. add report/export consistency
        9. polish responsive behavior and micro-interactions
        10. document everything for future maintenance

        ## 23. Build Phases

        Build the system in phases so every layer becomes stable before the next one starts.

        ### Phase 1: Foundation

        Goal: make the project safe and structurally correct before adding more features.

        Deliverables:

        - secure password hashing
        - secure cookie handling
        - reliable JWT validation
        - server-only environment variables
        - clean database connection setup
        - consistent validation schemas

        Exit criteria:

        - users can sign up and log in safely
        - protected routes reject invalid sessions
        - no secrets depend on public env names

        ### Phase 2: Core Participant Flow

        Goal: make the participant journey work end to end.

        Deliverables:

        - event discovery pages
        - signup and login pages
        - dashboard shell
        - event selection flow
        - team creation flow
        - invite flow
        - basic auth-aware navigation

        Exit criteria:

        - a user can register, log in, open the dashboard, and start event participation
        - team creation and invite handling follow the defined rules

        ### Phase 3: Participation Rules

        Goal: enforce the festival logic that makes the platform trustworthy.

        Deliverables:

        - outsider participation limit checks
        - duplicate registration prevention
        - team size enforcement
        - invite acceptance rules
        - leader-only team mutation checks

        Exit criteria:

        - invalid team and invite actions are blocked correctly
        - event participation cannot bypass the rules

        ### Phase 4: Payment and Accommodation

        Goal: complete the two major participant service flows after registration works.

        Deliverables:

        - transaction ID submission
        - payment status display
        - admin acknowledgement flow
        - payment clearance logic
        - accommodation form and save flow
        - admin accommodation overview

        Exit criteria:

        - participants can submit payment references safely
        - admins can review and acknowledge payment data
        - accommodation requests are stored and reviewed correctly

        ### Phase 5: Admin Reporting

        Goal: give administrators reliable operational visibility.

        Deliverables:

        - event count dashboards
        - participant count dashboards
        - payment dashboards
        - accommodation dashboards
        - export support for Excel or spreadsheet downloads

        Exit criteria:

        - admin views show accurate data
        - exports match the live database state

        ## Project‑From‑Scratch Checklist

        This checklist outlines the concrete steps to create the project from scratch and maps high‑level tasks to implementation targets.

        1. Init repo & branches
                - Initialize Git, create `main` and `development` branches, protect `main` with branch rules.
        2. Scaffold app
                - Create Next.js + TypeScript app; install core dependencies (React, Tailwind, Mongoose, jsonwebtoken, bcrypt/argon2, Zod, Nodemailer).
        3. Lint & formatting
                - Configure `ESLint`, `Prettier`, TypeScript `tsconfig.json`, and Husky pre-commit hooks.
        4. Environment management
                - Add `.env.example` with server-only vars: `JWT_SECRET`, `MONGODB_URI`, `MONGODB_DBNAME`, `SMTP_USER`, `SMTP_PASS`.
        5. Database connection & models
                - Implement `src/lib/mongodb.ts` with cached Mongoose connection.
                - Add models: `user`, `team`, `event`, `invite`, `transaction`, `accommodation` with indexes and validation.
        6. Auth & password hashing
                - Implement signup/login with bcrypt or argon2; enforce password policy and never store plaintext.
        7. JWT & secure cookies
                - Use server-only `JWT_SECRET`, sign tokens server-side, set cookies `httpOnly: true`, `secure` in prod, `sameSite: 'lax'`.
        8. Middleware & RBAC
                - Harden `src/middleware.ts` to validate tokens and enforce role checks; add `roles` to `user` model (devAdmin, managementAdmin).
        9. User actions & validation
                - Implement `src/features/users/user-actions.ts` with Zod schemas; return sanitized user payloads.
        10. Event, team & invite flows
                - Implement business rules: outsider limits, team size enforcement, invite lifecycle and ownership checks.
        11. Payment & accommodation flows
                - Add transaction model, admin acknowledgment workflow, and accommodation form handling.
        12. Admin dashboards & controls
                - Build admin UI/serverside controls for open/close/freeze/lock, capacity checks, confirmation and undo windows.
        13. Dev dashboard & restrictions
                - Add a dev-only dashboard route gated server-side by `devAdmin` role; hide debugging tools from management admins.
        14. Audit logging & admin reasons
                - Create `audit` collection and require `reason` for admin mutations; write audit entries for all manual admin actions.
        15. Tests & CI
                - Add unit and integration tests for auth, RBAC, invite/event flows; add GitHub Actions for lint/test/build.
        16. Observability & backup
                - Add health endpoints, error reporting (Sentry/logging), and MongoDB backup plan.
        17. Docs & deployment
                - Write `BACKEND_README.md`, `FRONTEND_README.md`, update `MASTER_BUILD_BLUEPRINT.md`; prepare deployment scripts and env instructions.
        18. Security audit & release
                - Run security checks (no `NEXT_PUBLIC_*` secrets), fix issues, final QA, tag release and deploy.

        Use this checklist to drive Phase‑1 implementation first (auth, env, cookies, middleware), then progress through the remaining phases.

        ### Phase 6: Frontend Polish

        Goal: finish the public-facing experience and remove rough edges.

        Deliverables:

        - correct metadata
        - consistent mobile navigation
        - better empty, loading, and error states
        - cleaned dashboard files
        - semantic button and link usage
        - responsive tuning across screens

        Exit criteria:

        - the UI feels consistent on all major pages
        - desktop and mobile preserve the same meaning

        ### Phase 7: Cleanup and Hardening

        Goal: make the codebase stable for long-term maintenance.

        Deliverables:

        - remove commented legacy code
        - extract repeated helpers
        - standardize naming
        - improve route protection
        - centralize role checks
        - add missing indexes and constraints

        Exit criteria:

        - the architecture is easier to maintain
        - future changes can be added without reworking core logic

        ## 24. What Should Not Be Overbuilt Yet

        Do not overcomplicate these too early:

        - chat or notification systems
        - real-time collaboration
        - multi-step permission engines
        - complex analytics pipelines
        - overabstracted component factories

        The platform needs strong basics before it needs advanced extras.

        ## 25. Quality Checklist

        Before calling the app complete, confirm:

        - passwords are hashed
        - cookies are secure
        - auth tokens are validated
        - invite permissions are enforced
        - event limits are enforced
        - admin routes are protected
        - forms are validated
        - metadata is correct
        - mobile UI works properly
        - dashboard pages are clean
        - reports are accurate
        - no critical secrets are public

        ## 26. Final Build Standard

        The finished system should feel like this:

        - a polished public festival site
        - a secure participant portal
        - a controlled team-management flow
        - a trustworthy payment and accommodation system
        - an accurate admin dashboard
        - a maintainable codebase with clear architecture

        If the app satisfies those points, it is built correctly for the use case.
