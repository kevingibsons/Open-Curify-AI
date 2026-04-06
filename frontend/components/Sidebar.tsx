"use client";

import { FileText, HelpCircle, MessageSquareText, Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import type { ChatMode, FileContext } from "@/lib/types";

const modeDescriptions: Record<ChatMode, string> = {
  balanced: "General conversation and everyday document Q&A.",
  precise: "Lower temperature for tighter, more factual answers.",
  creative: "Higher temperature for brainstorming and expansive replies."
};

export default function Sidebar({
  mode,
  setMode,
  fileContext,
  isStreaming
}: {
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
  fileContext: FileContext | null;
  isStreaming: boolean;
}) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <aside className="curify-glass flex h-full flex-col rounded-[24px] shadow-panel">
      <div className="border-b border-black/5 px-5 py-5 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-300 via-lime-300 to-green-500 shadow-[0_0_30px_rgba(125,255,69,0.45)]">
            <div className="h-3.5 w-3.5 rotate-45 rounded-[3px] bg-white/85" />
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight">Open Curify</div>
            <div className="text-sm text-[color:var(--text-soft)]">
              by <span className="font-bold text-[color:var(--text-main)]">Crsynk Labs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="rounded-2xl border border-black/8 bg-black/[0.03] p-3 dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MessageSquareText size={16} className="text-emerald-500" />
            AI Chat
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="curify-glass rounded-[18px] p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--text-soft)]">Chat Mode</p>
          <div className="mt-3 flex flex-col gap-2">
            {(["balanced", "precise", "creative"] as ChatMode[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                disabled={isStreaming}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  mode === value
                    ? "border-emerald-500/60 bg-gradient-to-r from-lime-100 to-white text-black dark:from-lime-500/20 dark:to-white/5 dark:text-white"
                    : "border-black/8 bg-white/80 text-[color:var(--text-main)] hover:border-emerald-500/40 dark:border-white/10 dark:bg-white/5"
                } ${isStreaming ? "opacity-70" : ""}`}
              >
                <div className="font-semibold capitalize">{value}</div>
                <div className={`mt-1 text-xs ${mode === value ? "text-black/70 dark:text-white/75" : "text-[color:var(--text-soft)]"}`}>
                  {modeDescriptions[value]}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="curify-glass rounded-[18px] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--text-soft)]">Document Context</p>
          {fileContext ? (
            <div className="mt-3 space-y-2 text-sm text-[color:var(--text-soft)]">
              <div className="flex items-start gap-2">
                <FileText size={16} className="mt-0.5 text-emerald-500" />
                <div>
                  <div className="font-semibold text-[color:var(--text-main)]">{fileContext.filename}</div>
                  <div>{fileContext.characters} chars extracted</div>
                  <div>{fileContext.truncated ? "Truncated to fit prompt window" : "Full extracted text attached"}</div>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-[color:var(--text-soft)]">
              Upload a PDF, DOCX, or TXT file from the chat input to ask grounded questions about it.
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto px-5 pb-5 pt-6">
        <div className="space-y-3 border-t border-black/5 pt-4 text-sm dark:border-white/10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--text-soft)]">Settings & Help</div>
          <div className="flex items-center gap-2 text-[color:var(--text-soft)]">
            <Settings size={15} />
            <span>Settings</span>
          </div>
          <div className="flex items-center gap-2 text-[color:var(--text-soft)]">
            <HelpCircle size={15} />
            <span>Help</span>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-black/8 bg-white/60 p-1 dark:border-white/10 dark:bg-white/5">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm ${resolvedTheme === "light" ? "bg-white text-black shadow-sm dark:bg-white/10 dark:text-white" : "text-[color:var(--text-soft)]"}`}
          >
            <Sun size={15} />
            Light
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm ${resolvedTheme === "dark" ? "bg-black text-white shadow-sm dark:bg-white/10" : "text-[color:var(--text-soft)]"}`}
          >
            <Moon size={15} />
            Dark
          </button>
        </div>
      </div>
    </aside>
  );
}
