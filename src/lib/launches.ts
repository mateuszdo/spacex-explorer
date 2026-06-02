import type { Launch, PaginatedResponse } from "@/types/launch";

const PAGE_SIZE = 12;

interface LaunchQuery {
  name?: { $regex: string; $options: string };
}

export async function fetchLaunches(
  page: number,
  search: string,
): Promise<PaginatedResponse<Launch>> {
  const query: LaunchQuery = {};
  const trimmed = search.trim();
  if (trimmed) {
    query.name = { $regex: trimmed, $options: "i" };
  }

  const res = await fetch("https://api.spacexdata.com/v4/launches/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      options: {
        page,
        limit: PAGE_SIZE,
        sort: { date_utc: "desc" },
        select: ["name", "date_utc", "date_precision", "upcoming", "success"],
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`SpaceX API error: ${res.status}`);
  }

  return res.json() as Promise<PaginatedResponse<Launch>>;
}
