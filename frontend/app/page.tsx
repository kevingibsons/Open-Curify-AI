"use client";

import { useState } from "react";

import ChatWindow from "@/components/ChatWindow";
import HeaderBar from "@/components/HeaderBar";
import InputBar from "@/components/InputBar";
import Sidebar from "@/components/Sidebar";
import { apiBaseUrl } from "@/lib/config";
import type { ChatMessage, ChatMode, FileContext, UploadResponse } from "@/lib/types";

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello, I'm Curify. I can chat in English, Tamil, or Hindi, and I can answer questions about uploaded PDF, DOCX, or TXT files.",
  createdAt: new Date().toISOString()
};

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [mode, setMode] = useState<ChatMode>("balanced");
  const [isStreaming, setIsStreaming] = useState(false);
  const [fileContext, setFileContext] = useState<FileContext | null>(null);
  const [status, setStatus] = useState("Ready");

  async function handleFileUpload(file: File) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${apiBaseUrl}/api/upload`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Upload failed." }));
        throw new Error(error.detail || "Upload failed.");
      }

      const payload = (await response.json()) as UploadResponse;
      setFileContext(payload);
      setStatus(`Attached ${payload.filename}${payload.truncated ? " (truncated)" : ""}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    }
  }

  async function handleSend(text: string) {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString()
    };
    const assistantMessageId = crypto.randomUUID();

    setMessages((current) => [
      ...current,
      userMessage,
      { id: assistantMessageId, role: "assistant", content: "", createdAt: new Date().toISOString() }
    ]);
    setIsStreaming(true);
    setStatus("Streaming response...");

    try {
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages
            .filter((message) => message.role === "user" || message.role === "assistant")
            .map(({ role, content }) => ({ role, content })),
          mode,
          file_context: fileContext
        })
      });

      if (!response.ok || !response.body) {
        throw new Error("Chat request failed.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finalText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() || "";

        for (const chunk of chunks) {
          const lines = chunk.split("\n");
          const event = lines.find((line) => line.startsWith("event:"))?.slice(6).trim();
          const dataLine = lines.find((line) => line.startsWith("data:"))?.slice(5).trim();
          if (!event || !dataLine) {
            continue;
          }

          const payload = JSON.parse(dataLine) as {
            token?: string;
            text?: string;
            language?: string;
            mode?: string;
          };

          if (event === "meta") {
            setStatus(`Replying in ${payload.language?.toUpperCase() ?? "EN"} - ${payload.mode ?? mode} mode`);
          }

          if (event === "token" && payload.token) {
            finalText += payload.token;
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantMessageId ? { ...message, content: finalText } : message
              )
            );
          }

          if (event === "done") {
            const completed = payload.text ?? finalText;
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantMessageId ? { ...message, content: completed } : message
              )
            );
            setStatus("Ready");
          }
        }
      }
    } catch (error) {
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: error instanceof Error ? error.message : "Something went wrong while streaming."
              }
            : message
        )
      );
      setStatus(error instanceof Error ? error.message : "Chat failed.");
    } finally {
      setIsStreaming(false);
    }
  }

  function handleNewConversation() {
    setMessages([welcomeMessage]);
    setFileContext(null);
    setStatus("Started a new conversation.");
  }

  return (
    <main className="curify-shell min-h-screen p-3 md:p-4">
      <div className="grid min-h-[calc(100vh-1.5rem)] gap-3 lg:grid-cols-[290px_minmax(0,1fr)]">
        <Sidebar
          mode={mode}
          setMode={setMode}
          fileContext={fileContext}
          isStreaming={isStreaming}
        />
        <section className="curify-glass flex min-h-[75vh] flex-col overflow-hidden rounded-[24px] shadow-panel">
          <div className="p-3">
            <HeaderBar status={status} onNewConversation={handleNewConversation} />
          </div>
          <ChatWindow messages={messages} isStreaming={isStreaming} />
          <InputBar
            onSend={handleSend}
            onFileUpload={handleFileUpload}
            isStreaming={isStreaming}
          />
        </section>
      </div>
    </main>
  );
}
