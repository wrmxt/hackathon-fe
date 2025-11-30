// src/api/borrowings.ts
import { HTTP_CLIENT } from "@/api/api";           // путь поправь, если другой
import { useQuery } from "@tanstack/react-query";


export function useBorrowings(userId: string) {
  return useQuery({
    queryKey: ["Borrowings", userId],
    staleTime: 5_000,
    gcTime: 30_000,
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
    queryKey: ["BorrowingsPending", userId],
    staleTime: 5_000,
    gcTime: 30_000,
    refetchInterval: 5_000,
    refetchIntervalInBackground: true,
    queryFn: () =>
      HTTP_CLIENT.get(
        `/api/borrowings/pending?user_id=${encodeURIComponent(userId)}`
      ),
  });
}


export function useConfirm(user: string, borrowing_id: string) {
  // Note: ideally this should be a mutation; kept as query-based trigger for existing UI flow
  return useQuery({
    queryKey: ["BorrowingsConfirm", user, borrowing_id],
    queryFn : () =>
      HTTP_CLIENT.post("/api/borrowings/confirm", {borrowing_id: borrowing_id, owner_id: user})
  })
}