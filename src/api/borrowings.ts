// src/api/borrowings.ts
import { HTTP_CLIENT } from "@/api/api";           // путь поправь, если другой
import { useQuery } from "@tanstack/react-query";


export function useBorrowings(userId: string) {
  return useQuery({
    queryKey: ["Borrowings", userId],
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



export function usePending(userId: string) {
  return useQuery({
    queryKey: ["Borrowings", userId],
    staleTime: 1_000,
    gcTime: 1_000,
    refetchInterval: 5_000,
    refetchIntervalInBackground: true,
    queryFn: () =>
      HTTP_CLIENT.get(
        `/api/borrowings/pending?user_id=${encodeURIComponent(userId)}`
      ),
  });
}


export function useConfirm(user: string, borrowing_id: string) {

  return useQuery({
    queryKey: ["ChatResponse", user, borrowing_id],
    queryFn : () =>
      HTTP_CLIENT.post("/api/borrowing/confirm", {borrowing_id: borrowing_id, owner_id: user})
  })
}