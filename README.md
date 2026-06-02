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

### Current state

The home page fetches the 10 most recent launches in a Server Component and
renders their names. No loading/error UI yet.
