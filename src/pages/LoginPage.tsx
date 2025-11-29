import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@/components/ui/button";
import { useAuthNamed as useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = (location.state as any)?.from?.pathname ?? "/";

  const [username, setUsername] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    // mocked login
    login(username.trim());
    navigate(from, { replace: true });
  };

  return (
    <div className="mx-auto max-w-md pt-24">
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold">Welcome back</h1>
        <p className="mb-6 text-sm text-muted-foreground">Sign in with your username to continue.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm shadow-sm"
              placeholder="e.g. alice"
            />
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button type="submit" variant="default">
              Sign in
            </Button>
            <Button type="button" variant="ghost" onClick={() => { setUsername("demo"); login("demo"); navigate(from, { replace: true }); }}>
              Demo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
