"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface Props {
  user: { name: string | null; email: string };
}

export function UserCard({ user }: Props) {
  const label = user.name?.trim() || user.email;
  const initial = label.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-sidebarHover">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[13px] font-semibold text-accentInk">
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-ink">{label}</div>
        <div className="truncate text-xs text-subtle">{user.email}</div>
      </div>
      <button
        onClick={() => signOut({ redirectTo: "/login" })}
        className="rounded-lg p-1.5 text-muted hover:bg-sidebarHover hover:text-ink"
        aria-label="Sign out"
        title="Sign out"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}
