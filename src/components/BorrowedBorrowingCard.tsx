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
  if (!raw) return "";
  return raw
    .replace(/_/g, " ")
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

function getBorrowingStatusVariant(
  status: string,
): "default" | "secondary" | "outline" {
  const s = status.toLowerCase();
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

  return (
    <Card className="flex h-full w-full max-w-xs flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg">
      {/* HEADER */}
      <CardHeader className="flex flex-row items-start justify-between space-y-0 px-4 py-3">
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
          variant={getBorrowingStatusVariant(borrowing.status)}
          className="px-2 py-0 text-[11px]"
        >
          {formatBorrowingStatus(borrowing.status)}
        </Badge>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="flex flex-1 flex-col px-4 pb-3 pt-1">
        <p className="text-sm text-muted-foreground line-clamp-3">
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
    </Card>
  );
}
