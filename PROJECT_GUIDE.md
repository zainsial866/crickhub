# CricketHub Frontend Project Guide

## 1. Project Overview

CricketHub is a Next.js 14 frontend for discovering indoor cricket grounds, booking time slots, managing teams, and administering the platform. It is currently a frontend demo: application data is supplied by `lib/mockData.ts`, client state is managed with Zustand, and authentication is simulated in the browser with `localStorage`.

The application supports three roles:

- **Player**: discovers grounds, books slots, manages bookings, manages a team, and views the leaderboard.
- **Ground owner**: manages a facility, its slots, bookings, settings, and earnings.
- **Admin**: reviews grounds, moderates users, monitors platform statistics, and resolves disputes.

## 2. Technology Stack

- **Next.js 14 App Router**: routing, layouts, metadata, and the development/build toolchain.
- **React 18**: client components and interactive UI.
- **TypeScript**: strict type checking across application code.
- **Tailwind CSS**: utility-first styling and responsive layouts.
- **CSS variables**: centralized dark and light theme values.
- **Zustand**: global client state with persisted browser storage.
- **Axios**: prepared HTTP client for a future backend API.
- **date-fns**: date formatting and date arithmetic.
- **Lucide React**: interface icons.
- **Radix UI, React Hook Form, and Zod**: installed foundations for dialogs, forms, and validation; the current screens mainly use the local components and native form state.

## 3. How To Run It

Run these commands from the project root:

```bash
npm install
npm run dev
```

The development server normally runs at `http://localhost:3000`.

Available scripts:

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve a completed production build. |
| `npm run lint` | Run Next.js ESLint checks. |
| `npm run type-check` | Run TypeScript without emitting files. |

## 4. Folder Structure

```text
app/          App Router layouts and route pages
components/   Reusable UI components, cards, forms, and layouts
context/      React providers for authentication and theme state
hooks/        Small role/domain hooks that select data from the store
lib/          API client, constants, mock data, Zustand store, utilities
styles/       Global CSS and theme variables
types/        Shared TypeScript domain models
```

Generated or local-only directories are intentionally not source documentation targets:

- `node_modules/` contains installed third-party packages.
- `.next/` contains Next.js generated build/development artifacts.
- `tsconfig.tsbuildinfo` is TypeScript incremental compiler state.
- `.git/` is Git repository metadata.

## 5. Application Flow

1. `app/layout.tsx` loads global CSS and wraps the app with `ThemeProvider` and `AuthProvider`.
2. `AuthProvider` restores or creates a demo user and token in `localStorage`.
3. Role pages render through `PlayerLayout`, `GroundOwnerLayout`, or `AdminLayout`.
4. Those layouts render the shared `Header`, desktop `Sidebar`, page content, and mobile `Navigation`.
5. Page-specific hooks read and update Zustand state from `lib/store.ts`.
6. Zustand persists selected demo changes under `crickethub_app_storage`.
7. Theme changes update `html[data-theme]`, which changes CSS variables in `styles/variables.css`.

There is no server-side authentication or database connection in the current implementation. `lib/api.ts` is ready for an API, but the visible screens use local mock state.

## 6. Route Files In `app/`

### `app/layout.tsx`

The root layout for every route. It imports `styles/globals.css`, defines page metadata and viewport settings, and wraps all children in the theme and authentication providers.

### `app/page.tsx`

The public landing/entry page. It provides theme switching, links to sign in and sign up, and buttons/cards that switch the demo role and navigate to that role's home page.

### `app/(auth)/layout.tsx`

The route-group layout for authentication screens. The `(auth)` folder does not appear in URLs. This layout centers login and signup content and applies authentication-page spacing.

### `app/(auth)/login/page.tsx`

The demo login screen. It supports email/password form submission and one-click demo login for Player, Owner, and Admin roles. Login calls `AuthContext.login()` and redirects using `ROLE_HOME_ROUTES`.

### `app/(auth)/signup/page.tsx`

The demo signup screen. It collects name, email, password, and either Player or Ground Owner role, then calls `AuthContext.signup()` and redirects to the selected role home page.

### `app/player/layout.tsx`

The player route layout. It supplies the shared player shell and protects the page structure with the player navigation experience.

