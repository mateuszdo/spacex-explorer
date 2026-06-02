# SpaceX Explorer

A frontend explorer for SpaceX launch data, built with Next.js, React, and TypeScript.

## Status

In progress. See the decisions log below.

### Current state

Home page renders launches with full filtering — mission search, upcoming/past,
success/failure, date range, and sort (date or name, asc/desc) — plus infinite
"Load more" pagination and loading, error/retry, and empty states. All filtering
and sorting is server-side. No styling yet.

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

- [x] Fetch and display launches from the SpaceX API
- [x] Server-side pagination
- [x] Mission-name search
- [x] Filtering, sorting
- [ ] Launch detail page
- [ ] Favorites (LocalStorage)
- [ ] Styling pass

## SpaceX API usage

Launches come from `POST /v4/launches/query`, not `GET /v4/launches`. The
query endpoint does filtering, sorting, and pagination server-side; the plain
GET would return all of the launches at once.

The request body has two parts: `query` (filter conditions, empty = match all)
and `options` (pagination, sort, field selection). Responses come wrapped in a
pagination envelope - results are in `docs`, and `hasNextPage` / `nextPage`
drives the "Load more" control.

## Data layer: React Query

The launches fetch moved from a Server Component into a client-side React Query
hook (`useLaunches`). This provides loading and error state with retry and request caching.

Structure:

- `lib/launches.ts` — the raw fetch (what to request).
- `lib/hooks/useLaunches.ts` — the React Query hook (how the UI consumes it).
- `app/providers.tsx` — client-side QueryClient provider, wired into the layout.

The `queryKey` (`["launches", filters]`) is the cache identity — the entire
`LaunchFilters` object. Each filter/sort combination caches independently, and
any change refetches from page 1.

### Tradeoff

This drops server-side rendering of the list — the page now ships an empty
shell and fetches on the client. It's because the list becomes
interactive (filters, search, infinite scroll), which are client concerns. The
detail page will stay server-rendered where SSR pays off.

### Pagination

The list uses `useInfiniteQuery`. `getNextPageParam` reads `nextPage` from each
response envelope and returns it as the next page number, or `undefined` on the
last page (when the API sends `nextPage: null`) — which automatically hides the
"Load more" button. Pagination is fully server-side: each click requests one
more page of 12 via `options.page`.

### Search and filtering

All filtering and sorting runs server-side via the request `query` and
`options`, never by filtering fetched results.

- **Search** — MongoDB `$regex`, case-insensitive, on `name`. The `/query`
  endpoints pass `query` through to MongoDB, so standard operators work.
- **Timeframe** — filters on the stored `upcoming` boolean (not a date
  comparison; the flag and `date_utc` can disagree on older records).
- **Outcome** — filters on `success`. It is `boolean | null` (null = upcoming),
  so `success: false` matches genuine failures only.
- **Date range** — `$gte` / `$lte` on `date_utc`; the end date is pushed to
  end-of-day so it is inclusive.
- **Sort** — `options.sort` on `date_utc` or `name`, asc or desc.

All filter state lives in one `LaunchFilters` object that is the `queryKey`, so
each combination caches independently and any change refetches from page 1.
Only the search input is debounced (400ms); dropdowns and date pickers apply
immediately.
