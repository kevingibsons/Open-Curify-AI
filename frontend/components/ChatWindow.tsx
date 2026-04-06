"use client";

import { useEffect, useRef } from "react";

import MessageBubble from "@/components/MessageBubble";
import type { ChatMessage } from "@/lib/types";

export default function ChatWindow({ messages, isStreaming }: { messages: ChatMessage[]; isStreaming: boolean }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const isWelcomeState = messages.length <= 1;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <div className="curify-grid relative flex-1 overflow-y-auto px-4 py-6 md:px-6">
      {isWelcomeState ? (
        <div className="pointer-events-none absolute inset-x-0 top-8 flex flex-col items-center px-6 text-center">
          <div className="relative mb-8 mt-10 h-28 w-28 rounded-full bg-[radial-gradient(circle_at_35%_30%,#b6ff75_0%,#62d316_42%,#1c7d00_70%,#125a00_100%)] shadow-[0_0_40px_rgba(144,255,64,0.55)]">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--hero-glow),transparent_62%)] blur-xl" />
          </div>
          <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">Welcome to Open Curify</h2>
          <p className="mt-4 max-w-2xl text-lg text-[color:var(--text-soft)] md:text-2xl">
            Get started by asking Curify a question or attaching a document for grounded answers.
          </p>
          <p className="mt-2 text-sm text-[color:var(--text-soft)]">Not sure where to start? Try “Summarize this file” or “Explain this in Tamil”.</p>
        </div>
      ) : null}
      <div className={`mx-auto flex max-w-4xl flex-col gap-4 ${isWelcomeState ? "min-h-[30rem] justify-end pt-[23rem]" : ""}`}>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
