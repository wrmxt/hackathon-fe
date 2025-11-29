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

type Section = "Neighbors" | "My Things" | "Borrowed" | "Lended" | "Inbox";

export default function SidebarDrawer({
  active,
  onSelect,
}: {
  active: Section;
  onSelect: (s: Section) => void;
}) {
  const sections: Section[] = ["Neighbors", "My Things", "Borrowed", "Lended", "Inbox"];

  return (
    <DrawerContent>
      <DrawerHeader>
        <div className="flex items-center justify-between">
          <div>
            <DrawerTitle>Navigation</DrawerTitle>
            <DrawerDescription className="text-xs text-muted-foreground">Quick access to your workspace</DrawerDescription>
          </div>
          <div className="md:hidden">
            <DrawerClose>
              <Button size="icon" variant="ghost" aria-label="Close sidebar">✕</Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerHeader>

      <nav className="flex flex-col gap-2">
        {sections.map((s) => {
          const isActive = s === active;
          return (
            <Button
              key={s}
              variant={isActive ? "secondary" : "ghost"}
              size="default"
              className="justify-start w-full"
              onClick={() => {
                onSelect(s);
              }}
            >
              <span className="flex-1 text-left">{s}</span>
              {s === "Inbox" && <Badge variant="default">3</Badge>}
            </Button>
          );
        })}
      </nav>

      <DrawerFooter>
        <div className="text-xs text-muted-foreground">Filters & quick links</div>
      </DrawerFooter>
    </DrawerContent>
  );
}
