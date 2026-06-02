import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchLaunches } from "@/lib/launches";

export function useLaunches(search: string) {
  return useInfiniteQuery({
    queryKey: ["launches", { search }],
    queryFn: ({ pageParam }) => fetchLaunches(pageParam, search),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
}
