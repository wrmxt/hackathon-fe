import React from "react";
import { useAuth } from "@/context/AuthContext";
import { usePending } from "@/api/borrowings";
import {HTTP_CLIENT, useItems} from "@/api/api";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/ui/button";

type Borrowing = {
  id: string;
  item_id: string;
  lender_id: string;
  borrower_id: string;
  start: string;
  due: string;
  status: string;
};

type PendingResponse = {
  as_lender: Borrowing[];
  as_borrower: Borrowing[];
};

export default function InboxPage() {
  const { user } = useAuth();
  const userId = user ?? "";
  const qc = useQueryClient();

  const pendingQ = usePending(userId);
  const pending = pendingQ.data as PendingResponse | undefined;

  const { data: items = [] } = useItems();

  const [confirming, setConfirming] = React.useState<string | null>(null);

  const handleConfirm = async (borrowing_id: string) => {
    try {
      setConfirming(borrowing_id);
      await HTTP_CLIENT.post("/api/borrowing/confirm", { borrowing_id, owner_id: userId });
      // refetch pending list
      await qc.invalidateQueries({ queryKey: ["Borrowings", userId] });
    } catch (err) {
      console.error(err);
    } finally {
      setConfirming(null);
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Inbox</h1>
        <p className="text-muted-foreground">Items waiting for your confirmation.</p>
      </header>

      <div className="rounded-lg border bg-card p-4">
        {pendingQ.isLoading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : pendingQ.isError ? (
          <div className="text-sm text-destructive">Error loading pending items</div>
        ) : (
          <div className="space-y-4">
            {(pending?.as_lender ?? []).length === 0 ? (
              <div className="text-sm text-muted-foreground">No pending confirmations.</div>
            ) : (
              (pending?.as_lender ?? []).map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-4 rounded-md border bg-background/50 p-3">
                  <div>
                    <div className="text-sm font-medium">Borrowing ID: {b.id}</div>
                    <div className="text-xs text-muted-foreground">Item ID: {b.item_id}</div>
                    <div className="text-xs text-muted-foreground">Borrower: {b.borrower_id}</div>
                    <div className="text-xs text-muted-foreground">Start: {new Date(b.start).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Due: {new Date(b.due).toLocaleString()}</div>

                    <></>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleConfirm(b.id)}
                      disabled={confirming !== null}
                    >
                      {confirming === b.id ? "Confirming..." : "Confirm"}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
