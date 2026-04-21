import type { Chat, LegalDocument } from "@/types";

const CHATS_KEY = "ai-lawyer.chats";
const DOCS_KEY = "ai-lawyer.documents";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function read<T>(key: string): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or serialization errors are ignored for now */
  }
}

export function createId(): string {
  if (isBrowser() && typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// Chats -----------------------------------------------------------------------

export function getChats(): Chat[] {
  return read<Chat>(CHATS_KEY).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getChat(id: string): Chat | undefined {
  return getChats().find((c) => c.id === id);
}

export function saveChat(chat: Chat): void {
  const all = read<Chat>(CHATS_KEY);
  const idx = all.findIndex((c) => c.id === chat.id);
  if (idx >= 0) all[idx] = chat;
  else all.unshift(chat);
  write(CHATS_KEY, all);
}

export function deleteChat(id: string): void {
  write(
    CHATS_KEY,
    read<Chat>(CHATS_KEY).filter((c) => c.id !== id),
  );
}

// Documents ------------------------------------------------------------------

export function getDocuments(): LegalDocument[] {
  return read<LegalDocument>(DOCS_KEY).sort(
    (a, b) => b.updatedAt - a.updatedAt,
  );
}

export function getDocument(id: string): LegalDocument | undefined {
  return getDocuments().find((d) => d.id === id);
}

export function saveDocument(doc: LegalDocument): void {
  const all = read<LegalDocument>(DOCS_KEY);
  const idx = all.findIndex((d) => d.id === doc.id);
  if (idx >= 0) all[idx] = doc;
  else all.unshift(doc);
  write(DOCS_KEY, all);
}

export function deleteDocument(id: string): void {
  write(
    DOCS_KEY,
    read<LegalDocument>(DOCS_KEY).filter((d) => d.id !== id),
  );
}
