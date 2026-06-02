/** A single launch, trimmed to the fields we currently use. */
export interface Launch {
  id: string;
  name: string;
  date_utc: string; // ISO 8601
  date_precision: "half" | "quarter" | "year" | "month" | "day" | "hour";
  upcoming: boolean;
  success: boolean | null;
}

/** The pagination envelope returned by every /query endpoint. */
export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  nextPage: number | null;
}

export type Timeframe = "all" | "upcoming" | "past";
export type Outcome = "all" | "success" | "failure";
export type SortField = "date_utc" | "name";
export type SortDirection = "asc" | "desc";

export interface LaunchFilters {
  search: string;
  timeframe: Timeframe;
  outcome: Outcome;
  dateFrom: string; // "" or YYYY-MM-DD
  dateTo: string; // "" or YYYY-MM-DD
  sortField: SortField;
  sortDirection: SortDirection;
}

export const DEFAULT_FILTERS: LaunchFilters = {
  search: "",
  timeframe: "all",
  outcome: "all",
  dateFrom: "",
  dateTo: "",
  sortField: "date_utc",
  sortDirection: "desc",
};

export interface Rocket {
  id: string;
  name: string;
  type: string;
  description: string;
  flickr_images: string[];
}

export interface Launchpad {
  id: string;
  name: string;
  full_name: string;
  locality: string;
  region: string;
  status: string;
}

export interface LaunchLinks {
  patch: { small: string | null; large: string | null };
  webcast: string | null;
  article: string | null;
  wikipedia: string | null;
  flickr: { small: string[]; original: string[] };
}

/** A launch with rocket + launchpad resolved (detail view). */
export interface LaunchDetail {
  id: string;
  name: string;
  date_utc: string;
  date_precision: Launch["date_precision"];
  upcoming: boolean;
  success: boolean | null;
  details: string | null;
  links: LaunchLinks;
  rocket: Rocket | null;
  launchpad: Launchpad | null;
}
