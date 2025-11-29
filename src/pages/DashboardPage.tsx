import Button from "@/components/ui/button";
import {useItems} from "@/api/api.ts";

export default function DashboardPage() {

  const {data: items = []} = useItems()

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to shAIring – Zero-Waste Neighbor Hub.</p>
      </header>

      <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
        <p>This is the default page for "/".</p>
        <div className="mt-3">
          <Button variant="default">Explore</Button>
        </div>
      </div>

      <pre>{JSON.stringify(items)}</pre>
    </section>
  );
}

