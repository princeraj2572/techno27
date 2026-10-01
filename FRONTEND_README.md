# Frontend README

This project’s frontend is a Next.js App Router application built around a modular, responsive, animation-heavy landing experience and a set of functional authenticated pages.

## Overview

The frontend is responsible for:

- the public festival landing page
- event discovery and event detail pages
- authentication screens
- dashboard and admin entry points
- team, sponsor, gallery, schedule, contact, and accommodation pages
- responsive navigation and user session awareness
- visual motion, festive effects, and rich media presentation

The app uses server actions for data mutation, but the user interface itself is a client-first experience built with reusable components.

## Technology Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Radix UI components
- React Hook Form
- Zod validation
- Framer Motion
- Lucide React and React Icons
- next/image for optimized media rendering
- next/font for typography loading

## Frontend Architecture

### High-Level Structure

The frontend follows a layered composition model:

1. `src/app` defines routes and page shells.
2. `src/components` contains reusable sections, widgets, and layout primitives.
3. `src/components/ui` provides low-level design-system controls such as buttons, dialogs, tables, dropdowns, forms, and toasts.
4. `src/hooks` contains reusable client-side helpers such as the fetch wrapper and toast hook.
5. `src/lib/utils.ts` provides shared helpers used by the UI.
6. Page components assemble these building blocks into full screens.

### Rendering Model

The app mixes server and client components intentionally:

- static or mostly static content is rendered through route pages and composed sections
- interactive pieces such as dropdowns, forms, sliders, carousels, and dashboards are client components
- route transitions and auth state are handled on the client when needed

### UI Flow

```text
Route in src/app
        |
        v
Page component
        |
        v
Reusable section / widget in src/components
        |
        v
Client interaction: form, dropdown, carousel, modal, or slider
        |
        v
Server action call through useFetch or direct action invocation
        |
        v
UI refresh / toast / redirect
```

## Route Map

### Public Content Routes

- `/` landing page
- `/about`
- `/events`
- `/events/[slug]` event detail pages such as `codigo`, `techlab`, `robovation`, `ideathon`, `designathon`, `kalakriti`, `master_chef`, `roadies`, `antaragni`, `beat-battle`, `start-up-business-plan`, `riywayat`, `aima`, `reverseEng`, and `yuva-sabha`
- `/gallery`
- `/schedule`
- `/sponsors`
- `/team`
- `/junoon`
- `/contacts`
- `/accommodation`

### Functional Routes

- `/auth/signup`
- `/auth/login`
- `/auth/forgot-password`
- `/dashboard`
- `/events-selection`
- `/team-details/[teamId]`
- `/admin/dashboard`
- `/admin/count-data`
- `/admin/event-data/[eventId]`
- `/admin/payment-data`
- `/admin/accommodation-data`

## Core Pages

### Home Page

The home page combines the strongest visual elements of the site:

- a hero section with a gradient sky background
- the torch/pillar centerpiece artwork
- a prominent register call to action
- the event carousel / events showcase
- about section content
- faculty and convenor showcase
- footer and social links
- animated snowflake overlay

This page is the main brand-facing entry point and is intentionally cinematic.

### Events Page

The events section presents the technical and non-technical event catalog with a swipeable carousel-like interaction. It is designed to work on both desktop and mobile:

- center card is emphasized
- adjacent cards are partially visible
- arrows support desktop interaction
- touch gestures support mobile interaction
- each card links into a specific event detail page

### Auth Pages

The auth flow is split into three main experiences:

- signup uses a step-based flow for email verification and account creation
- login uses form validation and redirects users based on role
- forgot-password provides password recovery support

### Dashboard and Admin Pages

The dashboard area is the authenticated user hub. It is intended to show:

- profile information
- registration status
- participating teams
- pending invites
- payment status
- access to event registration and team details

The admin area is intended to expose management dashboards for counts, payments, and accommodation data.

## Component Breakdown

### Layout Components

- `src/app/layout.tsx` wraps the app, loads fonts, mounts the navigation bar, and renders the toast system.
- `src/components/nav.tsx` provides the fixed top navigation.
- `src/components/footer.tsx` provides the footer links and social icons.

### Hero and Presentation Components

- `src/components/background-video.tsx` renders a looping background video with a radial overlay.
- `src/components/snowflakes.tsx` renders the festive snowflake animation.
- `src/components/countdown-timer.tsx` shows a live countdown timer to the event date.
- `src/components/image-carousel.tsx` provides a motion-driven rotating image carousel.
- `src/components/sponser-marquee.tsx` and `src/components/sponsors.tsx` present sponsor branding.

### Content Components

- `src/components/aboutSection.tsx` presents the festival story and supporting artwork.
- `src/components/eventsSection.tsx` presents the event cards and interaction controls.
- `src/components/facultySection.tsx` shows the faculty, convenors, mentors, and highlight cards.
- `src/components/faq.tsx` provides the FAQ accordion view.

### Functional Components

