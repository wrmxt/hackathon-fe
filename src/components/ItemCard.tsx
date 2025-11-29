import { useState } from "react";
import { Wrench, Info } from "lucide-react";
import Button from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ItemDetailsDialog from "@/components/ItemDetailsDialog"; // поправь путь при необходимости

// Тип айтема в стиле бэкенда
export interface Item {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  owner_id: string;
  status: "available" | "borrowed" | "unavailable";
  risk_level?: "low" | "medium" | "high";
  created_at?: string;
}

function capitalize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
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

export interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const ownerName = capitalize(item.owner_id);
  const hasTags = Array.isArray(item.tags) && item.tags.length > 0;
  const itemIconAria = `${item.name} category icon`;

  return (
    <>
      <Card className="flex h-full w-full max-w-xs flex-col rounded-2xl border border-border bg-card shadow-sm">
        {/* HEADER */}
        <CardHeader className="flex flex-row items-start justify-between space-y-0 px-4 py-3">
          {/* Левая часть: иконка + текстовый блок */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Wrench aria-label={itemIconAria} className="size-5" />
            </div>

            <div className="flex flex-col">
              {/* Название теперь слева и центрится по иконке за счёт items-center у родителя */}
              <CardTitle className="text-sm font-semibold leading-tight">
                {item.name}
              </CardTitle>

              {/* Более выразительный owner */}
              <p className="mt-1 text-[11px] text-muted-foreground">
                Shared by{" "}
                <span className="font-semibold text-foreground">
                  {ownerName}
                </span>
              </p>

              {/* Detail of item опушен ниже */}
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

          {/* Статус справа */}
          <Badge
            variant={getStatusVariant(item.status)}
            className="px-2 py-0 text-[11px]"
          >
            {getStatusLabel(item.status)}
          </Badge>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="flex flex-1 flex-col px-4 pb-3 pt-1">
          {/* Теги под хедером */}
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

          {/* Кнопки прибиты к низу карточки */}
          <div className="mt-auto flex gap-2 pt-3">
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

      {/* Модалка с деталями — уже существующий компонент */}
      <ItemDetailsDialog
        item={item}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
}
