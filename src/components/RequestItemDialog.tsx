import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog.tsx";
import Button from "@/components/ui/button.tsx";
import type { Item } from "@/components/ItemCard.tsx"; // путь поправь, если другой
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRequestBorrowing } from "@/api/requestBorrowing";

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

  const { user } = useAuth();
  const userId = user ?? "";

  // trigger request when user submits
  const [shouldRequest, setShouldRequest] = useState(false);
  const reqQ = useRequestBorrowing(userId, shouldRequest ? item.id : "");

  useEffect(() => {
    if (!shouldRequest) return;
    if (reqQ.isSuccess) {
      onRequested?.(item.id);
      onOpenChange(false);
      setShouldRequest(false);
    }
  }, [reqQ.isSuccess, shouldRequest, onRequested, onOpenChange, item.id]);

  const loading = shouldRequest && reqQ.isLoading;
  const error = shouldRequest && reqQ.isError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Request “{item.name}”
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            You’re about to send a borrowing request to {ownerName}. Confirm to proceed.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 space-y-3">
          {error && (
            <div className="text-xs text-destructive">
              Failed to send request. Please try again.
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => {
                setShouldRequest(false);
                onOpenChange(false);
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => {
                if (alreadyRequested || !userId) return;
                setShouldRequest(true);
              }}
              disabled={alreadyRequested || loading || !userId}
            >
              {alreadyRequested ? "Requested" : loading ? "Sending..." : "Confirm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RequestItemDialog;
