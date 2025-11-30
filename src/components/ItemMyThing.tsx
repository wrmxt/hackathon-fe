import { useState } from "react";
import { Wrench, Info } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ItemDetailsDialog from "@/components/ItemDetailsDialog";
import type { Item } from "@/components/ItemCard"; // тип берём из уже существующего компонента

// First letter uppercase
function capitalize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// те же маппинги статуса, что и в ItemCard
function getStatusLabel(status: Item["status"]) {
  switch (status) {
    case "available":
      return "Available";
    case "borrowed":
      return "Borrowed";
    case "unavailable":
      return "Unavailable";
    default:
      return status;
  }
}

const STATUS_VARIANTS = {
  available: "default",
  borrowed: "secondary",
  unavailable: "outline",
} as const satisfies Record<
  Item["status"],
  "default" | "secondary" | "outline"
>;

function getStatusVariant(status: Item["status"]) {
  return STATUS_VARIANTS[status];
}

export interface ItemMyThingProps {
  item: Item;
}

export default function ItemMyThing({ item }: ItemMyThingProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const ownerName = capitalize(item.owner_id);
  const hasTags = Array.isArray(item.tags) && item.tags.length > 0;
  const itemIconAria = `${item.name} category icon`;

  return (
    <>
      <Card className="flex h-full w-full max-w-xs flex-col rounded-2xl border border-border bg-card shadow-sm">
        {/* HEADER */}
        <CardHeader className="flex flex-row items-start justify-between space-y-0 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Wrench aria-label={itemIconAria} className="size-5" />
            </div>

            <div className="flex flex-col">
              <CardTitle className="text-sm font-semibold leading-tight">
                {item.name}
              </CardTitle>

              <p className="mt-1 text-[11px] text-muted-foreground">
                Owned by{" "}
                <span className="font-semibold text-foreground">
                  {ownerName}
                </span>
              </p>

              <button
                type="button"
                onClick={() => setDetailsOpen(true)}
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
              >
                <Info className="size-3.5" aria-hidden="true" />
                <span>Detail of item</span>
              </button>
            </div>
          </div>

          <Badge
            variant={getStatusVariant(item.status)}
            className="px-2 py-0 text-[11px]"
          >
            {getStatusLabel(item.status)}
          </Badge>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="flex flex-1 flex-col px-4 pb-3 pt-1">
          {hasTags && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {item.tags!.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-2 py-0.5 text-[10px] font-medium"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Можно добавить доп. инфу, например created_at, если захочешь */}
          <div className="mt-auto pt-3 text-[11px] text-muted-foreground">
            {item.created_at && (
              <span>
                Added{" "}
                <span className="text-foreground">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details modal — переиспользуем существующий */}
      <ItemDetailsDialog
        item={item}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
}
