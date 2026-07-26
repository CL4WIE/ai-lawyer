"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Link2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  open: boolean;
  chatId?: string;
  onClose: () => void;
}

export function ShareChatModal({ open, chatId, onClose }: Props) {
  const [shareId, setShareId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || !chatId) return;
    let cancelled = false;
    setLoading(true);
    setCopied(false);
    fetch(`/api/chats/${chatId}/share`)
      .then((res) => (res.ok ? res.json() : { shareId: null }))
      .then((data: { shareId: string | null }) => {
        if (!cancelled) setShareId(data.shareId);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, chatId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const shareUrl =
    shareId && typeof window !== "undefined"
      ? `${window.location.origin}/share/${shareId}`
      : "";

  async function handleCreateLink() {
    if (!chatId) return;
    setWorking(true);
    try {
      const res = await fetch(`/api/chats/${chatId}/share`, { method: "POST" });
      if (res.ok) {
        const data = (await res.json()) as { shareId: string };
        setShareId(data.shareId);
      }
    } finally {
      setWorking(false);
    }
  }

  async function handleStopSharing() {
    if (!chatId) return;
    setWorking(true);
    try {
      const res = await fetch(`/api/chats/${chatId}/share`, { method: "DELETE" });
      if (res.ok) setShareId(null);
    } finally {
      setWorking(false);
    }
  }

  function handleCopy() {
    if (!shareUrl || typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-canvas shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-ink">Share this chat</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted hover:bg-sidebarHover hover:text-ink"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          {loading ? (
            <p className="text-sm text-subtle">Loading…</p>
          ) : shareId ? (
            <>
              <p className="mb-3 text-sm text-muted">
                Anyone with this link can view a read-only copy of this
                conversation. It will keep showing your future messages in
                this chat too, until you stop sharing.
              </p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  onFocus={(e) => e.currentTarget.select()}
                  className="w-full flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                />
                <Button size="sm" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" strokeWidth={2} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <button
                onClick={handleStopSharing}
                disabled={working}
                className="mt-4 text-sm text-muted hover:text-ink disabled:opacity-60"
              >
                {working ? "Stopping…" : "Stop sharing"}
              </button>
            </>
          ) : (
            <>
              <p className="mb-4 text-sm text-muted">
                Create a public link to share a read-only copy of this
                conversation. Anyone with the link can view it — no sign-in
                required.
              </p>
              <Button onClick={handleCreateLink} disabled={working || !chatId}>
                <Link2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                {working ? "Creating link…" : "Create share link"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
