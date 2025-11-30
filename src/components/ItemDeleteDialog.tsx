import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Button from "@/components/ui/button";
import type { Item } from "@/components/ItemCard";
import { useDeleteItem } from "@/api/apiUpdateDeleteItems";
import { useAuth } from "@/context/AuthContext";

interface ItemDeleteDialogProps {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: (itemId: string | number) => void;
}

export default function ItemDeleteDialog({ item, open, onOpenChange, onDeleted }: ItemDeleteDialogProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const del = useDeleteItem();

  const isBorrowed = item.status === "borrowed";

  const handleDelete = async () => {
    if (!user) return;
    if (isBorrowed) {
      setErrorMsg("You cannot delete an item while it is borrowed.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await del.mutateAsync({ itemId: item.id, userId: user });
      onOpenChange(false);
      onDeleted?.(item.id);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to delete the item.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setErrorMsg(null); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete item</DialogTitle>
          <DialogDescription>
            {isBorrowed
              ? "This item is currently borrowed. Return it before deleting."
              : `This action cannot be undone. This will permanently remove "${item.name}" from your shared items.`}
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {errorMsg}
          </div>
        )}

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting || isBorrowed}>
            {isSubmitting ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
