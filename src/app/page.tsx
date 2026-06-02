"use client";

import { useState } from "react";
import { useLaunches } from "@/lib/hooks/useLaunches";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { DEFAULT_FILTERS, type LaunchFilters } from "@/types/launch";

export default function HomePage() {
  const [filters, setFilters] = useState<LaunchFilters>(DEFAULT_FILTERS);

  // Debounce only the search text; other filters apply immediately.
  const debouncedSearch = useDebounce(filters.search, 400);
  const activeFilters = { ...filters, search: debouncedSearch };

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLaunches(activeFilters);

  const launches = data?.pages.flatMap((page) => page.docs) ?? [];

  function update<K extends keyof LaunchFilters>(
    key: K,
    value: LaunchFilters[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <main>
      <h1>SpaceX Explorer</h1>

      <div>
        <label htmlFor="search">Search missions</label>
        <input
          id="search"
          type="search"
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          placeholder="e.g. Starlink"
        />

        <label htmlFor="timeframe">Timeframe</label>
        <select
          id="timeframe"
          value={filters.timeframe}
          onChange={(e) =>
            update("timeframe", e.target.value as LaunchFilters["timeframe"])
          }
        >
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>

        <label htmlFor="outcome">Outcome</label>
        <select
          id="outcome"
          value={filters.outcome}
          onChange={(e) =>
            update("outcome", e.target.value as LaunchFilters["outcome"])
          }
        >
          <option value="all">All</option>
          <option value="success">Success</option>
          <option value="failure">Failure</option>
        </select>

        <label htmlFor="dateFrom">From</label>
        <input
          id="dateFrom"
          type="date"
          value={filters.dateFrom}
          onChange={(e) => update("dateFrom", e.target.value)}
        />

        <label htmlFor="dateTo">To</label>
        <input
          id="dateTo"
          type="date"
          value={filters.dateTo}
          onChange={(e) => update("dateTo", e.target.value)}
        />

        <label htmlFor="sort">Sort</label>
        <select
          id="sort"
          value={`${filters.sortField}:${filters.sortDirection}`}
          onChange={(e) => {
            const [field, dir] = e.target.value.split(":");
            setFilters((prev) => ({
              ...prev,
              sortField: field as LaunchFilters["sortField"],
              sortDirection: dir as LaunchFilters["sortDirection"],
            }));
          }}
        >
          <option value="date_utc:desc">Date (newest)</option>
          <option value="date_utc:asc">Date (oldest)</option>
          <option value="name:asc">Name (A–Z)</option>
          <option value="name:desc">Name (Z–A)</option>
        </select>

        <button onClick={() => setFilters(DEFAULT_FILTERS)}>Reset</button>
      </div>

      {isPending && <p>Loading launches…</p>}

      {isError && (
        <div role="alert">
          <p>Could not load launches.</p>
          <button onClick={() => refetch()}>Retry</button>
        </div>
      )}

      {!isPending && !isError && launches.length === 0 && (
        <p>No launches match your filters.</p>
      )}

      {launches.length > 0 && (
        <ul>
          {launches.map((launch) => (
            <li key={launch.id}>{launch.name}</li>
          ))}
        </ul>
      )}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading…" : "Load more"}
        </button>
      )}
    </main>
  );
}
