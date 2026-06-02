import type { Launch, PaginatedResponse } from "@/types/launch";

export async function fetchLatestLaunches(): Promise<Launch[]> {
  const res = await fetch("https://api.spacexdata.com/v4/launches/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: {},
      options: {
        limit: 10,
        sort: { date_utc: "desc" },
        select: ["name", "date_utc", "date_precision", "upcoming", "success"],
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`SpaceX API error: ${res.status}`);
  }

  const data: PaginatedResponse<Launch> = await res.json();
  return data.docs;
}
