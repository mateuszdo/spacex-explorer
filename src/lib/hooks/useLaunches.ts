import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchLaunches } from "@/lib/launches";

export function useLaunches() {
  return useInfiniteQuery({
    queryKey: ["launches"],
    queryFn: ({ pageParam }) => fetchLaunches(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
}
