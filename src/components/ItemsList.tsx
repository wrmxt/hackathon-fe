import { useItems } from "@/api/api";
import ItemCard,  {type Item}  from "@/components/ItemCard"; // поправь путь, если другой

export interface ItemsListProps {
  title?: string;
  items?: Item[]; // если передаёшь явно — переопределяет API
}

// Возможные формы ответа от API
type ItemsApiResponse = Item[] | { items: Item[] };

export function ItemsList({
                            title = "Available items",
                            items: overrideItems,
                          }: ItemsListProps) {
  const { data } = useItems();

  // Приводим data к ожидаемому варианту без any
  const raw = data as ItemsApiResponse | undefined;

  let apiItems: Item[] = [];

  if (Array.isArray(raw)) {
    apiItems = raw;
  } else if (raw && "items" in raw && Array.isArray(raw.items)) {
    apiItems = raw.items;
  }

  const effectiveItems: Item[] = overrideItems ?? apiItems;

  if (effectiveItems.length === 0) {
    return (
      <section className="w-full space-y-3">
        <header className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">
            No items available yet. Be the first to share something with your neighbors.
          </p>
        </header>
      </section>
    );
  }

  return (
    <section className="w-full space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">
            Items you can borrow from your neighbors right now.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          {effectiveItems.length} items
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {effectiveItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default ItemsList;
