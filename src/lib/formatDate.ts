import type { Launch } from "@/types/launch";

export function formatLaunchDate(
  dateUtc: string,
  precision: Launch["date_precision"],
): string {
  const d = new Date(dateUtc);
  if (precision === "year") return String(d.getUTCFullYear());
  if (
    precision === "month" ||
    precision === "quarter" ||
    precision === "half"
  ) {
    return d.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
