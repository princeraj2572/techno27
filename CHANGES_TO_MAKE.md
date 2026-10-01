# Changes To Make

This document turns the architecture and issues report into a practical change list. It is written as an implementation checklist so the codebase can be improved step by step.

## Goal

Bring the festival platform closer to a production-ready state by fixing security issues first, then authorization and data integrity, then frontend consistency and maintainability.

## Priority 1: Security Fixes

These changes should happen first because they affect user safety and account protection.

### 1. Hash passwords

Current problem:

- passwords are stored in plaintext
- login compares raw password strings directly

What to change:

- hash passwords before saving them in the user model
- compare passwords with a secure hashing library during login
- never store or return raw passwords in responses

Suggested files:

- `src/actions/user-actions.ts`
- `src/models/user.model.ts`

### 2. Protect auth cookies

Current problem:

- the auth cookie is readable by client-side JavaScript

What to change:

- set the auth cookie as `httpOnly`
- keep `secure` enabled in production
- keep `sameSite` restrictive enough for the app flow
- delete the cookie on logout

Suggested files:

- `src/actions/user-actions.ts`
- `src/lib/utils.ts` if logout is handled there

### 3. Remove unsafe JWT fallback

Current problem:

- token generation and verification use a fallback string when the secret is missing

What to change:

- require a real JWT secret from environment variables
- fail fast if the secret is missing
- do not ship a default development fallback in runtime auth logic

Suggested files:

- `src/actions/user-actions.ts`

### 4. Use server-only env names for secrets

Current problem:

- MongoDB and JWT settings are stored in `NEXT_PUBLIC_` variables

What to change:

- rename server-only secrets to non-public environment names
- update the database connection module and auth code to read the new names
- keep only truly public values in public env variables

Suggested files:

- `src/lib/mongodb.ts`
- `src/actions/user-actions.ts`
- `.env.local`

## Priority 2: Authorization Fixes

These changes make sure the right person is allowed to perform each mutation.

### 5. Lock invite state mutations

Current problem:

- invite cancel, accept, and reject actions do not clearly verify the caller

What to change:

- check that the current user is the team leader before canceling invites
- check that the current user is the invite recipient before accepting or rejecting
- refuse invite changes if the invite is already completed
- return clear errors for unauthorized access

Suggested files:

- `src/actions/invite-actions.ts`

### 6. Add role guards for admin pages and actions

Current problem:

- admin data should not be reachable by normal participants unless the page or action checks it

What to change:

- add a reusable helper for admin checks
- block non-admin access in admin dashboards and data endpoints
- keep the rule in one place instead of repeating it in every page

Suggested files:

- `src/actions/user-actions.ts`
- `src/middleware.ts`
- `src/app/(functionality)/admin/**`

### 7. Validate route tokens instead of only checking presence

Current problem:

- middleware only checks if a cookie exists

What to change:

- validate the token or decode it in middleware before allowing protected routes
- redirect expired or invalid sessions immediately
- keep the page-level auth check as a second layer

Suggested files:

- `src/middleware.ts`

## Priority 3: Data Integrity Fixes

These changes reduce accidental mismatches and make the data model more trustworthy.

### 8. Clean up payment summary logic

Current problem:

- the payment dashboard query and comment do not match cleanly

What to change:

- define the exact population the admin report should include
- rename variables and comments so they match the actual data set
- extract payment calculation rules into a helper
- document the meaning of acknowledged amount and clearance status

Suggested files:

- `src/actions/payment-actions.ts`

### 9. Centralize business rules

Current problem:

- event-limit and membership rules are spread across multiple actions

What to change:

- create reusable helpers for event limits, outsider limits, and team membership checks
- reuse them in event registration and invite acceptance
- keep the business rules in one place

Suggested files:

- `src/actions/event-actions.ts`
- `src/actions/invite-actions.ts`
- `src/lib/utils.ts`

### 10. Add schema indexes and uniqueness rules

Current problem:

- critical lookups depend on email, team leader, invitee, and transaction ID

What to change:

- index user email
- index team leader
- index invitee email and teamId
- keep transaction ID unique
- add any other lookup indexes needed for reporting

Suggested files:

- `src/models/user.model.ts`
- `src/models/team.model.ts`
- `src/models/invitation.model.ts`
- `src/models/transaction.model.ts`

## Priority 4: Frontend Fixes

These improve polish, accessibility, and consistency.

### 11. Replace default metadata

Current problem:

- the root description still says generated by create next app

What to change:

- write a real app description
- add better page titles and social metadata
- make the metadata match the event platform branding

Suggested files:

- `src/app/layout.tsx`

### 12. Make mobile navigation match desktop intent

Current problem:

- mobile events navigation is simpler than desktop navigation

What to change:

- give mobile events the same submenu structure or a clear alternative
- avoid different information architecture between breakpoints
- keep the menu logic reusable

Suggested files:

- `src/components/nav.tsx`

### 13. Fix semantic button and link usage

Current problem:

- some links wrap buttons instead of using one interactive element

What to change:

- use `Link` styled like a button or a button that triggers navigation, not both
- ensure keyboard and screen reader behavior stays correct

Suggested files:

- `src/app/page.tsx`
- `src/components/nav.tsx`

### 14. Remove commented-out legacy code

Current problem:

- the dashboard file contains a large amount of commented code

What to change:

- delete dead commented blocks
- split large dashboard logic into smaller components if needed
- keep only the active implementation in the file

Suggested files:

- `src/app/(functionality)/dashboard/page.tsx`

### 15. Reduce auth flicker in the user dropdown

Current problem:

- the dropdown fetches auth state on route change, which can flicker

What to change:

- move auth state resolution into a more stable session source
- keep the dropdown from reloading unnecessarily
- preserve the admin and logout actions

Suggested files:

- `src/components/user-dropdown.tsx`

## Priority 5: Maintainability Fixes

These changes make the code easier to grow safely.

### 16. Separate reusable business helpers

What to change:

- move shared calculations into helper functions
- keep page files focused on rendering
- keep action files focused on use-case logic

Suggested files:

- `src/lib/utils.ts`
- `src/actions/*`

### 17. Clean up naming and spelling

What to change:

- standardize event and component naming
- fix inconsistent naming where it affects readability
- align filenames with the actual feature they represent

Examples:

- `TechnoAmbiation` / `Techno-aiMBiAtion` spelling should be standardized
- `accomodation` should eventually be renamed to `accommodation` if the rest of the app is updated with it

### 18. Add stronger error messages and loading states

What to change:

- surface clearer errors for auth and action failures
- keep loading states consistent across forms and dashboards
- avoid silent failures in user-facing flows

Suggested files:

- `src/hooks/use-fetch.ts`
- `src/components/*`

## Recommended Implementation Order

If you want the highest impact order, do it like this:

1. Hash passwords
2. Secure cookies
3. Remove unsafe JWT fallback
4. Fix invite authorization
5. Validate middleware tokens
6. Rename server-only env variables
7. Clean up metadata
8. Fix mobile navigation consistency
9. Remove commented dashboard code
10. Refactor payment and business-rule helpers

## What To Leave Alone For Now

These areas are not the main problem right now and can stay as-is until the higher priority issues are fixed:

- visual theme and hero art
- event card designs
- faculty presentation layout
- sponsor marquee styling
- snowflake and motion effects

Those parts are already useful for the brand and do not block production readiness.

## Final Note

The key idea is that the app does not need a total rewrite. It needs targeted changes in the right order:

- secure the auth layer
- enforce authorization
- make config safe
- clean the frontend experience
- refactor only after the core risks are removed
