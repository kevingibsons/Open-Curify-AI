"use client";

import { KeyboardEvent, useRef, useState } from "react";
import { Paperclip, Send } from "lucide-react";

export default function InputBar({
  onSend,
  onFileUpload,
  isStreaming
}: {
  onSend: (text: string) => Promise<void>;
  onFileUpload: (file: File) => Promise<void>;
  isStreaming: boolean;
}) {
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function submit() {
    if (!input.trim() || isStreaming) {
      return;
    }
    void onSend(input.trim());
    setInput("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      await onFileUpload(file);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="px-4 pb-5 pt-2 md:px-6 md:pb-6">
      <div className="mx-auto max-w-5xl rounded-[26px] border border-emerald-500/30 bg-[color:var(--panel-bg)] px-4 py-4 shadow-[0_0_0_1px_rgba(100,255,120,0.08),0_18px_70px_var(--input-glow)] backdrop-blur">
        <div className="flex items-end gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mb-1 rounded-full p-2 text-[color:var(--text-soft)] transition hover:bg-black/5 hover:text-emerald-600 dark:hover:bg-white/5"
            aria-label="Upload a file"
          >
            <Paperclip size={18} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void handleUpload(file);
              }
            }}
          />
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            rows={3}
            maxLength={1500}
            className="max-h-48 flex-1 resize-none bg-transparent text-base outline-none placeholder:text-[color:var(--text-soft)]"
            placeholder={uploading ? "Uploading document..." : "Ask me anything..."}
          />
          <button
            type="button"
            onClick={submit}
            disabled={!input.trim() || isStreaming}
            className="mb-1 rounded-full border border-black/10 bg-white p-3 text-[color:var(--text-soft)] transition hover:border-emerald-500 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-3 text-xs text-[color:var(--text-soft)] dark:border-white/10">
          <div className="flex items-center gap-2">
            <Paperclip size={14} />
            <span>Attach PDF, DOCX, or TXT</span>
          </div>
          <div>{input.length}/1,500</div>
        </div>
      </div>
    </div>
  );
}
