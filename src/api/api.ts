import {httpClient} from "@/api/client.ts";


const HTTP_CLIENT = httpClient({baseURL: import.meta.env.VITE_API_BASE_URL, timeoutMs: 10000});

export {HTTP_CLIENT};



import {useQuery} from "@tanstack/react-query";


export function useItems() {
  return useQuery({
    queryKey: ["LatestDataEntry"],
    staleTime: 1_000,
    gcTime: 1_000,
    refetchInterval: 5_000,
    refetchIntervalInBackground: true,

    queryFn : () =>
      HTTP_CLIENT.get("/api/items")
  })
}

