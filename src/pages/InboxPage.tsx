import React from "react";
import { useAuth } from "@/context/AuthContext";
import { usePending, useConfirm } from "@/api/borrowings";
import { useItems } from "@/api/api";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X } from "lucide-react";

import InboxBorrowingCard, {
  type Borrowing,
  type Item,
} from "@/components/InboxBorrowingCard";

// augment Window for AudioContext
declare global {
  interface Window {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  }
}

type PendingResponse = {
  as_lender: Borrowing[];
  as_borrower: Borrowing[];
};

function ConfirmWorker({
                         userId,
                         borrowingId,
                         onDone,
                       }: {
  userId: string;
  borrowingId: string;
  onDone: (ok: boolean, msg?: string) => void;
}) {
  const q = useConfirm(userId, borrowingId);

  React.useEffect(() => {
    if (q.isSuccess) {
      onDone(true, "Confirmed");
    } else if (q.isError) {
      onDone(false, "Failed to confirm");
    }
  }, [q.isSuccess, q.isError, onDone]);

  return (
    <Button
      size="sm"
      variant="default"
      disabled
      className="inline-flex items-center gap-2"
    >
      {q.isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : q.isError ? (
        <X className="h-4 w-4 text-destructive" />
      ) : (
        <Check className="h-4 w-4 text-green-500" />
      )}
      <span>
        {q.isLoading ? "Confirming..." : q.isError ? "Error" : "Processing"}
      </span>
    </Button>
  );
}

export default function InboxPage() {
  const { user } = useAuth();
  const userId = user ?? "";
  const qc = useQueryClient();

  const pendingQ = usePending(userId);
  const pending = pendingQ.data as PendingResponse | undefined;

  const { data: itemsRaw = [] } = useItems();

  let itemsList: Item[] = [];
  if (Array.isArray(itemsRaw)) {
    itemsList = itemsRaw as Item[];
  } else {
    const maybe = itemsRaw as { items?: unknown };
    if (Array.isArray(maybe.items)) {
      itemsList = maybe.items as Item[];
    }
  }

  const [confirmingId, setConfirmingId] = React.useState<string | null>(null);
  const [confirmedIds, setConfirmedIds] = React.useState<Record<string, boolean>>(
    {},
  );
  const [toast, setToast] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const playSuccessSound = React.useCallback(() => {
    try {
      const AudioCtx = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(ctx.destination);
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.05, now + 0.01);
      o.start(now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      setTimeout(() => {
        try {
          o.stop();
          ctx.close?.();
        } catch (err) {
          console.debug(err);
        }
      }, 200);
    } catch (e) {
      console.debug(e);
    }
  }, []);

  const handleConfirmDone = async (
    borrowingId: string,
    ok: boolean,
    msg?: string,
  ) => {
    setConfirmingId(null);
    if (ok) {
      setConfirmedIds((s) => ({ ...s, [borrowingId]: true }));
      await qc.invalidateQueries({ queryKey: ["Borrowings", userId] });
      await qc.invalidateQueries({ queryKey: ["LatestDataEntry"] });
      setToast({ type: "success", message: msg ?? "Confirmed" });
      playSuccessSound();
      setTimeout(() => setToast(null), 3000);
      setTimeout(
        () =>
          setConfirmedIds((s) => {
            const copy = { ...s };
            delete copy[borrowingId];
            return copy;
          }),
        3000,
      );
    } else {
      setToast({ type: "error", message: msg ?? "Failed to confirm" });
      setTimeout(() => setToast(null), 4000);
    }
  };

  const asLender = pending?.as_lender ?? [];

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Inbox</h1>
        <p className="mt-4 text-muted-foreground">
          Items waiting for your confirmation.
        </p>
      </header>

      {toast && (
        <div
          className={`rounded-md border px-4 py-2 ${
            toast.type === "success"
              ? "border-green-600 bg-green-600/10"
              : "border-destructive bg-destructive/10"
          }`}
        >
          <div
            className={`flex items-center gap-2 text-sm ${
              toast.type === "success" ? "text-green-700" : "text-destructive"
            }`}
          >
            {toast.type === "success" ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <X className="h-4 w-4 text-destructive" />
            )}
            <div>{toast.message}</div>
          </div>
        </div>
      )}

      <div>
        {pendingQ.isLoading ? (
          <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
            Loading pending confirmations...
          </div>
        ) : pendingQ.isError ? (
          <div className="rounded-lg border bg-card p-6 text-center text-sm text-destructive">
            Error loading pending items
          </div>
        ) : asLender.length === 0 ? (
          <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
            No pending confirmations.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {asLender.map((b) => {
              const item = itemsList.find((it) => it.id === b.item_id);

              let actionNode: React.ReactNode;
              if (confirmedIds[b.id]) {
                actionNode = (
                  <Badge
                    variant="default"
                    className="inline-flex items-center gap-2 animate-pulse"
                  >
                    <Check className="h-4 w-4 text-white" />
                    Confirmed
                  </Badge>
                );
              } else if (confirmingId === b.id) {
                actionNode = (
                  <ConfirmWorker
                    userId={userId}
                    borrowingId={b.id}
                    onDone={(ok, msg) => handleConfirmDone(b.id, ok, msg)}
                  />
                );
              } else {
                actionNode = (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setConfirmingId(b.id)}
                    className="rounded-md px-3 py-1 shadow-sm hover:shadow-md"
                  >
                    Confirm
                  </Button>
                );
              }

              return (
                <InboxBorrowingCard
                  key={b.id}
                  borrowing={b}
                  item={item}
                  actionNode={actionNode}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