- `src/components/user-dropdown.tsx` handles authentication-aware menu actions.
- `src/components/payments.tsx` handles transaction submission and payment history.
- `src/components/accomodation-modal.tsx` supports accommodation-related input.
- `src/components/ui/*` contains reusable form, modal, table, select, dropdown, accordion, and toast primitives.

## How The Frontend Works

### Navigation

The navigation bar is fixed at the top of the app and drives most user movement:

- on desktop it shows a glassmorphism-style horizontal menu
- on mobile it collapses into a drawer-style overlay menu
- the Events menu exposes technical and non-technical shortcuts
- the user menu changes based on authentication state

### Authentication-Aware UI

`src/components/user-dropdown.tsx` is the main session-aware UI element.

- when a user is authenticated, it shows dashboard or admin dashboard and logout actions
- when no user is authenticated, it shows signup and login actions
- it uses the current pathname to refresh auth state when routes change

### Forms and Validation

Auth and data-entry pages use a consistent form flow:

- React Hook Form manages local form state
- Zod provides input validation rules
- shadcn-style UI controls render the input elements
- server actions are invoked through the shared fetch helper or direct action calls
- toast messages communicate success and failure states

### Interactive Media

The frontend uses animation and motion deliberately rather than as decoration alone:

- Framer Motion powers the rotating image carousel
- the event carousel uses translation and scaling to emphasize the active card
- snowflakes add a seasonal visual overlay
- hero imagery and gradients create a layered festival atmosphere

### Mobile Behavior

The UI is responsive across breakpoints:

- hero elements scale and reposition for smaller screens
- navigation switches to a mobile menu
- event cards support touch swipes
- section layouts collapse from multi-column to single-column grids
- components use relative sizing and utility classes instead of fixed desktop-only layouts

## Client State Patterns

The frontend relies on a few repeatable state patterns:

- `useState` for visible UI state such as menus, steps, and dialog visibility
- `useEffect` for fetching data after mount and reacting to route changes
- `useRef` for swipe tracking, dropdown containment, and other imperative helpers
- a shared `useFetch` hook for invoking server actions and managing loading/error/data state

This keeps the interaction model simple and consistent across forms, dashboards, and detail views.

## Page-Level Design System

### Visual Style

The UI uses a distinct festival look instead of a generic admin dashboard style:

- deep blue and black backgrounds
- gold and sky-blue accent gradients
- glassmorphism panels
- bold hero imagery
- large typography for headings and calls to action
- layered background effects and soft glows

### Typography

Typography is loaded through `next/font` in the root layout:

- Geist Sans for body text
- Geist Mono for monospace accents

The styling favors strong contrast and large display headings on public pages.

### Media Handling

`next/image` is used throughout to keep images optimized and responsive. The app heavily relies on images stored in `public/` for event cards, faculty portraits, sponsor logos, backgrounds, and decorative assets.

## Frontend Workflows

### Login Workflow

1. The user submits the login form.
2. Zod validates the email and password structure.
3. `userLogin` is invoked through the fetch helper.
4. The UI shows a loading state.
5. On success, a toast appears and the user is redirected to the correct dashboard.

### Signup Workflow

1. The user opens the signup page.
2. The UI walks them through email entry, OTP verification, and account details.
3. Each step is isolated into a separate component.
4. The flow keeps the signup process focused and easier to resume.

### Event Browsing Workflow

1. The user lands on the home page or events page.
2. The event carousel highlights major event categories.
3. The user clicks an event card.
4. The app routes them to a dedicated event page.

### Payment Workflow

1. The user opens the payment panel.
2. The current balance and transaction history are loaded.
3. The user scans the QR code or visits the payment link.
4. The user enters the transaction ID.
5. The UI submits it and refreshes the list.

### Dashboard Workflow

1. The user opens a protected page.
2. Middleware and the user dropdown verify session state.
3. The dashboard loads registered teams, invites, and payment data.
4. The user can continue registration or open team details.

## Design Notes

- The frontend is content-rich, so component reuse is important.
- The landing page is intentionally cinematic, while authenticated pages are more operational.
- The app mixes visual flair with practical workflow components.
- The same styling language is used across public and functional pages to keep the product coherent.

## Useful Implementation Details

- `Nav` uses outside-click handling to close the desktop events menu.
- `EventsSection` supports swipe gestures through touch handlers.
- `UserDropdown` adapts its menu based on whether the user is an admin, a normal user, or signed out.
- `Payments` stores the transaction amount remaining and keeps the table in sync with the latest server data.
- `FAQAccordion` uses Radix accordion primitives for accessible expandable content.

## Frontend Structure Summary

| Area | Responsibility |
| --- | --- |
| `src/app` | Route-level pages and route groups |
| `src/components` | Shared sections, widgets, and page building blocks |
| `src/components/ui` | Design-system primitives |
| `src/hooks` | Data-fetching and toast helpers |
| `public` | Images, videos, logos, event graphics, and decorative assets |

## Suggested Enhancements

If you continue evolving the frontend, the most useful next improvements would be:

- add a route-by-route screenshot or page intent index
- document the auth/signup subcomponents in more detail
- standardize shared page sections into a formal design system guide
- add a small sitemap or route tree diagram
