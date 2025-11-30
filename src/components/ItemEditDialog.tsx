import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Item } from "@/components/ItemCard";
import { useUpdateItem } from "@/api/apiUpdateDeleteItems";
import { useAuth } from "@/context/AuthContext";

interface ItemEditDialogProps {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: (item: Item) => void;
}

export default function ItemEditDialog({ item, open, onOpenChange, onUpdated }: ItemEditDialogProps) {
  const { user } = useAuth();
  const [name, setName] = useState(item.name || "");
  const [description, setDescription] = useState(item.description || "");
  const [tagsText, setTagsText] = useState(Array.isArray(item.tags) ? item.tags.join(", ") : "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const upd = useUpdateItem();

  const handleSave = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const tags = tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const body = { user_id: user, name, description, tags };
      await upd.mutateAsync({ itemId: item.id, body });
      onOpenChange(false);
      onUpdated?.({ ...item, name, description, tags });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="item-name">Name</label>
            <Input id="item-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="item-desc">Description</label>
            <Input id="item-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="item-tags">Tags</label>
            <Input id="item-tags" value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="e.g. tools, diy, home" />
            <p className="text-[10px] text-muted-foreground">Separate tags with commas.</p>
          </div>
        </div>
        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
