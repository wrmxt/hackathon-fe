import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Wrench, Shield } from "lucide-react";
import { useItems } from "@/api/api";

export interface Item {
  id: string;
  name: string;
  owner_id: string;
  risk_level: "low" | "medium" | "high";
  status: "available" | "borrowed" | "unavailable";
}

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
function getStatusVariant(status: Item["status"]) {
  switch (status) {
    case "available":
      return "default";
    case "borrowed":
      return "secondary";
    case "unavailable":
      return "outline";
    default:
      return "default";
  }
}
function getRiskLabel(risk: Item["risk_level"]) {
  switch (risk) {
    case "low":
      return "Low";
    case "medium":
      return "Medium";
    case "high":
      return "High";
    default:
      return risk;
  }
}
function getRiskVariant(risk: Item["risk_level"]) {
  switch (risk) {
    case "low":
      return "secondary";
    case "medium":
      return "default";
    case "high":
      return "destructive";
    default:
      return "secondary";
  }
}
function capitalize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function ItemCardInline({ item }: { item: Item }) {
  const ownerName = capitalize(item.owner_id);
  return (
    <Card className="relative w-full max-w-xs overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-colors">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Wrench className="size-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <CardTitle className="text-sm font-semibold leading-tight tracking-tight">{item.name}</CardTitle>
            <CardDescription className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
              Owner: <span className="font-medium text-foreground/80">{ownerName}</span>
            </CardDescription>
          </div>
        </div>
        <Badge variant={getStatusVariant(item.status)}>{getStatusLabel(item.status)}</Badge>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="mb-3 flex items-center gap-2 text-[11px]">
          <Shield className="size-3.5 text-muted-foreground" aria-hidden="true" />
          <span className="text-muted-foreground">Risk:</span>
          <Badge variant={getRiskVariant(item.risk_level)} className="text-[10px] px-2 py-0.5">{getRiskLabel(item.risk_level)}</Badge>
        </div>
        <div className="flex gap-2 pt-1">
          <Button type="button" size="sm" className="h-7 px-2.5 text-[11px] font-medium">Request</Button>
          <Button type="button" size="sm" variant="ghost" className="h-7 px-2.5 text-[11px] font-medium">Details</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export interface ItemsListProps {
  title?: string;
  items?: Item[];
}

export function ItemsList({ title = "Available items", items: overrideItems }: ItemsListProps) {
  const { data: items = [] } = useItems();
  const apiItems: Item[] = Array.isArray(items) ? (items as Item[]) : (((items as any)?.items ?? []) as Item[]);
  const effectiveItems: Item[] = overrideItems ?? apiItems;

  if (effectiveItems.length === 0) {
    return (
      <section className="w-full space-y-3">
        <header className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">No items available yet. Be the first to share something with your neighbors.</p>
        </header>
      </section>
    );
  }

  return (
    <section className="w-full space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">Items you can borrow from your neighbors right now.</p>
        </div>
        <p className="text-xs text-muted-foreground">{effectiveItems.length} items</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {effectiveItems.map(item => <ItemCardInline key={item.id} item={item} />)}
      </div>
    </section>
  );
}

export default ItemsList;
