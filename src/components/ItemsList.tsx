import { useState, useMemo } from "react";
import { useItems } from "@/api/api";
import ItemCard, { type Item } from "@/components/ItemCard";
import Button from "@/components/ui/button";

export interface ItemsListProps {
  title?: string;      // сейчас не используем в UI, но оставляем проп
  items?: Item[];
}

type ItemsApiResponse = Item[] | { items: Item[] };
type StatusFilter = "all" | "available" | "borrowed";

export function ItemsList({ items: overrideItems }: ItemsListProps) {
  const { data } = useItems();

  const raw = data as ItemsApiResponse | undefined;
  let apiItems: Item[] = [];

  if (Array.isArray(raw)) {
    apiItems = raw;
  } else if (raw && "items" in raw && Array.isArray(raw.items)) {
    apiItems = raw.items;
  }

  const effectiveItems: Item[] = overrideItems ?? apiItems;

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    return effectiveItems.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      if (!q) return true;

      const nameMatch = item.name.toLowerCase().includes(q);
      const tagsMatch = (item.tags ?? []).some((tag) =>
        tag.toLowerCase().includes(q)
      );

      return nameMatch || tagsMatch;
    });
  }, [effectiveItems, query, statusFilter]);

  if (effectiveItems.length === 0) {
    return (
      <section className="w-full space-y-3">
        <p className="text-sm text-muted-foreground">
          No items available yet. Be the first to share something with your neighbors.
        </p>
      </section>
    );
  }

  const statusButtonClasses = (value: StatusFilter) =>
    [
      "h-7 px-2.5 text-[11px] rounded-full border",
      "transition-colors",
      value === statusFilter
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-background text-muted-foreground border-border hover:bg-muted",
    ].join(" ");

  return (
    <section className="w-full space-y-4">
      {/* ШАПКА: всё прижато к левому краю */}
      <header className="space-y-2">
        {/* Поиск + фильтры под ним */}
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Search item
        </p>
        <div className="flex flex-col gap-2 sm:w-80">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or tag…"
            className="h-8 w-full rounded-md border border-border bg-background px-2.5 text-xs outline-none focus-visible:ring-1 focus-visible:ring-primary"
          />

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground mr-1">
              Status:
            </span>
            <Button
              type="button"
              variant="ghost"
              className={statusButtonClasses("all")}
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={statusButtonClasses("available")}
              onClick={() => setStatusFilter("available")}
            >
              Available
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={statusButtonClasses("borrowed")}
              onClick={() => setStatusFilter("borrowed")}
            >
              Borrowed
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground">
            {filteredItems.length} of {effectiveItems.length} items
          </p>
        </div>
      </header>

      {filteredItems.length === 0 ? (
        <div className="rounded-xl border bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
          No items match your search or filters. Try adjusting the text or status.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ItemsList;
