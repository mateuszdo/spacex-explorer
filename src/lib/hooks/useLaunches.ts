import { useQuery } from "@tanstack/react-query";
import { fetchLatestLaunches } from "@/lib/launches";

export function useLaunches() {
  return useQuery({
    queryKey: ["launches", "latest"],
    queryFn: fetchLatestLaunches,
  });
}
