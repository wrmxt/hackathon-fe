import { useQuery } from "@tanstack/react-query";
import {HTTP_CLIENT} from "@/api/api.ts";
// предполагаю, что HTTP_CLIENT уже объявлен и экспортирован в этом же файле,
// как у тебя в примере с useItems / useChat

export function useRequestReturn(borrowingId: string, userId: string) {
  return useQuery({
    queryKey: ["RequestReturn", borrowingId, userId],
    enabled: Boolean(borrowingId && userId),

    queryFn: () =>
      HTTP_CLIENT.post(
        `/api/borrowings/request-return?borrowing_id=${encodeURIComponent(
          borrowingId
        )}&user_id=${encodeURIComponent(userId)}`
      ),
  });
}

export function useConfirmReturn(borrowingId: string, ownerId: string) {
  return useQuery({
    queryKey: ["ConfirmReturn", borrowingId, ownerId],
    enabled: Boolean(borrowingId && ownerId),

    queryFn: () =>
      HTTP_CLIENT.post(
        `/api/borrowings/confirm-return?borrowing_id=${encodeURIComponent(
          borrowingId
        )}&owner_id=${encodeURIComponent(ownerId)}`
      ),
  });
}
