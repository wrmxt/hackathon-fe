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


export function useChat(user: string, message: string) {

  return useQuery({
    queryKey: ["ChatResponse", user, message],
    queryFn : () =>
      HTTP_CLIENT.post("/api/chat", {user_id: user, message: message}) as Promise<{user_id: string; reply: string; confident: number;}>
  })
}
