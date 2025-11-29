import { httpClient } from "@/api/client.ts";
import { useQuery } from "@tanstack/react-query";

const HTTP_CLIENT = httpClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeoutMs: 10_000,
});

export { HTTP_CLIENT };

export function useBuildingState() {
  return useQuery({
    queryKey: ["BuildingState"],
    staleTime: 1_000,
    gcTime: 1_000,
    refetchInterval: 5_000,
    refetchIntervalInBackground: true,
    // бэк возвращает JSON вида:
    // { building: {...}, residents: [...], items: [...], impact: {...} }
    queryFn: () => HTTP_CLIENT.get("/api/building-state"),
  });
}
