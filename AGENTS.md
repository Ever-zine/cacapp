# AGENTS.md

## Project Overview

CacApp is a French Next.js App Router application for tracking toilet visits, locations, profiles, streaks, and trophies.

Core stack:
- Next.js 16, React 19, TypeScript strict mode.
- Tailwind CSS v4 via `app/globals.css`.
- Supabase Auth and database through `@supabase/ssr` and `@supabase/supabase-js`.
- Leaflet / React Leaflet for the map view.

The app is mostly client-driven. Authentication, CRUD operations, profile settings, location tags, maps, and trophies currently use the browser Supabase client.

## Commands

Use npm; this repo has a `package-lock.json`.

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Run `npm run lint` before handing off changes when possible. Use `npm run build` for changes that affect routing, rendering, Supabase integration, or Next config.

## Environment

The app expects these public Supabase variables:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Do not hardcode Supabase credentials or service-role keys. Browser code must only use public anon-key access and rely on Supabase RLS.

## Important Files

- `app/page.tsx`: client-side entry redirecting authenticated users to `/dashboard` and others to `/login`.
- `app/(auth)/login/page.tsx`: client-side Supabase email/password login.
- `app/(auth)/signup/page.tsx`: client-side Supabase signup.
- `app/(auth)/actions.ts`: deprecated placeholder; do not add new auth server actions here unless the app is intentionally migrated back.
- `app/dashboard/DashboardClient.tsx`: main dashboard, user profile loading/creation, log listing, streak calculation, trophy unlock logic, and signout.
- `app/dashboard/AddPoopForm.tsx`: create/edit form, geolocation, reverse geocoding through Nominatim, and location tag creation.
- `app/dashboard/MapView.tsx`: public map of geolocated logs. Leaflet is imported dynamically to avoid SSR issues.
- `app/dashboard/ProfileSettings.tsx`: profile preferences.
- `app/trophies/page.tsx`: trophy progress and global unlock views.
- `lib/types.ts`: shared domain types and constants for poop types, sizes, colors, avatars, trophies, categories, and rarities.
- `lib/supabase/client.ts`: browser Supabase client.
- `lib/supabase/server.ts`: server Supabase client helper using Next cookies.
- `lib/supabase/middleware.ts`: session refresh and auth redirects.
- `middleware.ts`: wires the Supabase middleware.
- `supabase/schema.sql`: canonical database schema and RLS policies.
- `next.config.ts`: currently uses `output: 'export'` and `trailingSlash: true`.

## Data Model Notes

Supabase tables are defined in `supabase/schema.sql`:

- `poop_logs`: user-owned logs. Select is public for the global map; insert/update/delete are restricted to the owning user.
- `location_tags`: user-owned location labels.
- `user_profiles`: public profile reads, owner-only writes.
- `user_trophies`: public trophy reads, owner-only inserts.

When changing database fields, update all of these together:
- `supabase/schema.sql`
- TypeScript interfaces in `lib/types.ts`
- Supabase reads/writes in dashboard, form, map, and trophy pages
- RLS policies if access semantics change

## App Conventions

- Keep user-facing copy in French.
- Prefer existing Tailwind utility style over adding component libraries.
- Keep domain constants centralized in `lib/types.ts`.
- Use the `@/` alias for local imports.
- Client components begin with `"use client"` and currently use single quotes in most app files.
- Existing UI uses rounded cards, emoji-heavy controls, zinc neutrals, amber defaults, and dark-mode variants.
- Dynamic Tailwind color classes are mapped explicitly in code, especially in `DashboardClient.tsx`; avoid constructing arbitrary class names that Tailwind cannot see.

## Supabase Conventions

- Use `createClient` from `@/lib/supabase/client` inside client components.
- Use `createClient` from `@/lib/supabase/server` only in server components/actions/routes.
- Auth pages and dashboard are currently client-side flows. Keep that pattern unless deliberately refactoring the auth architecture.
- Always scope private user queries with `.eq('user_id', currentUser.id)` unless the feature intentionally uses public data.
- The map and trophy pages intentionally read some global data because RLS allows public selects for social/global features.
- Handle Supabase errors in the UI instead of silently failing.

## Routing And Rendering

- This is an App Router project.
- Leaflet must stay client-only. Use dynamic imports with `{ ssr: false }` for React Leaflet components and import Leaflet itself inside `useEffect`.
- `middleware.ts` protects all non-static routes and redirects:
  - unauthenticated users to `/login`
  - authenticated users away from `/login` and `/signup` to `/dashboard`
- Be careful with `next.config.ts`: `output: 'export'` can limit server features such as middleware and SSR. If you change deployment mode, verify auth redirects and build behavior.

## Trophies And Streaks

Trophy definitions live in `lib/types.ts`; unlock logic currently lives in `DashboardClient.tsx`.

When adding or changing trophies:
- Add or update the `TrophyId` union.
- Update `TROPHIES`.
- Update `checkTrophies` in `DashboardClient.tsx`.
- Consider how existing users will unlock the trophy on next dashboard load.
- Keep secret trophies hidden in trophy UI until unlocked.

## Geolocation And Map Notes

`AddPoopForm.tsx` asks for browser geolocation on create mode and reverse-geocodes through Nominatim.

Do not make geolocation required. The app supports logs without coordinates.

`MapView.tsx` groups markers by user and rounded coordinates. If changing marker logic, preserve:
- client-only Leaflet loading
- public/global map behavior
- current-user edit affordance where applicable

## Testing And Verification

There is no dedicated test suite configured yet. For now:

- Run `npm run lint` for all code changes.
- Run `npm run build` when changing Next config, routes, rendering boundaries, or Supabase server/client usage.
- Manually verify auth, dashboard load, add/edit/delete, profile save, trophies, and map if touching those flows.

If adding tests later, prefer focused tests around pure domain logic first, especially streak and trophy calculations.

## Safety Rules For Future Agents

- Do not overwrite user data, local `.env*` files, database dumps, or Supabase temp files.
- Do not commit or expose secrets.
- Do not weaken RLS policies without a clear product reason.
- Do not replace the client-side Supabase flow with server actions casually; `app/(auth)/actions.ts` is explicitly deprecated.
- Do not hand-roll Leaflet SSR workarounds; keep map rendering browser-only.
- Preserve unrelated working tree changes.
