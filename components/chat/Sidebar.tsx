"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FilePlus,
  FileText,
  MessageSquarePlus,
  PanelLeft,
  Search,
  Scale,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  deleteChat,
  deleteDocument,
  getChats,
  getDocuments,
} from "@/lib/storage";
import type { Chat, LegalDocument } from "@/types";
import { NewDocumentModal } from "./NewDocumentModal";
import { UserCard } from "./UserCard";

interface SidebarProps {
  activeChatId?: string;
  activeDocumentId?: string;
  onSelectChat?: (chatId: string) => void;
  onNewChat?: () => void;
  refreshKey?: number;
}

export function Sidebar({
  activeChatId,
  activeDocumentId,
  onSelectChat,
  onNewChat,
  refreshKey = 0,
}: SidebarProps) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  function refresh() {
    setChats(getChats());
    setDocuments(getDocuments());
  }

  useEffect(() => {
    refresh();
  }, [refreshKey]);

  const filteredChats = search.trim()
    ? chats.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase()),
      )
    : chats;

  if (collapsed) {
    return (
      <aside className="flex h-full w-14 flex-col items-center border-r border-border bg-sidebar py-3">
        <button
          onClick={() => setCollapsed(false)}
          className="mb-2 rounded-lg p-2 text-muted hover:bg-sidebarHover hover:text-ink"
          aria-label="Expand sidebar"
        >
          <PanelLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button
          onClick={onNewChat}
          className="rounded-lg p-2 text-muted hover:bg-sidebarHover hover:text-ink"
          aria-label="New chat"
        >
          <MessageSquarePlus className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </aside>
    );
  }

  return (
    <>
      <aside className="flex h-full w-[260px] flex-col border-r border-border bg-sidebar">
        <div className="flex items-center justify-between px-3 pt-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-ink hover:bg-sidebarHover"
          >
            <Scale className="h-4 w-4" strokeWidth={1.75} />
            AI Lawyer
          </Link>
          <button
            onClick={() => setCollapsed(true)}
            className="rounded-lg p-1.5 text-muted hover:bg-sidebarHover hover:text-ink"
            aria-label="Collapse sidebar"
          >
            <PanelLeft className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="px-2 pt-3">
          <button
            onClick={onNewChat}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink hover:bg-sidebarHover"
          >
            <MessageSquarePlus className="h-4 w-4" strokeWidth={1.75} />
            New chat
          </button>
          <button
            onClick={() => setShowSearch((v) => !v)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink hover:bg-sidebarHover"
          >
            <Search className="h-4 w-4" strokeWidth={1.75} />
            Search chats
          </button>
          {showSearch && (
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              autoFocus
              className="mt-1 w-full rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-sm text-ink placeholder:text-subtle focus:border-ink focus:outline-none"
            />
          )}
        </div>

        <div className="mt-4 flex-1 overflow-y-auto chat-scroll px-2 pb-2">
          <section className="mb-4">
            <div className="flex items-center justify-between px-2 py-1">
              <h3 className="text-xs font-medium text-subtle">Documents</h3>
              <button
                onClick={() => setModalOpen(true)}
                className="rounded p-1 text-muted hover:bg-sidebarHover hover:text-ink"
                aria-label="New document"
                title="New document"
              >
                <FilePlus className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </div>
            {documents.length === 0 ? (
              <button
                onClick={() => setModalOpen(true)}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-subtle hover:bg-sidebarHover hover:text-ink"
              >
                <FilePlus className="h-3.5 w-3.5" strokeWidth={1.75} />
                New document
              </button>
            ) : (
              <ul className="mt-1 space-y-0.5">
                {documents.slice(0, 8).map((d) => (
                  <li key={d.id} className="group relative">
                    <Link
                      href={`/chat/documents/${d.id}`}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-2.5 py-1.5 pr-8 text-sm text-ink hover:bg-sidebarHover",
                        activeDocumentId === d.id && "bg-sidebarHover",
                      )}
                    >
                      <FileText
                        className="h-3.5 w-3.5 flex-shrink-0 text-muted"
                        strokeWidth={1.75}
                      />
                      <span className="truncate">{d.title}</span>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteDocument(d.id);
                        refresh();
                        if (activeDocumentId === d.id) router.push("/chat");
                      }}
                      className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1 text-muted opacity-0 hover:bg-sidebarHover hover:text-ink group-hover:opacity-100"
                      aria-label="Delete document"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <div className="px-2 py-1">
              <h3 className="text-xs font-medium text-subtle">Chats</h3>
            </div>
            {filteredChats.length === 0 ? (
              <p className="px-2.5 py-2 text-xs text-subtle">
                No conversations yet.
              </p>
            ) : (
              <ul className="space-y-0.5">
                {filteredChats.map((c) => (
                  <li key={c.id} className="group relative">
                    <button
                      onClick={() => onSelectChat?.(c.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 pr-8 text-left text-sm text-ink hover:bg-sidebarHover",
                        activeChatId === c.id && "bg-sidebarHover",
                      )}
                    >
                      <span className="truncate">{c.title}</span>
                    </button>
                    <button
                      onClick={() => {
                        deleteChat(c.id);
                        refresh();
                        if (activeChatId === c.id) onNewChat?.();
                      }}
                      className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1 text-muted opacity-0 hover:bg-sidebarHover hover:text-ink group-hover:opacity-100"
                      aria-label="Delete chat"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="border-t border-border/80 px-2 py-2">
          <UserCard />
        </div>
      </aside>

      <NewDocumentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(doc) => {
          refresh();
          router.push(`/chat/documents/${doc.id}`);
        }}
      />
    </>
  );
}
