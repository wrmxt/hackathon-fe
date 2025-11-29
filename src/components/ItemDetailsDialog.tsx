import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// минимальный тип для диалога (структурно совместим с твоим Item)
export interface ItemDetailsDialogItem {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  owner_id: string;
  status: "available" | "borrowed" | "unavailable";
  risk_level?: "low" | "medium" | "high";
  created_at?: string;
}

interface ItemDetailsDialogProps {
  item: ItemDetailsDialogItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemDetailsDialog({
                                    item,
                                    open,
                                    onOpenChange,
                                  }: ItemDetailsDialogProps) {
  const hasDescription =
    !!item.description && item.description.trim().length > 0;
  const hasTags = Array.isArray(item.tags) && item.tags.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="max-w-sm">
  <DialogHeader>
    <DialogTitle className="text-base font-semibold">
    {item.name}
    </DialogTitle>
    <DialogDescription className="text-xs text-muted-foreground">
      {!!item.description && "No more details about this shared item."}
  </DialogDescription>
  </DialogHeader>

  <div className="mt-3 space-y-2 text-sm">
    {hasDescription && (
      <p className="text-sm text-foreground">{item.description}</p>
    )}

  {hasTags && (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {item.tags!.map((tag) => (
          <Badge
            key={tag}
        variant="secondary"
        className="px-2 py-0.5 text-[11px]"
          >
  #{tag}
    </Badge>
  ))}
    </div>
  )}

  {item.created_at && (
    <p className="mt-3 text-[11px] text-muted-foreground">
      Added: {new Date(item.created_at).toLocaleDateString()}
    </p>
  )}
  </div>
  </DialogContent>
  </Dialog>
);
}

export default ItemDetailsDialog;
