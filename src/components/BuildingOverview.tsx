import type { ReactNode } from "react";
import { useBuildingState } from "@/api/buildingState";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Building2, Home, Users, Package, Leaf } from "lucide-react";

// Local type aligning with /api/building-state response
interface BuildingState {
  building?: {
    id: string;
    name: string;
    city: string;
    flats_count: number;
  };
  residents?: Array<{ id: string; name: string; floor: number; trusted_score?: number }>;
  items?: Array<{ id: string; name: string; owner_id: string; risk_level?: string; status?: string }>;
  impact?: {
    co2_saved_kg: number;
    waste_avoided_kg: number;
    borrows_count: number;
    events_count: number;
    items_shared: number;
  };
}

// компактная стат-карточка: фикс ширина, высота чуть больше текста
function StatCard({
                    icon,
                    iconBg,
                    title,
                    subtitle,
                    value,
                  }: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  value: string | number;
}) {
  return (
    <Card className="w-44 rounded-xl border bg-card/80 shadow-sm">
      <CardContent className="flex items-center gap-3 px-3 py-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full text-[14px] ${iconBg}`}
        >
          {icon}
        </div>
        <div className="flex flex-1 items-center justify-between gap-3">
          <div className="space-y-0.5">
            <CardTitle className="text-sm font-semibold leading-tight">
              {title}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {subtitle}
            </CardDescription>
          </div>
          <span className="text-lg font-semibold">{value}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function BuildingOverview() {
  const { data: state, isLoading, isError } = useBuildingState() as unknown as {
    data: BuildingState | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  const buildingName = state?.building?.name ?? "—";
  const city = state?.building?.city ?? "";
  const flatsCount = state?.building?.flats_count ?? 0;
  const residentsCount = state?.residents?.length ?? 0;
  const itemsCount = state?.items?.length ?? 0;

  const co2Saved = state?.impact?.co2_saved_kg ?? 0;
  const wasteAvoided = state?.impact?.waste_avoided_kg ?? 0;
  const borrowsCount = state?.impact?.borrows_count ?? 0;

  // SKELETON
  if (isLoading && !state) {
    return (
      <section className="w-full space-y-3">
        <div className="h-3 w-28 rounded bg-muted/70" />
        <Card className="rounded-2xl border bg-card/80 shadow-md animate-pulse">
          <CardContent className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-36 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
              </div>
            </div>
            <div className="grid gap-2 text-xs sm:grid-cols-3">
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              className="w-44 rounded-xl border bg-card/80 shadow-sm animate-pulse"
            >
              <CardContent className="flex items-center gap-3 px-3 py-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-20 rounded bg-muted" />
                  <div className="h-2 w-16 rounded bg-muted" />
                </div>
                <div className="h-3 w-6 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  // ERROR
  if (isError) {
    return (
      <section className="w-full space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Building overview
        </p>
        <Card className="rounded-2xl border bg-card/80 shadow-sm">
          <CardHeader className="px-4 py-3">
            <CardDescription className="text-xs text-destructive">
              Couldn’t load building data.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    );
  }

  return (
    <section className="w-full space-y-3">
      {/* маленький label сверху */}
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Building overview
      </p>

      {/* 1) Большая карточка с домом */}
      <Card className="rounded-2xl border bg-card/90 shadow-md">
        <CardContent className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Building2 className="h-7 w-7" aria-hidden="true" />
            </div>
            <div className="space-y-0.5">
              <CardTitle className="text-base font-semibold">
                {buildingName}
                {city && <span className="text-muted-foreground"> · {city}</span>}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {flatsCount} flats · {residentsCount} residents · {itemsCount} items
              </CardDescription>
            </div>
          </div>

          <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5" aria-hidden="true" />
              <span>
                <span className="font-semibold text-foreground">{flatsCount}</span>{" "}
                flats
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" aria-hidden="true" />
              <span>
                <span className="font-semibold text-foreground">{residentsCount}</span>{" "}
                residents
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" aria-hidden="true" />
              <span>
                <span className="font-semibold text-foreground">{itemsCount}</span>{" "}
                items
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2) Компактные impact-плитки слева */}
      <div className="flex flex-wrap gap-3">
        <StatCard
          icon={<Leaf className="h-5 w-5" />}
          iconBg="bg-emerald-500/15 text-emerald-400"
          title="CO₂ saved"
          subtitle="Estimated, kg"
          value={co2Saved}
        />
        <StatCard
          icon={<Leaf className="h-5 w-5 rotate-180" />}
          iconBg="bg-sky-500/15 text-sky-400"
          title="Waste avoided"
          subtitle="Estimated, kg"
          value={wasteAvoided}
        />
        <StatCard
          icon={<Package className="h-5 w-5" />}
          iconBg="bg-violet-500/15 text-violet-400"
          title="Borrows"
          subtitle="Successful item borrows"
          value={borrowsCount}
        />
      </div>
    </section>
  );
}

export default BuildingOverview;
