import React from "react";
import { Send, Bot } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useChat } from "@/api/api";
import { useAuth } from "@/context/AuthContext";

type Message = {
  id: string;
  from: "user" | "assistant";
  text: string;
  confident?: boolean;
};

type ChatResponse = { user_id?: string; reply?: string; confident?: number };

export function ChatPanel() {
  const { user: authUser } = useAuth();
  const userName = authUser ?? "Guest";

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [lastSent, setLastSent] = React.useState<string>("");

  // Trigger useChat when lastSent changes
  const chatQuery = useChat(userName, lastSent);
  const isLoading = chatQuery.isLoading;
  const isError = chatQuery.isError;
  const data = chatQuery.data as ChatResponse | undefined;

  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  // Append assistant response when available
  React.useEffect(() => {
    if (data && lastSent) {
      const assistantMsg: Message = {
        id: `assist-${Date.now()}`,
        from: "assistant",
        text: data.reply ?? String(data),
        confident: (data.confident ?? 0) > 0.5,
      };
      setMessages((s) => [...s, assistantMsg]);
      setLastSent("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // scroll to bottom on messages or loading
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages, isLoading]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const m: Message = { id: `user-${Date.now()}`, from: "user", text: input.trim() };
    setMessages((s) => [...s, m]);
    setLastSent(input.trim());
    setInput("");
  };

  return (
    <Card className="mx-auto w-full max-w-4xl bg-card/80 backdrop-blur-md border border-border/30 shadow-2xl">
      <CardHeader>
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Assistant</CardTitle>
              <CardDescription className="text-sm">Concise, helpful answers — right when you need them.</CardDescription>
            </div>
          </div>

          <div className="text-right text-xs text-muted-foreground">
            <div className="font-medium">Signed in as</div>
            <div className="mt-1 text-sm">{userName}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6">
        <div className="flex h-[min(68vh,760px)] flex-col gap-4">
          <div className="flex-1 overflow-hidden rounded-2xl border bg-background p-4">
            <div
              ref={scrollRef}
              className="h-full w-full overflow-y-auto space-y-5 pr-3 scrollbar-thin scrollbar-thumb-muted/40 scrollbar-track-transparent"
            >
              {messages.length === 0 && !isLoading ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">No messages yet — say hello 👋</div>
              ) : null}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.from === "assistant" && (
                    <div className="flex-none">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground shadow">
                        <Bot className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  )}

                  <div className={`max-w-[74%] ${m.from === "user" ? "ml-auto text-right" : "mr-auto text-left"}`}>
                    <div
                      className={`relative inline-block rounded-3xl px-6 py-3 leading-relaxed transition-all ${
                        m.from === "user"
                          ? "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-xl"
                          : "bg-muted text-foreground shadow"
                      }`}
                      style={{ wordBreak: "break-word" }}
                    >
                      <div className="whitespace-pre-wrap">{m.text}</div>
                    </div>

                    {m.from === "assistant" && m.confident ? (
                      <div className="mt-2">
                        <Badge variant="outline">Confident</Badge>
                      </div>
                    ) : null}
                  </div>

                  {m.from === "user" && (
                    <div className="flex-none">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow">
                        <span className="text-sm font-semibold">{userName?.[0]?.toUpperCase() ?? "U"}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && lastSent ? (
                <div className="flex items-start gap-3">
                  <div className="flex-none">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground shadow">
                      <Bot className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="max-w-[74%] mr-auto text-left">
                    <div className="inline-block rounded-3xl px-5 py-3 leading-relaxed bg-muted text-foreground/90 italic shadow">
                      <div className="inline-flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-75" />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-150" />
                        <span className="ml-3 text-sm text-muted-foreground">Assistant is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {isError ? <div className="text-sm text-destructive">Error fetching assistant response.</div> : null}
            </div>
          </div>

          <form onSubmit={handleSend} className="pt-2">
            <div className="flex items-end gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isLoading ? "Waiting for assistant..." : "Type a message — press Enter to send"}
                className="min-h-[68px] max-h-52 w-full resize-none rounded-xl border px-4 py-3 text-sm shadow-sm focus:ring-1 focus:ring-ring"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />

              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" onClick={() => setInput("")} disabled={isLoading} aria-label="Clear">
                  Clear
                </Button>
                <Button type="submit" disabled={isLoading || !input.trim()} size="default" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </Button>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Shift+Enter for newline. Input disabled while assistant is thinking.</div>
          </form>
        </div>
      </CardContent>

      <CardFooter>
        <div className="w-full text-xs text-muted-foreground">Responses are mocked via the app API.</div>
      </CardFooter>
    </Card>
  );
}
