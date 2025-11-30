import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useBuildingState } from "@/api/buildingState";

type Resident = {
  id: string;
  name: string;
  floor?: number;
  flat?: number;
  email?: string;
  phone?: string;
  trusted_score?: number;
};

type BuildingState = {
  residents?: Resident[];
};

interface ContactInfoDialogProps {
  ownerId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactInfoDialog({
                                    ownerId,
                                    open,
                                    onOpenChange,
                                  }: ContactInfoDialogProps) {
  const { data, isLoading, isError } = useBuildingState() as {
    data?: BuildingState;
    isLoading: boolean;
    isError: boolean;
  };

  const resident =
    ownerId && data?.residents
      ? data.residents.find((r) => r.id === ownerId)
      : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {resident ? resident.name : "Contact information"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            How to reach the owner of this item in your building.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-2 text-sm">
            <div className="h-3 w-24 rounded bg-muted animate-pulse" />
            <div className="h-3 w-40 rounded bg-muted animate-pulse" />
            <div className="h-3 w-32 rounded bg-muted animate-pulse" />
          </div>
        )}

        {isError && !isLoading && (
          <p className="text-sm text-destructive">
            Couldn’t load resident info. Please try again later.
          </p>
        )}

        {!isLoading && !isError && !resident && (
          <p className="text-sm text-muted-foreground">
            Owner information not found in this building.
          </p>
        )}

        {!isLoading && !isError && resident && (
          <div className="space-y-3 text-sm">
            <div className="space-y-1 rounded-md border border-border bg-muted/10 px-3 py-2">
              {resident.email && (
                <p className="text-sm">
                  Email:{" "}
                  <a
                    href={`mailto:${resident.email}`}
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    {resident.email}
                  </a>
                </p>
              )}
              {resident.phone && (
                <p className="text-sm">
                  Phone:{" "}
                  <a
                    href={`tel:${resident.phone}`}
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    {resident.phone}
                  </a>
                </p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ContactInfoDialog;
