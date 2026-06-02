"use client";
import { useState } from "react";
import { useLaunches } from "@/lib/hooks/useLaunches";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLaunches(debouncedSearch);

  const launches = data?.pages.flatMap((page) => page.docs) ?? [];

  return (
    <main>
      <h1>SpaceX Explorer</h1>

      <label htmlFor="search">Search missions</label>
      <input
        id="search"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="e.g. Starlink"
      />

      {isPending && <p>Loading launches…</p>}

      {isError && (
        <div role="alert">
          <p>Could not load launches.</p>
          <button onClick={() => refetch()}>Retry</button>
        </div>
      )}

      {!isPending && !isError && launches.length === 0 && (
        <p>No launches match your search.</p>
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
