import React from "react";
import { useAuth } from "@/context/AuthContext";
import { usePending, useConfirm } from "@/api/borrowings";
import { useItems } from "@/api/api";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/card";

// augment Window for AudioContext (avoid using `any`)
declare global {
  interface Window {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  }
}

type Borrowing = {
  id: string;
  item_id: string;
  lender_id: string;
  borrower_id: string;
  start: string;
  due: string;
  status: string;
};

type Item = {
  id: string;
  name?: string;
  description?: string;
  [key: string]: unknown;
};

type PendingResponse = {
  as_lender: Borrowing[];
  as_borrower: Borrowing[];
};

function ConfirmWorker({ userId, borrowingId, onDone }: { userId: string; borrowingId: string; onDone: (ok: boolean, msg?: string) => void }) {
  // This component is mounted only when the user triggers confirm for a specific borrowing
  const q = useConfirm(userId, borrowingId);
  React.useEffect(() => {
    if (q.isSuccess) {
      onDone(true, "Confirmed");
    } else if (q.isError) {
      onDone(false, "Failed to confirm");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.isSuccess, q.isError]);

  return (
    <div className="inline-block">
      <Button size="sm" variant="default" disabled className="inline-flex items-center gap-2">
        {q.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : q.isError ? <X className="h-4 w-4 text-destructive" /> : <Check className="h-4 w-4 text-green-500" />}
        <span>{q.isLoading ? "Confirming..." : q.isError ? "Error" : "Processing"}</span>
      </Button>
    </div>
  );
}

export default function InboxPage() {
  const { user } = useAuth();
  const userId = user ?? "";
  const qc = useQueryClient();

  const pendingQ = usePending(userId);
  const pending = pendingQ.data as PendingResponse | undefined;

  const { data: itemsRaw = [] } = useItems();
  // `useItems` may return an array or an object like { items: [] }
  let itemsList: Item[] = [];
  if (Array.isArray(itemsRaw)) itemsList = itemsRaw as Item[];
  else {
    const maybe = itemsRaw as unknown as { items?: unknown };
    if (Array.isArray(maybe.items)) itemsList = maybe.items as Item[];
  }

  const [confirmingId, setConfirmingId] = React.useState<string | null>(null);
  const [confirmedIds, setConfirmedIds] = React.useState<Record<string, boolean>>({});
  const [toast, setToast] = React.useState<{ type: "success" | "error"; message: string } | null>(null);

  // Play a short success sound using WebAudio API
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
        try { o.stop(); ctx.close?.(); } catch (err) { console.debug(err); }
      }, 200);
    } catch (e) {
      console.debug(e);
    }
  }, []);

  const handleConfirmDone = async (borrowing_id: string, ok: boolean, msg?: string) => {
    setConfirmingId(null);
    if (ok) {
      // mark as confirmed briefly
      setConfirmedIds((s) => ({ ...s, [borrowing_id]: true }));
      // refresh lists
      await qc.invalidateQueries({ queryKey: ["Borrowings", userId] });
      await qc.invalidateQueries({ queryKey: ["LatestDataEntry"] });
      // show toast
      setToast({ type: "success", message: msg ?? "Confirmed" });
      // play a short success sound
      playSuccessSound();
      setTimeout(() => setToast(null), 3000);
      // remove success indicator after 3s
      setTimeout(() => setConfirmedIds((s) => { const copy = { ...s }; delete copy[borrowing_id]; return copy; }), 3000);
    } else {
      setToast({ type: "error", message: msg ?? "Failed to confirm" });
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Inbox</h1>
        <p className="text-muted-foreground">Items waiting for your confirmation.</p>
      </header>

      {toast ? (
        <div className={`rounded-md px-4 py-2 ${toast.type === "success" ? "bg-green-600/10 border border-green-600" : "bg-destructive/10 border border-destructive"}`}>
          <div className={`flex items-center gap-2 text-sm ${toast.type === "success" ? "text-green-700" : "text-destructive"}`}>
            {toast.type === "success" ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-destructive" />}
            <div>{toast.message}</div>
          </div>
        </div>
      ) : null}

      <div>
        {pendingQ.isLoading ? (
          <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">Loading pending confirmations...</div>
        ) : pendingQ.isError ? (
          <div className="rounded-lg border bg-card p-6 text-center text-sm text-destructive">Error loading pending items</div>
        ) : (pending?.as_lender ?? []).length === 0 ? (
          <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">No pending confirmations.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {(pending?.as_lender ?? []).map((b) => {
                 const item = itemsList.find((it) => it.id === b.item_id) as Item | undefined;

                // borrower avatar initials
                const borrowerInitial = (b.borrower_id || "?").toString().trim()[0]?.toUpperCase() ?? "?";

                return (
                  <Card key={b.id} className="overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
                     <CardHeader>
                       <div className="flex items-center justify-between gap-4 w-full">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-12 w-12 flex-none rounded-md bg-muted/60 flex items-center justify-center text-muted-foreground text-xl">📦</div>
                          <div className="min-w-0">
                            <CardTitle className="truncate text-sm font-semibold">{item?.name ?? `Item ${b.item_id}`}</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground truncate">Borrower: <span className="text-foreground font-medium">{b.borrower_id}</span></CardDescription>
                          </div>
                        </div>

                         <div className="flex items-center gap-2">
                           <Badge variant="outline" className="capitalize">{b.status.replace(/_/g, " ")}</Badge>
                         </div>
                       </div>
                     </CardHeader>

                     <CardContent>
                      <div className="text-sm text-muted-foreground line-clamp-3">{item?.description ?? "No description available."}</div>
                     </CardContent>

                     <CardFooter>
                       <div className="flex items-center justify-between w-full gap-4">
                         <div className="text-xs text-muted-foreground">
                           <div>Start: <span className="text-foreground">{new Date(b.start).toLocaleString()}</span></div>
                           <div>Due: <span className="text-foreground">{new Date(b.due).toLocaleString()}</span></div>
                         </div>

                    <CardAction>
                      <div className="flex items-center gap-2">
                        {confirmedIds[b.id] ? (
                          <Badge variant="default" className="inline-flex items-center gap-2 animate-pulse"><Check className="h-4 w-4 text-white"/>Confirmed</Badge>
                        ) : confirmingId === b.id ? (
                          <ConfirmWorker userId={userId} borrowingId={b.id} onDone={(ok, msg) => handleConfirmDone(b.id, ok, msg)} />
                        ) : (
                          <Button variant="secondary" size="sm" onClick={() => setConfirmingId(b.id)} className="rounded-md px-3 py-1 shadow-sm hover:shadow-md">Confirm</Button>
                        )}
                      </div>
                    </CardAction>
                   </div>
                 </CardFooter>
               </Card>
             );
          })}
          </div>
        )}
      </div>
     </section>
   );
 }
