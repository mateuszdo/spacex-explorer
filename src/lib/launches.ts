import type {
  Launch,
  LaunchFilters,
  LaunchDetail,
  PaginatedResponse,
} from "@/types/launch";

const PAGE_SIZE = 12;

interface DateRange {
  $gte?: string;
  $lte?: string;
}

interface LaunchQuery {
  name?: { $regex: string; $options: string };
  upcoming?: boolean;
  success?: boolean;
  date_utc?: DateRange;
}

function buildQuery(filters: LaunchFilters): LaunchQuery {
  const query: LaunchQuery = {};

  const trimmed = filters.search.trim();
  if (trimmed) {
    query.name = { $regex: trimmed, $options: "i" };
  }

  if (filters.timeframe === "upcoming") query.upcoming = true;
  else if (filters.timeframe === "past") query.upcoming = false;

  if (filters.outcome === "success") query.success = true;
  else if (filters.outcome === "failure") query.success = false;

  if (filters.dateFrom || filters.dateTo) {
    query.date_utc = {};
    if (filters.dateFrom) query.date_utc.$gte = filters.dateFrom;
    if (filters.dateTo) {
      // make the end date inclusive of the whole day
      query.date_utc.$lte = `${filters.dateTo}T23:59:59.999Z`;
    }
  }

  return query;
}

export async function fetchLaunches(
  page: number,
  filters: LaunchFilters,
): Promise<PaginatedResponse<Launch>> {
  const res = await fetch("https://api.spacexdata.com/v4/launches/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: buildQuery(filters),
      options: {
        page,
        limit: PAGE_SIZE,
        sort: { [filters.sortField]: filters.sortDirection },
        select: ["name", "date_utc", "date_precision", "upcoming", "success"],
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`SpaceX API error: ${res.status}`);
  }

  return res.json() as Promise<PaginatedResponse<Launch>>;
}

export async function fetchLaunchById(
  id: string,
): Promise<LaunchDetail | null> {
  const res = await fetch("https://api.spacexdata.com/v4/launches/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: { _id: id },
      options: {
        limit: 1,
        pagination: false,
        populate: [
          {
            path: "rocket",
            select: ["name", "type", "description", "flickr_images"],
          },
          {
            path: "launchpad",
            select: ["name", "full_name", "locality", "region", "status"],
          },
        ],
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`SpaceX API error: ${res.status}`);
  }

  const data: PaginatedResponse<LaunchDetail> = await res.json();
  return data.docs[0] ?? null;
}
