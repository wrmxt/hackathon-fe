// src/components/ReturnRequestCard.tsx
import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ReturnBorrowing {
  id: string;
  item_id: string;
  lender_id: string;
  borrower_id: string;
  start: string;
  due: string;
  status: string; // expected: return_requested
}

export interface ReturnRequestCardProps {
  borrowing: ReturnBorrowing;
  itemName?: string;
  itemDescription?: string;
  onConfirm: () => void;
  confirming?: boolean;
  confirmed?: boolean;
  error?: boolean;
  actionNode?: ReactNode; // optional override
}

// Different badge text for clarity
function statusLabel(status: string) {
  const s = status.toLowerCase();
  if (s === "return_requested") return "Return requested";
  return status;
}

export default function ReturnRequestCard({
  borrowing,
  itemName,
  itemDescription,
  onConfirm,
  confirming,
  confirmed,
  error,
  actionNode,
}: ReturnRequestCardProps) {
  const title = itemName || `Item ${borrowing.item_id}`;
  const description = itemDescription || "No description available.";

  return (
    <Card className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-amber-400/50 bg-amber-50 dark:bg-amber-950/30 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-3 px-4 pt-3">
        <div className="flex size-10 items-center justify-center rounded-md bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200 shadow-inner">
          <RotateCcw className="size-5" />
        </div>
        <div className="flex flex-1 flex-col">
          <h3 className="text-sm font-semibold tracking-tight text-amber-900 dark:text-amber-100">
            {title}
          </h3>
          <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-300">
            Borrower <span className="font-semibold">{borrowing.borrower_id}</span> wants to return this item.
          </p>
        </div>
        <Badge className="bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100 px-2 py-0 text-[10px] font-medium">
          {statusLabel(borrowing.status)}
        </Badge>
      </div>

      <div className="px-4 pb-2 pt-2 text-xs text-muted-foreground">
        <p className="line-clamp-3 text-amber-800 dark:text-amber-200/90">{description}</p>
        <div className="mt-2 space-y-0.5 text-[11px] text-amber-700 dark:text-amber-300">
          <div>
            Started: <span className="font-medium text-foreground">{new Date(borrowing.start).toLocaleString()}</span>
          </div>
          <div>
            Due: <span className="font-medium text-foreground">{new Date(borrowing.due).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-end gap-2 px-4 pb-3">
        {actionNode ? (
          actionNode
        ) : confirmed ? (
          <Badge className="bg-green-600 text-white px-3 py-1 text-[11px]">Returned</Badge>
        ) : confirming ? (
          <Button size="sm" disabled className="h-8 px-3 text-[11px]">Confirming...</Button>
        ) : error ? (
          <Button size="sm" variant="destructive" onClick={onConfirm} className="h-8 px-3 text-[11px]">Retry</Button>
        ) : (
          <Button size="sm" variant="secondary" onClick={onConfirm} className="h-8 px-3 text-[11px]">Confirm return</Button>
        )}
      </div>
    </Card>
  );
}

