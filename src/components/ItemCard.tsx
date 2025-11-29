import { Wrench, Shield, Info } from "lucide-react";
import Button from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const exampleItem = {
  id: "item-1",
  name: "Drill",
  owner_id: "peter",
  risk_level: "low" as "low" | "medium" | "high",
  status: "available" as "available" | "borrowed" | "unavailable",
};

const ownerName = capitalize(exampleItem.owner_id);
const category = "Tools";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getStatusLabel(status: (typeof exampleItem)["status"]) {
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
function getStatusVariant(status: (typeof exampleItem)["status"]) {
  switch (status) {
    case "available": return "default"; // primary token
    case "borrowed": return "secondary"; // secondary token
    case "unavailable": return "outline"; // neutral outline
    default: return "default";
  }
}
function getRiskLabel(risk: (typeof exampleItem)["risk_level"]) {
  switch (risk) {
    case "low": return "Low";
    case "medium": return "Medium";
    case "high": return "High";
    default: return risk;
  }
}
function getRiskVariant(risk: (typeof exampleItem)["risk_level"]) {
  switch (risk) {
    case "low": return "secondary";
    case "medium": return "default";
    case "high": return "destructive";
    default: return "secondary";
  }
}

const itemIconAria = `${exampleItem.name} category icon`;

export default function ItemCard() {
  return (
    <Card className="w-full max-w-xs rounded-2xl border border-border bg-card shadow-sm">
      {/* HEADER */}
      <CardHeader className="flex flex-row items-start justify-between space-y-0 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Wrench aria-label={itemIconAria} className="size-5" />
          </div>
          <div className="flex flex-col">
            <CardTitle className="text-sm font-semibold leading-tight">
              {exampleItem.name}
            </CardTitle>
            <CardDescription className="mt-0.5 text-[11px] text-muted-foreground">
              Owner:{" "}
              <span className="font-medium text-foreground/80">
                {ownerName}
              </span>
              <span className="mx-1.5 inline-block h-1 w-1 rounded-full bg-border align-middle" />
              <span>{category}</span>
            </CardDescription>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <Badge variant={getStatusVariant(exampleItem.status)}>{getStatusLabel(exampleItem.status)}</Badge>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
          >
            <Info className="size-3.5" aria-hidden="true" />
            <span>Detail of item</span>
          </button>
        </div>
      </CardHeader>

      {/* CONTENT – уплотнённые отступы */}
      <CardContent className="px-4 pb-3 pt-1">
        <div className="space-y-2 text-[11px]">
          {/* Risk row ближе к хедеру */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield
                className="size-3.5 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="text-muted-foreground">Risk:</span>
            </div>
            <Badge variant={getRiskVariant(exampleItem.risk_level)} className="text-[10px] px-2 py-0.5">{getRiskLabel(exampleItem.risk_level)} risk</Badge>
          </div>
        </div>

        {/* Основные действия, чуть ближе к риску */}
        <div className="mt-3 flex gap-2">
          <Button
            type="button"
            size="sm"
            className="h-8 flex-1 rounded-full text-[11px] font-medium"
          >
            Request item
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 flex-1 rounded-full text-[11px] font-medium"
          >
            Contact info
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
