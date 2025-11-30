// src/api/borrowings.ts
import { HTTP_CLIENT } from "@/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// одноразовая функция, если не нужен react-query
export function requestBorrowing({
                                   itemId,
                                   lenderId,
                                   borrowerId,
                                   start,
                                   due,
                                 }: {
  itemId: string;
  lenderId: string;
  borrowerId: string;
  start: string;
  due: string;
}) {
  return HTTP_CLIENT.post("/api/borrowings/request", {
    item_id: itemId,
    lender_id: lenderId,
    borrower_id: borrowerId,
    start,
    due,
  });
}

export function useRequestBorrowing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, lenderId, borrowerId, start, due }: { itemId: string; lenderId: string; borrowerId: string; start: string; due: string; }) =>
      requestBorrowing({ itemId, lenderId, borrowerId, start, due }),
    onSuccess: () => {
      // invalidate related queries so UI updates
      qc.invalidateQueries({ queryKey: ["Borrowings"] });
      qc.invalidateQueries({ queryKey: ["LatestDataEntry"] });
    }
  });
}
