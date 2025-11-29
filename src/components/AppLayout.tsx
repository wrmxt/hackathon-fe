import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TopBar, type NavItem } from "@/components/TopBar";
import { ThemeProvider } from "@/lib/theme";
import React, {useMemo} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import SidebarDrawer from "@/components/SidebarDrawer";
import { Drawer } from "@/components/ui/drawer";
export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
      },
    },
  }), []);


  const activeItem: NavItem =
    location.pathname === "/chat"
      ? "chat"
      : location.pathname === "/about"
      ? "about"
      : "dashboard"; // default for "/" and "/dashboard"

  const handleChange = (item: NavItem) => {
    if (item === "dashboard") navigate("/");
    else if (item === "chat") navigate("/chat");
    else if (item === "about") navigate("/about");
  };

  const isAbout = location.pathname === "/about";

  // Sidebar state and active section local to layout
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  type Section = "Neighbors" | "My Things" | "Borrowed" | "Lended" | "Inbox";
  const [activeSection, setActiveSection] = React.useState<Section>("Neighbors");


  const handleSection = (s: Section) => {
    setActiveSection(s);
    setSidebarOpen(false); // close on mobile
    if (s === "Inbox") navigate('/inbox');
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background">
          <Drawer open={sidebarOpen} onOpenChange={(v) => setSidebarOpen(v)}>
            <TopBar activeItem={activeItem} onChange={handleChange} />

            <main className={isAbout ? "pt-0 pb-10" : "mx-auto max-w-6xl px-4 pt-6 pb-10"}>
              <div className="flex w-full gap-6">
                <SidebarDrawer active={activeSection} onSelect={(s) => handleSection(s)} />

                {/* Main content */}
                <div className="flex-1">
                  <Outlet />
                </div>
              </div>
            </main>
          </Drawer>
        </div>
        <ReactQueryDevtools initialIsOpen={false}/>

      </QueryClientProvider>
    </ThemeProvider>
  );
}