### `app/player/discover/page.tsx`

The player home page. It displays the availability hero, search and filters, ground cards, nearby match challenges, and the booking modal. Ground filtering comes from `useGrounds()` and team challenges come from `useTeams()`.

### `app/player/bookings/page.tsx`

The player booking history screen. It separates upcoming and past bookings, renders `BookingCard` items, opens booking detail dialogs, and confirms cancellation through a modal.

### `app/player/team/page.tsx`

The team management screen. It displays the team summary, roster, player removal actions, team statistics, and the invite modal for adding members.

### `app/player/leaderboard/page.tsx`

The team standings screen. It renders the top three teams as podium cards and all teams in a responsive standings table.

### `app/player/profile/page.tsx`

The player account and preferences screen. It edits local profile fields, selects dark/light theme, controls notification demo toggles, and provides logout.

### `app/ground-owner/layout.tsx`

The ground-owner route layout. It supplies the shared header, desktop sidebar, and mobile navigation around owner pages.

### `app/ground-owner/dashboard/page.tsx`

The owner overview. It shows the facility identity, revenue and occupancy KPIs, today's bookings, and links to slot and settings pages.

### `app/ground-owner/slots/page.tsx`

The owner slot schedule. It shows a seven-day selector, booking-protection notice, slot cards, availability controls, and slot prices.

### `app/ground-owner/earnings/page.tsx`

The owner revenue page. It displays gross, cash, and digital-wallet metrics, then lists recent booking transactions. The CSV export action is currently a local success-state demo.

### `app/ground-owner/settings/page.tsx`

The facility settings form. It edits the displayed ground name, location, address, rate, hours, and description. Saving currently shows a local confirmation state rather than persisting changes to the store.

### `app/admin/layout.tsx`

The admin route layout. It supplies the shared shell for administration pages.

### `app/admin/dashboard/page.tsx`

The admin overview. It shows platform KPIs, ground approval activity, and dispute activity, with actions for approving or rejecting grounds.

### `app/admin/grounds/page.tsx`

The ground moderation directory. It filters grounds by status, displays pricing/rating/location information, opens an inspection modal, and approves or rejects pending grounds.

### `app/admin/users/page.tsx`

The user directory. It filters local demo users by text and role and toggles each user's active/suspended status.

### `app/admin/disputes/page.tsx`

The dispute-resolution queue. It lists dispute tickets, opens case details in a modal, and marks unresolved tickets as resolved.

## 7. Reusable Components

### `components/layouts/PlayerLayout.tsx`

Shared player shell containing `Header`, desktop `Sidebar`, page content, and mobile `Navigation`. The content shell uses the full desktop viewport with responsive inner padding.

### `components/layouts/GroundOwnerLayout.tsx`

Shared shell for all ground-owner pages. Its structure matches the player shell while selecting owner navigation through the current user role.

### `components/layouts/AdminLayout.tsx`

Shared shell for all admin pages. It uses the same header/sidebar/mobile navigation system and full-width desktop content area.

### `components/shared/Header.tsx`

Global top header. It renders the CricketHub brand, role-switching shortcuts on large screens, theme toggle, notification control, current-user summary, and logout.

### `components/shared/Sidebar.tsx`

Desktop-only left navigation. It selects links for the current role, highlights the active route, shows optional badges, and displays a location/platform information panel.

### `components/shared/Navigation.tsx`

Mobile-only bottom navigation. It selects role-specific links, displays the active link with icon and label, and uses theme CSS variables for its surface, borders, active color, and inactive text.

### `components/shared/Card.tsx`

Reusable card container with default, elevated, and interactive variants. It supplies the common background, border, radius, spacing, hover, and shadow styles.

### `components/shared/Button.tsx`

Reusable typed button supporting primary, secondary, outline, ghost, and danger variants; small, medium, and large sizes; optional icons; disabled state; and loading state.

### `components/shared/Badge.tsx`

Reusable status/category label supporting primary, teal, orange, success, danger, and outline variants with small or medium sizing.

### `components/shared/Modal.tsx`

Reusable dialog overlay. It locks body scrolling while open, supports a title and description, provides configurable maximum widths, and closes when the backdrop or close button is used.

### `components/shared/Loading.tsx`

