import {ChatPanel} from "@/components/ChatPanel.tsx";

export default function ChatPage() {

  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 pb-10 flex justify-center">
      <div className="w-full px-2">
        <ChatPanel />
      </div>
    </section>
  );
}
