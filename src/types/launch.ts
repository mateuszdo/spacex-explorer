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
