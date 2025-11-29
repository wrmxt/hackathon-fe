import React from "react";
import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import { Share2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DrawerTrigger } from "@/components/ui/drawer";

export type NavItem = "chat" | "dashboard" | "about";

export interface TopBarProps {
  activeItem: NavItem;
  onChange: (item: NavItem) => void;
}

const navItems: { key: NavItem; label: string }[] = [
  { key: "chat", label: "Chat" },
  { key: "dashboard", label: "Dashboard" },
  { key: "about", label: "About Us" },
];

export const TopBar: React.FC<TopBarProps> = ({ activeItem, onChange }) => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/40 bg-background/50 backdrop-blur-md shadow-sm">
      <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between px-3 sm:h-16 sm:px-4">
        {/* Logo / App name */}
        <div className="flex items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground flex-none shadow-sm">
            <Share2 className="h-7 w-7" aria-hidden="true" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold tracking-tight sm:text-xl">
              shAIring
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground/80">
              Smart Sharing for Your Building
            </span>
          </div>
        </div>

        {/* Center nav */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-md bg-background/40 backdrop-blur-sm p-1 text-xs sm:text-sm shadow-xs">
          {navItems.map(({ key, label }) => {
            const isActive = key === activeItem;
            return (
              <Button
                key={key}
                type="button"
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-8 sm:h-9 px-2 sm:px-5 transition-colors",
                  isActive && "shadow-sm"
                )}
                onClick={() => onChange(key)}
              >
                {label}
              </Button>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full bg-background/40 backdrop-blur-sm border-border/50 hover:bg-accent hover:text-accent-foreground"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <span className="inline-flex items-center justify-center">
              {theme === "light" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 3v2" />
                  <path d="M12 19v2" />
                  <path d="M5 5l1.5 1.5" />
                  <path d="M17.5 17.5L19 19" />
                  <path d="M3 12h2" />
                  <path d="M19 12h2" />
                  <path d="M5 19l1.5-1.5" />
                  <path d="M17.5 6.5L19 5" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
                </svg>
              )}
            </span>
          </Button>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium shadow-sm">
                  <span className="text-sm leading-none">
                    {user?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium">{user}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="default"
              onClick={() => navigate("/login")}
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
      {/* Sidebar toggle */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <DrawerTrigger>
          <Button size="icon" variant="secondary" aria-label="Toggle sidebar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </Button>
        </DrawerTrigger>
      </div>
    </header>
  );
};
