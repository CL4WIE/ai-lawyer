"use client";

import { ChevronDown, SquarePen, UserPlus } from "lucide-react";

interface Props {
  onNewChat: () => void;
}

export function ChatHeader({ onNewChat }: Props) {
  return (
    <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
      <button className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[15px] font-medium text-ink hover:bg-sidebarHover">
        AI LawyerGPT
        <ChevronDown className="h-4 w-4 text-muted" strokeWidth={1.75} />
      </button>
      <div className="flex items-center gap-1">
        <button
          className="rounded-lg p-2 text-muted hover:bg-sidebarHover hover:text-ink"
          aria-label="Share"
          title="Share"
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
    </div>
  );
}
