# SpaceX Explorer

A frontend explorer for SpaceX launch data, built with Next.js, React, and TypeScript.

## Status

In progress. See the decisions log below.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Architecture decisions

- **App Router** — current Next.js default; enables Server Components for data fetching on detail pages later.
- **CSS Modules** — styling is deferred to a dedicated pass; CSS Modules ship with Next.js and need no extra config.

## Roadmap

- [ ] Fetch and display launches from the SpaceX API
- [ ] Server-side pagination, filtering, sorting, search
- [ ] Launch detail page
- [ ] Favorites (LocalStorage)
- [ ] Styling pass

## SpaceX API usage

Launches come from `POST /v4/launches/query`, not `GET /v4/launches`. The
query endpoint does filtering, sorting, and pagination server-side; the plain
GET would return all launches

The request body has two parts: `query` (filter conditions, empty = match all)
and `options` (pagination, sort, field selection). Responses come wrapped in a
pagination envelope - results are in `docs`, and `hasNextPage` / `nextPage`
will drive the "Load more" control.

## Data layer: React Query

The launches fetch moved from a Server Component into a client-side React Query
hook (`useLaunches`). This provides loading and error state with retry and request caching.

Structure:

- `lib/launches.ts` — the raw fetch (what to request).
- `lib/hooks/useLaunches.ts` — the React Query hook (how the UI consumes it).
- `app/providers.tsx` — client-side QueryClient provider, wired into the layout.

The `queryKey` (`["launches", "latest"]`) is the cache identity. Filters and
sort options will be added to it so each combination caches independently.

## Tradeoff

This drops server-side rendering of the list — the page now ships an empty
shell and fetches on the client. It's because the list becomes
interactive (filters, search, infinite scroll), which are client concerns. The
detail page will stay server-rendered where SSR pays off.

### Current state

Home page fetches the 10 most recent launches via React Query and renders their
names, with loading and error/retry states. No pagination, filtering, or
styling yet.
