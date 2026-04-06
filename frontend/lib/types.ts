export type ChatMode = "balanced" | "precise" | "creative";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface FileContext {
  filename: string;
  content_type: string;
  text: string;
  truncated: boolean;
  characters: number;
}

export type UploadResponse = FileContext;

