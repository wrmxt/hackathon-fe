import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TopBar, type NavItem } from "@/components/TopBar";
import { ThemeProvider } from "@/lib/theme";

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <TopBar activeItem={activeItem} onChange={handleChange} />
        <main className={isAbout ? "pt-0 pb-10" : "mx-auto max-w-6xl px-4 pt-6 pb-10"}>
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}