Provides `LoadingSpinner` and `CardSkeleton` placeholders for loading states. The current route pages do not rely heavily on these components yet.

### `components/cards/GroundCard.tsx`

Displays one ground's image, pitch type, city, rating, distance, location, hours, price, and booking action. It opens the booking flow through a callback.

### `components/cards/BookingCard.tsx`

Displays one booking's reference, status, ground, date/time, team, fee, cancellation action, and optional details action.

### `components/cards/SlotPicker.tsx`

Provides date selection for the next four days and a responsive grid of available/booked time slots. It reports selected date and slot through callbacks.

### `components/cards/StatsHeroCard.tsx`

Displays the player discovery hero with a circular availability indicator and booking, rank, and match statistics.

### `components/cards/TeamCard.tsx`

Displays the team crest, name, city, captain, roster count, win/loss/points summary, invite code copy action, and invite action.

### `components/forms/BookingModal.tsx`

Multi-step booking dialog. It lets a player select a date and slot, choose a payment method, tag the booking to a team, and confirm the booking. After confirmation it displays a booking ticket.

### `components/forms/InviteMemberModal.tsx`

Team invitation dialog. It copies the team invite code or submits a new member's name and email through the supplied callback.

## 8. Context Providers

### `context/AuthContext.tsx`

Owns the current user, token, loading state, login, signup, role switching, and logout. All operations are demo operations and persist user/token values in `localStorage` under `crickethub_user` and `crickethub_token`.

### `context/ThemeContext.tsx`

Owns the current dark/light theme. It reads `crickethub_theme`, falls back to the browser color preference, and updates `document.documentElement` with `data-theme`.

## 9. Hooks

### `hooks/useGrounds.ts`

Selects grounds, slots, search/filter values, and filter setters from the Zustand store. It derives filtered grounds with `useMemo()` and exposes ground/slot lookup helpers.

### `hooks/useBookings.ts`

Selects bookings and booking actions from the store. It derives upcoming versus past bookings and wraps create/cancel operations in async functions used by the UI.

### `hooks/useTeams.ts`

Selects the team, leaderboard, match challenges, and team/challenge actions from the store. It exposes async wrappers for adding and removing members.

### `hooks/useOwner.ts`

Selects owner-related grounds, slots, and bookings. The demo treats the first ground as the owner's primary facility and filters its slots/bookings accordingly.

### `hooks/useAdmin.ts`

Selects platform stats, grounds, disputes, and moderation actions from the store.

### `hooks/useMediaQuery.ts`

Provides a reusable `useMediaQuery()` hook and a `useResponsive()` helper for mobile, tablet, and desktop media-query state.

## 10. `lib/` Files

### `lib/store.ts`

The central Zustand store. It owns grounds, slots, bookings, team data, leaderboard data, match challenges, platform stats, and disputes. Actions cover filtering, ground moderation, slot updates, booking creation/cancellation, team membership, dispute resolution, and challenge acceptance. The persist middleware stores selected mutable collections as `crickethub_app_storage`.

### `lib/mockData.ts`

The demo dataset for grounds, slots, bookings, team members, leaderboard entries, match challenges, platform statistics, and disputes. Replace or supplement this file when connecting real API data.

### `lib/api.ts`

Creates a configured Axios client. Its base URL uses `NEXT_PUBLIC_API_URL` and defaults to `http://localhost:3001`. Request interception adds the stored bearer token; response interception clears local auth storage after a 401 response.

### `lib/constants.ts`

Stores application name/tagline, supported cities, pitch-type filter options, role home routes, and the default theme.

### `lib/utils.ts`

Contains `cn()` for merging conditional Tailwind classes, `formatPKR()` for Pakistani rupee display, and `formatDisplayDate()` for safe ISO date formatting.

## 11. Type Definitions

### `types/index.ts`

Barrel file that re-exports all domain types and defines the generic `ApiResponse<T>` shape.

### `types/user.ts`

Defines `UserRole`, `User`, and `AuthState`.

### `types/ground.ts`

Defines pitch types, ground slots, ground amenities, ground reviews, and the complete `Ground` model.

### `types/booking.ts`

Defines booking statuses, supported payment methods, and the `Booking` model.

### `types/team.ts`

