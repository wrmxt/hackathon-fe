import { useBuildingState } from "@/api/buildingState";
import { Card } from "@/components/ui/card";
import NeighborCard, {type Resident, type NeighborItem} from "@/components/NeighborCard";


type BuildingState = {
  building?: {
    id: string;
    name: string;
    city?: string;
    flats_count?: number;
  };
  residents?: Resident[];
  items?: NeighborItem[];
};

export default function NeighborsPage() {
  const { data, isLoading, isError } = useBuildingState();

  const state = data as BuildingState | undefined;
  const residents = state?.residents ?? [];
  const allItems = state?.items ?? [];
  const buildingName = state?.building?.name ?? "Your building";
  const city = state?.building?.city ?? "";

  // loading
  if (isLoading && !state) {
    return (
      <section className="w-full pt-12 px-6 space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Neighbors
          </h1>
          <p className="text-sm text-muted-foreground">
            People in your building who share items.
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
                  <div className="h-3 w-20 rounded bg-muted" />
                  <div className="h-2 w-16 rounded bg-muted" />
                </div>
              </div>
              <div className="mt-4 h-2 w-24 rounded bg-muted" />
              <div className="mt-3 h-2 w-28 rounded bg-muted" />
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
            Neighbors
          </h1>
        </header>
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Couldn’t load neighbors. Please try again later.
        </div>
      </section>
    );
  }

  // нет соседей
  if (!residents.length) {
    return (
      <section className="w-full pt-12 px-6 space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Neighbors
          </h1>
          <p className="text-sm text-muted-foreground">
            No residents found for this building yet.
          </p>
        </header>

        <div className="rounded-2xl border bg-muted/10 px-4 py-6 text-sm text-muted-foreground">
          Once your neighbors join shAIring, they’ll appear here with their
          shared items and contact info.
        </div>
      </section>
    );
  }

  // нормальный случай
  return (
    <section className="w-full pt-12 px-6 space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Neighbors</h1>
        <p className="text-sm text-muted-foreground">
          People in{" "}
          <span className="font-medium text-foreground">
            {buildingName}
          </span>
          {city ? ` · ${city}` : ""} who share items with you.
        </p>
        <p className="text-xs text-muted-foreground">
          {residents.length} residents · {allItems.length} shared items
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {residents.map((resident) => {
          const itemsOfResident = allItems.filter(
            (it) => it.owner_id === resident.id
          );
          return (
            <NeighborCard
              key={resident.id}
              resident={resident}
              items={itemsOfResident}
            />
          );
        })}
      </div>
    </section>
  );
}
