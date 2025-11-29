// src/api/borrowings.ts
import { HTTP_CLIENT } from "@/api/api";           // путь поправь, если другой
import { useQuery } from "@tanstack/react-query";


export function useBorrowings(userId: string) {
  return useQuery({
    queryKey: ["Borrowings", userId],
    enabled: !!userId, // не дергаем запрос, если userId пустой
    staleTime: 1_000,
    gcTime: 1_000,
    refetchInterval: 5_000,
    refetchIntervalInBackground: true,
    queryFn: () =>
      HTTP_CLIENT.get(
        `/api/borrowings?user_id=${encodeURIComponent(userId)}`
      ),
  });
}