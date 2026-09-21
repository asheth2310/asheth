"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { CornerDownLeft } from "lucide-react";
import { getFallbackAnswer, PLAYGROUND_PROMPTS } from "@/lib/content";

const WELCOME =
  "agent://aagam online. Ask me about the systems, the stack, the experience — or why you should hire Aagam.";

function messageText(m: UIMessage): string {
  return m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
}

const INITIAL: UIMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    parts: [{ type: "text", text: WELCOME }],
  },
];

export function AgentConsole() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const fallbackUsed = useRef(false);

  const { messages, sendMessage, status, error, setMessages, clearError } =
    useChat({ messages: INITIAL });

  const isLoading = status === "streaming" || status === "submitted";

  // If the API is unreachable, answer from the local knowledge base instead
  // of leaving the user with a dead chat.
  useEffect(() => {
    if (error && !fallbackUsed.current) {
      fallbackUsed.current = true;
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      const text = getFallbackAnswer(lastUser ? messageText(lastUser) : "");
      setMessages((prev) => [
        ...prev,
        {
          id: `offline-${Date.now()}`,
          role: "assistant",
          parts: [
            {
              type: "text",
              text: `[offline mode — answering from local knowledge]\n\n${text}`,
            },
          ],
        },
      ]);
      clearError();
    }
  }, [error, messages, setMessages, clearError]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const submit = async (text: string) => {
    const value = text.trim();
    if (!value || isLoading) return;
    setInput("");
    try {
      await sendMessage({ text: value });
    } catch {
      // The error-state effect above handles the fallback.
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface-deep shadow-2xl">
      <div className="flex items-center gap-2 border-b border-line bg-surface-raised px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-xs text-ink-hi0">
          agent://aagam — live
        </span>
        <span
          className={`ml-auto flex items-center gap-1.5 font-mono text-[10px] tracking-widest ${
            isLoading ? "text-amber-300" : "text-emerald-300"
          }`}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLoading
                  ? "animate-ping bg-amber-400"
                  : "animate-ping bg-emerald-400"
              }`}
            />
            <span
              className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                isLoading ? "bg-amber-400" : "bg-emerald-400"
              }`}
            />
          </span>
          {isLoading ? "THINKING" : "READY"}
        </span>
      </div>

      <div
        ref={scrollRef}
        className="h-[300px] space-y-3 overflow-y-auto p-4 font-mono text-xs leading-relaxed"
      >
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap break-words">
            {m.role === "user" ? (
              <p>
                <span className="text-emerald-400">$ </span>
                <span className="text-ink-hi">{messageText(m)}</span>
              </p>
            ) : (
              <p>
                <span className="text-cyan-400">› </span>
                <span className="text-ink-mid">{messageText(m)}</span>
              </p>
            )}
          </div>
        ))}
        {isLoading && (
          <p className="text-ink-faint">
            <span className="text-cyan-400">› </span>
            <span className="animate-pulse">▊</span>
          </p>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
          {PLAYGROUND_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => submit(p)}
              disabled={isLoading}
              className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] text-emerald-300 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="flex items-center gap-2 border-t border-line bg-surface-card px-4 py-2.5"
      >
        <span className="font-mono text-sm text-emerald-400">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ask about the systems, stack, experience…"
          aria-label="Ask the agent"
          className="w-full bg-transparent font-mono text-sm text-ink-hi placeholder:text-ink-faint focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Send"
          className="rounded-md p-2 text-ink-hi0 transition-colors hover:text-emerald-300 disabled:opacity-40"
        >
          <CornerDownLeft size={16} />
        </button>
      </form>
    </div>
  );
}
