// src/components/BorrowedBorrowingCard.tsx
import type { ReactNode } from "react";
import { Package } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import Button from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRequestReturn } from "@/api/returnBorrowing";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// что приходит из /api/borrowings
export interface Borrowing {
  id: string;
  item_id: string;
  lender_id: string;
  borrower_id: string;
  start: string;
  due: string;
  status: string; // "waiting_for_confirm", "confirmed", ...
}

// минимальный тип айтема из /api/items
export interface BorrowedItem {
  id: string;
  name?: string;
  description?: string;
  [key: string]: unknown;
}

export interface BorrowedBorrowingCardProps {
  borrowing: Borrowing;
  item?: BorrowedItem;
  actionNode?: ReactNode; // сюда можно передать кнопку/бейдж, если нужно
}

// красивый статус (простое Title Case без переименований)
function formatBorrowingStatus(raw: string): string {
  const s = (raw || "").toLowerCase();
  if (s === "return_requested") return "Waiting";
  if (!raw) return "";
  return raw
    .replace(/_/g, " ")
    .split(" ")
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
    .join(" ");
}

function getBorrowingStatusVariant(
  status: string,
): "default" | "secondary" | "outline" {
  const s = status.toLowerCase();
  if (s === "return_requested") return "secondary";
  if (s.includes("rejected") || s.includes("cancel")) {
    return "outline";
  }
  if (s.includes("waiting") || s.includes("pending")) {
    return "secondary";
  }
  return "default";
}

export default function BorrowedBorrowingCard({
  borrowing,
  item,
  actionNode,
}: BorrowedBorrowingCardProps) {
  const title = item?.name ?? `Item ${borrowing.item_id}`;
  const description = item?.description || "No description available.";
  const iconAria = `${title} borrowed item card`;

  const { user } = useAuth();
  const userId = user ?? "";
  const [returnOpen, setReturnOpen] = useState(false);
  const [fireReturn, setFireReturn] = useState(false);
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const reqReturnQ = useRequestReturn(fireReturn ? borrowing.id : "", userId);
  const effectiveStatus = localStatus ?? borrowing.status;
  const canRequestReturn = (effectiveStatus || "").toLowerCase() === "active";
  const alreadyRequested =
    (effectiveStatus || "").toLowerCase() === "return_requested" ||
    reqReturnQ.isSuccess;

  useEffect(() => {
    if (reqReturnQ.isSuccess) {
      const id = requestAnimationFrame(() => setLocalStatus("return_requested"));
      return () => cancelAnimationFrame(id);
    }
  }, [reqReturnQ.isSuccess]);

  return (
    <Card className="flex h-full w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg">
      {/* HEADER */}
      <CardHeader className="flex flex-row items-start justify-between space-y-0 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Package aria-label={iconAria} className="size-5" />
          </div>

          <div className="flex flex-col">
            <CardTitle className="text-sm font-semibold leading-tight">
              {title}
            </CardTitle>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Borrowed from{" "}
              <span className="font-semibold text-foreground">
                {borrowing.lender_id}
              </span>
            </p>
          </div>
        </div>

        <Badge
          variant={getBorrowingStatusVariant(effectiveStatus)}
          className="px-2 py-0 text-[11px]"
        >
          {formatBorrowingStatus(effectiveStatus)}
        </Badge>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="flex flex-1 flex-col px-5 pb-3 pt-1">
        <p className="text-sm text-muted-foreground line-clamp-3 break-words">
          {description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-4 text-xs text-muted-foreground">
          <div>
            <div>
              Start:{" "}
              <span className="text-foreground">
                {new Date(borrowing.start).toLocaleString()}
              </span>
            </div>
            <div>
              Due:{" "}
              <span className="text-foreground">
                {new Date(borrowing.due).toLocaleString()}
              </span>
            </div>
          </div>

          <CardFooter className="p-0">
            <div className="flex items-center gap-2">
              {actionNode}
            </div>
          </CardFooter>
        </div>
      </CardContent>

      <CardFooter className="mt-0 px-5 pb-4">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 w-full text-[11px]"
          onClick={() => setReturnOpen(true)}
          disabled={!canRequestReturn || alreadyRequested || reqReturnQ.isLoading}
        >
          {alreadyRequested
            ? "Return requested"
            : reqReturnQ.isLoading
            ? "Sending..."
            : "Return"}
        </Button>
      </CardFooter>

      {/* Return confirm modal */}
      <Dialog
        open={returnOpen}
        onOpenChange={(o) => {
          if (!reqReturnQ.isLoading) setReturnOpen(o);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Return “{title}”
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              You’re about to request a return from the owner. Confirm to proceed.
            </DialogDescription>
          </DialogHeader>

          {reqReturnQ.isError && (
            <div className="text-xs text-destructive">
              Failed to send return request. Please try again.
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => setReturnOpen(false)}
              disabled={reqReturnQ.isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => {
                if (
                  !userId ||
                  reqReturnQ.isLoading ||
                  alreadyRequested ||
                  !canRequestReturn
                )
                  return;
                setFireReturn(true);
                setReturnOpen(false);
              }}
              disabled={
                reqReturnQ.isLoading ||
                alreadyRequested ||
                !userId ||
                !canRequestReturn
              }
            >
              {reqReturnQ.isLoading ? "Sending..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
