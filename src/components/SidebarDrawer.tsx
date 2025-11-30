import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { useAuth } from "@/context/AuthContext";
import { usePending } from "@/api/borrowings";

type Section = "Neighbors" | "My Things" | "Borrowed" | "Lended" | "Inbox";

export default function SidebarDrawer({
                                        active,
                                        onSelect,
                                      }: {
  active: Section;
  onSelect: (s: Section) => void;
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const pendingQuery = usePending(user || "");
  const pendingData = pendingQuery.data as unknown;
  const pendingCount = (() => {
    if (!pendingData) return 0;
    if (Array.isArray(pendingData)) return pendingData.length;
    const items = (pendingData as any)?.items ?? (pendingData as any)?.data ?? [];
    return Array.isArray(items) ? items.length : 0;
  })();
  const sections: Section[] = ["Neighbors", "My Things", "Borrowed", "Lended", "Inbox"];

  return (
    <DrawerContent>
      <DrawerHeader>
        <div className="flex items-center justify-between">
          <div>
            <DrawerTitle>Navigation</DrawerTitle>
            <DrawerDescription className="text-xs text-muted-foreground">
              Quick access to your workspace
            </DrawerDescription>
          </div>
          <div className="md:hidden">
            <DrawerClose>
              <Button size="icon" variant="ghost" aria-label="Close sidebar">
                ✕
              </Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerHeader>

      <nav className="flex flex-col gap-2 px-4 pb-4">
        {sections.map((s) => {
          const isActive = s === active;

          return (
            <Button
              key={s}
              variant={isActive ? "secondary" : "ghost"}
              size="default"
              className="w-full justify-start"
              onClick={() => {
                onSelect(s);

                if (s === "My Things") {
                  navigate("/mythings");
                }

                if (s === "Neighbors") {
                  navigate("/neighbors");
                }

                if (s === "Lended") {
                  // маршрут: <Route path="landed" element={<LendedPage />} />
                  navigate("/landed");
                }

                if (s === "Borrowed") {
                  // маршрут: <Route path="borrowed" element={<BorrowedPage />} />
                  navigate("/borrowed");
                }

                // если захочешь позже:
                // if (s === "Inbox") navigate("/inbox");
              }}
            >
              <span className="flex-1 text-left">{s}</span>
              {s === "Inbox" && (
                <Badge variant="default">{pendingCount}</Badge>
              )}
            </Button>
          );
        })}
      </nav>

      <DrawerFooter>
        <div className="text-xs text-muted-foreground">
          Filters & quick links
        </div>
      </DrawerFooter>
    </DrawerContent>
  );
}
