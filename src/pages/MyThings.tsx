import { useAuth } from "@/context/AuthContext"; // как в InboxPage
import { useItems } from "@/api/api";
import ItemMyThing from "@/components/ItemMyThing";
import type { Item } from "@/components/ItemCard";
import { Card } from "@/components/ui/card";

export default function MyThingsPage() {
  const { user } = useAuth();
  const userId = user ?? "";

  const { data: itemsRaw = [], isLoading, isError } = useItems();

  // useItems может вернуть массив или объект { items: [] }
  let itemsList: Item[] = [];
  if (Array.isArray(itemsRaw)) {
    itemsList = itemsRaw as Item[];
  } else {
    const maybe = itemsRaw as { items?: unknown };
    if (Array.isArray(maybe.items)) {
      itemsList = maybe.items as Item[];
    }
  }

  const myItems: Item[] = userId
    ? itemsList.filter((it) => it.owner_id === userId)
    : [];

  // loading state
  if (isLoading && !itemsList.length) {
    return (
      <section className="w-full pt-12 px-6 space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            My things
          </h1>
          <p className="text-sm text-muted-foreground">
            Items you’re sharing with neighbors.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
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
              <div className="mt-auto flex gap-2 pt-3">
                <div className="h-7 w-20 rounded-full bg-muted" />
                <div className="h-7 w-20 rounded-full bg-muted" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  // error state
  if (isError) {
    return (
      <section className="w-full pt-12 px-6 space-y-3">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            My things
          </h1>
        </header>
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Couldn’t load your items. Please try again later.
        </div>
      </section>
    );
  }

  // если пользователь не залогинен
  if (!userId) {
    return (
      <section className="w-full pt-12 px-6 space-y-3">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            My things
          </h1>
        </header>
        <div className="rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground">
          Please sign in to see and manage your shared items.
        </div>
      </section>
    );
  }

  // нет своих вещей
  if (myItems.length === 0) {
    return (
      <section className="w-full pt-12 px-6 space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            My things
          </h1>
          <p className="text-sm text-muted-foreground">
            You haven’t shared any items yet.
          </p>
        </header>

        <div className="rounded-2xl border bg-muted/10 px-4 py-6 text-sm text-muted-foreground">
          Once you add items to share, they’ll appear here so you can manage
          them easily.
        </div>
      </section>
    );
  }

  // основной случай — список своих вещей
  return (
    <section className="w-full pt-12 px-6 space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            My things
          </h1>
          <p className="text-sm text-muted-foreground">
            Items you’re currently sharing with neighbors.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          {myItems.length} item{myItems.length === 1 ? "" : "s"}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {myItems.map((item) => (
          <ItemMyThing
            key={item.id}
            item={{ ...item, owner_id: "you" }}
          />
        ))}
      </div>
    </section>
  );
}
