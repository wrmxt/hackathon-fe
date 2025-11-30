import { useState } from "react";
import { Wrench, Info, Pencil, Trash2 } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ItemDetailsDialog from "@/components/ItemDetailsDialog";
import ItemEditDialog from "@/components/ItemEditDialog";
import ItemDeleteDialog from "@/components/ItemDeleteDialog";
import type { Item } from "@/components/ItemCard";

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
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(item);

  const hasTags =
    Array.isArray(currentItem.tags) && currentItem.tags.length > 0;
  const itemIconAria = `${currentItem.name} category icon`;

  return (
    <>
      <Card className="relative flex h-full w-full max-w-xs flex-col rounded-2xl border border-border bg-card shadow-sm">
        {/* Status badge — закреплённый сверху справа */}
        <div className="absolute right-3 top-3">
          <Badge
            variant={getStatusVariant(currentItem.status)}
            className="px-2 py-0 text-[10px]"
          >
            {getStatusLabel(currentItem.status)}
          </Badge>
        </div>

        {/* HEADER */}
        <CardHeader className="flex flex-row items-start justify-between space-y-0 px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Wrench aria-label={itemIconAria} className="size-4" />
            </div>

            <div className="flex flex-col">
              <CardTitle className="text-[13px] font-semibold leading-tight">
                {currentItem.name}
              </CardTitle>

              <p className="mt-0.5 text-[10px] text-muted-foreground">
                Owned by{" "}
                <span className="font-semibold text-foreground">You</span>
              </p>

              {/* Actions row */}
              <div className="mt-1.5 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setDetailsOpen(true)}
                  className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-foreground"
                >
                  <Info className="size-3" aria-hidden="true" />
                  <span>Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  aria-label="Edit item"
                  className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="size-3" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteOpen(true)}
                  aria-label="Delete item"
                  className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="size-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="flex flex-1 flex-col px-4 pb-3 pt-1">
          {hasTags && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {currentItem.tags!.map((tag) => (
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

          <div className="mt-auto pt-2 text-[10px] text-muted-foreground">
            {currentItem.created_at && (
              <span>
                Added{" "}
                <span className="text-foreground">
                  {new Date(currentItem.created_at).toLocaleDateString()}
                </span>
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ItemDetailsDialog
        item={currentItem}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <ItemEditDialog
        item={currentItem}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={(updated) => setCurrentItem(updated)}
      />

      <ItemDeleteDialog
        item={currentItem}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => {
          // удаление обрабатывается через react-query invalidate; карточка исчезнет, когда родитель перерендерится
        }}
      />
    </>
  );
}

