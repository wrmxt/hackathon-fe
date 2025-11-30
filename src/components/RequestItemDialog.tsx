import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog.tsx";
import Button from "@/components/ui/button.tsx";
import type { Item } from "@/components/ItemCard.tsx"; // путь поправь, если другой
import { useState } from "react";

interface RequestItemDialogProps {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alreadyRequested?: boolean;
  onRequested?: (itemId: string) => void;
}

export function RequestItemDialog({
  item,
  open,
  onOpenChange,
  alreadyRequested,
  onRequested,
}: RequestItemDialogProps) {
  const ownerName = item.owner_id.charAt(0).toUpperCase() + item.owner_id.slice(1);
  const [message, setMessage] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Request “{item.name}”
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Send a short note to {ownerName} to reserve this item.
          </DialogDescription>
        </DialogHeader>

        <form
          className="mt-3 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            onRequested?.(item.id);
            onOpenChange(false);
          }}
        >
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Message to owner
            </label>
            <textarea
              className="h-20 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
              placeholder="Hi, could I borrow this item tomorrow evening?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-8 px-3 text-xs" disabled={alreadyRequested}>
              {alreadyRequested ? "Requested" : "Send request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RequestItemDialog;
