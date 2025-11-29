import Button from "@/components/ui/button";

export default function AboutPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">About Us</h1>
        <p className="text-muted-foreground">Learn more about shAIring and the team behind it.</p>
      </header>

      <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
        <p className="text-sm text-muted-foreground">This is a simple stub to demonstrate routing.</p>
        <div className="mt-3">
          <Button variant="ghost">Contact</Button>
        </div>
      </div>
    </section>
  );
}

