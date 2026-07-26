"use client";

import { useState } from "react";
import { ChevronDown, SquarePen, UserPlus } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ShareChatModal } from "./ShareChatModal";

interface Props {
  onNewChat: () => void;
  chatId?: string;
}

export function ChatHeader({ onNewChat, chatId }: Props) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
      <button className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[15px] font-medium text-ink hover:bg-sidebarHover">
        LegalEase
        <ChevronDown className="h-4 w-4 text-muted" strokeWidth={1.75} />
      </button>
      <div className="flex items-center gap-1">
        <ThemeToggle className="h-8 w-8" />
        <button
          onClick={() => setShareOpen(true)}
          disabled={!chatId}
          className="rounded-lg p-2 text-muted hover:bg-sidebarHover hover:text-ink disabled:pointer-events-none disabled:opacity-40"
          aria-label="Share"
          title={chatId ? "Share" : "Start a conversation to share it"}
        >
          <UserPlus className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <button
          onClick={onNewChat}
          className="rounded-lg p-2 text-muted hover:bg-sidebarHover hover:text-ink"
          aria-label="New chat"
          title="New chat"
        >
          <SquarePen className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      <ShareChatModal
        open={shareOpen}
        chatId={chatId}
        onClose={() => setShareOpen(false)}
      />
    </div>
  );
}
