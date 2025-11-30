// src/pages/BorrowedPage.tsx
import { useAuth } from "@/context/AuthContext";
import { useBorrowings } from "@/api/borrowings";
import { useItems } from "@/api/api";
import BorrowedBorrowingCard, {
  type Borrowing,
  type BorrowedItem,
} from "@/components/BorrowedBorrowingCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check } from "lucide-react";

type BorrowingsResponse = {
  borrowed?: Borrowing[];
  lent?: Borrowing[];
};

export default function BorrowedPage() {
  const { user } = useAuth();
  const userId = user ?? "";

  const { data: borrowingsRaw, isLoading, isError } = useBorrowings(userId);
  const borrowingsData = borrowingsRaw as BorrowingsResponse | undefined;
  const borrowedList: Borrowing[] = borrowingsData?.borrowed ?? [];

  const { data: itemsRaw = [] } = useItems();

  let itemsList: BorrowedItem[] = [];
  if (Array.isArray(itemsRaw)) {
    itemsList = itemsRaw as BorrowedItem[];
  } else {
    const maybe = itemsRaw as { items?: unknown };
    if (Array.isArray(maybe.items)) {
      itemsList = maybe.items as BorrowedItem[];
    }
  }

  const findItemById = (id: string): BorrowedItem | undefined =>
    itemsList.find((it) => it.id === id);

  // не залогинен
  if (!userId) {
    return (
      <section className="w-full pt-12 px-6 space-y-3">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Borrowed items</h1>
        </header>
        <div className="rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground">
          Please sign in to see items you’ve borrowed from your neighbors.
        </div>
      </section>
    );
  }

  // loading
  if (isLoading && !borrowingsData) {
    return (
      <section className="w-full pt-12 px-6 space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Borrowed items
          </h1>
          <p className="text-sm text-muted-foreground">
            Items you’ve borrowed from your neighbors.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              className="flex h-full w-full max-w-xs flex-col rounded-2xl border bg-card/80 p-4 shadow-sm animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-3 w-24 rounded bg-muted" />
                  <div className="h-2 w-16 rounded bg-muted" />
                </div>
              </div>
              <div className="mt-4 h-2 w-28 rounded bg-muted" />
              <div className="mt-auto flex items-center justify-between gap-4 pt-4">
                <div className="space-y-1">
                  <div className="h-2 w-24 rounded bg-muted" />
                  <div className="h-2 w-20 rounded bg-muted" />
                </div>
                <div className="h-7 w-20 rounded-full bg-muted" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  // error
  if (isError) {
    return (
      <section className="w-full pt-12 px-6 space-y-3">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Borrowed items
          </h1>
        </header>
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Couldn’t load borrowed items. Please try again later.
        </div>
      </section>
    );
  }

  // нет одолженных
  if (borrowedList.length === 0) {
    return (
      <section className="w-full pt-12 px-6 space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Borrowed items
          </h1>
          <p className="text-sm text-muted-foreground">
            You haven’t borrowed any items yet.
          </p>
        </header>

        <div className="rounded-2xl border bg-muted/10 px-4 py-6 text-sm text-muted-foreground">
          When you borrow items from your neighbors, they’ll appear here so you
          can keep track of them.
        </div>
      </section>
    );
  }

  // основной кейс
  return (
    <section className="w-full pt-12 px-6 space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Borrowed items
          </h1>
          <p className="text-sm text-muted-foreground">
            Items you’ve currently borrowed from your neighbors.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          {borrowedList.length} active borrow
          {borrowedList.length === 1 ? "" : "s"}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {borrowedList.map((b) => {
          const item = findItemById(b.item_id);

          const actionNode = (
            <Badge
              variant="outline"
              className={
                b.status.toLowerCase().includes("confirm")
                  ? "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px]"
                  : "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] border-amber-400 bg-amber-500/10"
              }
            >
              {b.status.toLowerCase().includes("confirm") ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  waiting
                </>
              ) : (
                <>
                  <Check className="h-3 w-3" />
                  borrowing
                </>
              )}
            </Badge>

          );

          return (
            <BorrowedBorrowingCard
              key={b.id}
              borrowing={b}
              item={item}
              actionNode={actionNode}
            />
          );
        })}
      </div>
    </section>
  );
}
