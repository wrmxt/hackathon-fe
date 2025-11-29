import Button from "@/components/ui/button";
import { TopBar } from "@/components/TopBar";
import { ThemeProvider } from "@/lib/theme";
import type { NavItem } from "@/components/TopBar";
import React from "react";

export default function App() {
  const [active, setActive] = React.useState<NavItem>("dashboard");

  return (
    <ThemeProvider>
      <TopBar activeItem={active} onChange={setActive} />
      <main className="mx-auto max-w-6xl px-4 pt-20">
        <h1 className="text-2xl font-semibold mb-4">
          {active === "chat" ? "Chat" : active === "dashboard" ? "Dashboard" : "About Us"}
        </h1>
        <p className="text-muted-foreground">This is a sample page content below the fixed top bar.</p>
        <div className="mt-6">
          <Button variant="secondary">Sample Button</Button>
        </div>
      </main>
    </ThemeProvider>
  );
}
