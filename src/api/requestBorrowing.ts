import { httpClient } from "@/api/client.ts";
import { useQuery } from "@tanstack/react-query";

const HTTP_CLIENT = httpClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeoutMs: 10_000,
});

export function useRequestBorrowing(userId: string, itemId: string) {
  return useQuery({
    queryKey: ["RequestBorrowing", userId, itemId],
    enabled: Boolean(userId && itemId), // чтобы не стрелял без данных
    queryFn: () =>
      HTTP_CLIENT.post("/api/borrowings/request", {
        user_id: userId,
        item_id: itemId,
      }) as Promise<{ status: string; borrowing: unknown }>,
  });
}