Defines team roles, team members, teams, leaderboard entries, and match challenges.

### `types/admin.ts`

Defines platform statistics, ground approval requests, and dispute tickets.

## 12. Styling and Configuration Files

### `styles/globals.css`

Imports the theme variables, enables Tailwind layers, resets margins/box sizing, sets the global background/text colors and font stack, styles scrollbars, and defines safe-area padding helpers.

### `styles/variables.css`

Defines the dark theme variables on `:root` and the light theme variables on `html[data-theme="light"]`. The variables cover backgrounds, surfaces, cards, borders, primary brand color, teal, orange, and text colors.

### `tailwind.config.ts`

Configures Tailwind content scanning and maps semantic color names such as `bg`, `surface`, `card`, `primary`, `teal`, `orange`, and text colors to CSS variables. It also defines the project's responsive breakpoints.

### `postcss.config.js`

Enables the Tailwind CSS and Autoprefixer PostCSS plugins.

### `next.config.js`

Enables React strict mode and allows Next image resources from `images.unsplash.com` and `via.placeholder.com`.

### `tsconfig.json`

Enables strict TypeScript, ES2020/DOM libraries, bundler module resolution, JSX preservation, incremental checking, and the `@/*` alias mapped to the project root. `node_modules` is excluded.

### `next-env.d.ts`

Generated Next.js TypeScript references for Next and Next image types. It should not be manually edited.

### `.eslintrc.json`

Extends Next.js Core Web Vitals ESLint rules.

### `.env.local`

Local environment configuration. It currently contains the frontend API URL, app name, and demo auth-provider setting. This file is ignored by Git and should not contain committed secrets.

### `.gitignore`

Excludes dependencies, Next.js output, local environment files, generic build folders, and log files from Git.

### `package.json`

Defines project metadata, npm scripts, runtime dependencies, and development dependencies.

### `package-lock.json`

Locks the exact dependency tree installed by npm. It is generated by npm and should generally be updated through npm commands rather than edited manually.

### `findstr`

An empty root-level file currently present in the workspace. It is not imported or used by the application and can be removed if it was created accidentally.

## 13. Theme System

Use semantic Tailwind classes such as `bg-card`, `border-card-border`, `text-text-primary`, and `bg-primary` in components. These resolve to CSS variables and automatically follow the selected theme.

Theme behavior:

1. `ThemeProvider` reads the saved theme after the client mounts.
2. It sets `html[data-theme]` to `dark` or `light`.
3. `variables.css` supplies the matching colors.
4. Components re-render when the context theme changes.

## 14. State and Persistence

There are two browser-persisted systems:

- **Authentication**: `crickethub_user`, `crickethub_token`, and `crickethub_theme` are managed by the contexts.
- **Application data**: `crickethub_app_storage` is managed by Zustand and stores mutable bookings, slots, grounds, team, disputes, and matches.

To reset the demo in a browser, remove these keys from local storage or use browser developer tools. A fresh browser profile also starts with the default demo values.

## 15. Current Demo Limitations

- Login and signup do not validate credentials against a backend.
- Booking creation and cancellation are local simulated operations with short artificial delays.
- Owner settings and earnings export display success states but do not write to a backend.
- Admin user moderation is component-local state rather than shared persisted state.
- `lib/api.ts` is configured but is not currently used by the page workflows.
- Some installed packages are preparation for future form/dialog/validation work rather than active dependencies in every screen.

## 16. Recommended Change Locations

| Need | Primary files |
| --- | --- |
| Add a new page | `app/<route>/page.tsx` |
| Change shared desktop/mobile navigation | `components/shared/Header.tsx`, `Sidebar.tsx`, `Navigation.tsx` |
| Change the whole role shell | `components/layouts/*Layout.tsx` |
| Change reusable visual primitives | `components/shared/*` |
| Change demo business data | `lib/mockData.ts` |
| Change global state/actions | `lib/store.ts` and the related hook |
| Add or change domain fields | `types/*.ts` and affected mock data/components |
| Change theme colors | `styles/variables.css` |
| Add semantic Tailwind colors or breakpoints | `tailwind.config.ts` |
| Connect backend requests | `lib/api.ts`, then replace mock-store calls in hooks |
