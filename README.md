# SpaceX Explorer

A frontend explorer for SpaceX launch data, built with Next.js, React, and TypeScript.

**Live demo:** https://spacex-explorer-tawny.vercel.app

**Github link:** https://github.com/mateuszdo/spacex-explorer

## Status

Completed

### Current state

Feature-complete and styled. Launches list with server-side filtering, search,
sort, and "Load more" pagination; a server-rendered detail page at
`/launches/[id]`; favorites persisted in LocalStorage. Loading, error/retry,
empty, and not-found states are all handled. Minimal light theme via CSS Modules.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Architecture decisions

- **App Router** — current Next.js default; enables Server Components for data fetching on detail pages later.
- **CSS Modules** — component-scoped styles, ship with Next.js, no extra config. `globals.css` holds a reset, form-control defaults, and theme colours; layout and per-page styles are scoped modules.
- **React Query over SWR / custom fetchers** — I picked React Query mainly for `useInfiniteQuery`, which fits the "Load more" pagination almost exactly. It also gives caching, dedupe, and loading/error/retry handling out of the box that I'd otherwise have to write by hand. SWR would have worked too; the infinite-query support is what tipped it.

## Roadmap

- [x] Fetch and display launches from the SpaceX API
- [x] Server-side pagination
- [x] Mission-name search
- [x] Filtering, sorting
- [x] Launch detail page
- [x] Favorites (LocalStorage)
- [x] Styling pass

## SpaceX API usage

Launches come from `POST /v4/launches/query`, not `GET /v4/launches`. The
query endpoint does filtering, sorting, and pagination server-side. The plain
GET returns every launch in one array, which the brief explicitly rules out.

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
detail page stays server-rendered where SSR pays off.

### Pagination

The list uses `useInfiniteQuery`. `getNextPageParam` reads `nextPage` from each
response envelope and returns it as the next page number, or `undefined` on the
last page (when the API sends `nextPage: null`) — which automatically hides the
"Load more" button. Pagination is fully server-side: each click requests one
more page of 12.

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

### Launch detail

Route `/launches/[id]`, rendered as a Server Component — it is non-interactive,
so server rendering gives a faster first paint and real SSR. It fetches via
`/launches/query` with `_id` match and `populate`, which resolves `rocket` and
`launchpad` in a single request rather than three separate calls. `select` trims
the populated documents. `notFound()` handles a bad id.

`rocket` and `launchpad` can be `null` (some launches have no linked record), so
the UI guards for absence. Dates render precision-aware (e.g. "Dec 2022" for a
month-precision launch) via a shared helper used by the cards too.

The gallery only renders when a launch has Flickr images, which most launches
do not; the section is omitted otherwise. It uses plain `<img>` — switching to
`next/image` (with `remotePatterns` for the Flickr domains) is a TODO.

### Favorites

I store bookmarks in LocalStorage under `spacex:favorites`, keeping each launch's id and name so the favorites page can render straight away without re-fetching.

The tricky part is that LocalStorage only exists on the client, so if I read it during render the server and client disagree and React throws a hydration mismatch. The `useFavorites` hook gets around this by starting empty (which matches what the server renders), then reading storage in a `useEffect` after mount and flipping a `hydrated` flag. Anything that depends on saved state waits for `hydrated` before rendering, so the first paint always lines up with the server. I also added a `storage` event listener so favorites stay in sync if you have the app open in two tabs.

## Performance and accessibility

### Performance

- Server-side pagination — only 12 launches per request, never the full set.
- React Query caches per filter combination and dedupes in-flight requests, so
  revisiting a filter or navigating back is instant rather than re-fetching.
- `select` trims API responses to the fields actually rendered, and the detail
  page resolves rocket + launchpad via `populate` in one request instead of
  three.
- Search is debounced (400ms) to avoid a request per keystroke.
- Fonts are system fonts (no web-font download).

### Accessibility

- Every form control has an associated `<label>`.
- The favorite toggle uses `aria-pressed` and a state-dependent `aria-label`;
  the active nav item uses `aria-current="page"`.
- Loading/error states use semantic markup (`role="alert"` on the error).
- Muted text colours were chosen to meet WCAG AA contrast on the background.
- Dates use `<time dateTime>`, the back-link and headings give clear structure.

## Tradeoffs and next steps

- **The list isn't server-rendered.** Putting it in React Query meant giving up SSR on the list, but I got caching and easy filtering in return. If I had more time I'd try prefetching page one on the server and hydrating React Query, so the first paint has content without losing the interactive bits.
- **No virtualization.** "Load more" just keeps adding to the list. That's fine for a few hundred rows; a really long session would want windowing (`react-window`). I left it out on purpose — didn't seem worth it at these sizes.
- **Gallery uses plain `<img>`.** `next/image` would give lazy-loading and optimization, but it needs each Flickr domain whitelisted in config, which felt like overkill here.
- **Search regex isn't escaped.** The search text goes straight into a Mongo `$regex`. Works fine for this, but real code should escape special characters first.
- **If I had more time:** charts (launches per year, success rate), a side-by-side compare view, and some tests around the filter-to-query logic.

## Known limitations / TODOs

- Search does not escape regex metacharacters.
- Gallery uses unoptimized `<img>` tags.
- No automated tests.
- API data quirks surface as-is (e.g. some past records carry `upcoming: true`);
  the UI trusts the stored flags rather than reconciling them.
