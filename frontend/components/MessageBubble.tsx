"use client";

import { Children, isValidElement, type ReactElement, useState } from "react";
import { Check, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import type { ChatMessage } from "@/lib/types";

function extractText(node: unknown): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((item) => extractText(item)).join("");
  }

  if (isValidElement(node)) {
    return extractText((node as ReactElement<{ children?: unknown }>).props.children);
  }

  return "";
}

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === "assistant";

  async function copy() {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className={`group flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[92%] rounded-[24px] border px-4 py-3 shadow-sm md:max-w-[80%] ${
          isAssistant
            ? "border-black/6 bg-white/85 text-black dark:border-white/10 dark:bg-white/5 dark:text-white"
            : "border-emerald-400/30 bg-gradient-to-br from-emerald-500 to-lime-500 text-black"
        }`}
      >
        <div className="prose prose-sm max-w-none prose-headings:mb-2 prose-p:my-2 dark:prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code(props) {
                const { className, children, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                const text = extractText(Children.toArray(children)).replace(/\n$/, "");

                if (match) {
                  const language = match[1];

                  return (
                    <div className="not-prose my-4 overflow-hidden rounded-2xl border border-white/10 bg-[#111319] shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
                      <div className="flex items-center justify-between bg-[#232635] px-4 py-2 text-xs text-slate-200">
                        <span className="font-medium lowercase tracking-wide">{language}</span>
                        <button
                          type="button"
                          onClick={() => void navigator.clipboard.writeText(text)}
                          className="flex items-center gap-2 text-slate-200 transition hover:text-white"
                        >
                          <Copy size={14} />
                          Copy code
                        </button>
                      </div>
                      <pre className="m-0 overflow-x-auto bg-[#050608] px-4 py-4 text-sm text-slate-100">
                        <code className={className} {...rest}>
                          {text}
                        </code>
                      </pre>
                    </div>
                  );
                }

                return (
                  <code
                    className="rounded-md bg-black/5 px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/10"
                    {...rest}
                  >
                    {children}
                  </code>
                );
              }
            }}
          >
            {message.content || (isAssistant ? "..." : "")}
          </ReactMarkdown>
        </div>
        {isAssistant && message.content ? (
          <button
            type="button"
            onClick={copy}
            className="mt-3 flex items-center gap-1 text-xs text-[color:var(--text-soft)] opacity-0 transition group-hover:opacity-100"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
