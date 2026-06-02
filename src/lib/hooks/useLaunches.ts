import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchLaunches } from "@/lib/launches";
import type { LaunchFilters } from "@/types/launch";

export function useLaunches(filters: LaunchFilters) {
  return useInfiniteQuery({
    queryKey: ["launches", filters],
    queryFn: ({ pageParam }) => fetchLaunches(pageParam, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
}
