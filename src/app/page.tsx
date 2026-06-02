"use client";

import { useLaunches } from "@/lib/hooks/useLaunches";

export default function HomePage() {
  const { data, isPending, isError, refetch } = useLaunches();

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

      {data && (
        <ul>
          {data.map((launch) => (
            <li key={launch.id}>{launch.name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
