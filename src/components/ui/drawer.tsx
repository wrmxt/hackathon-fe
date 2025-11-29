/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import Button from "@/components/ui/button";

type DrawerContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export function Drawer({ open: openProp, onOpenChange, children }: {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  children: React.ReactNode;
}) {
  const [openState, setOpenState] = useState(false);
  const controlled = openProp !== undefined;
  const open = controlled ? (openProp as boolean) : openState;

  const setOpen = (v: boolean) => {
    if (!controlled) setOpenState(v);
    if (onOpenChange) onOpenChange(v);
  };

  return <DrawerContext.Provider value={{ open, setOpen }}>{children}</DrawerContext.Provider>;
}

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer must be used within a Drawer");
  return ctx;
}

export function DrawerTrigger({ children }: { children: React.ReactNode }) {
  const { setOpen } = useDrawer();
  // render a button that opens the drawer
  return (
    <span onClick={() => setOpen(true)} className="inline-block">
      {children}
    </span>
  );
}

export function DrawerContent({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useDrawer();
  // Full-screen overlay + slide-in panel from left
  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ background: open ? "rgba(0,0,0,0.35)" : "transparent" }}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 transform bg-muted/95 border-r p-4 transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {children}
      </aside>
    </>
  );
}

export function DrawerHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function DrawerTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

export function DrawerDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={className ?? "text-sm text-muted-foreground"}>{children}</p>;
}

export function DrawerFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 flex items-center justify-end gap-2">{children}</div>;
}

export function DrawerClose({ children }: { children: React.ReactNode }) {
  const { setOpen } = useDrawer();
  return (
    <span onClick={() => setOpen(false)} className="inline-block">
      {children}
    </span>
  );
}

export { Button };
