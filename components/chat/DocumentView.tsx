"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Copy, Download } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/Button";
import {
  deleteDocument,
  getDocument,
  saveDocument,
} from "@/lib/storage";
import type { LegalDocument } from "@/types";

interface Props {
  documentId: string;
}

export function DocumentView({ documentId }: Props) {
  const router = useRouter();
  const [doc, setDoc] = useState<LegalDocument | null | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [sidebarKey, setSidebarKey] = useState(0);

  useEffect(() => {
    const d = getDocument(documentId);
    if (d) {
      setDoc(d);
      setTitle(d.title);
      setContent(d.content);
    } else {
      setDoc(null);
    }
  }, [documentId]);

  useEffect(() => {
    if (!doc) return;
    if (title === doc.title && content === doc.content) return;
    const t = setTimeout(() => {
      const updated: LegalDocument = {
        ...doc,
        title: title.trim() || "Untitled Document",
        content,
        updatedAt: Date.now(),
      };
      saveDocument(updated);
      setDoc(updated);
      setSidebarKey((k) => k + 1);
    }, 400);
    return () => clearTimeout(t);
  }, [title, content, doc]);

  function handleCopy() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(content).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  }

  function handleDownload() {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safe = (title || "document").replace(/[^\w\-]+/g, "_");
    a.href = url;
    a.download = `${safe}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleDelete() {
    if (!doc) return;
    deleteDocument(doc.id);
    router.push("/chat");
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-canvas">
      <Sidebar activeDocumentId={documentId} refreshKey={sidebarKey} />
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
          <button
            onClick={() => router.push("/chat")}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-muted hover:bg-sidebarHover hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            Back to chat
          </button>
          <div className="flex items-center gap-1">
            <Button variant="secondary" size="sm" onClick={handleCopy}>
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
            <Button size="sm" onClick={handleDownload}>
              <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
              Download
            </Button>
            <button
              onClick={handleDelete}
              className="ml-1 rounded-full px-3 py-1.5 text-xs text-muted hover:bg-sidebarHover hover:text-ink"
            >
              Delete
            </button>
          </div>
        </div>

        {doc === undefined ? (
          <div className="flex flex-1 items-center justify-center text-sm text-subtle">
            Loading…
          </div>
        ) : doc === null ? (
          <div className="flex flex-1 items-center justify-center text-sm text-subtle">
            Document not found.
          </div>
        ) : (
          <div className="chat-scroll flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-3xl px-6 py-8">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-6 w-full border-0 bg-transparent text-3xl font-semibold text-ink placeholder:text-subtle focus:outline-none"
                placeholder="Untitled document"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[60vh] w-full resize-none border-0 bg-transparent font-sans text-[15px] leading-7 text-ink placeholder:text-subtle focus:outline-none"
                spellCheck
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
