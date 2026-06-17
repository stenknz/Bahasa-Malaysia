"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

export default function ConversationChatPage() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/conversation/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: id, content: input }),
      });
      const data = await res.json();
      setMessages(data.messages);
      setInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Conversation</h1>
      <div className="flex-1 space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
        {messages.length === 0 && (
          <p className="text-center text-sm text-slate-400">Start the conversation by sending a message.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
              m.role === "user"
                ? "bg-primary-600 text-white"
                : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
        />
        <button
          onClick={sendMessage}
          disabled={sending}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
