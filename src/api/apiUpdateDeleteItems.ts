import { HTTP_CLIENT } from "@/api/api.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Define request body types to ensure correct usage
type UpdateItemBody = {
  user_id: string;
  name?: string;
  description?: string;
  tags?: string[];
  status?: "available" | "archived" | "unavailable";
};

type UpdateItemVars = { itemId: string | number; body: UpdateItemBody };

/**
 * PATCH /api/items/{item_id}
 * body: {
 *   user_id: string,
 *   name?: string,
 *   description?: string,
 *   tags?: string[],
 *   status?: "available" | "archived" | "unavailable"
 * }
 */
export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, body }: UpdateItemVars) =>
      HTTP_CLIENT.patch(`/api/items/${itemId}`, body),

    onSuccess: () => {
      // Обновляем список вещей после изменения
      queryClient.invalidateQueries({ queryKey: ["LatestDataEntry"] });
    },
  });
}

// Types for delete
type DeleteItemVars = { itemId: string | number; userId: string };

/**
 * DELETE /api/items/{item_id}?user_id=...
 */
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, userId }: DeleteItemVars) =>
      HTTP_CLIENT.delete(`/api/items/${itemId}`, {
        params: { user_id: userId },
      }),

    onSuccess: () => {
      // Обновляем список вещей после удаления
      queryClient.invalidateQueries({ queryKey: ["LatestDataEntry"] });
    },
  });
}
