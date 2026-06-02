"use client";

import { useLaunches } from "@/lib/hooks/useLaunches";

export default function HomePage() {
  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLaunches();

  const launches = data?.pages.flatMap((page) => page.docs) ?? [];

  return (
    <main>
      <h1>SpaceX Explorer</h1>

      {isPending && <p>Loading launches…</p>}

      {isError && (
        <div role="alert">
          <p>Could not load launches.</p>
          <button onClick={() => refetch()}>Retry</button>
        </div>
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
