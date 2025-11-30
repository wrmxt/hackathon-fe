import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Users } from "lucide-react";

export interface Resident {
  id: string;
  name: string;
  floor?: number;
  flat?: number;
  email?: string;
  phone?: string;
  trusted_score?: number;
}

export interface NeighborItem {
  id: string;
  name: string;
  owner_id: string;
  status: "available" | "borrowed" | "unavailable";
  tags?: string[];
}

interface NeighborCardProps {
  resident: Resident;
  items: NeighborItem[];
}

export default function NeighborCard({ resident, items }: NeighborCardProps) {
  const initial = resident.name?.trim()?.[0]?.toUpperCase() ?? "?";

  const totalItems = items.length;
  const availableItems = items.filter((it) => it.status === "available").length;

  const uniqueTags = Array.from(
    new Set(
      items.flatMap((it) =>
        Array.isArray(it.tags) ? it.tags : []
      )
    )
  ).slice(0, 4); // максимум 4 тега для компактности


  return (
    <Card className="flex h-full w-full max-w-xs flex-col rounded-2xl border border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 px-4 py-3">
        {/* Левая часть: аватар + имя */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
            {initial}
          </div>

          <div className="flex flex-col">
            <CardTitle className="text-sm font-semibold leading-tight">
              {resident.name}
            </CardTitle>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Flat {resident.flat ?? "?"}
              {resident.floor != null && <> · Floor {resident.floor}</>}
            </p>

          </div>
        </div>

        {/* Кол-во вещей */}
        <Badge
          variant="secondary"
          className="px-2 py-0 text-[11px] flex items-center gap-1"
        >
          <Users className="h-3 w-3" />
          <span>{totalItems} items</span>
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col px-4 pb-3 pt-1">
        {/* Контакты */}
        <div className="space-y-1 text-sm text-muted-foreground">
          {resident.email && (
            <p className="flex items-center gap-2 text-[12px]">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border/60">
                <Mail className="h-3 w-3" />
              </span>
              <a
                href={`mailto:${resident.email}`}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {resident.email}
              </a>
            </p>
          )}
          {resident.phone && (
            <p className="flex items-center gap-2 text-[12px]">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border/60">
                <Phone className="h-3 w-3" />
              </span>
              <a
                href={`tel:${resident.phone}`}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {resident.phone}
              </a>
            </p>
          )}
        </div>

        {/* Теги вещей соседа */}
        {uniqueTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {uniqueTags.map((tag) => (
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

        {/* Мини-строка о доступных вещах */}
        {totalItems > 0 && (
          <p className="mt-auto pt-3 text-[11px] text-muted-foreground">
            {availableItems} of {totalItems} items currently available.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
