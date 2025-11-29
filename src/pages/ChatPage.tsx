import Button from "@/components/ui/button";

export default function ChatPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Chat</h1>
        <p className="text-muted-foreground">This is a placeholder for the Chat page.</p>
      </header>

      <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
        <p className="text-sm text-muted-foreground">Your chat UI will appear here.</p>
        <div className="mt-3">
          <Button variant="secondary">Start a conversation</Button>
        </div>
      </div>
    </section>
  );
}

