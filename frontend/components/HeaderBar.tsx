"use client";

import { Plus } from "lucide-react";

export default function HeaderBar({
  status,
  onNewConversation
}: {
  status: string;
  onNewConversation: () => void;
}) {
  return (
    <header className="curify-glass flex items-center justify-between rounded-[22px] px-4 py-3 shadow-panel">
      <div className="flex min-w-0 items-center gap-4">
        <div className="text-xl font-semibold tracking-tight">AI Chat</div>
        <div className="hidden rounded-full border border-black/5 bg-white/60 px-3 py-1 text-xs text-[color:var(--text-soft)] dark:border-white/10 dark:bg-white/5 md:block">
          {status}
        </div>
      </div>
      <button
        type="button"
        onClick={onNewConversation}
        className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:border-black/20 dark:border-white/10 dark:bg-white/5"
      >
        <Plus size={16} />
        New Chat
      </button>
    </header>
  );
}
